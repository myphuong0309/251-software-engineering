'use client';

import Link from "next/link";
import { useParams } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { sampleTutors } from "@/lib/sample-data";
import { Tutor } from "@/types/api";

export default function TutorProfilePage() {
  const params = useParams<{ id: string }>();
  const { auth } = useAuth();
  const [topic, setTopic] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  const tutor: Tutor = useMemo(() => {
    return (
      sampleTutors.find((item) => item.userId === params.id) || sampleTutors[0]
    );
  }, [params.id]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus(null);
    if (!auth.userId) {
      setStatus("Add your userId on the login page to book a session.");
      return;
    }
    setSending(true);
    try {
      await api.createMatchingRequest(
        {
          student: { userId: auth.userId, fullName: auth.fullName || "Student" },
          tutor: { userId: tutor.userId, fullName: tutor.fullName },
          subject: topic || "Mentoring request",
        },
        auth.token,
      );
      setStatus("Matching request submitted successfully.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Request failed.";
      setStatus(message);
    } finally {
      setSending(false);
    }
  };

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
            {tutor.fullName
              ?.split(" ")
              .map((part) => part[0])
              .join("")
              .slice(0, 2)}
          </div>
          <div className="space-y-2">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                {tutor.fullName}
              </h1>
              <p className="text-sm text-gray-600">Faculty of Computer Science</p>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-yellow-50 text-yellow-600 text-xs font-semibold">
                ★ {tutor.averageRating?.toFixed(1) || "4.5"}
              </span>
              <span className="text-gray-500">Live data when backend has reviews</span>
            </div>
          </div>
        </header>

        <div className="flex flex-wrap gap-2 text-xs">
          {tutor.expertiseAreas?.map((area) => (
            <span
              key={area}
              className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-700"
            >
              {area}
            </span>
          ))}
        </div>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-gray-800">About</h2>
          <p className="text-sm text-gray-700">
            {tutor.biography ||
              "This tutor will share their biography once their profile is synced from the backend."}
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-gray-800">Education</h2>
          <p className="text-sm text-gray-700">
            Information will appear here when provided. You can still send a request below.
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
              Sample feedback to mirror the original design. Connect to backend once review API is ready.
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
          <form className="space-y-4 max-w-md" onSubmit={onSubmit}>
            <div className="space-y-1">
              <label htmlFor="topic" className="text-sm text-gray-800">
                Topic/Subject
              </label>
              <input
                type="text"
                id="topic"
                placeholder="e.g., Database Normalization"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>
            {status ? (
              <p className="text-sm text-blue-700 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
                {status}
              </p>
            ) : null}
            <div className="flex flex-wrap gap-3 pt-1">
              <button
                type="submit"
                disabled={sending}
                className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium bg-blue-700 text-white hover:bg-blue-800 transition disabled:opacity-60"
              >
                {sending ? "Sending..." : "Send Matching Request"}
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
