'use client';

import Link from "next/link";

const mentees = [
  {
    id: "emma",
    name: "Emma Wilson",
    major: "Computer Science",
    subjects: "Software Engineering, Database Systems",
    sessions: "8 completed • Last: 2 days ago",
    progress: "Good",
  },
  {
    id: "michael",
    name: "Michael Brown",
    major: "Computer Engineering",
    subjects: "Programming Languages, Algorithms",
    sessions: "12 completed • Last: Yesterday",
    progress: "Excellent",
  },
  {
    id: "sophia",
    name: "Sophia Davis",
    major: "Information Systems",
    subjects: "Data Structures, Web Development",
    sessions: "5 completed • Last: 1 week ago",
    progress: "Needs improvement",
  },
  {
    id: "alex",
    name: "Alex Chen",
    major: "Computer Science",
    subjects: "Database Systems",
    sessions: "3 completed • Last: 3 days ago",
    progress: "Good",
  },
  {
    id: "james",
    name: "James Wilson",
    major: "Software Engineering",
    subjects: "Software Engineering, Object-Oriented Programming",
    sessions: "7 completed • Last: 5 days ago",
    progress: "Excellent",
  },
];

export default function TutorMenteesPage() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Mentees</h1>

      <div className="bg-white p-4 rounded-xl border border-gray-200 mb-4 flex flex-col md:flex-row gap-4 items-end shadow-sm">
        <div className="w-full md:w-2/3">
          <input
            type="text"
            placeholder="Search mentees..."
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white placeholder-gray-400 text-sm"
          />
        </div>
        <div className="w-full md:w-1/3">
          <label className="block text-xs text-gray-500 mb-1 ml-1 font-medium">Filter by Subject</label>
          <select className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm">
            <option>All</option>
            <option>Software Engineering</option>
            <option>Computer Science</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mentees.map((mentee) => (
          <div
            key={mentee.id}
            className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition flex flex-col h-full"
          >
            <div className="text-center mb-8">
              <h3 className="text-lg font-bold text-gray-800">{mentee.name}</h3>
              <p className="text-xs text-gray-400 mt-1">{mentee.major}</p>
            </div>
            <div className="space-y-5 mb-8 px-2 flex-1">
              <div className="flex items-start gap-4">
                <i className="fa-solid fa-book-open text-gray-400 mt-1 text-lg w-5" />
                <div>
                  <span className="block text-xs text-gray-400 mb-1">Subjects</span>
                  <span className="text-sm font-medium text-gray-700">{mentee.subjects}</span>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <i className="fa-regular fa-clock text-gray-400 mt-1 text-lg w-5" />
                <div>
                  <span className="block text-xs text-gray-400 mb-1">Sessions</span>
                  <span className="text-sm text-gray-600">{mentee.sessions}</span>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <i className="fa-regular fa-star text-gray-400 mt-1 text-lg w-5" />
                <div>
                  <span className="block text-xs text-gray-400 mb-1">Progress</span>
                  <span className="text-sm font-bold text-gray-800">{mentee.progress}</span>
                </div>
              </div>
            </div>
            <Link
              href={`/tutor/mentees/${mentee.id}`}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition flex items-center justify-center gap-2 text-sm"
            >
              Track Progress <i className="fa-solid fa-chevron-right text-xs" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
