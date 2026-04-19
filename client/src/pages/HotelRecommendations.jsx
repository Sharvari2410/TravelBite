import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import HotelCard from "../components/cards/HotelCard";
import Loader from "../components/common/Loader";
import { filterHotelsByBudget } from "../services/hotelService";

export default function HotelRecommendations() {
  const navigate = useNavigate();
  const [budget, setBudget] = useState("all");
  const [loading, setLoading] = useState(true);
  const [hotelList, setHotelList] = useState([]);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      setLoading(true);
      const result = await filterHotelsByBudget(budget);
      if (!isMounted) return;
      setHotelList(result);
      setLoading(false);
    };
    load();
    return () => {
      isMounted = false;
    };
  }, [budget]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 md:px-8">
      <section className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7a1338]">Curated Collection</p>
          <h1 className="mt-2 text-4xl font-black text-[#171433] md:text-6xl">Luxury Stays</h1>
          <p className="mt-2 max-w-3xl text-base text-gray-600 md:text-xl">Experience unparalleled comfort at handpicked locations near vibrant food districts.</p>
        </div>
        <button
          onClick={() => navigate(`/food-map-india?source=hotels&budget=${budget}`)}
          className="rounded-full border border-[#eadfce] bg-white px-5 py-3 font-semibold text-[#171433]"
        >
          Interactive Map
        </button>
      </section>

      <section className="mt-6 flex flex-wrap gap-3">
        {["all", "budget", "mid", "premium"].map((item) => (
          <button
            key={item}
            onClick={() => setBudget(item)}
            className={`rounded-full px-5 py-2 text-sm font-semibold ${
              budget === item ? "bg-[#7a1338] text-white" : "border border-[#e8dde3] bg-white text-gray-700"
            }`}
          >
            {item === "all" ? "All" : item === "mid" ? "Mid-range" : item[0].toUpperCase() + item.slice(1)}
          </button>
        ))}
      </section>

      <section className="mt-7">
        {loading ? (
          <Loader label="Selecting ideal stays..." />
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {hotelList.map((hotel) => (
              <HotelCard key={hotel.id} hotel={hotel} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

