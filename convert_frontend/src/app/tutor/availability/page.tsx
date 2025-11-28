'use client';

const calendarDays = [
  ["", "", "", "1", "2", "3", "4"],
  ["5", "6", "7", "8", "9", "10", "11"],
  ["12", "13", "14*", "15", "16", "17", "18"],
  ["19", "20", "21", "22", "23", "24", "25"],
  ["26", "27", "28", "29", "30", "31", ""],
];

const slots = [
  { label: "8:00 - 9:00", highlight: false },
  { label: "9:00 - 10:00", highlight: false },
  { label: "10:00 - 11:00", highlight: false },
  { label: "11:00 - 12:00", highlight: true },
  { label: "13:00 - 14:00", highlight: false },
  { label: "14:00 - 15:00", highlight: false },
  { label: "15:00 - 16:00", highlight: false },
];

export default function TutorAvailabilityPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Availability Management</h1>

      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 space-y-8">
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-700">Calendar</h2>
            <div className="flex items-center gap-2">
              <button className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-50 text-gray-500">
                <i className="fa-solid fa-chevron-left text-xs" />
              </button>
              <span className="font-bold text-gray-700 px-2 text-sm">October 2025</span>
              <button className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-50 text-gray-500">
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
                const isAvailable = day === "14*";
                return (
                  <div
                    key={idx}
                    className={`h-24 border-b border-r border-gray-100 p-2 relative hover:bg-gray-50 cursor-pointer ${idx % 7 === 6 ? "border-r-0" : ""} ${isAvailable ? "bg-green-50" : ""}`}
                  >
                    {day ? (
                      <span className={`font-medium ${isAvailable ? "text-gray-800" : ""}`}>
                        {day.replace("*", "")}
                      </span>
                    ) : null}
                    {isAvailable ? (
                      <span className="absolute bottom-2 left-2 bg-green-200 text-green-800 text-[10px] px-2 py-0.5 rounded-full font-medium">
                        Available
                      </span>
                    ) : null}
                  </div>
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
            <i className="fa-regular fa-calendar text-gray-500" /> Tuesday, October 14
          </h3>
          <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
            <i className="fa-regular fa-clock" /> Available Time Slots
          </p>

          <div className="space-y-2">
            {slots.map((slot) => (
              <button
                key={slot.label}
                className={`w-full rounded-lg py-3 text-sm transition ${
                  slot.highlight
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
              <select className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm bg-white appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer">
                <option>None (One-time)</option>
                <option>Daily</option>
                <option>Weekly</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                <i className="fa-solid fa-chevron-down text-xs" />
              </div>
            </div>
          </div>

          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg mt-6 flex items-center justify-center gap-2 shadow-sm transition">
            <i className="fa-regular fa-floppy-disk" /> Save Availability
          </button>
        </div>
      </section>
    </div>
  );
}
