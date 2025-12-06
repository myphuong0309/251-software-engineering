'use client';

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import { Tutor } from "@/types/api";

export default function TutorProfilePage() {
  const params = useParams<{ id: string }>();
  const [tutor, setTutor] = useState<Tutor | null>(null);

  useEffect(() => {
    const loadTutor = async () => {
      try {
        const data = await api.getTutorById(params.id);
        setTutor(data || null);
      } catch (error) {
        console.warn("Unable to load tutor", error);
        setTutor(null);
      }
    };
    if (params.id) loadTutor();
  }, [params.id]);

  const initials = useMemo(
    () =>
      (tutor?.fullName || "Tutor")
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2),
    [tutor?.fullName],
  );

  return (
    <div className="space-y-6">
      <Link
        href="/student/find-tutor"
        className="inline-flex items-center text-sm text-blue-700 hover:text-blue-800"
      >
        ← Back to search results
      </Link>

      <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8 space-y-6">
        <header className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-blue-100 flex items-center justify-center text-2xl font-semibold text-blue-700">
            {initials}
          </div>
          <div className="space-y-2">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                {tutor?.fullName || "Tutor"}
              </h1>
              <p className="text-sm text-gray-600">Faculty of Computer Science</p>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-yellow-50 text-yellow-600 text-xs font-semibold">
                ★ {tutor?.averageRating?.toFixed(1) || "4.5"}
              </span>
              <span className="text-gray-500">2 reviews</span>
            </div>
          </div>
        </header>

        <div className="flex flex-wrap gap-2 text-xs">
          {tutor?.expertiseAreas?.length ? (
            tutor.expertiseAreas.map((area) => (
              <span
                key={area}
                className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-700"
              >
                {area}
              </span>
            ))
          ) : (
            <span className="text-xs text-gray-500">No expertise areas listed.</span>
          )}
        </div>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-gray-800">About</h2>
          <p className="text-sm text-gray-700">
            {tutor?.biography || "Biography will be added soon."}
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-gray-800">Education</h2>
          <p className="text-sm text-gray-700">
            Ph.D. in Computer Science, Stanford University
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-800">Student Reviews</h2>

          <div className="border border-gray-100 rounded-lg p-4 space-y-1">
            <h4 className="text-sm font-semibold text-gray-800 flex flex-wrap items-center gap-2">
              John Doe
              <span className="text-xs text-gray-400">October 5, 2023</span>
            </h4>
            <div className="text-xs text-yellow-500">★★★★★</div>
            <p className="text-sm text-gray-700">
              She is an excellent tutor. She explained complex concepts...
            </p>
          </div>

          <div className="border border-gray-100 rounded-lg p-4 space-y-1">
            <h4 className="text-sm font-semibold text-gray-800 flex flex-wrap items-center gap-2">
              Alice Chen
              <span className="text-xs text-gray-400">September 28, 2023</span>
            </h4>
            <div className="text-xs text-yellow-500">★★★★☆</div>
            <p className="text-sm text-gray-700">
              Very knowledgeable and patient. Helped me a lot with my database project.
            </p>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-800">Book a Session</h2>
          <form className="space-y-4 max-w-md">
            <div className="space-y-1">
              <label htmlFor="topic" className="text-sm text-gray-800">
                Topic/Subject
              </label>
              <input
                type="text"
                id="topic"
                placeholder="e.g., Database Normalization"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              />
            </div>
            <div className="flex flex-wrap gap-3 pt-1">
              <button
                type="submit"
                className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium bg-blue-700 text-white hover:bg-blue-800 transition"
              >
                Send Matching Request
              </button>
              <button
                type="button"
                className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 text-gray-700 hover:border-blue-500 hover:text-blue-600 transition"
              >
                Contact Tutor
              </button>
            </div>
          </form>
        </section>
      </section>
    </div>
  );
}
