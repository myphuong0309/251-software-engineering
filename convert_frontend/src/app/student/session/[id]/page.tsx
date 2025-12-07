'use client';

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { formatDate, formatTimeRange } from "@/lib/format";
import { Session } from "@/types/api";

export default function SessionDetailsPage() {
  const params = useParams<{ id: string }>();
  const { auth, ready } = useAuth();
  const [session, setSession] = useState<Session | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!auth.token) {
        setStatus("Please log in to view session details.");
        setSession(null);
        return;
      }
      setLoading(true);
      setStatus(null);
      try {
        const data = await api.getSessionById(params.id, auth.token);
        setSession(data || null);
        if (!data) setStatus("Session not found.");
      } catch (error) {
        console.warn("Unable to load session", error);
        setSession(null);
        const message = error instanceof Error ? error.message : "Unable to load session.";
        setStatus(message);
      } finally {
        setLoading(false);
      }
    };
    if (ready && params.id) load();
  }, [auth.token, params.id, ready]);

  const timeline = useMemo(() => {
    if (!session?.startTime) return "";
    return `${formatDate(session.startTime)} • ${formatTimeRange(session.startTime, session.endTime)}`;
  }, [session?.startTime, session?.endTime]);

  if (!ready) {
    return (
      <div className="max-w-5xl mx-auto py-12 flex justify-center">
        <i className="fa-solid fa-spinner fa-spin text-3xl text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/student/schedule/upcoming" className="text-sm text-blue-700 hover:text-blue-800 flex items-center gap-2">
          <i className="fa-solid fa-arrow-left" /> Back to schedule
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide">Session details</p>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">{session?.topic || "Session"}</h1>
            <p className="text-sm text-gray-600">{timeline || "Date & time TBD"}</p>
          </div>
          {session?.mode ? (
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-xs font-semibold text-gray-700">
              {session.mode}
            </span>
          ) : null}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Detail label="Tutor" value={session?.tutor?.fullName || "Tutor TBD"} />
          <Detail label="Student" value={session?.student?.fullName || "You"} />
          <Detail label="Location" value={session?.location || (session?.mode === "ONLINE" ? "Online" : "TBD")} />
          <Detail label="Duration" value={session?.duration ? `${session.duration} minutes` : "TBD"} />
        </div>

        <div className="pt-2 flex flex-wrap gap-3">
          {session?.meetingLink ? (
            <a
              href={session.meetingLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium bg-blue-700 text-white hover:bg-blue-800 transition"
            >
              <i className="fa-solid fa-video" /> Join Online Meeting
            </a>
          ) : null}
          <Link
            href="/student/schedule/upcoming"
            className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
          >
            Back to Upcoming
          </Link>
        </div>

        {status ? (
          <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{status}</div>
        ) : null}
        {loading ? <p className="text-sm text-gray-500">Loading session...</p> : null}
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value?: string }) {
  return (
    <div className="border border-gray-100 rounded-xl p-4 bg-gray-50">
      <p className="text-xs uppercase text-gray-400 font-semibold mb-1">{label}</p>
      <p className="text-sm font-semibold text-gray-800">{value || "TBD"}</p>
    </div>
  );
}
