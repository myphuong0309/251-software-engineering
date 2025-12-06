'use client';

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { formatDate, formatTimeRange } from "@/lib/format";
import { Session, User } from "@/types/api";

export default function TrackProgressPage() {
  const params = useParams<{ id: string }>();
  const { auth, ready } = useAuth();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [student, setStudent] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!ready) return;
      if (!auth.token || !auth.userId) {
        setError("Please log in to view mentees.");
        setSessions([]);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const tutorSessions = await api.getSessionsForTutor(auth.userId, auth.token);
        const filtered = (tutorSessions || []).filter((s) => s.student?.userId === params.id);
        setSessions(filtered);
        if (filtered[0]?.student?.userId) {
          setStudent(filtered[0].student as User);
        } else {
          // fallback: load from /users if not attached on session
          const user = await api.getUser(params.id, auth.token);
          setStudent(user);
        }
      } catch (err) {
        console.warn("Unable to load mentee detail", err);
        const message = err instanceof Error ? err.message : "Unable to load mentee.";
        setError(message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [auth.token, auth.userId, params.id, ready]);

  const stats = useMemo(() => {
    const completed = sessions.filter((s) => s.status === "COMPLETED");
    const upcoming = sessions.filter((s) => s.startTime && new Date(s.startTime) > new Date());
    const last = completed
      .filter((s) => s.endTime)
      .sort((a, b) => new Date(b.endTime || 0).getTime() - new Date(a.endTime || 0).getTime())[0];
    return {
      completedCount: completed.length,
      totalCount: sessions.length,
      upcomingCount: upcoming.length,
      lastSessionLabel: last?.endTime ? formatDate(last.endTime) : "N/A",
    };
  }, [sessions]);

  const initials = useMemo(() => {
    return (student?.fullName || "Student")
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }, [student?.fullName]);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <Link
        href="/tutor/mentees"
        className="text-blue-600 hover:text-blue-800 font-medium mb-2 flex items-center gap-2 transition text-sm"
      >
        <i className="fa-solid fa-arrow-left" /> Back to Mentees
      </Link>

      <div className="bg-blue-700 rounded-t-xl p-8 text-white flex items-center gap-6">
        <div className="w-20 h-20 rounded-full border-2 border-white flex items-center justify-center overflow-hidden bg-blue-600">
          <span className="text-2xl font-bold">{initials}</span>
        </div>
        <div>
          <h2 className="text-2xl font-bold">{student?.fullName || "Student"}</h2>
          <p className="opacity-90 mt-1 text-sm">
            {(student as any)?.major || "Major not set"} •
            {student && (student as any).gpa ? ` GPA ${(student as any).gpa}` : " GPA N/A"}
          </p>
        </div>
      </div>

      <div className="bg-white p-8 border-x border-b border-gray-200 shadow-sm mb-8 rounded-b-xl">
        {loading ? <p className="text-sm text-gray-500">Loading mentee info...</p> : null}
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h3 className="text-sm font-bold text-gray-800 mb-6">Student Information</h3>
            <div className="space-y-4 text-sm">
              <div>
                <p className="text-gray-500 mb-1">Email</p>
                <p className="text-gray-800 font-medium">{student?.email || "N/A"}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Faculty / Major</p>
                <p className="text-gray-800 font-medium">{(student as any)?.major || "N/A"}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Phone</p>
                <p className="text-gray-800 font-medium">{student?.phoneNumber || "N/A"}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-gray-800 mb-6">Progress Notes</h3>
            <div className="space-y-3 text-sm">
              <p className="text-gray-700">
                <span className="font-semibold">Completed:</span> {stats.completedCount} / {stats.totalCount}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Upcoming:</span> {stats.upcomingCount}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Last session:</span> {stats.lastSessionLabel}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10">
          <h3 className="text-sm font-bold text-gray-800 mb-4">Session History</h3>
          {sessions.length === 0 ? (
            <p className="text-sm text-gray-500">No sessions found for this mentee.</p>
          ) : (
            <div className="space-y-3">
              {sessions.map((s) => (
                <div
                  key={s.sessionId}
                  className="border border-gray-200 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-gray-800">{s.topic || "Session"}</p>
                    <p className="text-xs text-gray-500">
                      {s.startTime
                        ? `${formatDate(s.startTime)} • ${formatTimeRange(s.startTime, s.endTime)}`
                        : "Date TBD"}
                    </p>
                    <p className="text-xs text-gray-500">Status: {s.status || "N/A"}</p>
                  </div>
                  <Link
                    href={`/student/session/${s.sessionId}`}
                    className="mt-3 sm:mt-0 inline-flex items-center gap-2 text-xs font-semibold text-blue-700 hover:text-blue-800"
                  >
                    View session <i className="fa-solid fa-arrow-right text-[10px]" />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
