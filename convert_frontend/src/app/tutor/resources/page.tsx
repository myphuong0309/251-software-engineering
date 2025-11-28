'use client';

import Link from "next/link";

const subjects = [
  {
    id: "co3001",
    title: "CO3001 – Software Engineering",
    class: "SE2023-01",
    major: "Computer Science",
    total: "5 files",
    updated: "2 days ago",
  },
  {
    id: "co2013",
    title: "CO2013 – Database Systems",
    class: "CS2023-02",
    major: "Computer Engineering",
    total: "3 files",
    updated: "Yesterday",
  },
  {
    id: "co3005",
    title: "CO3005 – Principles of Programming Languages",
    class: "CS2023-01",
    major: "Computer Science",
    total: "4 files",
    updated: "3 days ago",
  },
  {
    id: "co2003",
    title: "CO2003 – Data Structures and Algorithms",
    class: "CS2023-01",
    major: "Information Systems",
    total: "6 files",
    updated: "1 week ago",
  },
  {
    id: "co3001-retake",
    title: "CO3001 – Software Engineering (Retake)",
    class: "SE2023-02",
    major: "Software Engineering",
    total: "2 files",
    updated: "5 days ago",
  },
];

export default function TutorResourcesPage() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <section>
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Resources</h1>
      </section>

      <section className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <form className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="flex flex-col gap-1 md:col-span-1">
            <label htmlFor="search" className="text-sm text-gray-700">
              Search
            </label>
            <input
              type="text"
              id="search"
              placeholder="Search by subject, code, or class..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="class" className="text-sm text-gray-700">
              Class
            </label>
            <select
              id="class"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              <option>All Classes</option>
              <option>CS2023-01</option>
              <option>CS2023-02</option>
              <option>SE2023-01</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="term" className="text-sm text-gray-700">
              Semester
            </label>
            <select
              id="term"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              <option>All Semesters</option>
              <option>2023-1</option>
              <option>2023-2</option>
            </select>
          </div>
        </form>
      </section>

      <p className="text-xs text-gray-400">5 subjects found</p>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {subjects.map((subject) => (
          <div
            key={subject.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex flex-col gap-3"
          >
            <div>
              <h4 className="text-sm font-bold text-gray-800">{subject.title}</h4>
              <p className="text-xs text-gray-400 mt-0.5">
                Class: {subject.class} • Major: {subject.major}
              </p>
            </div>
            <div className="text-xs text-gray-700 space-y-1">
              <p>
                <span className="font-semibold text-gray-800">Total resources: </span>
                <span>{subject.total}</span>
              </p>
              <p>
                <span className="font-semibold text-gray-800">Last updated: </span>
                <span>{subject.updated}</span>
              </p>
            </div>
            <div className="mt-2">
              <Link
                href={`/tutor/resources/${subject.id}`}
                className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-xs font-bold bg-blue-700 text-white hover:bg-blue-800 transition"
              >
                Manage Resources
              </Link>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
