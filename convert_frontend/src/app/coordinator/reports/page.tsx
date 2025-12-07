'use client';

import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { formatDate } from "@/lib/format";
import { Report, ReportType, Session } from "@/types/api";

const seedReportIds = ["rep-1", "rep-2"];

const typeLabels: Record<ReportType, string> = {
  STUDENT_ACTIVITY: "Student Activity",
  TUTOR_PERFORMANCE: "Tutor Performance",
  SESSION_HISTORY: "Session History",
};

type FilterType = ReportType | "ALL";

function initials(name?: string) {
  if (!name) return "CO";
  const parts = name.split(" ").filter(Boolean);
  return parts.slice(0, 2).map((p) => p[0]?.toUpperCase()).join("") || "CO";
}

function parseCriteria(criteria?: string) {
  if (!criteria) return null;
  try {
    return JSON.parse(criteria) as Record<string, string>;
  } catch (error) {
    return null;
  }
}

function criteriaSummary(criteria?: string) {
  const parsed = parseCriteria(criteria);
  if (!parsed) return criteria || "N/A";
  if (parsed.month && parsed.year) return `Month ${parsed.month}/${parsed.year}`;
  if (parsed.tutorId) return `Tutor ${parsed.tutorId}`;
  if (parsed.studentId) return `Student ${parsed.studentId}`;
  const entries = Object.entries(parsed);
  if (entries.length === 0) return "N/A";
  return entries
    .slice(0, 2)
    .map(([key, value]) => `${key}: ${value}`)
    .join(", ");
}

function formatReportTitle(report: Report) {
  const label = typeLabels[(report.reportType || report.type || "STUDENT_ACTIVITY") as ReportType];
  const criteriaLabel = criteriaSummary(report.criteria);
  return criteriaLabel ? `${label} — ${criteriaLabel}` : label;
}

function downloadJson(filename: string, data: unknown) {
  if (typeof window === "undefined") return;
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export default function ReportsPage() {
  const { auth, ready } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [loadingReports, setLoadingReports] = useState(false);
  const [loadingSessions, setLoadingSessions] = useState(false);

  const [filterType, setFilterType] = useState<FilterType>("ALL");

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
    const bootstrap = async () => {
      if (!ready) return;
      if (!auth.token) {
        setError("Please log in as a coordinator to view analytics and reports.");
        setReports([]);
        setSessions([]);
        return;
      }

      setError(null);
      setStatus(null);

      setLoadingReports(true);
      setLoadingSessions(true);

      try {
        const seedResults = await Promise.all(
          seedReportIds.map(async (id) => {
            try {
              return await api.getReport(id, auth.token || undefined);
            } catch (err) {
              return null;
            }
          }),
        );
        seedResults.filter(Boolean).forEach((rep) => addOrReplace(rep as Report));
      } catch (err) {
        console.warn("Unable to load seed reports", err);
        setError("Unable to load reports from the backend.");
      } finally {
        setLoadingReports(false);
      }

      try {
        const sessionData = await api.getAllSessions(auth.token);
        setSessions(sessionData || []);
      } catch (err) {
        console.warn("Unable to load sessions", err);
      } finally {
        setLoadingSessions(false);
      }
    };

    bootstrap();
  }, [auth.token, ready]);

  const handleExportAll = () => {
    if (!reports.length) {
      setStatus("No reports to export yet.");
      return;
    }
    downloadJson("reports.json", reports);
    setStatus(`Exported ${reports.length} report(s) as JSON.`);
  };

  const handleDownloadReport = (report: Report) => {
    downloadJson(`${report.reportId || "report"}.json`, report);
    setStatus(`Downloaded ${report.reportId}`);
  };

  const filteredReports = useMemo(() => {
    const sorted = [...reports].sort(
      (a, b) =>
        new Date(b.generatedDate || 0).getTime() -
        new Date(a.generatedDate || 0).getTime(),
    );
    if (filterType === "ALL") return sorted;
    return sorted.filter(
      (rep) => (rep.reportType || rep.type) === filterType,
    );
  }, [reports, filterType]);

  const reportStats = useMemo(() => {
    const total = reports.length;
    const uniqueTypes = new Set(
      reports.map((rep) => rep.reportType || rep.type).filter(Boolean),
    ).size;
    const latest =
      [...reports]
        .filter((r) => r.generatedDate)
        .sort(
          (a, b) =>
            new Date(b.generatedDate || 0).getTime() -
            new Date(a.generatedDate || 0).getTime(),
        )[0]?.generatedDate || null;
    const now = new Date();
    const reportsThisMonth = reports.filter((r) => {
      if (!r.generatedDate) return false;
      const dt = new Date(r.generatedDate);
      return dt.getMonth() === now.getMonth() && dt.getFullYear() === now.getFullYear();
    }).length;
    return { total, uniqueTypes, latest, reportsThisMonth };
  }, [reports]);

  const statusBreakdown = useMemo(() => {
    const counts: Record<string, number> = {};
    sessions.forEach((session) => {
      const status = session.status || "UNKNOWN";
      counts[status] = (counts[status] || 0) + 1;
    });
    const total = sessions.length || 1;
    return Object.entries(counts).map(([label, value]) => ({
      label,
      value,
      percent: Math.round((value / total) * 100),
    }));
  }, [sessions]);

  const topicBreakdown = useMemo(() => {
    const counts: Record<string, number> = {};
    sessions.forEach((session) => {
      const topic = session.topic || "Unassigned";
      counts[topic] = (counts[topic] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([topic, value]) => ({ topic, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [sessions]);

  const reportTypePill = (type?: ReportType | string) => {
    const map: Record<ReportType, string> = {
      STUDENT_ACTIVITY: "bg-blue-50 text-blue-700",
      TUTOR_PERFORMANCE: "bg-green-50 text-green-700",
      SESSION_HISTORY: "bg-amber-50 text-amber-700",
    };
    if (!type) return "bg-gray-100 text-gray-700";
    return map[type as ReportType] || "bg-gray-100 text-gray-700";
  };

  return (
    <div className="space-y-8 font-sans">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Reports & Analytics</h2>
          <p className="text-gray-500 text-sm mt-1">Live data pulled from the backend reports and sessions.</p>
        </div>
        <div className="flex items-center gap-4">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as FilterType)}
            className="border border-gray-300 text-gray-600 px-3 py-2 rounded-lg text-sm hover:bg-gray-50 transition"
          >
            <option value="ALL">All report types</option>
            <option value="STUDENT_ACTIVITY">Student Activity</option>
            <option value="TUTOR_PERFORMANCE">Tutor Performance</option>
            <option value="SESSION_HISTORY">Session History</option>
          </select>
          <button
            onClick={handleExportAll}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition"
          >
            <i className="fa-solid fa-download" /> Export
          </button>

          <div className="h-8 w-px bg-gray-300 mx-1" />

          <button className="text-gray-400 hover:text-blue-600">
            <i className="fa-solid fa-bell text-xl" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">
              {initials(auth.fullName)}
            </div>
            <span className="text-sm font-medium text-gray-700">{auth.fullName || "Coordinator"}</span>
          </div>
        </div>
      </header>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {status ? <p className="text-sm text-green-600">{status}</p> : null}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-blue-100 text-blue-600">
              <i className="fa-solid fa-chart-pie text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Reports</p>
              <p className="text-2xl font-bold text-gray-800">{reportStats.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-indigo-100 text-indigo-600">
              <i className="fa-solid fa-layer-group text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Unique Types</p>
              <p className="text-2xl font-bold text-gray-800">{reportStats.uniqueTypes}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-green-100 text-green-600">
              <i className="fa-solid fa-clock-rotate-left text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Latest Run</p>
              <p className="text-2xl font-bold text-gray-800">
                {reportStats.latest ? formatDate(reportStats.latest) : "N/A"}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-amber-100 text-amber-600">
              <i className="fa-solid fa-calendar-week text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500">This Month</p>
              <p className="text-2xl font-bold text-gray-800">{reportStats.reportsThisMonth}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-80 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-800">Sessions by Status</h3>
            <span className="text-blue-600 text-sm font-medium">{sessions.length} total</span>
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto">
            {loadingSessions ? (
              <p className="text-sm text-gray-500">Loading sessions...</p>
            ) : statusBreakdown.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-300">
                <i className="fa-solid fa-chart-column text-4xl mb-2 opacity-50" />
                <p className="text-sm font-medium">No session data yet</p>
              </div>
            ) : (
              statusBreakdown.map((item) => (
                <div key={item.label} className="space-y-1">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span className="font-semibold">{item.label}</span>
                    <span>{item.value} • {item.percent}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500"
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-80 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-800">Sessions by Topic</h3>
            <span className="text-blue-600 text-sm font-medium">Top {topicBreakdown.length || 0}</span>
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto">
            {loadingSessions ? (
              <p className="text-sm text-gray-500">Loading sessions...</p>
            ) : topicBreakdown.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-300">
                <i className="fa-solid fa-chart-column text-4xl mb-2 opacity-50" />
                <p className="text-sm font-medium">No topic data yet</p>
              </div>
            ) : (
              topicBreakdown.map((item) => (
                <div
                  key={item.topic}
                  className="flex items-center justify-between gap-3 border border-gray-100 rounded-lg p-3 hover:border-blue-200 transition"
                >
                  <div>
                    <p className="font-semibold text-gray-800">{item.topic}</p>
                    <p className="text-xs text-gray-500">From session records</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
                    {item.value} session{item.value === 1 ? "" : "s"}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <section className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-gray-800 text-lg">Recent Reports</h3>
              <p className="text-sm text-gray-500">
                Showing {filteredReports.length || 0} report(s) pulled from the backend.
              </p>
            </div>
            <span className="text-blue-600 text-sm font-medium hover:underline cursor-pointer" onClick={() => setFilterType("ALL")}>
              Clear filters
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-xs text-gray-500 uppercase font-semibold border-b border-gray-100">
                  <th className="px-6 py-4">Report</th>
                  <th className="px-6 py-4">Generated By</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {loadingReports ? (
                  <tr>
                    <td className="px-6 py-6 text-gray-500" colSpan={4}>
                      Loading reports from backend...
                    </td>
                  </tr>
                ) : filteredReports.length === 0 ? (
                  <tr>
                    <td className="px-6 py-6 text-gray-500" colSpan={4}>
                      No reports available. Generate one to get started.
                    </td>
                  </tr>
                ) : (
                  filteredReports.map((rep) => (
                    <tr key={rep.reportId} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-1 rounded-full bg-blue-50 text-blue-700 text-[11px] font-semibold uppercase">
                              {rep.reportType || rep.type || "Report"}
                            </span>
                            <span className="font-medium text-gray-800">{formatReportTitle(rep)}</span>
                          </div>
                          <p className="text-xs text-gray-500">
                            Criteria: {criteriaSummary(rep.criteria)}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {rep.generatedBy?.fullName || rep.generatedBy?.userId || "Unknown"}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {rep.generatedDate ? formatDate(rep.generatedDate) : "N/A"}
                      </td>
                      <td className="px-6 py-4 text-right space-x-3">
                        <button
                          className="text-blue-600 hover:text-blue-800 font-medium"
                          onClick={() => setSelectedReport(rep)}
                        >
                          View
                        </button>
                        <button
                          className="text-blue-600 hover:text-blue-800 font-medium"
                          onClick={() => handleDownloadReport(rep)}
                        >
                          Download
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {selectedReport ? (
        <div className="fixed inset-0 h-full w-full bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex justify-between items-start p-6 pb-2">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Report Details</h3>
                <p className="text-gray-400 text-sm mt-1">ID: {selectedReport.reportId}</p>
              </div>
              <button
                onClick={() => setSelectedReport(null)}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <i className="fa-solid fa-xmark text-xl" />
              </button>
            </div>

            <div className="p-6 pt-4 max-h-[70vh] overflow-y-auto space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Type</p>
                  <p className="text-sm font-bold text-gray-800">{selectedReport.reportType || selectedReport.type}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Generated</p>
                  <p className="text-sm text-gray-700">
                    {selectedReport.generatedDate ? formatDate(selectedReport.generatedDate) : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Generated By</p>
                  <p className="text-sm text-gray-700">
                    {selectedReport.generatedBy?.fullName || selectedReport.generatedBy?.userId || "Unknown"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Criteria</p>
                  <p className="text-sm text-gray-700">{criteriaSummary(selectedReport.criteria)}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold mb-2">Raw criteria</p>
                <pre className="text-xs bg-gray-50 border border-gray-100 rounded-lg p-3 text-gray-700 whitespace-pre-wrap">
                  {selectedReport.criteria || "N/A"}
                </pre>
              </div>
              {selectedReport.content ? (
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold mb-2">Content</p>
                  <pre className="text-xs bg-gray-50 border border-gray-100 rounded-lg p-3 text-gray-700 whitespace-pre-wrap">
                    {selectedReport.content}
                  </pre>
                </div>
              ) : null}
            </div>

            <div className="p-4 border-t border-gray-100 flex justify-between">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className={`px-3 py-1 rounded-full ${reportTypePill(selectedReport.reportType || selectedReport.type)}`}>
                  {selectedReport.reportType || selectedReport.type || "Report"}
                </span>
                <span>Backend ID: {selectedReport.reportId}</span>
              </div>
              <button
                onClick={() => setSelectedReport(null)}
                className="px-6 py-2 rounded-lg border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
