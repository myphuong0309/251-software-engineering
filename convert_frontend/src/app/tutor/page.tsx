'use client';

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { formatDate, formatTimeRange } from "@/lib/format";
import {
  sampleMatchingRequests,
  sampleSessions,
  sampleTutors,
} from "@/lib/sample-data";
import { MatchingRequest, Session, Tutor } from "@/types/api";

export default function TutorDashboard() {
  const { auth } = useAuth();
  const [requests, setRequests] =
    useState<MatchingRequest[]>(sampleMatchingRequests);
  const [sessions, setSessions] = useState<Session[]>(sampleSessions);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (!auth.userId) return;
      try {
        const [reqData, sessionData] = await Promise.all([
          api.getMatchingRequestsForTutor(auth.userId, auth.token),
          api.getSessionsForTutor(auth.userId, auth.token),
        ]);
        if (reqData?.length) setRequests(reqData);
        if (sessionData?.length) setSessions(sessionData);
      } catch (error) {
        console.warn("Tutor dashboard using sample data", error);
      }
    };
    loadData();
  }, [auth.token, auth.userId]);

  const activeTutor: Tutor =
    sampleTutors.find((tutor) => tutor.userId === auth.userId) || sampleTutors[0];

  const pendingRequests = requests.filter((request) => request.status === "PENDING");
  const upcomingSessions = sessions.filter((session) => {
    const start = session.startTime ? new Date(session.startTime) : null;
    return start ? start > new Date() : true;
  });

  const approve = async (requestId: string) => {
    if (!auth.userId) {
      setStatus("Add your userId on login to manage requests.");
      return;
    }
    try {
      await api.approveMatchingRequest(requestId, auth.token);
      setRequests((prev) =>
        prev.map((r) =>
          r.requestId === requestId ? { ...r, status: "ACCEPTED" } : r,
        ),
      );
      setStatus("Request approved.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Approve failed.");
    }
  };

  const reject = async (requestId: string) => {
    if (!auth.userId) {
      setStatus("Add your userId on login to manage requests.");
      return;
    }
    try {
      await api.rejectMatchingRequest(requestId, auth.token);
      setRequests((prev) =>
        prev.map((r) =>
          r.requestId === requestId ? { ...r, status: "REJECTED" } : r,
        ),
      );
      setStatus("Request rejected.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Reject failed.");
    }
  };

  const stats = useMemo(
    () => ({
      hours: 12.5,
      students: 7,
      sessions: sessions.length,
      rating: activeTutor.averageRating || 4.8,
    }),
    [activeTutor.averageRating, sessions.length],
  );

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800">Tutor Dashboard</h1>

      {status ? (
        <div className="text-sm text-blue-700 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
          {status}
        </div>
      ) : null}

      <section className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <h2 className="text-base font-bold text-gray-700 mb-1">
          Pending Session Requests
        </h2>
        <p className="text-xs text-gray-400 mb-6">
          Review and respond to student requests
        </p>

        <div className="space-y-6">
          {pendingRequests.map((request) => (
            <div
              key={request.requestId}
              className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-100 pb-6 last:border-0 last:pb-0"
            >
              <div>
                <p className="font-bold text-gray-800 text-sm">
                  {request.student?.fullName || "Student"}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {request.subject || "Requested subject"}
                </p>
                <p className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                  <i className="fa-regular fa-calendar text-gray-400" />
                  {request.preferredTimeSlots?.[0]
                    ? `${formatDate(request.preferredTimeSlots[0])}`
                    : "Preferred time not set"}
                </p>
              </div>
              <div className="flex gap-3 mt-3 md:mt-0">
                <button
                  onClick={() => approve(request.requestId)}
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-1.5 rounded text-xs font-bold transition flex items-center gap-2"
                >
                  <i className="fa-solid fa-check" /> Accept
                </button>
                <button
                  onClick={() => reject(request.requestId)}
                  className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-500 px-6 py-1.5 rounded text-xs font-bold transition flex items-center gap-2"
                >
                  <i className="fa-solid fa-xmark" /> Decline
                </button>
              </div>
            </div>
          ))}
          {!pendingRequests.length ? (
            <p className="text-sm text-gray-500">No pending requests right now.</p>
          ) : null}
        </div>
      </section>

      <section className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <h2 className="text-base font-bold text-gray-700 mb-1">Upcoming Sessions</h2>
        <p className="text-xs text-gray-400 mb-6">Your scheduled tutoring sessions</p>

        <div className="space-y-6">
          {upcomingSessions.map((session) => (
            <div
              key={session.sessionId}
              className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-100 pb-6 last:border-0 last:pb-0"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-bold text-gray-800 text-sm">
                    {session.student?.fullName || "Student"}
                  </p>
                  <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded font-medium">
                    {session.mode === "IN_PERSON" ? "In-Person" : "Online"}
                  </span>
                </div>
                <p className="text-xs text-gray-400">{session.topic}</p>
                <p className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                  <i className="fa-regular fa-calendar text-gray-400" />
                  {formatDate(session.startTime)} ,{" "}
                  {formatTimeRange(session.startTime, session.endTime)}
                </p>
              </div>
              <div className="flex gap-2 mt-3 md:mt-0">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded text-xs font-bold transition">
                  Join Meeting
                </button>
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
              <span className="text-3xl font-bold text-blue-700">
                {stats.rating.toFixed(1)}
              </span>
            </div>
            <span className="text-xs text-gray-400">Average Rating (out of 5)</span>
          </div>

          <div className="space-y-5 max-w-2xl mx-auto">
            {[
              { label: "Teaching Quality", value: 4.9 },
              { label: "Communication", value: 4.7 },
              { label: "Punctuality", value: 5.0 },
            ].map((metric) => (
              <div key={metric.label}>
                <div className="flex justify-between text-xs mb-1 text-gray-500">
                  <span>{metric.label}</span>
                  <span className="font-bold text-gray-700">{metric.value}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2 relative">
                  <div
                    className="bg-blue-600 h-2 rounded-full absolute left-0 top-0"
                    style={{ width: `${(metric.value / 5) * 100}%` }}
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
          <StatCard
            icon="fa-regular fa-clock"
            title="Hours"
            value={stats.hours.toString()}
            color="text-blue-600"
            background="bg-blue-50"
          />
          <StatCard
            icon="fa-regular fa-user"
            title="Students"
            value={stats.students.toString()}
            color="text-green-600"
            background="bg-green-50"
          />
          <StatCard
            icon="fa-solid fa-chart-line"
            title="Sessions"
            value={stats.sessions.toString()}
            color="text-purple-600"
            background="bg-purple-50"
          />
          <StatCard
            icon="fa-solid fa-medal"
            title="Rating"
            value={stats.rating.toFixed(1)}
            color="text-amber-600"
            background="bg-amber-50"
          />
        </div>
      </section>
    </div>
  );
}

function StatCard({
  icon,
  title,
  value,
  color,
  background,
}: {
  icon: string;
  title: string;
  value: string;
  color: string;
  background: string;
}) {
  return (
    <div className={`${background} p-4 rounded-lg`}>
      <div className={`flex items-center gap-2 ${color} mb-1`}>
        <i className={`${icon} text-sm`} />
        <span className="text-xs font-medium">{title}</span>
      </div>
      <p className="text-xl font-bold text-gray-800">{value}</p>
    </div>
  );
}
