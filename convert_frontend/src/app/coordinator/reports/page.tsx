'use client';

export default function ReportsPage() {
  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Reports</h2>
        <div className="flex items-center gap-4">
          <button className="text-gray-400 hover:text-blue-600">
            <i className="fa-solid fa-bell text-xl" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">
              CO
            </div>
            <span className="text-sm font-medium text-gray-700">Coordinator</span>
          </div>
        </div>
      </header>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-sm text-gray-600">
        <p className="mb-2 font-semibold text-gray-800">Reports</p>
        <p>Reporting endpoints are available (generate by id/get by id), but no report list is implemented yet.</p>
        <p className="mt-2 text-gray-500">Once reports are generated, they can be fetched via the backend and displayed here.</p>
      </div>
    </div>
  );
}
