'use client';

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { formatDate, formatTimeRange } from "@/lib/format";
import { AvailabilitySlot, MatchingRequest, Session } from "@/types/api";

export default function TutorDashboard() {
  const { auth, ready } = useAuth();
  const [pending, setPending] = useState<MatchingRequest[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [mutating, setMutating] = useState<string | null>(null);
  const [rescheduleTarget, setRescheduleTarget] = useState<Session | null>(null);
  const [availableSlots, setAvailableSlots] = useState<AvailabilitySlot[]>([]);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [modalError, setModalError] = useState<string | null>(null);

  const loadData = async () => {
    if (!ready) return;
    if (!auth.token || !auth.userId) {
      setError("Please log in to view your dashboard.");
      setPending([]);
      setSessions([]);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const [reqs, sess, slots] = await Promise.all([
        api.getMatchingRequestsForTutor(auth.userId, auth.token),
        api.getSessionsForTutor(auth.userId, auth.token),
        api.getAvailabilityForTutor(auth.userId, auth.token),
      ]);
      setPending((reqs || []).filter((r) => r.status === "PENDING"));
      setSessions(sess || []);
      setAvailableSlots(slots || []);
    } catch (err) {
      console.warn("Unable to load tutor dashboard data", err);
      setError("Unable to load latest data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.token, auth.userId, ready]);

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

  const availableOptions = useMemo(() => {
    const now = new Date();
    return (availableSlots || [])
      .filter((slot) => slot.status !== "BOOKED")
      .filter((slot) => {
        if (!slot.startTime) return false;
        const start = new Date(slot.startTime);
        return start > now;
      })
      .sort(
        (a, b) =>
          new Date(a.startTime || 0).getTime() -
          new Date(b.startTime || 0).getTime(),
      );
  }, [availableSlots]);

  const handleApprove = async (requestId: string) => {
    if (!auth.token || !auth.userId) {
      setError("Please log in to approve requests.");
      return;
    }
    setMutating(requestId);
    try {
      await api.approveMatchingRequest(requestId, auth.token);
      setPending((prev) => prev.filter((r) => r.requestId !== requestId));
      await loadData();
      setStatusMessage("Request accepted.");
    } catch (err) {
      console.warn("Unable to approve request", err);
      const message = err instanceof Error ? err.message : "Unable to approve request. Please try again.";
      setError(message);
    } finally {
      setMutating(null);
    }
  };

  const handleReject = async (requestId: string) => {
    if (!auth.token || !auth.userId) {
      setError("Please log in to reject requests.");
      return;
    }
    setMutating(requestId);
    try {
      await api.rejectMatchingRequest(requestId, auth.token);
      setPending((prev) => prev.filter((r) => r.requestId !== requestId));
      await loadData();
      setStatusMessage("Request declined.");
    } catch (err) {
      console.warn("Unable to reject request", err);
      const message = err instanceof Error ? err.message : "Unable to reject request. Please try again.";
      setError(message);
    } finally {
      setMutating(null);
    }
  };

  const handleCancelSession = async (sessionId: string) => {
    if (!auth.token || !auth.userId) {
      setError("Please log in to manage sessions.");
      return;
    }
    setMutating(sessionId);
    try {
      await api.cancelSession(sessionId, auth.token);
      await loadData();
      setStatusMessage("Session canceled.");
    } catch (err) {
      console.warn("Unable to cancel session", err);
      const message = err instanceof Error ? err.message : "Unable to cancel session.";
      setError(message.includes("403") ? "You need to log in as a tutor to cancel sessions." : message);
    } finally {
      setMutating(null);
    }
  };

  const handleReschedule = (session: Session) => {
    if (!auth.token || !auth.userId) {
      setError("Please log in to manage sessions.");
      return;
    }
    setModalError(null);
    setStatusMessage(null);
    setRescheduleTarget(session);
    setSelectedSlotId(availableOptions[0]?.slotId || null);
    if (availableOptions.length === 0) {
      setModalError("No available time slots. Please add availability first.");
    }
  };

  const submitReschedule = async () => {
    if (!auth.token || !auth.userId) {
      setModalError("Please log in to manage sessions.");
      return;
    }
    if (!rescheduleTarget) return;
    if (!selectedSlotId) {
      setModalError("Pick an available time slot.");
      return;
    }
    const slot = availableOptions.find((s) => s.slotId === selectedSlotId);
    if (!slot?.startTime || !slot.endTime) {
      setModalError("Selected slot is missing times.");
      return;
    }
    setMutating(rescheduleTarget.sessionId);
    try {
      await api.rescheduleSession(
        rescheduleTarget.sessionId,
        {
          newStartTime: slot.startTime,
          newEndTime: slot.endTime,
        },
        auth.token,
      );
      await loadData();
      setStatusMessage("Session rescheduled.");
      setRescheduleTarget(null);
    } catch (err) {
      console.warn("Unable to reschedule session", err);
      const message = err instanceof Error ? err.message : "Unable to reschedule session.";
      setModalError(message.includes("403") ? "You need to log in as a tutor to reschedule sessions." : message);
    } finally {
      setMutating(null);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Tutor Dashboard</h1>
      {loading ? <p className="text-sm text-gray-500">Loading...</p> : null}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {statusMessage ? <p className="text-sm text-green-600">{statusMessage}</p> : null}

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
                <button
                  disabled={mutating === request.requestId}
                  onClick={() => handleApprove(request.requestId)}
                  className="bg-green-500 hover:bg-green-600 disabled:opacity-60 text-white px-6 py-1.5 rounded text-xs font-bold transition flex items-center gap-2"
                >
                  <i className="fa-solid fa-check" /> {mutating === request.requestId ? "Saving..." : "Accept"}
                </button>
                <button
                  disabled={mutating === request.requestId}
                  onClick={() => handleReject(request.requestId)}
                  className="bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-60 text-gray-500 px-6 py-1.5 rounded text-xs font-bold transition flex items-center gap-2"
                >
                  <i className="fa-solid fa-xmark" /> {mutating === request.requestId ? "Saving..." : "Decline"}
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
                  <i className="fa-regular fa-calendar text-gray-400" />
                  {session.startTime ? (
                    <>
                      {formatDate(session.startTime)} • {formatTimeRange(session.startTime, session.endTime)}
                    </>
                  ) : (
                    "Date TBD"
                  )}
                </p>
              </div>
              <div className="flex gap-2 mt-3 md:mt-0">
                {session.meetingLink ? (
                  <a
                    href={session.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded text-xs font-bold transition inline-flex items-center justify-center min-w-[88px]"
                  >
                    Join Meeting
                  </a>
                ) : (
                  <div className="w-[88px]" />
                )}
                <button
                  onClick={() => handleReschedule(session)}
                  disabled={mutating === session.sessionId}
                  className="bg-yellow-400 hover:bg-yellow-500 disabled:opacity-60 text-white px-4 py-1.5 rounded text-xs font-bold transition"
                >
                  {mutating === session.sessionId ? "Updating..." : "Reschedule"}
                </button>
                <button
                  onClick={() => handleCancelSession(session.sessionId)}
                  disabled={mutating === session.sessionId}
                  className="bg-red-400 hover:bg-red-500 disabled:opacity-60 text-white px-4 py-1.5 rounded text-xs font-bold transition"
                >
                  {mutating === session.sessionId ? "Updating..." : "Cancel"}
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

      {rescheduleTarget ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white w-full max-w-lg rounded-xl shadow-xl border border-gray-200 p-6 relative">
            <button
              type="button"
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
              onClick={() => setRescheduleTarget(null)}
              aria-label="Close"
            >
              <i className="fa-solid fa-xmark" />
            </button>
            <h3 className="text-lg font-bold text-gray-800 mb-1">Reschedule session</h3>
            <p className="text-sm text-gray-500 mb-4">
              {rescheduleTarget.topic || "Session"} with {rescheduleTarget.student?.fullName || "student"}
            </p>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-gray-600">Pick an available slot</label>
                {availableOptions.length === 0 ? (
                  <p className="text-sm text-gray-500">No available time slots. Add availability first.</p>
                ) : (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {availableOptions.map((slot) => (
                      <label
                        key={slot.slotId}
                        className={`flex items-start gap-3 border rounded-lg px-3 py-2 cursor-pointer hover:border-blue-400 ${
                          selectedSlotId === slot.slotId ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-white"
                        }`}
                      >
                        <input
                          type="radio"
                          className="mt-1"
                          name="slot"
                          checked={selectedSlotId === slot.slotId}
                          onChange={() => setSelectedSlotId(slot.slotId)}
                        />
                        <div className="text-sm">
                          <p className="font-semibold text-gray-800">{formatDate(slot.startTime || "")}</p>
                          <p className="text-xs text-gray-600">
                            {formatTimeRange(slot.startTime || "", slot.endTime || "")}
                          </p>
                          <p className="text-[11px] text-gray-500 mt-0.5">
                            {slot.isRecurring ? "Recurring" : "One-time"} • {slot.status || "AVAILABLE"}
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>
              {modalError ? <p className="text-sm text-red-600">{modalError}</p> : null}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  onClick={() => setRescheduleTarget(null)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={submitReschedule}
                  disabled={mutating === rescheduleTarget.sessionId}
                  className="px-5 py-2 rounded-lg bg-blue-700 text-white text-sm font-semibold hover:bg-blue-800 disabled:opacity-60"
                >
                  {mutating === rescheduleTarget.sessionId ? "Saving..." : "Save changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
