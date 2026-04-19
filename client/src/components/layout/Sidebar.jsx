import React from "react";

export default function Sidebar({ title = "Quick Filters", items = [] }) {
  return (
    <div className="rounded-3xl border border-[#eadfce] bg-white p-5 shadow-[0_10px_25px_rgba(31,25,47,0.06)]">
      <h3 className="text-base font-black text-[#1a1730]">{title}</h3>
      <ul className="mt-4 space-y-2 text-sm text-gray-600">
        {items.map((item) => (
          <li key={item} className="rounded-xl border border-[#f0e7dd] bg-[#fcfaf7] px-3 py-2">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}