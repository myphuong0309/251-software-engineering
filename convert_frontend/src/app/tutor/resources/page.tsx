'use client';

import Link from "next/link";
import { FormEvent, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { formatDate } from "@/lib/format";
import { sampleResources, sampleSessions } from "@/lib/sample-data";
import { Resource } from "@/types/api";

export default function TutorResourcesPage() {
  const { auth } = useAuth();
  const [resources, setResources] = useState<Resource[]>(sampleResources);
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [sessionId, setSessionId] = useState(sampleSessions[0].sessionId);
  const [status, setStatus] = useState<string | null>(null);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus(null);
    if (!auth.userId) {
      setStatus("Add your userId on login to upload resources.");
      return;
    }
    try {
      const created = await api.addResourceToSession(
        {
          title,
          linkURL: link,
          session: { sessionId },
          addedByTutor: { userId: auth.userId, fullName: auth.fullName || "Tutor" },
          description: "Tutor uploaded resource",
        },
        auth.token,
      );
      setResources((prev) => [...prev, created]);
      setStatus("Resource added.");
      setTitle("");
      setLink("");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Upload failed.");
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800">Resources</h1>

      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Add Resource</h2>
        <form className="grid grid-cols-1 md:grid-cols-3 gap-4" onSubmit={onSubmit}>
          <div className="space-y-1">
            <label className="text-sm text-gray-700">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              required
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm text-gray-700">Link</label>
            <input
              type="url"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              placeholder="https://..."
              required
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm text-gray-700">Session</label>
            <select
              value={sessionId}
              onChange={(e) => setSessionId(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              {sampleSessions.map((session) => (
                <option key={session.sessionId} value={session.sessionId}>
                  {session.topic}
                </option>
              ))}
            </select>
          </div>
          <div className="md:col-span-3">
            <button
              type="submit"
              className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium bg-blue-700 text-white hover:bg-blue-800 transition"
            >
              Upload
            </button>
          </div>
        </form>
        {status ? (
          <p className="text-sm text-blue-700 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 mt-3">
            {status}
          </p>
        ) : null}
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {resources.map((resource) => (
          <div
            key={resource.resourceId}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col gap-3"
          >
            <div>
              <h4 className="text-base font-semibold text-gray-800">
                {resource.title}
              </h4>
              <p className="text-sm text-gray-500">
                {resource.session?.topic || "Session resource"}
              </p>
            </div>
            <div className="text-sm text-gray-700 space-y-1">
              <p>
                <span className="font-semibold">Link:</span>{" "}
                <span className="text-blue-700 break-all">{resource.linkURL}</span>
              </p>
              <p className="text-xs text-gray-500">
                Uploaded {formatDate(resource.session?.startTime)}
              </p>
            </div>
            <div className="flex gap-2">
              <Link
                href={`/tutor/resources/${resource.resourceId}`}
                className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium bg-blue-700 text-white hover:bg-blue-800 transition"
              >
                Details
              </Link>
              <a
                href={resource.linkURL || "#"}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium border border-gray-200 text-gray-600 hover:border-blue-500 hover:text-blue-600 transition"
              >
                Open
              </a>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
