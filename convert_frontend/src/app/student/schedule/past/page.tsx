'use client';

import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { formatDate, formatTimeRange } from "@/lib/format";
import { sampleSessions } from "@/lib/sample-data";
import { Session } from "@/types/api";

export default function PastSchedulePage() {
  const { auth } = useAuth();
  const [sessions, setSessions] = useState<Session[]>(sampleSessions);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadSessions = async () => {
      if (!auth.userId) return;
      setLoading(true);
      try {
        const data = await api.getSessionsForStudent(auth.userId, auth.token);
        if (data?.length) setSessions(data);
      } catch (error) {
        console.warn("Using sample past sessions because API failed", error);
      } finally {
        setLoading(false);
      }
    };
    loadSessions();
  }, [auth.token, auth.userId]);

  const pastSessions = sessions.filter((session) => {
    const start = session.startTime ? new Date(session.startTime) : null;
    return start ? start < new Date() : false;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">My Schedule</h1>
        <p className="text-sm text-gray-500">Past sessions and follow-up actions.</p>
      </div>

      <div className="flex gap-3 text-sm">
        <Link
          href="/student/schedule/upcoming"
          className="px-3 py-1 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
        >
          Upcoming
        </Link>
        <Link
          href="/student/schedule/past"
          className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-semibold"
        >
          Past
        </Link>
      </div>

      <div className="space-y-4">
        {loading ? (
          <p className="text-sm text-gray-500">Loading sessions...</p>
        ) : null}
        {pastSessions.map((session) => (
          <div
            key={session.sessionId}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col gap-3"
          >
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-sm font-semibold text-blue-700">
                {session.tutor?.fullName
                  ?.split(" ")
                  .map((x) => x[0])
                  .join("")
                  .slice(0, 2) || "BK"}
              </div>
              <div className="flex-1">
                <h3 className="text-base font-semibold text-gray-800">
                  {session.topic || "Completed Session"}
                </h3>
                <p className="text-sm text-gray-600">
                  {session.tutor?.fullName || "Tutor TBD"}
                </p>
                <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-2">
                  <span>📅 {formatDate(session.startTime)}</span>
                  <span>⏰ {formatTimeRange(session.startTime, session.endTime)}</span>
                  <span>{session.mode === "IN_PERSON" ? "On campus" : "Online"}</span>
                </div>
              </div>
              <span className="text-xs font-semibold text-green-700 bg-green-50 px-2 py-1 rounded-full">
                {session.status || "COMPLETED"}
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link
                href={`/student/session/${session.sessionId}/evaluation`}
                className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium bg-blue-700 text-white hover:bg-blue-800 transition"
              >
                Evaluate Session
              </Link>
              <Link
                href="/student/resources"
                className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium border border-blue-700 text-blue-700 hover:bg-blue-50 transition"
              >
                View Resources
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
