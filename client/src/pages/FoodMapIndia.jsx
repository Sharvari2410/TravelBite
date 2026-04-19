import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import MapView from "../components/map/MapView";
import Loader from "../components/common/Loader";
import { getRegionalFoodMap } from "../services/foodService";
import { foodMapInsights } from "../utils/constants";

function estimateCost(priceBand) {
  if (priceBand === "$") return 150;
  if (priceBand === "$$") return 280;
  if (priceBand === "$$$") return 450;
  return 600;
}

export default function FoodMapIndia() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const source = params.get("source");

  const [loading, setLoading] = useState(true);
  const [regions, setRegions] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("West");
  const [routeDishes, setRouteDishes] = useState([]);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      const data = await getRegionalFoodMap();
      if (!isMounted) return;
      setRegions(data);
      if (data[0]?.name && !selectedRegion) setSelectedRegion(data[0].name);
      setLoading(false);
    };
    load();
    return () => {
      isMounted = false;
    };
  }, [selectedRegion]);

  const filterOptions = useMemo(() => {
    const signatures = regions.map((region) => region.signatureDish);
    return ["all", ...new Set([...regions.map((r) => r.name), ...signatures])];
  }, [regions]);

  const filteredRegions = useMemo(() => {
    const byFilter =
      activeFilter === "all"
        ? regions
        : regions.filter(
            (region) =>
              region.name.toLowerCase() === activeFilter.toLowerCase() ||
              region.signatureDish.toLowerCase() === activeFilter.toLowerCase()
          );

    if (!search.trim()) return byFilter;
    return byFilter.filter((region) => {
      const text = `${region.name} ${region.signatureDish} ${region.cities.join(" ")}`.toLowerCase();
      return text.includes(search.toLowerCase());
    });
  }, [regions, activeFilter, search]);

  useEffect(() => {
    if (!filteredRegions.length) return;
    const exists = filteredRegions.some((region) => region.name === selectedRegion);
    if (!exists) setSelectedRegion(filteredRegions[0].name);
  }, [filteredRegions, selectedRegion]);

  const selectedRegionData = useMemo(
    () => foodMapInsights[selectedRegion] || foodMapInsights.West,
    [selectedRegion]
  );

  const activeLabel = activeFilter === "all" ? "All Cuisines" : activeFilter;

  const addDishToRoute = (dish) => {
    setRouteDishes((prev) => {
      if (prev.some((item) => item.id === dish.id)) return prev;
      return [...prev, dish];
    });
  };

  const removeDishFromRoute = (dishId) => {
    setRouteDishes((prev) => prev.filter((item) => item.id !== dishId));
  };

  const routeCost = routeDishes.reduce((sum, dish) => sum + estimateCost(dish.priceBand), 0);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 md:px-8">
      <section className="flex flex-wrap items-end justify-between gap-4 rounded-3xl border border-[#eadfce] bg-[#f5ebdf] p-5 md:p-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7a1338]">Culinary Journey</p>
          <h1 className="mt-2 text-4xl font-black md:text-6xl text-[#171433]">Food Map of <span className="text-[#7a1338]">India</span></h1>
          <p className="mt-2 max-w-3xl text-base text-gray-600 md:text-xl">Explore regional cuisines, build tasting routes, and jump into itinerary-ready food plans.</p>
          {source === "hotels" ? (
            <p className="mt-2 text-sm font-semibold text-[#7a1338]">Context received from Hotels page.</p>
          ) : null}
        </div>
        <button
          onClick={() => setShowFilters((prev) => !prev)}
          className="rounded-full bg-[#7a1338] px-5 py-3 font-semibold text-white"
        >
          {showFilters ? "Hide Filters" : "Filter Cuisine"}
        </button>
      </section>

      {showFilters ? (
        <section className="mt-4 rounded-2xl border border-[#eadfce] bg-white p-4 shadow-sm">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-semibold text-[#171433]">Filter by region or signature dish</p>
            <button onClick={() => setActiveFilter("all")} className="text-xs font-semibold text-[#7a1338]">Clear Filter</button>
          </div>
          <div className="flex flex-wrap gap-2">
            {filterOptions.map((option) => (
              <button
                key={option}
                onClick={() => setActiveFilter(option)}
                className={`rounded-full px-3 py-2 text-xs font-semibold ${
                  activeFilter === option ? "bg-[#7a1338] text-white" : "bg-[#f6ebef] text-[#7a1338]"
                }`}
              >
                {option === "all" ? "All" : option}
              </button>
            ))}
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search city, dish, region"
              className="w-full rounded-full border border-[#e7dccc] px-4 py-2 text-sm outline-none sm:ml-auto sm:w-auto sm:min-w-[240px]"
            />
          </div>
        </section>
      ) : null}

      <section className="mt-6">
        {loading ? (
          <Loader label="Loading regional cuisine map..." />
        ) : (
          <MapView
            regions={filteredRegions}
            filterLabel={activeLabel}
            selectedRegion={selectedRegion}
            onRegionSelect={setSelectedRegion}
          />
        )}
      </section>

      {!loading && selectedRegionData ? (
        <section className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <article className="rounded-3xl border border-[#e8ddcf] bg-white p-4 shadow-sm md:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7a1338]">Selected Region</p>
                <h2 className="mt-1 text-3xl font-black text-[#171433] md:text-4xl">{selectedRegion}</h2>
                <p className="mt-1 text-sm italic text-gray-500">{selectedRegionData.tagline}</p>
              </div>
              <button
                onClick={() => navigate(`/itinerary?region=${selectedRegion}`)}
                className="rounded-full bg-[#171433] px-4 py-2 text-sm font-semibold text-white"
              >
                Plan Trip
              </button>
            </div>
            <p className="mt-3 text-sm text-gray-600">{selectedRegionData.description}</p>

            <h3 className="mt-5 text-lg font-black text-[#171433]">Iconic Dishes</h3>
            <div className="mt-3 grid gap-3 md:grid-cols-3">
              {selectedRegionData.dishes.map((dish) => (
                <article key={dish.id} className="overflow-hidden rounded-2xl border border-[#efe4d7] bg-[#fffdf9]">
                  <img src={dish.image} alt={dish.name} className="h-28 w-full object-cover" />
                  <div className="p-3">
                    <h4 className="text-sm font-black text-[#171433]">{dish.name}</h4>
                    <p className="mt-1 text-xs text-gray-500">{dish.city} • Spice {dish.spice}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#7a1338]">{dish.priceBand}</span>
                      <button
                        onClick={() => addDishToRoute(dish)}
                        className="rounded-full bg-[#f6ebef] px-3 py-1 text-xs font-semibold text-[#7a1338]"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </article>

          <article className="rounded-3xl border border-[#e8ddcf] bg-white p-4 shadow-sm md:p-6">
            <h3 className="text-2xl font-black text-[#171433]">Tasting Route Builder</h3>
            <p className="mt-1 text-sm text-gray-600">Collect dishes and create a custom food route for your trip.</p>
            <div className="mt-4 space-y-2">
              {routeDishes.length === 0 ? (
                <p className="rounded-xl bg-[#f9f3eb] px-3 py-3 text-sm text-gray-500">No dishes added yet.</p>
              ) : (
                routeDishes.map((dish) => (
                  <div key={dish.id} className="flex items-center justify-between rounded-xl border border-[#efe4d7] px-3 py-2 text-sm">
                    <span>{dish.name}</span>
                    <button onClick={() => removeDishFromRoute(dish.id)} className="text-xs font-semibold text-[#7a1338]">Remove</button>
                  </div>
                ))
              )}
            </div>
            <div className="mt-4 rounded-xl bg-[#f9f3eb] p-3 text-sm text-gray-700">
              <p>Stops: {routeDishes.length}</p>
              <p>Estimated cost: INR {routeCost}</p>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={() => navigate(`/itinerary?region=${selectedRegion}&stops=${routeDishes.length}`)}
                className="rounded-full bg-[#7a1338] px-4 py-2 text-sm font-semibold text-white"
              >
                Build Itinerary
              </button>
              <button
                onClick={() => setRouteDishes([])}
                className="rounded-full border border-[#e7dccc] px-4 py-2 text-sm font-semibold text-[#171433]"
              >
                Clear Route
              </button>
            </div>
          </article>
        </section>
      ) : null}

      {!loading && selectedRegionData?.hubs?.length ? (
        <section className="mt-8">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-2xl font-black text-[#171433] md:text-3xl">Popular Street Food Hubs</h3>
            <span className="text-sm font-semibold text-[#7a1338]">{selectedRegion}</span>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {selectedRegionData.hubs.map((hub) => (
              <article key={hub.id} className="overflow-hidden rounded-2xl border border-[#e8ddcf] bg-white shadow-sm">
                <img src={hub.image} alt={hub.title} className="h-36 w-full object-cover" />
                <div className="p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#7a1338]">{hub.city}</p>
                  <h4 className="mt-1 text-sm font-black text-[#171433]">{hub.title}</h4>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}



