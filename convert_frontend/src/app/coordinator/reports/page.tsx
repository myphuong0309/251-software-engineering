'use client';

import { FormEvent, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { formatDate } from "@/lib/format";
import { Report, ReportType } from "@/types/api";

const reportTypes: { label: string; value: ReportType }[] = [
  { label: "Session History", value: "SESSION_HISTORY" },
  { label: "Tutor Performance", value: "TUTOR_PERFORMANCE" },
  { label: "Student Activity", value: "STUDENT_ACTIVITY" },
];

export default function ReportsPage() {
  const { auth } = useAuth();
  const [selected, setSelected] = useState<ReportType>("SESSION_HISTORY");
  const [reports, setReports] = useState<Report[]>([]);
  const [status, setStatus] = useState<string | null>(null);

  const generate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const report = await api.generateReport(
        {
          type: selected,
          generatedDate: new Date().toISOString(),
          content: "Auto-generated from frontend",
        },
        auth.token,
      );
      setReports((prev) => [report, ...prev]);
      setStatus("Report generated successfully.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Report generation failed.");
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Reports & Analytics</h2>
          <p className="text-gray-500 text-sm mt-1">
            Generate program-wide reports for monitoring.
          </p>
        </div>
      </header>

      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <form className="flex flex-col sm:flex-row gap-4 items-end" onSubmit={generate}>
          <div className="space-y-1 flex-1">
            <label className="text-sm text-gray-700">Report type</label>
            <select
              value={selected}
              onChange={(e) => setSelected(e.target.value as ReportType)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              {reportTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium bg-blue-700 text-white hover:bg-blue-800 transition"
          >
            Generate
          </button>
        </form>
        {status ? (
          <p className="text-sm text-blue-700 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 mt-3">
            {status}
          </p>
        ) : null}
      </section>

      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Reports</h3>
        <div className="space-y-3">
          {reports.map((report) => (
            <div
              key={report.reportId}
              className="border border-gray-100 rounded-lg p-4 flex items-center justify-between"
            >
              <div>
                <p className="text-sm font-semibold text-gray-800">
                  {report.type?.replaceAll("_", " ")}
                </p>
                <p className="text-xs text-gray-500">
                  {formatDate(report.generatedDate)}
                </p>
              </div>
              <a
                className="text-blue-700 hover:text-blue-800 text-sm font-semibold"
                href="#"
                onClick={(e) => e.preventDefault()}
              >
                View
              </a>
            </div>
          ))}
          {!reports.length ? (
            <p className="text-sm text-gray-500">No reports generated yet.</p>
          ) : null}
        </div>
      </section>
    </div>
  );
}
