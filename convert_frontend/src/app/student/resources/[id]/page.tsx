'use client';

import Link from "next/link";
import { useParams } from "next/navigation";

const resourceSets = {
  co3001: {
    code: "CO3001",
    name: "Software Engineering",
    tutor: "Dr. Nguyen Van A",
    materials: [
      {
        id: "pdf-1",
        badge: { text: "PDF", bg: "bg-red-100", fg: "text-red-700" },
        title: "Software Engineering Principles - Chapter 1",
        description:
          "Introduction to software engineering methodologies and best practices",
        meta: "PDF Document • 2.4 MB • Uploaded 1/15/2024 • By Dr. Nguyen Van A",
      },
      {
        id: "vid-1",
        badge: { text: "VID", bg: "bg-purple-100", fg: "text-purple-700" },
        title: "UML Diagrams Tutorial",
        description:
          "Comprehensive guide to creating UML diagrams for software design",
        meta: "Video • 145 MB • Uploaded 1/16/2024 • By Dr. Nguyen Van A",
      },
    ],
  },
  co2003: {
    code: "CO2003",
    name: "Data Structures and Algorithms",
    tutor: "Dr. Robert Chen",
    materials: [
      {
        id: "pdf-2",
        badge: { text: "PDF", bg: "bg-red-100", fg: "text-red-700" },
        title: "Algorithm Cheatsheet",
        description: "Concise formulas and patterns for common algorithms.",
        meta: "PDF Document • 1.2 MB • Uploaded 2/10/2024 • By Dr. Robert Chen",
      },
      {
        id: "ppt-1",
        badge: { text: "PPT", bg: "bg-blue-100", fg: "text-blue-700" },
        title: "Trees and Graphs Slides",
        description: "Lecture slides covering traversal, spanning trees, and shortest paths.",
        meta: "Slides • 3.8 MB • Uploaded 2/12/2024 • By Dr. Robert Chen",
      },
      {
        id: "vid-2",
        badge: { text: "VID", bg: "bg-purple-100", fg: "text-purple-700" },
        title: "Greedy vs Dynamic Programming",
        description: "Video walkthrough comparing approaches with examples.",
        meta: "Video • 220 MB • Uploaded 2/13/2024 • By Dr. Robert Chen",
      },
    ],
  },
  default: {
    code: "COURSE",
    name: "Session Materials",
    tutor: "Tutor",
    materials: [],
  },
};

export default function ResourceDetailsPage() {
  const params = useParams<{ id: string }>();
  const data = resourceSets[(params.id as keyof typeof resourceSets) || "default"] || resourceSets.default;

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
          <h2 className="text-2xl font-bold text-gray-800">{data.code}</h2>
          <p className="text-sm text-gray-700">{data.name}</p>
          <p className="text-sm text-gray-500 mt-1">
            <span className="font-semibold text-gray-800">Tutor:</span> {data.tutor}
          </p>
        </header>
      </section>

      <section className="space-y-1">
        <h3 className="text-lg font-semibold text-gray-800">Session Materials</h3>
        <p className="text-sm text-gray-500">
          {data.materials.length} resources available
        </p>
      </section>

      <section className="space-y-4">
        {data.materials.map((material) => (
          <div
            key={material.id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col md:flex-row md:items-center gap-4"
          >
            <div
              className={`flex-shrink-0 w-12 h-12 rounded-lg ${material.badge.bg} ${material.badge.fg} flex items-center justify-center text-xs font-bold`}
            >
              {material.badge.text}
            </div>

            <div className="flex-1 space-y-1">
              <h4 className="text-base font-semibold text-gray-800">{material.title}</h4>
              <p className="text-sm text-gray-600">{material.description}</p>
              <div className="text-xs text-gray-500 mt-1">{material.meta}</div>
            </div>

            <div className="flex md:self-stretch items-center">
              <a
                href="#"
                className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium bg-blue-700 text-white hover:bg-blue-800 transition"
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
