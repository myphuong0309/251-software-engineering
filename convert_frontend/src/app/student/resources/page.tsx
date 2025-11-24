'use client';

import Link from "next/link";
import { useMemo, useState } from "react";
import { sampleResources } from "@/lib/sample-data";
import { formatRelative } from "@/lib/format";

export default function StudentResourcesPage() {
  const [search, setSearch] = useState("");
  const [sessionFilter, setSessionFilter] = useState("All Sessions");
  const [typeFilter, setTypeFilter] = useState("All Types");

  const groups = useMemo(() => {
    const grouped = sampleResources.reduce((acc, resource) => {
      const sessionId = resource.session?.sessionId || "general";
      if (!acc[sessionId]) {
        acc[sessionId] = {
          sessionId,
          tutor: resource.session?.tutor?.fullName || "Unknown tutor",
          subject: resource.session?.topic || "General",
          resources: [] as typeof sampleResources,
        };
      }
      acc[sessionId].resources.push(resource);
      return acc;
    }, {} as Record<string, { sessionId: string; tutor: string; subject: string; resources: typeof sampleResources }>);

    return Object.values(grouped);
  }, []);

  const filtered = groups.filter((group) => {
    const matchesSearch =
      group.tutor.toLowerCase().includes(search.toLowerCase()) ||
      group.subject.toLowerCase().includes(search.toLowerCase());
    const matchesSession =
      sessionFilter === "All Sessions" || group.subject.includes(sessionFilter);
    const matchesType = typeFilter === "All Types" || typeFilter === "PDF";
    return matchesSearch && matchesSession && matchesType;
  });

  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Resources</h1>
        <p className="text-sm text-gray-500 mt-1">
          Browse study materials linked to your sessions. Live data loads per session ID.
        </p>
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
              {groups.map((group) => (
                <option key={group.sessionId}>{group.subject}</option>
              ))}
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

      <p className="text-sm text-gray-500">
        {filtered.length} session{filtered.length !== 1 ? "s" : ""} found
      </p>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((group) => (
          <div
            key={group.sessionId}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col gap-3"
          >
            <div>
              <h4 className="text-base font-semibold text-gray-800">{group.tutor}</h4>
              <p className="text-sm text-gray-500">{group.subject}</p>
            </div>
            <div className="text-sm text-gray-700 space-y-1">
              <p>
                <span className="font-semibold">Resources:</span>{" "}
                <span>{group.resources.length} linked items</span>
              </p>
              <p>
                <span className="font-semibold">Last upload:</span>{" "}
                <span>{formatRelative(group.resources[0]?.session?.startTime)}</span>
              </p>
            </div>
            <div className="mt-2">
              <Link
                href={`/student/resources/${group.sessionId}`}
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
