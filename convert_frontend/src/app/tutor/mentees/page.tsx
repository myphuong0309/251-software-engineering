'use client';

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { Session, User } from "@/types/api";

export default function TutorMenteesPage() {
  const { auth, ready } = useAuth();
  const tutorId = auth.userId;
  const [sessions, setSessions] = useState<Session[]>([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!auth.token || !tutorId) {
        setError("Please log in to view mentees.");
        setSessions([]);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const data = await api.getSessionsForTutor(tutorId, auth.token);
        setSessions(data || []);
      } catch (err) {
        console.warn("Unable to load mentees", err);
        setError("Unable to load mentees.");
      } finally {
        setLoading(false);
      }
    };
    if (ready) load();
  }, [auth.token, tutorId, ready]);

  const mentees = useMemo(() => {
    const map = new Map<string, { user: User; sessions: Session[] }>();
    sessions.forEach((s) => {
      const student = s.student;
      if (!student?.userId) return;
      if (!map.has(student.userId)) {
        map.set(student.userId, { user: student, sessions: [] });
      }
      map.get(student.userId)?.sessions.push(s);
    });
    let list = Array.from(map.values()).map(({ user, sessions }) => {
      const completed = sessions.filter((s) => s.status === "COMPLETED").length;
      return {
        id: user.userId,
        name: user.fullName || "Student",
        major: (user as any).major || "N/A",
        subjects: sessions.map((s) => s.topic).filter(Boolean).join(", "),
        sessionsText: `${completed} completed • Total: ${sessions.length}`,
        progress: "Active",
      };
    });
    if (search) {
      list = list.filter((m) => m.name.toLowerCase().includes(search.toLowerCase()));
    }
    return list;
  }, [sessions, search]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Mentees</h1>
      {loading ? <p className="text-sm text-gray-500">Loading...</p> : null}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <div className="bg-white p-4 rounded-xl border border-gray-200 mb-4 flex flex-col md:flex-row gap-4 items-end shadow-sm">
        <div className="w-full md:w-2/3">
          <input
            type="text"
            placeholder="Search mentees..."
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white placeholder-gray-400 text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="w-full md:w-1/3">
          <label className="block text-xs text-gray-500 mb-1 ml-1 font-medium">Filter by Subject</label>
          <select className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm">
            <option>All</option>
            <option>Software Engineering</option>
            <option>Computer Science</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mentees.length === 0 ? (
          <p className="text-sm text-gray-500">No mentees found.</p>
        ) : null}
        {mentees.map((mentee) => (
          <div
            key={mentee.id}
            className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition flex flex-col h-full"
          >
            <div className="text-center mb-8">
              <h3 className="text-lg font-bold text-gray-800">{mentee.name}</h3>
              <p className="text-xs text-gray-400 mt-1">{mentee.major}</p>
            </div>
            <div className="space-y-5 mb-8 px-2 flex-1">
              <div className="flex items-start gap-4">
                <i className="fa-solid fa-book-open text-gray-400 mt-1 text-lg w-5" />
                <div>
                  <span className="block text-xs text-gray-400 mb-1">Subjects</span>
                  <span className="text-sm font-medium text-gray-700">{mentee.subjects}</span>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <i className="fa-regular fa-clock text-gray-400 mt-1 text-lg w-5" />
                <div>
                  <span className="block text-xs text-gray-400 mb-1">Sessions</span>
                  <span className="text-sm text-gray-600">{mentee.sessionsText}</span>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <i className="fa-regular fa-star text-gray-400 mt-1 text-lg w-5" />
                <div>
                  <span className="block text-xs text-gray-400 mb-1">Progress</span>
                  <span className="text-sm font-bold text-gray-800">{mentee.progress}</span>
                </div>
              </div>
            </div>
            <Link
              href={`/tutor/mentees/${mentee.id}`}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition flex items-center justify-center gap-2 text-sm"
            >
              Track Progress <i className="fa-solid fa-chevron-right text-xs" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
