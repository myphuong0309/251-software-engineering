'use client';

import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import { AvailabilitySlot } from "@/types/api";

export default function TutorAvailabilityPage() {
  const tutorId = "tutor-1";
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await api.getAvailabilityForTutor(tutorId);
        setSlots(data || []);
      } catch (err) {
        console.warn("Unable to load availability", err);
        setError("Unable to load availability.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const sortedSlots = useMemo(() => {
    return [...slots].sort(
      (a, b) =>
        new Date(a.startTime || 0).getTime() - new Date(b.startTime || 0).getTime(),
    );
  }, [slots]);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Availability Management</h1>
      {loading ? <p className="text-sm text-gray-500">Loading...</p> : null}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 space-y-8">
        <div className="bg-gray-50/50 rounded-xl p-6 border border-gray-100 space-y-4">
          <h3 className="text-gray-700 font-semibold flex items-center gap-2">
            <i className="fa-regular fa-calendar text-gray-500" /> Available Time Slots
          </h3>
          <div className="space-y-2">
            {sortedSlots.length === 0 ? (
              <p className="text-sm text-gray-500">No availability slots configured.</p>
            ) : (
              sortedSlots.map((slot) => (
                <div
                  key={slot.slotId}
                  className="w-full rounded-lg border border-gray-300 bg-white text-gray-700 px-4 py-3 flex items-center justify-between"
                >
                  <div className="flex flex-col text-sm">
                    <span className="font-semibold">
                      {slot.startTime} - {slot.endTime}
                    </span>
                    <span className="text-xs text-gray-500">
                      Status: {slot.status || "AVAILABLE"}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {slot.isRecurring ? "Recurring" : "One-time"}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
