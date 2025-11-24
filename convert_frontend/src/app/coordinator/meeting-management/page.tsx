'use client';

import { useMemo } from "react";
import { formatDate, formatTimeRange } from "@/lib/format";
import { sampleSessions } from "@/lib/sample-data";

export default function MeetingManagementPage() {
  const stats = useMemo(() => {
    const total = sampleSessions.length;
    const completed = sampleSessions.filter((s) => s.status === "COMPLETED").length;
    const canceled = sampleSessions.filter((s) => s.status === "CANCELED").length;
    const upcoming = total - completed - canceled;
    return { total, completed, upcoming, canceled };
  }, []);

  return (
    <div className="space-y-8">
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
              BK
            </div>
            <span className="text-sm font-medium text-gray-700">Coordinator</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard icon="fa-solid fa-clock" label="Total Sessions" value={stats.total} color="blue" />
        <StatCard icon="fa-solid fa-check-circle" label="Completed" value={stats.completed} color="green" />
        <StatCard icon="fa-solid fa-hourglass-half" label="Upcoming" value={stats.upcoming} color="yellow" />
        <StatCard icon="fa-solid fa-ban" label="Cancelled" value={stats.canceled} color="red" />
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
              {sampleSessions.map((session) => (
                <tr key={session.sessionId} className="hover:bg-gray-50 transition">
                  <td className="py-4 px-4 font-bold text-gray-700">
                    #{session.sessionId.slice(0, 5)}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                        {session.tutor?.fullName
                          ?.split(" ")
                          .map((x) => x[0])
                          .join("")
                          .slice(0, 2)}
                      </div>
                      <span className="font-medium text-gray-800">
                        {session.tutor?.fullName}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-gray-600">{session.student?.fullName}</td>
                  <td className="py-4 px-4 text-gray-600">{session.topic}</td>
                  <td className="py-4 px-4 text-gray-500">
                    <div className="flex flex-col">
                      <span className="text-gray-800 font-medium">
                        {formatDate(session.startTime)}
                      </span>
                      <span className="text-xs">
                        {formatTimeRange(session.startTime, session.endTime)}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                      {session.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: string;
  label: string;
  value: number;
  color: "blue" | "green" | "yellow" | "red";
}) {
  const palette: Record<typeof color, string> = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    yellow: "bg-yellow-100 text-yellow-600",
    red: "bg-red-100 text-red-600",
  };
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-lg ${palette[color]}`}>
          <i className={`${icon} text-xl`} />
        </div>
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
      </div>
    </div>
  );
}
