'use client';

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { formatDate, formatTimeRange } from "@/lib/format";
import { sampleAvailability } from "@/lib/sample-data";
import { AvailabilitySlot } from "@/types/api";

export default function TutorAvailabilityPage() {
  const { auth } = useAuth();
  const [slots, setSlots] = useState<AvailabilitySlot[]>(sampleAvailability);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [isRecurring, setIsRecurring] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    const loadSlots = async () => {
      if (!auth.userId) return;
      try {
        const data = await api.getAvailabilityForTutor(auth.userId, auth.token);
        if (data?.length) setSlots(data);
      } catch (error) {
        console.warn("Using sample availability because API failed", error);
      }
    };
    loadSlots();
  }, [auth.token, auth.userId]);

  const addSlot = async () => {
    setStatus(null);
    if (!auth.userId) {
      setStatus("Add your userId on login to save availability.");
      return;
    }
    if (!start || !end) {
      setStatus("Select start and end time.");
      return;
    }
    try {
      const created = await api.createAvailability(
        {
          tutor: { userId: auth.userId, fullName: auth.fullName || "Tutor" },
          startTime: new Date(start).toISOString(),
          endTime: new Date(end).toISOString(),
          isRecurring,
          status: "AVAILABLE",
        },
        auth.token,
      );
      setSlots((prev) => [...prev, created]);
      setStatus("Availability saved.");
      setStart("");
      setEnd("");
      setIsRecurring(false);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Save failed.");
    }
  };

  const deleteSlot = async (slotId: string) => {
    try {
      await api.deleteAvailability(slotId, auth.token);
      setSlots((prev) => prev.filter((slot) => slot.slotId !== slotId));
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Delete failed.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Availability Management</h1>

      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-4">
          <div className="flex-1 space-y-1">
            <label className="text-sm text-gray-700">Start time</label>
            <input
              type="datetime-local"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            />
          </div>
          <div className="flex-1 space-y-1">
            <label className="text-sm text-gray-700">End time</label>
            <input
              type="datetime-local"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              id="recurring"
              type="checkbox"
              checked={isRecurring}
              onChange={(e) => setIsRecurring(e.target.checked)}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded"
            />
            <label htmlFor="recurring" className="text-sm text-gray-700">
              Recurring
            </label>
          </div>
          <button
            type="button"
            onClick={addSlot}
            className="h-11 inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium bg-blue-700 text-white hover:bg-blue-800 transition"
          >
            Save Availability
          </button>
        </div>
        {status ? (
          <div className="text-sm text-blue-700 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
            {status}
          </div>
        ) : null}
      </section>

      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">Upcoming Slots</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {slots.map((slot) => (
            <div
              key={slot.slotId}
              className="border border-gray-100 rounded-lg p-4 flex flex-col gap-2"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    {formatDate(slot.startTime)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatTimeRange(slot.startTime, slot.endTime)}
                  </p>
                </div>
                <span className="text-xs font-semibold px-2 py-1 rounded-full bg-green-50 text-green-700">
                  {slot.status || "AVAILABLE"}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{slot.isRecurring ? "Repeats" : "One-time"}</span>
                <button
                  type="button"
                  onClick={() => deleteSlot(slot.slotId)}
                  className="text-red-500 hover:text-red-600 font-semibold"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
