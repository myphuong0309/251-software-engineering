'use client';

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import { formatDate, formatTimeRange } from "@/lib/format";
import { MatchingRequest, Session } from "@/types/api";

export default function StudentDashboard() {
  const studentId = "student-1";
  const [sessions, setSessions] = useState<Session[]>([]);
  const [matches, setMatches] = useState<MatchingRequest[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setError(null);
      try {
        const [sessionData, matchData] = await Promise.all([
          api.getSessionsForStudent(studentId),
          api.getMatchingRequestsForStudent(studentId),
        ]);
        setSessions(sessionData || []);
        setMatches(matchData || []);
      } catch (error) {
        console.warn("Unable to load student dashboard data", error);
        setError("Unable to load your latest sessions. Please try again later.");
      }
    };
    loadData();
  }, []);

  const upcoming = useMemo(() => {
    const futureSessions = sessions
      .filter((session) => session.startTime && new Date(session.startTime) > new Date())
      .sort(
        (a, b) =>
          new Date(a.startTime || 0).getTime() -
          new Date(b.startTime || 0).getTime(),
      );
    return futureSessions[0] || null;
  }, [sessions]);

  const matchedTutors = useMemo(() => {
    return matches.map((item) => item.tutor).filter(Boolean);
  }, [matches]);

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Welcome back, John!
        </h1>
      </section>

      {upcoming ? (
        <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">
            Upcoming Session
          </h2>
          <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
            <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-xl font-semibold text-blue-600">
              {(upcoming.tutor?.fullName || "Tutor")
                .split(" ")
                .map((part) => part[0])
                .join("")
                .slice(0, 2)}
            </div>

            <div className="flex-1 space-y-1">
              <h3 className="text-base font-semibold text-gray-800">
                {upcoming.tutor?.fullName || "Tutor"}
              </h3>
              <p className="text-sm text-gray-600">
                {upcoming.topic || "Upcoming session"}
              </p>
              <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-2">
                <span className="flex items-center gap-1">
                  📅 {formatDate(upcoming.startTime)}
                </span>
                <span className="flex items-center gap-1">
                  ⏰ {formatTimeRange(upcoming.startTime, upcoming.endTime)}
                </span>
              </div>
            </div>

            <div className="flex flex-row flex-wrap gap-2">
              <a
                href={upcoming.meetingLink || "#"}
                className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium bg-blue-700 text-white hover:bg-blue-800 transition"
              >
                Join Online Meeting
              </a>
              <Link
                href="/student/schedule/upcoming"
                className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium border border-blue-700 text-blue-700 hover:border-blue-500 hover:text-blue-600 transition"
              >
                View Details
              </Link>
            </div>
          </div>
        </section>
      ) : error ? (
        <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <p className="text-sm text-red-600">{error}</p>
        </section>
      ) : null}

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="/student/find-tutor"
          className="bg-white rounded-2xl border border-gray-100 shadow-sm px-8 py-10 flex flex-col items-center text-center hover:shadow-md hover:-translate-y-0.5 transition"
        >
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-lg font-semibold text-gray-800 mb-1">
            Find a New Tutor
          </h3>
          <p className="text-sm text-gray-500">Browse available tutors</p>
        </Link>

        <Link
          href="/student/schedule/upcoming"
          className="bg-white rounded-2xl border border-gray-100 shadow-sm px-8 py-10 flex flex-col items-center text-center hover:shadow-md hover:-translate-y-0.5 transition"
        >
          <div className="text-4xl mb-4">📅</div>
          <h3 className="text-lg font-semibold text-gray-800 mb-1">
            View My Schedule
          </h3>
          <p className="text-sm text-gray-500">Manage your sessions</p>
        </Link>
      </section>

      <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-800">Notifications</h2>
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-xs font-semibold text-blue-700">
            3 new
          </span>
        </div>
        <ul className="space-y-3 text-sm">
          <li className="flex justify-between gap-4">
            <span className="text-gray-700">Your session request with Dr. Smith was accepted</span>
            <span className="text-xs text-gray-400 whitespace-nowrap">2 hours ago</span>
          </li>
          <li className="flex justify-between gap-4">
            <span className="text-gray-700">Reminder: Submit feedback for your last session</span>
            <span className="text-xs text-gray-400 whitespace-nowrap">1 day ago</span>
          </li>
          <li className="flex justify-between gap-4">
            <span className="text-gray-700">New resource added for CO3001</span>
            <span className="text-xs text-gray-400 whitespace-nowrap">2 days ago</span>
          </li>
        </ul>
      </section>

      <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Matched Tutors
        </h2>

        {matchedTutors.length === 0 ? (
          <p className="text-sm text-gray-500">No matched tutors yet.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {matchedTutors.map((tutor) => (
              <div key={tutor?.userId} className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-sm font-semibold text-blue-700">
                  {(tutor?.fullName || "T")
                    .split(" ")
                    .map((part) => part[0])
                    .join("")
                    .slice(0, 2)}
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-800">
                    {tutor?.fullName || "Tutor"}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {tutor?.expertiseAreas?.join(", ") || "Specialization coming soon"}
                  </p>
                </div>
              </div>
            ))}

            <Link
              href="/student/schedule/upcoming"
              className="w-full inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium border border-blue-700 text-blue-700 hover:bg-blue-50 hover:border-blue-800 transition"
            >
              Schedule New Session
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
