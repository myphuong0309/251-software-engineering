'use client';

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { Resource } from "@/types/api";

export default function ResourceDetailsPage() {
  const params = useParams<{ id: string }>();
  const [resource, setResource] = useState<Resource | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { auth } = useAuth();

  useEffect(() => {
    const load = async () => {
      if (!auth.token) {
        setError("Please log in to view this resource.");
        setResource(null);
        return;
      }

      setError(null);
      try {
        const data = await api.getResourceById(params.id, auth.token);
        setResource(data || null);
      } catch (err) {
        console.warn("Unable to load resource", err);
        setError("Unable to load resource.");
        setResource(null);
      }
    };
    if (params.id) load();
  }, [auth.token, params.id]);

  const badge = useMemo(() => {
    const title = resource?.title?.toLowerCase() || "";
    if (title.endsWith(".pdf")) return { text: "PDF", bg: "bg-red-100", fg: "text-red-700" };
    if (title.includes("slide") || title.endsWith(".ppt") || title.endsWith(".pptx"))
      return { text: "PPT", bg: "bg-blue-100", fg: "text-blue-700" };
    if (title.includes("video") || title.endsWith(".mp4"))
      return { text: "VID", bg: "bg-purple-100", fg: "text-purple-700" };
    return { text: "DOC", bg: "bg-gray-100", fg: "text-gray-700" };
  }, [resource?.title]);

  return (
    <div className="space-y-6">
      <Link
        href="/student/resources"
        className="inline-flex items-center text-sm text-blue-700 hover:text-blue-800 mb-2"
      >
        ← Back to Resources
      </Link>

      <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <header className="space-y-1">
          <h2 className="text-2xl font-bold text-gray-800">
            {resource?.session?.topic || resource?.title || "Resource"}
          </h2>
          <p className="text-sm text-gray-700">{resource?.title}</p>
          <p className="text-sm text-gray-500 mt-1">
            <span className="font-semibold text-gray-800">Tutor:</span>{" "}
            {resource?.session?.tutor?.fullName || "Tutor"}
          </p>
        </header>
      </section>

      {error ? (
        <p className="text-sm text-red-600">{error}</p>
      ) : null}

      <section className="space-y-1">
        <h3 className="text-lg font-semibold text-gray-800">Session Materials</h3>
        <p className="text-sm text-gray-500">
          {resource ? "1 resource available" : "No resource found"}
        </p>
      </section>

      <section className="space-y-4">
        {resource ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col md:flex-row md:items-center gap-4">
            <div
              className={`flex-shrink-0 w-12 h-12 rounded-lg ${badge.bg} ${badge.fg} flex items-center justify-center text-xs font-bold`}
            >
              {badge.text}
            </div>

            <div className="flex-1 space-y-1">
              <h4 className="text-base font-semibold text-gray-800">{resource.title}</h4>
              <p className="text-sm text-gray-600">{resource.description}</p>
              <div className="text-xs text-gray-500 mt-1">
                Session: {resource.session?.topic || resource.session?.sessionId || "N/A"}
              </div>
            </div>

            <div className="flex md:self-stretch items-center">
              <a
                href={resource.linkURL || "#"}
                className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium bg-blue-700 text-white hover:bg-blue-800 transition"
              >
                Access Resource
              </a>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-500">Resource not found.</p>
        )}
      </section>
    </div>
  );
}
