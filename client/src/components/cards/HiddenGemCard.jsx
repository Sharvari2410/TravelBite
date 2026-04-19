import React from "react";

export default function HiddenGemCard({ gem, onReadStory }) {
  return (
    <article className="overflow-hidden rounded-3xl border border-[#4a1c3f] bg-[#120926] text-white shadow-[0_15px_35px_rgba(0,0,0,0.35)]">
      <div className="relative h-56">
        <img src={gem.image} alt={gem.place} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#120926] via-transparent to-transparent" />
        <span className="absolute right-3 top-3 rounded-full bg-black/45 px-3 py-1 text-xs font-semibold">Liked by locals</span>
      </div>
      <div className="space-y-2 p-5">
        <h3 className="text-2xl font-black">{gem.place}</h3>
        <p className="text-sm text-[#d1c6df]">{gem.city}</p>
        <p className="text-sm text-[#b5a8c5]">{gem.whyVisit}</p>
        <div className="flex items-center justify-between pt-1 text-sm">
          <span className="text-[#f6b0cc]">{gem.category}</span>
          <button
            type="button"
            onClick={() => onReadStory?.(gem)}
            className="font-semibold text-[#f6b0cc]"
          >
            Read Story
          </button>
        </div>
      </div>
    </article>
  );
}
