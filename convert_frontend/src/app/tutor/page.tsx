'use client';

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { MatchingRequest, Session } from "@/types/api";

export default function TutorDashboard() {
  const { auth } = useAuth();
  const tutorId = auth.userId || "tutor-1";
  const [pending, setPending] = useState<MatchingRequest[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!auth.token) {
        setError("Please log in to view your dashboard.");
        setPending([]);
        setSessions([]);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const [reqs, sess] = await Promise.all([
          api.getMatchingRequestsForTutor(tutorId, auth.token),
          api.getSessionsForTutor(tutorId, auth.token),
        ]);
        setPending((reqs || []).filter((r) => r.status === "PENDING"));
        setSessions(sess || []);
      } catch (err) {
        console.warn("Unable to load tutor dashboard data", err);
        setError("Unable to load latest data.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [auth.token, tutorId]);

  const upcomingSessions = useMemo(() => {
    return sessions
      .filter((s) => s.startTime && new Date(s.startTime) > new Date())
      .sort(
        (a, b) =>
          new Date(a.startTime || 0).getTime() -
          new Date(b.startTime || 0).getTime(),
      );
  }, [sessions]);

  const metrics = useMemo(() => {
    const completed = sessions.filter((s) => s.status === "COMPLETED");
    return [
      { label: "Teaching Quality", value: 4.8 },
      { label: "Communication", value: 4.7 },
      { label: "Punctuality", value: 5.0 },
      { label: "Completed Sessions", value: completed.length },
    ];
  }, [sessions]);

  const weekStats = useMemo(() => {
    return [
      { icon: "fa-regular fa-clock", title: "Hours", value: `${sessions.length * 1.5}`, color: "text-blue-600", background: "bg-blue-50" },
      { icon: "fa-regular fa-user", title: "Students", value: `${new Set(sessions.map((s) => s.student?.userId)).size}`, color: "text-green-600", background: "bg-green-50" },
      { icon: "fa-solid fa-chart-line", title: "Sessions", value: `${sessions.length}`, color: "text-purple-600", background: "bg-purple-50" },
      { icon: "fa-regular fa-calendar", title: "Upcoming", value: `${upcomingSessions.length}`, color: "text-yellow-600", background: "bg-yellow-50" },
    ];
  }, [sessions, upcomingSessions]);

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Tutor Dashboard</h1>
      {loading ? <p className="text-sm text-gray-500">Loading...</p> : null}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <section className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <h2 className="text-base font-bold text-gray-700 mb-1">Pending Session Requests</h2>
        <p className="text-xs text-gray-400 mb-6">Review and respond to student requests</p>

        <div className="space-y-6">
          {pending.length === 0 ? <p className="text-sm text-gray-500">No pending requests.</p> : null}
          {pending.map((request) => (
            <div
              key={request.requestId}
              className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-100 pb-6 last:border-0 last:pb-0"
            >
              <div>
                <p className="font-bold text-gray-800 text-sm">{request.student?.fullName || "Student"}</p>
                <p className="text-xs text-gray-400 mt-1">{request.subject}</p>
                <p className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                  <i className="fa-regular fa-calendar text-gray-400" /> {request.preferredTimeSlots?.[0] || "Preferred time TBD"}
                </p>
              </div>
              <div className="flex gap-3 mt-3 md:mt-0">
                <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-1.5 rounded text-xs font-bold transition flex items-center gap-2">
                  <i className="fa-solid fa-check" /> Accept
                </button>
                <button className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-500 px-6 py-1.5 rounded text-xs font-bold transition flex items-center gap-2">
                  <i className="fa-solid fa-xmark" /> Decline
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <h2 className="text-base font-bold text-gray-700 mb-1">Upcoming Sessions</h2>
        <p className="text-xs text-gray-400 mb-6">Your scheduled tutoring sessions</p>

        <div className="space-y-6">
          {upcomingSessions.length === 0 ? <p className="text-sm text-gray-500">No upcoming sessions.</p> : null}
          {upcomingSessions.map((session) => (
            <div
              key={session.sessionId}
              className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-100 pb-6 last:border-0 last:pb-0"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-bold text-gray-800 text-sm">{session.student?.fullName || "Student"}</p>
                  <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded font-medium">
                    {session.mode || "Mode"}
                  </span>
                </div>
                <p className="text-xs text-gray-400">{session.topic}</p>
                <p className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                  <i className="fa-regular fa-calendar text-gray-400" /> {session.startTime || ""}
                </p>
              </div>
              <div className="flex gap-2 mt-3 md:mt-0">
                {session.meetingLink ? (
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded text-xs font-bold transition">
                    Join Meeting
                  </button>
                ) : (
                  <div className="w-[88px]" />
                )}
                <button className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-1.5 rounded text-xs font-bold transition">
                  Reschedule
                </button>
                <button className="bg-red-400 hover:bg-red-500 text-white px-4 py-1.5 rounded text-xs font-bold transition">
                  Cancel
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div>
        <h2 className="text-sm font-bold text-gray-700 mb-4">Quick Actions</h2>
        <div className="space-y-3">
          <Link
            href="/tutor/availability"
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded font-medium text-sm transition text-center flex items-center justify-center gap-2"
          >
            <i className="fa-regular fa-calendar-plus" /> Set Availability
          </Link>
          <Link
            href="/tutor/mentees"
            className="block w-full bg-white hover:bg-gray-50 text-gray-600 py-2.5 rounded font-medium text-sm transition text-center border border-gray-200 flex items-center justify-center gap-2 shadow-sm"
          >
            <i className="fa-regular fa-user" /> View My Mentees
          </Link>
        </div>
      </div>

      <section className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm">
        <div className="bg-blue-700 px-6 py-3">
          <h2 className="text-sm font-bold text-white">My Performance</h2>
        </div>

        <div className="p-8">
          <div className="flex flex-col items-center justify-center mb-8">
            <div className="w-24 h-24 rounded-full bg-blue-50 flex items-center justify-center mb-3 relative">
              <span className="text-3xl font-bold text-blue-700">4.8</span>
            </div>
            <span className="text-xs text-gray-400">Average Rating (out of 5)</span>
          </div>

          <div className="space-y-5 max-w-2xl mx-auto">
            {metrics.map((metric) => (
              <div key={metric.label}>
                <div className="flex justify-between text-xs mb-1 text-gray-500">
                  <span>{metric.label}</span>
                  <span className="font-bold text-gray-700">{metric.value}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2 relative">
                  <div
                    className="bg-blue-600 h-2 rounded-full absolute left-0 top-0"
                    style={{ width: `${(typeof metric.value === "number" ? (metric.value / 5) * 100 : 0)}%` }}
                  />
                  <div className="w-3 h-3 bg-white border-2 border-gray-300 rounded-full absolute top-[-2px] right-0 shadow-sm" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <h2 className="text-sm font-bold text-gray-700 mb-4">This Week</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {weekStats.map((stat) => (
            <div key={stat.title} className={`${stat.background} p-4 rounded-lg`}>
              <div className={`flex items-center gap-2 ${stat.color} mb-1`}>
                <i className={`${stat.icon} text-sm`} />
                <span className="text-xs font-medium">{stat.title}</span>
              </div>
              <p className="text-xl font-bold text-gray-800">{stat.value}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
