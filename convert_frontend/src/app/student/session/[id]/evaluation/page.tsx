'use client';

import Link from "next/link";
import { useParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { formatDate } from "@/lib/format";
import { Session } from "@/types/api";

const ratings = [
  { key: "ratingQuality", label: "Teaching Quality" },
  { key: "communication", label: "Communication" },
  { key: "punctuality", label: "Punctuality" },
  { key: "helpfulness", label: "Helpfulness" },
  { key: "satisfactionLevel", label: "Overall Satisfaction" },
] as const;

export default function SessionEvaluationPage() {
  const params = useParams<{ id: string }>();
  const { auth } = useAuth();
  const [session, setSession] = useState<Session | null>(null);
  const [scores, setScores] = useState({
    ratingQuality: 0,
    communication: 0,
    punctuality: 0,
    helpfulness: 0,
    satisfactionLevel: 0,
  });
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await api.getSessionById(params.id);
        setSession(data || null);
      } catch (err) {
        console.warn("Unable to load session for evaluation", err);
        setSession(null);
      }
    };
    if (params.id) load();
  }, [params.id]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus(null);
    if (!auth.userId) {
      setStatus("Add your userId on login to submit an evaluation.");
      return;
    }
    if (!session) {
      setStatus("Session not found.");
      return;
    }
    setSubmitting(true);
    try {
      await api.createEvaluation(
        {
          session,
          student: { userId: auth.userId, fullName: auth.fullName || "Student" },
          ratingQuality: scores.ratingQuality,
          satisfactionLevel: scores.satisfactionLevel,
          comment,
        },
        auth.token,
      );
      setStatus("Feedback submitted. Thank you!");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Submit failed.";
      setStatus(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <section className="flex justify-center">
        <div className="w-full max-w-3xl bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 relative">
          <Link
            href="/student/schedule/past"
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
            aria-label="Close"
          >
            <i className="fa-solid fa-xmark text-lg" />
          </Link>

          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6">
            Session Evaluation
          </h1>

          <p className="text-sm sm:text-base text-gray-700 mb-6">
            Feedback for your session with{" "}
            <span className="font-semibold">{session?.tutor?.fullName || "Tutor"}</span> on{" "}
            <span className="font-semibold">
              {session?.startTime ? formatDate(session.startTime) : "Date TBD"}
            </span>
          </p>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4 sm:space-y-5 mb-6">
              {ratings.map((rating) => (
                <div
                  key={rating.key}
                  className="flex items-center justify-between gap-4"
                >
                  <span className="text-sm sm:text-base text-gray-800">
                    {rating.label}
                  </span>
                  <div className="flex gap-1 text-yellow-500">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() =>
                          setScores((prev) => ({ ...prev, [rating.key]: value }))
                        }
                        aria-label={`${rating.label} rating ${value}`}
                      >
                        <i
                          className={`fa-star text-lg ${
                            scores[rating.key] >= value ? "fa-solid" : "fa-regular text-gray-300"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mb-6">
              <label
                htmlFor="experience"
                className="block text-sm font-medium text-gray-800 mb-2"
              >
                Share more about your experience (optional)
              </label>
              <textarea
                id="experience"
                rows={5}
                className="w-full rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-sm px-3 py-2 resize-none"
                placeholder="Write your comments here..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>

            {status ? (
              <div className="text-sm text-blue-700 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 mb-4">
                {status}
              </div>
            ) : null}

            <div className="flex justify-end gap-3 pt-2">
              <Link
                href="/student/schedule/past"
                className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-600 hover:bg-gray-50 text-center"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2 rounded-lg bg-blue-700 text-sm font-medium text-white hover:bg-blue-800 disabled:opacity-60"
              >
                {submitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
