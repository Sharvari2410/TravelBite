import React from "react";

export default function JournalEntry({ entry }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-[#e5dbe2] bg-white shadow-[0_10px_25px_rgba(31,25,47,0.06)]">
      <img src={entry.image} alt={entry.title} className="h-52 w-full object-cover" />
      <div className="space-y-2 p-4">
        <p className="inline-flex rounded-full bg-[#f7eff4] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#7a1338]">{entry.city}</p>
        <h3 className="text-2xl font-black text-[#171433]">{entry.title}</h3>
        <p className="text-sm text-gray-600">"{entry.snippet}"</p>
        <div className="flex items-center justify-between pt-2 text-xs text-gray-500">
          <span>{entry.date}</span>
          <button className="font-semibold text-[#7a1338]">View Details ?</button>
        </div>
      </div>
    </article>
  );
}