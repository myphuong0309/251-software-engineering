'use client';

'use client';

import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { AvailabilitySlot } from "@/types/api";

const slotsTemplate = [
  { label: "8:00 - 9:00", highlight: false },
  { label: "9:00 - 10:00", highlight: false },
  { label: "10:00 - 11:00", highlight: false },
  { label: "11:00 - 12:00", highlight: true },
  { label: "13:00 - 14:00", highlight: false },
  { label: "14:00 - 15:00", highlight: false },
  { label: "15:00 - 16:00", highlight: false },
];

export default function TutorAvailabilityPage() {
  const { auth } = useAuth();
  const tutorId = auth.userId || "tutor-1";
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const today = useMemo(() => new Date(), []);
  const [currentMonth, setCurrentMonth] = useState<number>(today.getMonth());
  const [currentYear, setCurrentYear] = useState<number>(today.getFullYear());
  const [selectedDay, setSelectedDay] = useState<string>(today.getDate().toString());
  const [selectedSlotLabel, setSelectedSlotLabel] = useState<string | null>(
    slotsTemplate.find((s) => s.highlight)?.label || null,
  );
  const [recurrence, setRecurrence] = useState("None");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!auth.token) {
        setError("Please log in to view availability.");
        setSlots([]);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const data = await api.getAvailabilityForTutor(tutorId, auth.token);
        setSlots(data || []);
      } catch (err) {
        console.warn("Unable to load availability", err);
        setError("Unable to load availability.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [auth.token, tutorId]);

  const displayedSlots = useMemo(() => {
    return [...slots].sort(
      (a, b) =>
        new Date(a.startTime || 0).getTime() - new Date(b.startTime || 0).getTime(),
    );
  }, [slots]);

  const calendarDays = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const startOffset = firstDay.getDay(); // 0 = Sun
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const cells: (string | null)[] = Array(startOffset).fill(null);
    for (let d = 1; d <= daysInMonth; d += 1) {
      cells.push(d.toString());
    }
    while (cells.length % 7 !== 0) {
      cells.push(null);
    }
    const weeks: (string | null)[][] = [];
    for (let i = 0; i < cells.length; i += 7) {
      weeks.push(cells.slice(i, i + 7));
    }
    return weeks;
  }, [currentMonth, currentYear]);

  const availableDaySet = useMemo(() => {
    const set = new Set<string>();
    displayedSlots.forEach((slot) => {
      if (!slot.startTime) return;
      const date = new Date(slot.startTime);
      if (date.getMonth() === currentMonth && date.getFullYear() === currentYear) {
        set.add(date.getDate().toString());
      }
    });
    return set;
  }, [currentMonth, currentYear, displayedSlots]);

  const slotsForSelectedDay = useMemo(() => {
    return displayedSlots.filter((slot) => {
      if (!slot.startTime) return false;
      const date = new Date(slot.startTime);
      return (
        date.getDate().toString() === selectedDay &&
        date.getMonth() === currentMonth &&
        date.getFullYear() === currentYear
      );
    });
  }, [displayedSlots, selectedDay, currentMonth, currentYear]);

  const selectedDateLabel = useMemo(() => {
    const dayNum = parseInt(selectedDay, 10);
    if (Number.isNaN(dayNum)) return "Select a day";
    const date = new Date(currentYear, currentMonth, dayNum);
    return date.toLocaleDateString(undefined, {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  }, [selectedDay, currentMonth, currentYear]);

  const monthLabel = useMemo(() => {
    return new Date(currentYear, currentMonth, 1).toLocaleDateString(undefined, {
      month: "long",
      year: "numeric",
    });
  }, [currentYear, currentMonth]);

  const changeMonth = (delta: number) => {
    const next = new Date(currentYear, currentMonth + delta, 1);
    setCurrentMonth(next.getMonth());
    setCurrentYear(next.getFullYear());
    setSelectedDay("1");
  };

  const addSlot = async () => {
    setStatusMessage(null);
    if (!auth.token) {
      setError("Please log in to save availability.");
      return;
    }
    if (!selectedDay || !selectedSlotLabel) {
      setError("Pick a day and time slot before saving.");
      return;
    }

    const dayNum = parseInt(selectedDay.replace("*", ""), 10);
    if (Number.isNaN(dayNum)) {
      setError("Invalid day selected.");
      return;
    }

    const [startLabel, endLabel] = selectedSlotLabel.split(" - ");
    const parseTime = (timeLabel: string) => {
      const [hourStr, minuteStr] = timeLabel.split(":");
      return { hour: parseInt(hourStr, 10), minute: parseInt(minuteStr, 10) };
    };
    const start = parseTime(startLabel);
    const end = parseTime(endLabel);

    const startDate = new Date(
      Date.UTC(currentYear, currentMonth, dayNum, start.hour, start.minute, 0),
    );
    const endDate = new Date(Date.UTC(currentYear, currentMonth, dayNum, end.hour, end.minute, 0));

    setSaving(true);
    setError(null);
    try {
      await api.createAvailability(
        {
          tutor: { userId: tutorId },
          startTime: startDate.toISOString(),
          endTime: endDate.toISOString(),
          isRecurring: recurrence !== "None (One-time)",
          status: "AVAILABLE",
        },
        auth.token,
      );
      setStatusMessage("Availability saved.");
      // Refresh list
        const data = await api.getAvailabilityForTutor(tutorId, auth.token);
        setSlots(data || []);
      } catch (err) {
        console.warn("Unable to save availability", err);
        setError("Unable to save availability.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Availability Management</h1>
      {loading ? <p className="text-sm text-gray-500">Loading...</p> : null}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {statusMessage ? <p className="text-sm text-green-600">{statusMessage}</p> : null}

      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 space-y-8">
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-700">Calendar</h2>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => changeMonth(-1)}
                className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-50 text-gray-500"
              >
                <i className="fa-solid fa-chevron-left text-xs" />
              </button>
              <span className="font-bold text-gray-700 px-2 text-sm">{monthLabel}</span>
              <button
                type="button"
                onClick={() => changeMonth(1)}
                className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-50 text-gray-500"
              >
                <i className="fa-solid fa-chevron-right text-xs" />
              </button>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="grid grid-cols-7 border-b border-gray-200 bg-white text-center text-xs text-gray-500 font-medium py-3">
              <div>Sun</div>
              <div>Mon</div>
              <div>Tue</div>
              <div>Wed</div>
              <div>Thu</div>
              <div>Fri</div>
              <div>Sat</div>
            </div>
            <div className="grid grid-cols-7 bg-white text-sm text-gray-700">
              {calendarDays.flat().map((day, idx) => {
                const dayString = day || "";
                const isAvailable = dayString ? availableDaySet.has(dayString) : false;
                const isSelected = selectedDay === dayString;
                return (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => dayString && setSelectedDay(dayString)}
                    className={`h-24 border-b border-r border-gray-100 p-2 relative hover:bg-gray-50 cursor-pointer text-left ${
                      idx % 7 === 6 ? "border-r-0" : ""
                    } ${isAvailable ? "bg-green-50" : ""} ${
                      isSelected ? "ring-2 ring-blue-400" : ""
                    }`}
                  >
                    {dayString ? (
                      <span className={`font-medium ${isAvailable ? "text-gray-800" : ""}`}>
                        {dayString}
                      </span>
                    ) : null}
                    {isAvailable ? (
                      <span className="absolute bottom-2 left-2 bg-green-200 text-green-800 text-[10px] px-2 py-0.5 rounded-full font-medium">
                        Available
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex gap-4 mt-3 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-green-100 rounded-sm border border-green-200" /> Available
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-blue-100 rounded-sm border border-blue-200" /> Selected
            </div>
          </div>
        </div>

        <div className="bg-gray-50/50 rounded-xl p-6 border border-gray-100 space-y-4">
          <h3 className="text-gray-700 font-semibold flex items-center gap-2">
            <i className="fa-regular fa-calendar text-gray-500" /> {selectedDateLabel}
          </h3>
          <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
            <i className="fa-regular fa-clock" /> Available Time Slots
          </p>

            <div className="space-y-2">
            {slotsTemplate.map((slot) => (
              <button
                key={slot.label}
                type="button"
                onClick={() => setSelectedSlotLabel(slot.label)}
                className={`w-full rounded-lg py-3 text-sm transition ${
                  selectedSlotLabel === slot.label
                    ? "border border-blue-400 bg-blue-50 text-gray-800 shadow-sm"
                    : slot.highlight
                      ? "border border-green-200 bg-green-100 text-gray-800 shadow-sm"
                      : "border border-gray-300 bg-white text-gray-600 hover:border-blue-400"
                }`}
              >
                {slot.label}
              </button>
            ))}
          </div>

          <div className="mt-8">
            <label className="block text-xs font-bold text-gray-500 mb-2">Recurring Schedule</label>
            <div className="relative">
              <select
                value={recurrence}
                onChange={(e) => setRecurrence(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm bg-white appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
              >
                <option>None (One-time)</option>
                <option>Daily</option>
                <option>Weekly</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                <i className="fa-solid fa-chevron-down text-xs" />
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={addSlot}
            disabled={saving}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg mt-6 flex items-center justify-center gap-2 shadow-sm transition disabled:opacity-60"
          >
            <i className="fa-regular fa-floppy-disk" /> {saving ? "Saving..." : "Save Availability"}
          </button>
        </div>

        <div className="bg-gray-50/50 rounded-xl p-6 border border-gray-100 space-y-4">
          <h3 className="text-gray-700 font-semibold flex items-center gap-2">
            <i className="fa-regular fa-calendar text-gray-500" /> Your Saved Slots
          </h3>
          <div className="space-y-2">
            {displayedSlots.length === 0 ? (
              <p className="text-sm text-gray-500">No availability slots configured.</p>
            ) : (
              displayedSlots.map((slot) => (
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
