'use client';

import { useState } from "react";

type Meeting = {
  id: string;
  displayId: string;
  tutor: { initials: string; name: string; title: string };
  student: { initials: string; name: string; type: string };
  course: string;
  topic: string;
  date: string;
  time: string;
  duration: string;
  link: string;
  status: { label: string; color: string; bannerColor: string; icon: string };
  notes: string;
};

const meetings: Meeting[] = [
  {
    id: "1021",
    displayId: "#1021",
    tutor: { initials: "JS", name: "Dr. Jane Smith", title: "Tutor" },
    student: { initials: "SD", name: "Sophia Davis", type: "Student" },
    course: "Database Systems",
    topic: "Chapter 4: Normalization",
    date: "Nov 15, 2025",
    time: "14:00 PM",
    duration: "14:00 PM - 16:00 PM",
    link: "zoom.us/j/928392...",
    status: { 
      label: "Scheduled Meeting", 
      color: "bg-blue-100 text-blue-700",
      bannerColor: "bg-blue-50 border-blue-500 text-blue-900",
      icon: "fa-regular fa-calendar-check"
    },
    notes: "Student requested focus on 3NF and BCNF forms.",
  },
  {
    id: "1022",
    displayId: "#1022",
    tutor: { initials: "RC", name: "Prof. Robert Chen", title: "Tutor" },
    student: { initials: "EW", name: "Emma Wilson", type: "Student" },
    course: "Software Engineering",
    topic: "Agile Methodologies",
    date: "Nov 16, 2025",
    time: "10:00 AM",
    duration: "10:00 AM - 11:30 AM",
    link: "zoom.us/j/882192...",
    status: { 
      label: "Completed", 
      color: "bg-green-100 text-green-700",
      bannerColor: "bg-green-50 border-green-500 text-green-900",
      icon: "fa-solid fa-check-double"
    },
    notes: "Session went well. Covered Scrum basics.",
  },
  {
    id: "1024",
    displayId: "#1024",
    tutor: { initials: "AC", name: "Alex Chen", title: "Tutor" },
    student: { initials: "SD", name: "Sophia Davis", type: "Student" },
    course: "Database Systems",
    topic: "SQL Queries Advanced",
    date: "Nov 18, 2025",
    time: "11:30 AM",
    duration: "11:30 AM - 13:00 PM",
    link: "zoom.us/j/112392...",
    status: { 
      label: "Cancelled", 
      color: "bg-red-100 text-red-700",
      bannerColor: "bg-red-50 border-red-500 text-red-900",
      icon: "fa-solid fa-ban"
    },
    notes: "Cancelled by student due to illness.",
  },
];

export default function MeetingManagementPage() {
  const [selected, setSelected] = useState<Meeting | null>(null);

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
              JD
            </div>
            <span className="text-sm font-medium text-gray-700">John Doe</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Total Sessions", value: "8", color: "bg-blue-100 text-blue-600", icon: "fa-solid fa-clock" },
          { label: "Completed", value: "2", color: "bg-green-100 text-green-600", icon: "fa-solid fa-check-circle" },
          { label: "Upcoming", value: "4", color: "bg-yellow-100 text-yellow-600", icon: "fa-solid fa-hourglass-half" },
          { label: "Cancelled", value: "1", color: "bg-red-100 text-red-600", icon: "fa-solid fa-ban" },
        ].map((stat) => (
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

        <div className="flex gap-4 mb-6">
             <div className="relative">
                <select className="appearance-none bg-white border border-gray-300 rounded-lg pl-4 pr-10 py-2 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>All Status</option>
                  <option>Scheduled</option>
                </select>
                <i className="fa-solid fa-chevron-down absolute right-3 top-3 text-xs text-gray-400 pointer-events-none" />
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
              {meetings.map((meeting) => (
                <tr key={meeting.id} className="hover:bg-gray-50 transition">
                  <td className="py-4 px-4 font-bold text-gray-700">{meeting.displayId}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                        {meeting.tutor.initials}
                      </div>
                      <span className="font-medium text-gray-800">{meeting.tutor.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-gray-600">{meeting.student.name}</td>
                  <td className="py-4 px-4 text-gray-600">{meeting.course}</td>
                  <td className="py-4 px-4 text-gray-500">
                    <div className="flex flex-col">
                      <span className="text-gray-800 font-medium">{meeting.date}</span>
                      <span className="text-xs">{meeting.time}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`${meeting.status.color} px-3 py-1 rounded-full text-xs font-semibold`}>
                      {meeting.status.label.split(" ")[0]}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button
                      className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                      onClick={() => setSelected(meeting)}
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
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            
            <div className="flex justify-between items-start p-6 pb-2">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Meeting Details</h3>
                <p className="text-gray-400 text-sm mt-1">ID: {selected.displayId}</p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <i className="fa-solid fa-xmark text-xl" />
              </button>
            </div>

            <div className="p-6 pt-4 max-h-[80vh] overflow-y-auto">
              
              <div className={`rounded-r-lg border-l-[6px] p-4 mb-8 flex justify-between items-center ${selected.status.bannerColor.replace('border-', 'border-l-')}`}>
                 <div className="flex items-center gap-3">
                    <i className={`${selected.status.icon} text-lg`}></i>
                    <div>
                        <h4 className="font-bold text-sm uppercase tracking-wide">{selected.status.label}</h4>
                        <p className="text-xs opacity-80 mt-0.5">This session is upcoming and ready to start.</p>
                    </div>
                 </div>
                 <div className="bg-white/60 px-3 py-1 rounded text-xs font-bold shadow-sm">
                    {selected.date}
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                <div className="md:col-span-3 space-y-7">
                    
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Course Info</p>
                        <h4 className="text-xl font-bold text-gray-900 leading-tight">{selected.course}</h4>
                        <p className="text-gray-500 mt-1">{selected.topic}</p>
                    </div>

                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Time & Duration</p>
                        <div className="flex items-center gap-2 text-gray-700 font-medium">
                            <i className="fa-regular fa-clock text-gray-400"></i>
                            {selected.duration}
                        </div>
                    </div>

                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Meeting Link</p>
                        <div className="flex items-center gap-2">
                            <i className="fa-solid fa-video text-blue-500"></i>
                            <a href="#" className="text-blue-600 font-medium hover:underline truncate">
                                {selected.link}
                            </a>
                        </div>
                    </div>

                </div>

                <div className="md:col-span-2">
                    <div className="border border-gray-100 rounded-2xl p-5 bg-white shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                                {selected.tutor.initials}
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 font-medium">{selected.tutor.title}</p>
                                <p className="text-sm font-bold text-gray-800">{selected.tutor.name}</p>
                            </div>
                        </div>

                        <hr className="border-gray-100 my-4" />

                        <div className="flex items-center gap-3 mt-4">
                            <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-sm">
                                {selected.student.initials}
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 font-medium">{selected.student.type}</p>
                                <p className="text-sm font-bold text-gray-800">{selected.student.name}</p>
                            </div>
                        </div>
                    </div>
                </div>
              </div>

              <div className="mt-8">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Session Notes</p>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 text-sm text-gray-600 leading-relaxed">
                    {selected.notes}
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
