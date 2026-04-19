import React from "react";

export default function ItineraryTimeline({ days, onSpotSelect, activeSpotId }) {
  return (
    <div className="relative space-y-7 pl-10">
      <span className="absolute left-4 top-2 h-[92%] w-[2px] bg-gradient-to-b from-[#f5a23d] via-[#8d1f4b] to-[#8d1f4b]" />
      {days.map((day) => (
        <article key={day.id} className="relative rounded-2xl border border-[#3a1b2f] bg-[#1b0d1d] p-5 text-white shadow-[0_12px_30px_rgba(0,0,0,0.35)]">
          <span className="absolute -left-[30px] top-7 h-3.5 w-3.5 rounded-full bg-[#f5a23d] shadow-[0_0_0_5px_rgba(245,162,61,0.2)]" />
          <h3 className="text-lg font-black text-[#ffb85c]">Day {day.day}: {day.title}</h3>
          <ul className="mt-3 space-y-2 text-sm text-[#ddd3e4]">
            {day.activities.map((activity) => (
              <li key={activity} className="rounded-xl border border-[#3a1b2f] bg-[#250f24] px-3 py-2">
                {activity}
              </li>
            ))}
          </ul>

          {day.spots?.length ? (
            <div className="mt-4 flex flex-wrap gap-2 text-xs">
              {day.spots.map((spot) => (
                <button
                  key={spot.id}
                  type="button"
                  onClick={() => onSpotSelect?.(spot.id)}
                  className={`rounded-full border px-3 py-1 transition ${
                    activeSpotId === spot.id
                      ? "border-[#f6b56a] bg-[#5a1a3a] text-[#ffe7c4]"
                      : "border-[#3a1b2f] bg-[#31152d] text-[#f7d0a1] hover:border-[#7a3558]"
                  }`}
                >
                  {spot.time} - {spot.name}
                </button>
              ))}
            </div>
          ) : null}
        </article>
      ))}
    </div>
  );
}
