import React from "react";

export default function CityCard({ city, onExplore }) {
  return (
    <article className="card-hover fade-in overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-sm">
      <button
        type="button"
        onClick={() => onExplore?.(city)}
        className="relative h-48 w-full overflow-hidden text-left"
      >
        <img src={city.image} alt={city.name} className="h-full w-full object-cover transition duration-500 hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/5 to-transparent" />
        <p className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold uppercase tracking-wide text-primary">
          {city.region}
        </p>
      </button>
      <div className="p-4">
        <h3 className="section-title text-xl text-dark">{city.name}</h3>
        <p className="mt-2 text-sm text-gray-600">{city.vibe}</p>
        <button
          type="button"
          onClick={() => onExplore?.(city)}
          className="mt-3 rounded-full bg-[#f6ebef] px-4 py-2 text-sm font-semibold text-[#7a1338]"
        >
          Explore {city.name}
        </button>
      </div>
    </article>
  );
}
