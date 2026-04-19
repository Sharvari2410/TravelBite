import React from "react";
export default function Loader({ label = "Loading your travel guide..." }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-orange-100 bg-white p-4 text-sm text-gray-600 shadow-sm">
      <span className="h-3 w-3 animate-pulse rounded-full bg-primary" />
      <span>{label}</span>
    </div>
  );
}