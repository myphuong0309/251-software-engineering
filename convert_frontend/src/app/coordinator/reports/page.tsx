'use client';

import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { formatDate } from "@/lib/format";
import { Report, ReportType } from "@/types/api";

const seedReportIds = ["rep-1", "rep-2"];

export default function ReportsPage() {
  const { auth, ready } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchId, setFetchId] = useState("");
  const [generating, setGenerating] = useState(false);
  const [reportType, setReportType] = useState<ReportType>("STUDENT_ACTIVITY");
  const [criteria, setCriteria] = useState('{"month":"11","year":"2024"}');

  const addOrReplace = (report: Report) => {
    setReports((prev) => {
      const existing = prev.findIndex((r) => r.reportId === report.reportId);
      if (existing >= 0) {
        const next = [...prev];
        next[existing] = report;
        return next;
      }
      return [report, ...prev];
    });
  };

  useEffect(() => {
    const loadSeeds = async () => {
      if (!ready || !auth.token) return;
      setLoading(true);
      setError(null);
      try {
        const results = await Promise.all(
          seedReportIds.map(async (id) => {
            try {
              return await api.getReport(id, auth.token);
            } catch (err) {
              return null;
            }
          }),
        );
        results.filter(Boolean).forEach((rep) => addOrReplace(rep as Report));
      } catch (err) {
        console.warn("Unable to load reports", err);
        setError("Unable to load reports.");
      } finally {
        setLoading(false);
      }
    };
    loadSeeds();
  }, [auth.token, ready]);

  const handleFetchById = async () => {
    setStatus(null);
    setError(null);
    if (!fetchId.trim()) return;
    if (!auth.token) {
      setError("Please log in as coordinator to fetch reports.");
      return;
    }
    setLoading(true);
    try {
      const rep = await api.getReport(fetchId.trim(), auth.token);
      addOrReplace(rep);
      setStatus(`Loaded report ${fetchId.trim()}`);
    } catch (err) {
      console.warn("Unable to fetch report", err);
      const message = err instanceof Error ? err.message : "Report not found.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    setStatus(null);
    setError(null);
    if (!auth.token) {
      setError("Please log in as coordinator to generate reports.");
      return;
    }
    setGenerating(true);
    try {
      const payload: Partial<Report> = {
        reportType,
        criteria,
        generatedBy: auth.userId ? ({ userId: auth.userId, fullName: auth.fullName } as any) : undefined,
      };
      const rep = await api.generateReport(payload, auth.token);
      addOrReplace(rep);
      setStatus("Report generated.");
    } catch (err) {
      console.warn("Unable to generate report", err);
      const message = err instanceof Error ? err.message : "Generate failed.";
      setError(message);
    } finally {
      setGenerating(false);
    }
  };

  const sortedReports = useMemo(() => {
    return [...reports].sort(
      (a, b) =>
        new Date(b.generatedDate || 0).getTime() -
        new Date(a.generatedDate || 0).getTime(),
    );
  }, [reports]);

  const formatCriteria = (value?: string) => {
    if (!value) return "N/A";
    try {
      const obj = JSON.parse(value);
      return JSON.stringify(obj, null, 2);
    } catch (e) {
      return value;
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Reports</h2>
          <p className="text-sm text-gray-500">Generate and fetch coordinator reports from the backend.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-gray-800">Existing Reports</h3>
            <div className="text-xs text-gray-400">{sortedReports.length} found</div>
          </div>
          {loading ? <p className="text-sm text-gray-500">Loading...</p> : null}
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          {status ? <p className="text-sm text-green-600">{status}</p> : null}
          {sortedReports.length === 0 && !loading ? (
            <p className="text-sm text-gray-500">No reports loaded yet. Try fetching or generating one.</p>
          ) : null}
          <div className="space-y-3">
            {sortedReports.map((rep) => (
              <article
                key={rep.reportId}
                className="border border-gray-200 rounded-lg p-4 bg-white hover:border-blue-300 transition"
              >
                <div className="flex justify-between items-start gap-3">
                  <div>
                    <p className="text-xs uppercase text-gray-400 font-semibold">
                      {rep.reportType || rep.type || "Report"}
                    </p>
                    <h4 className="text-lg font-bold text-gray-800">Report {rep.reportId}</h4>
                    <p className="text-xs text-gray-500">
                      Generated: {rep.generatedDate ? formatDate(rep.generatedDate) : "N/A"}
                    </p>
                    <p className="text-xs text-gray-500">
                      By: {(rep.generatedBy as any)?.fullName || (rep.generatedBy as any)?.userId || "Unknown"}
                    </p>
                  </div>
                  <span className="inline-flex items-center px-2 py-1 rounded-full bg-blue-50 text-blue-700 text-[11px] font-semibold">
                    {rep.reportType || rep.type || "Report"}
                  </span>
                </div>
                <div className="mt-3">
                  <p className="text-xs text-gray-500 mb-1">Criteria</p>
                  <pre className="text-xs bg-gray-50 border border-gray-100 rounded-lg p-3 text-gray-700 whitespace-pre-wrap">
                    {formatCriteria(rep.criteria)}
                  </pre>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-5">
          <div>
            <h3 className="text-base font-semibold text-gray-800">Fetch by ID</h3>
            <p className="text-xs text-gray-500">Try seeded IDs like rep-1 or rep-2.</p>
            <div className="mt-3 flex gap-2">
              <input
                type="text"
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Report ID (e.g., rep-1)"
                value={fetchId}
                onChange={(e) => setFetchId(e.target.value)}
              />
              <button
                type="button"
                onClick={handleFetchById}
                className="px-4 py-2 rounded-lg bg-blue-700 text-white text-sm font-semibold hover:bg-blue-800 transition"
              >
                Fetch
              </button>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <h3 className="text-base font-semibold text-gray-800">Generate report</h3>
            <div className="space-y-3 mt-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Report type</label>
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value as ReportType)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="STUDENT_ACTIVITY">Student Activity</option>
                  <option value="TUTOR_PERFORMANCE">Tutor Performance</option>
                  <option value="SESSION_HISTORY">Session History</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Criteria (JSON or text)</label>
                <textarea
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={criteria}
                  onChange={(e) => setCriteria(e.target.value)}
                />
              </div>
              <button
                type="button"
                onClick={handleGenerate}
                disabled={generating}
                className="w-full px-4 py-2 rounded-lg bg-blue-700 text-white text-sm font-semibold hover:bg-blue-800 disabled:opacity-60 transition"
              >
                {generating ? "Generating..." : "Generate report"}
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
