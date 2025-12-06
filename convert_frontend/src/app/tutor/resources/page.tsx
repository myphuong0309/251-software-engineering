'use client';

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { Resource } from "@/types/api";

export default function TutorResourcesPage() {
  const { auth, ready } = useAuth();
  const tutorId = auth.userId;
  const [resources, setResources] = useState<Resource[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const load = async () => {
      if (!auth.token || !tutorId) {
        setError("Please log in to view resources.");
        setResources([]);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const data = await api.getResources(auth.token);
        setResources((data || []).filter((r) => r.session?.tutor?.userId === tutorId || !r.session?.tutor));
      } catch (err) {
        console.warn("Unable to load resources", err);
        setError("Unable to load resources.");
      } finally {
        setLoading(false);
      }
    };
    if (ready) load();
  }, [auth.token, tutorId, ready]);

  const filtered = useMemo(() => {
    return resources.filter((r) => {
      if (!search) return true;
      return (
        r.title?.toLowerCase().includes(search.toLowerCase()) ||
        r.session?.topic?.toLowerCase().includes(search.toLowerCase())
      );
    });
  }, [resources, search]);

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
              value={search}
              onChange={(e) => setSearch(e.target.value)}
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

      {loading ? <p className="text-xs text-gray-400">Loading...</p> : null}
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
      {!loading && !error ? (
        <p className="text-xs text-gray-400">{filtered.length} resources found</p>
      ) : null}

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((res) => (
          <div
            key={res.resourceId}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex flex-col gap-3"
          >
            <div>
              <h4 className="text-sm font-bold text-gray-800">{res.title}</h4>
              <p className="text-xs text-gray-400 mt-0.5">
                Session: {res.session?.topic || res.session?.sessionId || "N/A"}
              </p>
            </div>
            <div className="text-xs text-gray-700 space-y-1">
              <p>
                <span className="font-semibold text-gray-800">Description: </span>
                <span>{res.description}</span>
              </p>
            </div>
            <div className="mt-2">
              <Link
                href={`/tutor/resources/${res.resourceId}`}
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
