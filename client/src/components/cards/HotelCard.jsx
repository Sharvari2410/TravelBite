import React from "react";
import { formatCurrency } from "../../utils/helpers";

export default function HotelCard({ hotel }) {
  return (
    <article className="overflow-hidden rounded-3xl border border-[#e8dee5] bg-white shadow-[0_10px_25px_rgba(31,25,47,0.06)]">
      <div className="relative h-56">
        <img src={hotel.image} alt={hotel.name} className="h-full w-full object-cover" />
        <span className="absolute left-3 top-3 rounded-full bg-[#7a1338] px-3 py-1 text-xs font-semibold text-white">Top Rated</span>
        <button className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[#7a1338] shadow">?</button>
      </div>

      <div className="space-y-3 p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-black text-[#171433]">{hotel.name}</h3>
          <p className="font-semibold text-[#7a1338]">? {hotel.rating}</p>
        </div>
        <p className="text-sm text-gray-600">?? {hotel.city} food district • {hotel.type}</p>

        <div className="flex flex-wrap gap-2">
          {hotel.perks.map((perk) => (
            <span key={perk} className="rounded-full bg-[#f6ebef] px-3 py-1 text-xs text-[#7a1338]">{perk}</span>
          ))}
        </div>

        <div className="flex items-center justify-between pt-1">
          <p className="text-3xl font-black text-[#171433]">{formatCurrency(hotel.nightlyRate)}<span className="text-base font-medium text-gray-500"> /night</span></p>
          <button className="rounded-full bg-[#7a1338] px-5 py-2 text-sm font-semibold text-white">View Details</button>
        </div>
      </div>
    </article>
  );
}