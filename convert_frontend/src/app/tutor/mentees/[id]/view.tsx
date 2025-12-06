'use client';

import Link from "next/link";
import { useParams } from "next/navigation";

const menteeDetails = {
  emma: {
    name: "Emma Wilson",
    major: "Computer Science • 3rd Year",
    email: "emma.wilson@student.hcmut.edu.vn",
    faculty: "Faculty of Computer Science & Engineering",
    enrollment: "September 2021",
    sessions: "8 completed • Last: 2 days ago",
    progress: "Good",
  },
  michael: {
    name: "Michael Brown",
    major: "Computer Engineering • 3rd Year",
    email: "michael.brown@student.hcmut.edu.vn",
    faculty: "Faculty of Computer Science & Engineering",
    enrollment: "September 2021",
    sessions: "12 completed • Last: Yesterday",
    progress: "Excellent",
  },
  sophia: {
    name: "Sophia Davis",
    major: "Information Systems • 3rd Year",
    email: "sophia.davis@student.hcmut.edu.vn",
    faculty: "Faculty of Information Systems",
    enrollment: "September 2021",
    sessions: "5 completed • Last: 1 week ago",
    progress: "Needs improvement",
  },
  alex: {
    name: "Alex Chen",
    major: "Computer Science • 3rd Year",
    email: "alex.chen@student.hcmut.edu.vn",
    faculty: "Faculty of Computer Science & Engineering",
    enrollment: "September 2021",
    sessions: "3 completed • Last: 3 days ago",
    progress: "Good",
  },
  james: {
    name: "James Wilson",
    major: "Software Engineering • 3rd Year",
    email: "james.wilson@student.hcmut.edu.vn",
    faculty: "Faculty of Software Engineering",
    enrollment: "September 2021",
    sessions: "7 completed • Last: 5 days ago",
    progress: "Excellent",
  },
};

export default function TrackProgressPage() {
  const params = useParams<{ id: string }>();
  const mentee = menteeDetails[(params.id as keyof typeof menteeDetails) || "emma"] || menteeDetails.emma;
  const initials = mentee.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <Link
        href="/tutor/mentees"
        className="text-blue-600 hover:text-blue-800 font-medium mb-2 flex items-center gap-2 transition text-sm"
      >
        <i className="fa-solid fa-arrow-left" /> Back to Mentees
      </Link>

      <div className="bg-blue-700 rounded-t-xl p-8 text-white flex items-center gap-6">
        <div className="w-20 h-20 rounded-full border-2 border-white flex items-center justify-center overflow-hidden bg-blue-600">
          <span className="text-2xl font-bold">{initials}</span>
        </div>
        <div>
          <h2 className="text-2xl font-bold">{mentee.name}</h2>
          <p className="opacity-90 mt-1 text-sm">{mentee.major}</p>
        </div>
      </div>

      <div className="bg-white p-8 border-x border-b border-gray-200 shadow-sm mb-8 rounded-b-xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h3 className="text-sm font-bold text-gray-800 mb-6">Student Information</h3>
            <div className="space-y-4 text-sm">
              <div>
                <p className="text-gray-500 mb-1">Email</p>
                <p className="text-gray-800 font-medium">{mentee.email}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Faculty</p>
                <p className="text-gray-800 font-medium">{mentee.faculty}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Enrollment Date</p>
                <p className="text-gray-800 font-medium">{mentee.enrollment}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-gray-800 mb-6">Progress Notes</h3>
            <div className="space-y-3 text-sm">
              <p className="text-gray-700">
                <span className="font-semibold">Last session:</span> {mentee.sessions}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Progress status:</span> {mentee.progress}
              </p>
              <p className="text-gray-500 text-xs">
                Notes entry area can be added once backend supports it.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
