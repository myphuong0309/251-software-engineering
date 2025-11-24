'use client';

import Link from "next/link";
import { useMemo, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { sampleTutors } from "@/lib/sample-data";
import { Tutor } from "@/types/api";

export default function FindTutorPage() {
  const { auth } = useAuth();
  const [query, setQuery] = useState("");
  const [subject, setSubject] = useState("All Subjects");
  const [date, setDate] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const filteredTutors = useMemo(() => {
    return sampleTutors.filter((tutor) => {
      const matchesQuery =
        tutor.fullName?.toLowerCase().includes(query.toLowerCase()) ||
        tutor.expertiseAreas?.some((area) =>
          area.toLowerCase().includes(query.toLowerCase()),
        );
      const matchesSubject =
        subject === "All Subjects" ||
        tutor.expertiseAreas?.some((area) =>
          area.toLowerCase().includes(subject.toLowerCase()),
        );
      return matchesQuery && matchesSubject;
    });
  }, [query, subject]);

  const handleRequest = async (tutor: Tutor) => {
    setMessage(null);
    if (!auth.userId) {
      setMessage("Please add your userId on the login page to submit a request.");
      return;
    }
    setSubmitting(true);
    try {
      await api.createMatchingRequest(
        {
          student: { userId: auth.userId, fullName: auth.fullName || "Student" },
          tutor: { userId: tutor.userId, fullName: tutor.fullName },
          subject:
            subject === "All Subjects" ? "General mentoring" : subject || "Mentoring",
          preferredTimeSlots: date ? [new Date(date).toISOString()] : undefined,
        },
        auth.token,
      );
      setMessage("Request sent to the coordinator and tutor.");
    } catch (error) {
      const text = error instanceof Error ? error.message : "Request failed.";
      setMessage(text);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Find a Tutor</h1>
        <p className="text-sm text-gray-500 mt-1">
          Search tutors by subject, then send a matching request that goes to the backend.
        </p>
      </section>

      <section className="bg-blue-100 border border-blue-300 rounded-2xl px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-base md:text-lg font-semibold text-gray-800">
            Personalized Learning Support (AI)
          </h3>
          <p className="text-sm text-gray-700 mt-1">
            Get matched with the perfect tutor based on your learning style and goals.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setMessage("Recommendations will appear once AI service is enabled.")}
          className="inline-flex items-center justify-center px-4 py-2 rounded-full text-xs sm:text-sm font-semibold text-blue-700 border border-blue-500 bg-white hover:bg-blue-50 hover:border-blue-600 transition"
        >
          Get Recommendations
        </button>
      </section>

      <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Filters</h3>
        <form className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="search" className="text-sm text-gray-700">
              Search
            </label>
            <input
              type="text"
              id="search"
              placeholder="Search by tutor name or subject..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="subject" className="text-sm text-gray-700">
              Subject/Course
            </label>
            <select
              id="subject"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            >
              <option>All Subjects</option>
              <option>Software Engineering</option>
              <option>Data Structures</option>
              <option>Algorithms</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="availability" className="text-sm text-gray-700">
              Preferred date
            </label>
            <input
              type="date"
              id="availability"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        </form>
      </section>

      {message ? (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 text-sm rounded-lg px-4 py-3">
          {message}
        </div>
      ) : null}

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredTutors.map((tutor) => (
          <div
            key={tutor.userId}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col gap-4"
          >
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-sm font-semibold text-blue-600">
                {tutor.fullName
                  ?.split(" ")
                  .map((x) => x[0])
                  .join("")
                  .slice(0, 2)}
              </div>
              <div>
                <h4 className="text-base font-semibold text-gray-800">
                  {tutor.fullName}
                </h4>
                <p className="text-sm text-gray-500">Faculty of Computer Science</p>
                <div className="mt-1 inline-flex items-center text-xs font-semibold text-yellow-500">
                  ★ {tutor.averageRating?.toFixed(1) || "4.5"}
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 text-xs mt-1">
              {tutor.expertiseAreas?.map((area) => (
                <span
                  key={area}
                  className="inline-flex items-center px-2.5 py-1 rounded-full bg-gray-100 text-gray-600"
                >
                  {area}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                href={`/student/tutor/${tutor.userId}`}
                className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium border border-blue-700 text-blue-700 hover:bg-blue-50 transition mt-2"
              >
                View Profile
              </Link>
              <button
                type="button"
                onClick={() => handleRequest(tutor)}
                disabled={submitting}
                className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium bg-blue-700 text-white hover:bg-blue-800 transition mt-2 disabled:opacity-60"
              >
                {submitting ? "Sending..." : "Request Match"}
              </button>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
