'use client';

import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { formatDate, formatTimeRange } from "@/lib/format";
import { Session } from "@/types/api";

export default function PastSchedulePage() {
  const { auth } = useAuth();
  const studentId = auth.userId || "student-1";
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSessions = async () => {
      if (!auth.token) {
        setError("Please log in to view your sessions.");
        setSessions([]);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const data = await api.getSessionsForStudent(studentId, auth.token);
        setSessions(data || []);
      } catch (error) {
        console.warn("Unable to load past sessions", error);
        setError("Unable to load past sessions. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    loadSessions();
  }, [auth.token, studentId]);

  const pastSessions = sessions.filter((session) => {
    const start = session.startTime ? new Date(session.startTime) : null;
    return start ? start < new Date() : false;
  });

  return (
    <div className="space-y-6">
      <section className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">My Schedule</h1>
        <div className="inline-flex rounded-lg border border-gray-200 bg-white overflow-hidden">
          <button className="px-4 py-2 text-sm font-semibold bg-blue-700 text-white">List</button>
          <button className="px-4 py-2 text-sm text-gray-600 hover:text-blue-600">Calendar</button>
        </div>
      </section>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-100 px-4 sm:px-6">
          <div className="flex gap-6 text-sm">
            <Link
              href="/student/schedule/upcoming"
              className="py-3 text-gray-500 hover:text-blue-600"
            >
              Upcoming Sessions
            </Link>
            <button className="py-3 border-b-2 border-blue-600 text-blue-600 font-semibold">
              Past Sessions
            </button>
          </div>
        </div>

        <div className="px-4 sm:px-6 py-5 space-y-4">
          {loading ? (
            <p className="text-sm text-gray-500">Loading sessions...</p>
          ) : error ? (
            <p className="text-sm text-red-600">{error}</p>
          ) : pastSessions.length === 0 ? (
            <p className="text-sm text-gray-500">No past sessions found.</p>
          ) : null}
          {pastSessions.map((session) => {
            const evaluated = Boolean(session.evaluationSubmitted || session.evaluationId);
            return (
              <div
                key={session.sessionId}
                className="border border-gray-100 rounded-xl p-4 sm:p-5 bg-white flex flex-col gap-3"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full border border-gray-300 bg-white" />
                  <div className="flex-1 space-y-1">
                    <h3 className="text-base font-semibold text-gray-800">
                      {session.tutor?.fullName || "Tutor TBD"}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {session.topic || (session as any).topic || "Completed Session"}
                    </p>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-1">
                      <span className="flex items-center gap-2">
                        <i className="fa-regular fa-calendar text-gray-400 text-xs" />
                        {session.startTime ? formatDate(session.startTime) : (session as any).date}
                      </span>
                      <span className="flex items-center gap-2">
                        <i className="fa-regular fa-clock text-gray-400 text-xs" />
                        {session.startTime
                          ? formatTimeRange(session.startTime, session.endTime)
                          : (session as any).time}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex pt-2">
                  {evaluated ? (
                    <Link
                      href={`/student/session/${session.sessionId}/evaluation`}
                      className="w-full inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium border border-blue-700 text-blue-700 hover:bg-blue-50 transition text-center"
                    >
                      View Evaluation
                    </Link>
                  ) : (
                    <Link
                      href={`/student/session/${session.sessionId}/evaluation`}
                      className="w-full inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium bg-blue-700 text-white hover:bg-blue-800 transition text-center"
                    >
                      Evaluate Session
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
