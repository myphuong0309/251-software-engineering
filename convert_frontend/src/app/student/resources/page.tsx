'use client';

import Link from "next/link";
import { useState } from "react";

const resourceCards = [
  {
    id: "co3001",
    name: "Emma Wilson",
    major: "Computer Science",
    subjects: "Software Engineering",
    sessions: "8 completed",
    last: "2 days ago",
  },
  {
    id: "co2003",
    name: "Michael Brown",
    major: "Computer Engineering",
    subjects: "Data Structures and Algorithms",
    sessions: "12 completed",
    last: "Yesterday",
  },
];

export default function StudentResourcesPage() {
  const [search, setSearch] = useState("");
  const [sessionFilter, setSessionFilter] = useState("All Sessions");
  const [typeFilter, setTypeFilter] = useState("All Types");

  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Resources</h1>
      </section>

      <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <form className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="flex flex-col gap-1 md:col-span-1">
            <label htmlFor="search" className="text-sm text-gray-700">
              Search
            </label>
            <input
              type="text"
              id="search"
              placeholder="Search resources..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="sessions" className="text-sm text-gray-700">
              Session
            </label>
            <select
              id="sessions"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              value={sessionFilter}
              onChange={(e) => setSessionFilter(e.target.value)}
            >
              <option>All Sessions</option>
              <option>Recent Sessions</option>
              <option>Last 7 days</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="file-type" className="text-sm text-gray-700">
              File Type
            </label>
            <select
              id="file-type"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option>All Types</option>
              <option>PDF</option>
              <option>Video</option>
              <option>Slides</option>
            </select>
          </div>
        </form>
      </section>

      <p className="text-sm text-gray-500">5 sessions found</p>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {resourceCards.map((resource) => (
          <div
            key={resource.id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col gap-3"
          >
            <div>
              <h4 className="text-base font-semibold text-gray-800">{resource.name}</h4>
              <p className="text-sm text-gray-500">{resource.major}</p>
            </div>
            <div className="text-sm text-gray-700 space-y-1">
              <p>
                <span className="font-semibold">Subjects:</span>
                <span> {resource.subjects}</span>
              </p>
              <p>
                <span className="font-semibold">Sessions:</span>
                <span> {resource.sessions}</span>
                <span className="mx-1 text-gray-400">•</span>
                <span className="font-semibold">Last:</span>
                <span> {resource.last}</span>
              </p>
            </div>
            <div className="mt-2">
              <Link
                href={`/student/resources/${resource.id}`}
                className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium bg-blue-700 text-white hover:bg-blue-800 transition"
              >
                Select
              </Link>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
