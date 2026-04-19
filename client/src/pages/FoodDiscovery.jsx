import React, { useEffect, useMemo, useState } from "react";
import FoodCard from "../components/cards/FoodCard";
import Loader from "../components/common/Loader";
import { searchFoodSpots } from "../services/foodService";
import { useSearchParams } from "react-router-dom";

const filters = ["Street Food", "Local Cuisine", "Cafes", "Desserts", "Night Food"];

export default function FoodDiscovery() {
  const [params] = useSearchParams();
  const [query, setQuery] = useState(params.get("search") || "");
  const [activeFilter, setActiveFilter] = useState("Street Food");
  const [loading, setLoading] = useState(true);
  const [spots, setSpots] = useState([]);

  useEffect(() => {
    let isMounted = true;
    const run = async () => {
      setLoading(true);
      const result = await searchFoodSpots(query);
      if (!isMounted) return;
      setSpots(result);
      setLoading(false);
    };
    run();
    return () => {
      isMounted = false;
    };
  }, [query]);

  const filtered = useMemo(() => {
    if (!activeFilter) return spots;
    return spots.filter((s) => {
      const target = `${s.title} ${s.cuisine}`.toLowerCase();
      return target.includes(activeFilter.toLowerCase().split(" ")[0]);
    }).length
      ? spots.filter((s) => `${s.title} ${s.cuisine}`.toLowerCase().includes(activeFilter.toLowerCase().split(" ")[0]))
      : spots;
  }, [spots, activeFilter]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 md:px-8">
      <section className="rounded-3xl border border-[#eadfce] bg-[#f5ebdf] p-8">
        <h1 className="text-4xl font-black text-[#171433] md:text-6xl">Food Discovery</h1>
        <p className="mt-3 max-w-3xl text-xl text-gray-600">
          From sizzling street stalls to hidden rooftop cafes, explore authentic flavors curated by local foodies.
        </p>
      </section>

      <section className="mt-5 rounded-2xl border border-[#ebe3da] bg-white p-3">
        <div className="flex flex-wrap gap-2">
          {filters.map((item) => (
            <button
              key={item}
              onClick={() => setActiveFilter(item)}
              className={`rounded-full px-4 py-2 text-sm font-semibold ${
                activeFilter === item ? "bg-[#7a1338] text-white" : "bg-[#f3eff3] text-gray-700"
              }`}
            >
              {item}
            </button>
          ))}
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search for flavors..."
            className="w-full rounded-full border border-[#e7dccc] px-4 py-2 text-sm outline-none sm:ml-auto sm:w-auto sm:min-w-[220px]"
          />
        </div>
      </section>

      <section className="mt-6">
        {loading ? (
          <Loader label="Loading flavors..." />
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {filtered.map((spot) => (
              <FoodCard key={spot.id} spot={spot} />
            ))}
          </div>
        )}
      </section>

      <div className="mt-10 flex justify-center">
        <button className="rounded-full bg-[#7a1338] px-8 py-3 text-lg font-semibold text-white">Load More Flavors</button>
      </div>
    </main>
  );
}

