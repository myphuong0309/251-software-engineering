'use client';

import Link from "next/link";
import { useParams } from "next/navigation";

const resourceDetails = {
  code: "CO3001",
  name: "Software Engineering",
  sessionDate: "1/20/2024 at 14:00",
};

const materials = [
  {
    id: "pdf-1",
    icon: "fa-regular fa-file-pdf",
    iconColor: "text-red-500",
    title: "Software Engineering Principles - Chapter 1",
    description: "Introduction to software engineering methodologies and best practices",
    badges: "PDF Document • 2.4 MB • Uploaded 1/15/2024",
    author: "",
  },
  {
    id: "vid-1",
    icon: "fa-solid fa-video",
    iconColor: "text-purple-500",
    title: "UML Diagrams Tutorial",
    description: "Comprehensive guide to creating UML diagrams for software design",
    badges: "Video • 145 MB • Uploaded 1/16/2024",
    author: "",
  },
  {
    id: "doc-1",
    icon: "fa-regular fa-file-lines",
    iconColor: "text-blue-500",
    title: "Design Patterns Reference",
    description: "Quick reference guide for common software design patterns",
    badges: "Document • 1.8 MB • Uploaded 1/17/2024",
    author: "By Dr. Nguyen Van A",
  },
];

export default function TutorResourceDetailsPage() {
  const params = useParams<{ id: string }>();
  const id = params.id || resourceDetails.code.toLowerCase();

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <Link
        href="/tutor/resources"
        className="text-gray-500 hover:text-gray-700 text-sm mb-6 flex items-center gap-2 font-medium"
      >
        <i className="fa-solid fa-arrow-left" /> Back to Sessions
      </Link>

      <div className="bg-white p-8 rounded-xl border border-gray-200 mb-4 flex justify-between items-start shadow-sm">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{resourceDetails.code}</h1>
          <p className="text-gray-500 text-sm mb-4">{resourceDetails.name}</p>
          <p className="text-xs text-gray-400">Session Date: {resourceDetails.sessionDate}</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-5 rounded-lg shadow-sm transition flex items-center gap-2 text-sm">
          <i className="fa-solid fa-plus" /> Upload Resource
        </button>
      </div>

      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-bold text-gray-800 mb-1">Session Materials</h2>
          <p className="text-xs text-gray-500">3 resources available</p>
        </div>

        {materials.map((material) => (
          <div
            key={material.id}
            className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col relative group"
          >
            <button className="absolute top-6 right-6 text-red-400 hover:text-red-600 text-xs font-bold bg-red-50 px-3 py-1 rounded-md transition">
              Remove
            </button>

            <div className="flex items-start gap-5 mb-6">
              <div className={`w-10 flex justify-center pt-1 ${material.iconColor} text-2xl`}>
                <i className={material.icon} />
              </div>
              <div className="flex-1 pr-16">
                <h3 className="font-bold text-gray-800 text-base mb-1">{material.title}</h3>
                <p className="text-xs text-gray-500 mb-3">{material.description}</p>
                <div className="flex gap-3 text-[10px] text-gray-400 font-medium uppercase tracking-wide mb-2">
                  {material.badges.split(" • ").map((part) => (
                    <span key={part} className="bg-gray-100 px-2 py-0.5 rounded">
                      {part}
                    </span>
                  ))}
                </div>
                {material.author ? (
                  <p className="text-[10px] text-gray-400 italic">{material.author}</p>
                ) : null}
              </div>
            </div>

            <div className="flex justify-end">
              <button className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition">
                <i className="fa-solid fa-download" /> Access Resource
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
