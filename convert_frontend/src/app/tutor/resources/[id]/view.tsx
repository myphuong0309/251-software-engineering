'use client';

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { Resource } from "@/types/api";

export default function TutorResourceDetailsPage() {
  const params = useParams<{ id: string }>();
  const [resource, setResource] = useState<Resource | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { auth } = useAuth();

  useEffect(() => {
    const load = async () => {
      if (!auth.token) {
        setError("Please log in to view this resource.");
        setIsLoading(false);
        return;
      }

      try {
        const data = await api.getResourceById(params.id, auth.token);
        setResource(data || null);
      } catch (err) {
        console.warn("Unable to load resource", err);
        setError("Unable to load resource.");
      } finally {
        setIsLoading(false);
      }
    };
    if (params.id) load();
    else setIsLoading(false);
  }, [auth.token, params.id]);

  const icon = useMemo(() => {
    const title = resource?.title?.toLowerCase() || "";
    if (title.endsWith(".pdf")) return { cls: "fa-regular fa-file-pdf", color: "text-red-500" };
    if (title.includes("video") || title.endsWith(".mp4")) return { cls: "fa-solid fa-video", color: "text-purple-500" };
    return { cls: "fa-regular fa-file-lines", color: "text-blue-500" };
  }, [resource?.title]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <i className="fa-solid fa-spinner fa-spin text-3xl text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto pt-10">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
        <div className="mt-4">
          <Link href="/tutor/resources" className="text-blue-600 hover:underline">
            &larr; Back to Resources
          </Link>
        </div>
      </div>
    );
  }

  if (!resource) {
    return (
      <div className="max-w-6xl mx-auto pt-10 text-center">
        <p className="text-gray-500 text-lg">Resource not found.</p>
        <div className="mt-4">
          <Link href="/tutor/resources" className="text-blue-600 hover:underline">
            &larr; Back to Resources
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <Link
        href="/tutor/resources"
        className="text-gray-500 hover:text-gray-700 text-sm mb-6 flex items-center gap-2 font-medium"
      >
        <i className="fa-solid fa-arrow-left" /> Back to Resources
      </Link>

      <div className="bg-white p-8 rounded-xl border border-gray-200 mb-4 flex justify-between items-start shadow-sm">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {resource.session?.topic || "Resource Details"}
          </h1>
          <p className="text-gray-500 text-sm mb-4">{resource.title || "No title"}</p>
          <p className="text-xs text-gray-400">Session ID: {resource.session?.sessionId || "N/A"}</p>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-bold text-gray-800 mb-1">Session Materials</h2>
          <p className="text-xs text-gray-500">1 resource</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col relative group">
          <div className="flex items-start gap-5 mb-6">
            <div className={`w-10 flex justify-center pt-1 ${icon.color} text-2xl`}>
              <i className={icon.cls} />
            </div>
            <div className="flex-1 pr-16">
              <h3 className="font-bold text-gray-800 text-base mb-1">{resource.title}</h3>
              <p className="text-xs text-gray-500 mb-3">{resource.description}</p>
              <div className="text-[10px] text-gray-400 font-medium uppercase tracking-wide mb-2">
                {resource.session?.sessionId ? `Session ${resource.session.sessionId}` : "No session"}
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <a
              href={resource.linkURL || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition"
            >
              <i className="fa-solid fa-download" /> Access Resource
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
