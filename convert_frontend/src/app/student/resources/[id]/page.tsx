'use client';

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { formatDate } from "@/lib/format";
import { sampleResources } from "@/lib/sample-data";
import { Resource } from "@/types/api";

export default function ResourceDetailsPage() {
  const params = useParams<{ id: string }>();
  const { auth } = useAuth();
  const [resources, setResources] = useState<Resource[]>(
    sampleResources.filter((res) => res.session?.sessionId === params.id) ||
      sampleResources,
  );
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    const loadResources = async () => {
      if (!params.id) return;
      try {
        const data = await api.getResourcesForSession(params.id, auth.token);
        if (data?.length) setResources(data);
      } catch (error) {
        console.warn("Using sample resources because API failed", error);
      }
    };
    loadResources();
  }, [auth.token, params.id]);

  const course = useMemo(() => {
    const first = resources[0];
    return {
      code: first?.session?.topic?.split(" ")[0] || "Course",
      name: first?.session?.topic || "Session materials",
      tutor: first?.session?.tutor?.fullName || "Tutor",
    };
  }, [resources]);

  const fileBadge = (link?: string) => {
    if (!link) return "FILE";
    if (link.endsWith(".pdf")) return "PDF";
    if (link.includes("youtube") || link.endsWith(".mp4")) return "VID";
    if (link.endsWith(".ppt") || link.endsWith(".pptx")) return "PPT";
    return "DOC";
  };

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
          <h2 className="text-2xl font-bold text-gray-800">{course.code}</h2>
          <p className="text-sm text-gray-700">{course.name}</p>
          <p className="text-sm text-gray-500 mt-1">
            <span className="font-semibold text-gray-800">Tutor:</span> {course.tutor}
          </p>
        </header>
      </section>

      <section className="space-y-1">
        <h3 className="text-lg font-semibold text-gray-800">Session Materials</h3>
        <p className="text-sm text-gray-500">
          {resources.length} resource{resources.length !== 1 ? "s" : ""} available
        </p>
        {status ? (
          <p className="text-sm text-blue-700 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
            {status}
          </p>
        ) : null}
      </section>

      <section className="space-y-4">
        {resources.map((resource) => (
          <div
            key={resource.resourceId}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col md:flex-row md:items-center gap-4"
          >
            <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">
              {fileBadge(resource.linkURL)}
            </div>

            <div className="flex-1 space-y-1">
              <h4 className="text-base font-semibold text-gray-800">
                {resource.title || "Resource"}
              </h4>
              <p className="text-sm text-gray-600">
                {resource.description || "Material attached to your tutoring session."}
              </p>
              <div className="text-xs text-gray-500 mt-1 flex flex-wrap gap-2">
                <span>{resource.linkURL ? "Online resource" : "Uploaded file"}</span>
                <span>•</span>
                <span>{formatDate(resource.session?.startTime)}</span>
                <span>•</span>
                <span>{resource.session?.tutor?.fullName || "Tutor"}</span>
              </div>
            </div>

            <div className="flex md:self-stretch items-center">
              <a
                href={resource.linkURL || "#"}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium bg-blue-700 text-white hover:bg-blue-800 transition"
                onClick={() => {
                  setStatus("Opening resource...");
                }}
              >
                Access Resource
              </a>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
