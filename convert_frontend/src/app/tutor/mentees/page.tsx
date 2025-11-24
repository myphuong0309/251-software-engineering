'use client';

import { useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { formatDate } from "@/lib/format";
import { sampleSessions, sampleStudent } from "@/lib/sample-data";

export default function TutorMenteesPage() {
  const { auth } = useAuth();
  const [note, setNote] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  const session = sampleSessions[0];

  const saveNote = async () => {
    setStatus(null);
    if (!auth.userId) {
      setStatus("Add your userId on login to save progress notes.");
      return;
    }
    try {
      await api.createProgressNote(
        {
          session,
          tutor: { userId: auth.userId, fullName: auth.fullName || "Tutor" },
          student: sampleStudent,
          content: note,
        },
        auth.token,
      );
      setStatus("Progress note saved.");
      setNote("");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Save failed.");
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800">My Mentees</h1>

      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-sm font-semibold text-blue-700">
            EW
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-800">
              {sampleStudent.fullName}
            </h3>
            <p className="text-sm text-gray-500">
              {sampleStudent.major} • GPA {sampleStudent.gpa}
            </p>
          </div>
        </div>
        <div className="text-sm text-gray-700 space-y-1">
          <p>
            <span className="font-semibold">Courses:</span>{" "}
            {sampleStudent.enrolledCourses?.join(", ")}
          </p>
          <p>
            <span className="font-semibold">Last session:</span>{" "}
            {formatDate(session.startTime)}
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-800">
            Progress Note
          </label>
          <textarea
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            rows={4}
            placeholder="Document progress, blockers, and next steps..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
          <div className="flex justify-end">
            <button
              type="button"
              onClick={saveNote}
              className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium bg-blue-700 text-white hover:bg-blue-800 transition"
            >
              Save Note
            </button>
          </div>
          {status ? (
            <p className="text-sm text-blue-700 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
              {status}
            </p>
          ) : null}
        </div>
      </section>
    </div>
  );
}
