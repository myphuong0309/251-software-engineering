'use client';

import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import { Session } from "@/types/api";

export default function MeetingManagementPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selected, setSelected] = useState<Session | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await api.getAllSessions();
        setSessions(data || []);
      } catch (err) {
        console.warn("Unable to load sessions", err);
        setError("Unable to load sessions.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const stats = useMemo(() => {
    const total = sessions.length;
    const completed = sessions.filter((s) => s.status === "COMPLETED").length;
    const scheduled = sessions.filter((s) => s.status === "SCHEDULED").length;
    const cancelled = sessions.filter((s) => s.status === "CANCELED").length;
    return [
      { label: "Total Sessions", value: total, color: "bg-blue-100 text-blue-600", icon: "fa-solid fa-clock" },
      { label: "Completed", value: completed, color: "bg-green-100 text-green-600", icon: "fa-solid fa-check-circle" },
      { label: "Upcoming", value: scheduled, color: "bg-yellow-100 text-yellow-600", icon: "fa-solid fa-hourglass-half" },
      { label: "Cancelled", value: cancelled, color: "bg-red-100 text-red-600", icon: "fa-solid fa-ban" },
    ];
  }, [sessions]);

  return (
    <div className="space-y-8 font-sans">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Coordinator Dashboard</h2>
          <p className="text-gray-500 text-sm mt-1">Overview of all tutor sessions</p>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-gray-400 hover:text-blue-600">
            <i className="fa-solid fa-bell text-xl" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">
              CO
            </div>
            <span className="text-sm font-medium text-gray-700">Coordinator</span>
          </div>
        </div>
      </header>

      {loading ? <p className="text-sm text-gray-500">Loading sessions...</p> : null}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <i className={`${stat.icon} text-xl`} />
              </div>
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-gray-800">Meeting Overview</h3>
          <div className="flex gap-3">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition flex items-center">
              <i className="fa-solid fa-file-export mr-2" />
              Export to CSV
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-xs text-gray-500 uppercase font-semibold border-b border-gray-100">
                <th className="py-4 px-4">Meeting ID</th>
                <th className="py-4 px-4">Tutor</th>
                <th className="py-4 px-4">Student</th>
                <th className="py-4 px-4">Course</th>
                <th className="py-4 px-4">Date & Time</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-100">
              {sessions.map((session) => (
                <tr key={session.sessionId} className="hover:bg-gray-50 transition">
                  <td className="py-4 px-4 font-bold text-gray-700">#{session.sessionId}</td>
                  <td className="py-4 px-4 text-gray-600">{session.tutor?.fullName || "Tutor"}</td>
                  <td className="py-4 px-4 text-gray-600">{session.student?.fullName || "Student"}</td>
                  <td className="py-4 px-4 text-gray-600">{session.topic || "N/A"}</td>
                  <td className="py-4 px-4 text-gray-500">
                    <div className="flex flex-col">
                      <span className="text-gray-800 font-medium">{session.startTime || "TBD"}</span>
                      <span className="text-xs">{session.endTime || ""}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold">
                      {session.status || "SCHEDULED"}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button
                      className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                      onClick={() => setSelected(session)}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selected ? (
        <div className="fixed inset-0 h-full w-full bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex justify-between items-start p-6 pb-2">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Meeting Details</h3>
                <p className="text-gray-400 text-sm mt-1">ID: #{selected.sessionId}</p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <i className="fa-solid fa-xmark text-xl" />
              </button>
            </div>

            <div className="p-6 pt-4 max-h-[80vh] overflow-y-auto space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Tutor</p>
                  <p className="text-sm font-bold text-gray-800">{selected.tutor?.fullName || "Tutor"}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Student</p>
                  <p className="text-sm font-bold text-gray-800">{selected.student?.fullName || "Student"}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Topic</p>
                  <p className="text-sm text-gray-700">{selected.topic || "N/A"}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Status</p>
                  <p className="text-sm text-gray-700">{selected.status || "SCHEDULED"}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Start</p>
                  <p className="text-sm text-gray-700">{selected.startTime || "TBD"}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold mb-1">End</p>
                  <p className="text-sm text-gray-700">{selected.endTime || ""}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Meeting Link</p>
                  <a
                    href={selected.meetingLink || "#"}
                    className="text-sm text-blue-600 hover:underline break-all"
                  >
                    {selected.meetingLink || "N/A"}
                  </a>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setSelected(null)}
                className="px-6 py-2 rounded-lg border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
