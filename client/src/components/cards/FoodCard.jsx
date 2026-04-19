import React from "react";

export default function FoodCard({ spot, onDetails, onFavorite }) {
  const review = `${(spot.rating * 220).toFixed(0)} reviews`;
  const priceMap = { Budget: "$5.00", Mid: "$12.00", Premium: "$24.00" };

  return (
    <article className="overflow-hidden rounded-3xl border border-[#e9dfd3] bg-white shadow-[0_10px_25px_rgba(31,25,47,0.06)]">
      <div className="relative h-48">
        <img src={spot.image} alt={spot.title} className="h-full w-full object-cover" />
        <button
          type="button"
          onClick={() => onFavorite?.(spot)}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-xs font-bold text-[#7a1338] shadow"
        >
          FAV
        </button>
      </div>
      <div className="space-y-2 p-4">
        <h3 className="text-xl font-black text-[#171433]">{spot.title}</h3>
        <p className="text-sm text-gray-500">Rating {spot.rating} ({review})</p>
        <p className="text-sm text-gray-600">Location: {spot.city} • {spot.cuisine}</p>
        <div className="mt-3 flex items-center justify-between">
          <p className="text-3xl font-black text-[#7a1338]">{priceMap[spot.priceRange] || "$9.00"}</p>
          <button
            type="button"
            onClick={() => onDetails?.(spot)}
            className="rounded-full bg-[#f6ebef] px-4 py-2 text-sm font-semibold text-[#7a1338]"
          >
            Details
          </button>
        </div>
      </div>
    </article>
  );
}
