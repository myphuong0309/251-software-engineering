'use client';

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { formatDate } from "@/lib/format";
import { sampleResources } from "@/lib/sample-data";
import { Resource } from "@/types/api";

export default function TutorResourceDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { auth } = useAuth();
  const [resource, setResource] = useState<Resource | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    const match = sampleResources.find((res) => res.resourceId === params.id);
    setResource(match || sampleResources[0]);
  }, [params.id]);

  const fileBadge = useMemo(() => {
    if (!resource?.linkURL) return "FILE";
    if (resource.linkURL.endsWith(".pdf")) return "PDF";
    if (resource.linkURL.includes("youtube") || resource.linkURL.endsWith(".mp4"))
      return "VID";
    return "DOC";
  }, [resource?.linkURL]);

  const removeResource = async () => {
    if (!resource) return;
    try {
      await api.removeResourceFromSession(resource.resourceId, auth.token);
      setStatus("Resource removed.");
      router.push("/tutor/resources");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Remove failed.");
    }
  };

  if (!resource) return null;

  return (
    <div className="space-y-6">
      <Link
        href="/tutor/resources"
        className="inline-flex items-center text-sm text-blue-700 hover:text-blue-800 mb-2"
      >
        ← Back to Resources
      </Link>

      <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col gap-4">
        <header className="space-y-1">
          <h2 className="text-2xl font-bold text-gray-800">{resource.title}</h2>
          <p className="text-sm text-gray-700">{resource.session?.topic}</p>
          <p className="text-sm text-gray-500">
            Added by {resource.addedByTutor?.fullName || "Tutor"} on{" "}
            {formatDate(resource.session?.startTime)}
          </p>
        </header>

        {status ? (
          <div className="text-sm text-blue-700 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
            {status}
          </div>
        ) : null}

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">
            {fileBadge}
          </div>

          <div className="flex-1 space-y-1">
            <p className="text-sm text-gray-600">
              {resource.description || "Resource shared for the session."}
            </p>
            <div className="text-xs text-gray-500 mt-1 flex flex-wrap gap-2">
              <span>{resource.linkURL ? "Online resource" : "Uploaded file"}</span>
              <span>•</span>
              <span>{resource.session?.tutor?.fullName || "Tutor"}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 md:self-stretch">
            <a
              href={resource.linkURL || "#"}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium bg-blue-700 text-white hover:bg-blue-800 transition"
            >
              Access Resource
            </a>
            <button
              type="button"
              onClick={removeResource}
              className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium border border-red-200 text-red-600 hover:bg-red-50 transition"
            >
              Remove
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
