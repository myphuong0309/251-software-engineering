'use client';

import Link from "next/link";

const pendingRequests = [
  {
    student: "Emma Wilson",
    subject: "CO3001 - Software Engineering",
    time: "Oct 15, 2023 , 14:00 - 15:30",
  },
  {
    student: "Alex Chen",
    subject: "CO2013 - Database Systems",
    time: "Oct 16, 2023 , 10:00 - 11:30",
  },
];

const upcomingSessions = [
  {
    student: "Michael Brown",
    topic: "CO3005 - Principles of Programming Languages",
    when: "Today , 16:00 - 17:30",
    mode: "Online",
    showJoin: true,
  },
  {
    student: "Sophia Davis",
    topic: "CO3001 - Data Structures and Algorithms",
    when: "Tomorrow , 09:00 - 10:30",
    mode: "In-Person",
    showJoin: false,
  },
  {
    student: "James Wilson",
    topic: "CO3001 - Software Engineering",
    when: "Oct 14, 2023 , 13:00 - 14:30",
    mode: "Online",
    showJoin: true,
  },
];

const metrics = [
  { label: "Teaching Quality", value: 4.9 },
  { label: "Communication", value: 4.7 },
  { label: "Punctuality", value: 5.0 },
];

const weekStats = [
  { icon: "fa-regular fa-clock", title: "Hours", value: "12.5", color: "text-blue-600", background: "bg-blue-50" },
  { icon: "fa-regular fa-user", title: "Students", value: "7", color: "text-green-600", background: "bg-green-50" },
  { icon: "fa-solid fa-chart-line", title: "Sessions", value: "9", color: "text-purple-600", background: "bg-purple-50" },
  { icon: "fa-regular fa-calendar", title: "Upcoming", value: "3", color: "text-yellow-600", background: "bg-yellow-50" },
];

export default function TutorDashboard() {
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Tutor Dashboard</h1>

      <section className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <h2 className="text-base font-bold text-gray-700 mb-1">Pending Session Requests</h2>
        <p className="text-xs text-gray-400 mb-6">Review and respond to student requests</p>

        <div className="space-y-6">
          {pendingRequests.map((request) => (
            <div
              key={request.student}
              className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-100 pb-6 last:border-0 last:pb-0"
            >
              <div>
                <p className="font-bold text-gray-800 text-sm">{request.student}</p>
                <p className="text-xs text-gray-400 mt-1">{request.subject}</p>
                <p className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                  <i className="fa-regular fa-calendar text-gray-400" /> {request.time}
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
          {upcomingSessions.map((session) => (
            <div
              key={session.student + session.when}
              className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-100 pb-6 last:border-0 last:pb-0"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-bold text-gray-800 text-sm">{session.student}</p>
                  <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded font-medium">
                    {session.mode}
                  </span>
                </div>
                <p className="text-xs text-gray-400">{session.topic}</p>
                <p className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                  <i className="fa-regular fa-calendar text-gray-400" /> {session.when}
                </p>
              </div>
              <div className="flex gap-2 mt-3 md:mt-0">
                {session.showJoin ? (
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
