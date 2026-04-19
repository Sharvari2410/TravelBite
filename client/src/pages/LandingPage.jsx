import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CityCard from "../components/cards/CityCard";
import FoodCard from "../components/cards/FoodCard";
import Loader from "../components/common/Loader";
import { useUserMode } from "../context/UserContext";
import { getCities, getCitySpotlight } from "../services/cityService";
import { quickStats, travelCollections, userModes } from "../utils/constants";

const modeImages = {
  budget: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&w=900&q=80",
  balanced: "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?auto=format&fit=crop&w=900&q=80",
  luxury: "https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=900&q=80",
  insider: "https://images.unsplash.com/photo-1455587734955-081b22074882?auto=format&fit=crop&w=900&q=80"
};

const statRoutes = {
  "Cities Curated": "/food-map-india",
  "Food Spots": "/food-discovery",
  "Weekly Plans Built": "/itinerary"
};

function getCollectionRoute(title) {
  if (title.toLowerCase().includes("weekend")) return "/food-discovery?search=weekend";
  if (title.toLowerCase().includes("slow")) return "/hidden-gems";
  if (title.toLowerCase().includes("luxury")) return "/hotels";
  return "/food-discovery";
}

export default function LandingPage() {
  const navigate = useNavigate();
  const { mode, setMode, isAuthenticated, currentUser } = useUserMode();
  const [query, setQuery] = useState("");
  const [cities, setCities] = useState([]);
  const [spotlight, setSpotlight] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      const [cityData, foodData] = await Promise.all([getCities(), getCitySpotlight()]);
      if (!isMounted) return;
      setCities(cityData);
      setSpotlight(foodData);
      setLoading(false);
    };
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    navigate(`/food-discovery?search=${encodeURIComponent(query)}`);
  };

  const handleModeClick = (item) => {
    setMode(item.id);
    navigate(`/user-mode?selected=${item.id}`);
  };

  const handleCityExplore = (city) => {
    navigate(`/food-discovery?search=${encodeURIComponent(city.name)}`);
  };

  const handleFoodDetails = (spot) => {
    navigate(`/food-discovery?search=${encodeURIComponent(spot.title)}`);
  };

  const handleFavorite = (spot) => {
    navigate(`/journal?saved=${encodeURIComponent(spot.title)}`);
  };

  return (
    <main className="mx-auto max-w-7xl space-y-10 px-4 py-8 md:px-8">
      <section className="rounded-3xl border border-[#eadfce] bg-[#f8f1e6] px-4 py-8 text-center sm:px-6 md:px-10">
        <p className="mx-auto w-fit rounded-full bg-[#f2dfe4] px-4 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#7a1338]">
          Personalize Your Feed
        </p>
        <h1 className="mt-4 text-4xl font-black text-[#171433] md:text-7xl">
          Choose Your <span className="italic text-[#7a1338]">Journey</span>
        </h1>
        <p className="mx-auto mt-3 max-w-3xl text-lg text-gray-600 md:text-xl">
          Discover cities through local food, hidden streets, luxury stays, and story-first itineraries.
        </p>

        <form onSubmit={handleSubmit} className="mx-auto mt-6 flex max-w-2xl flex-col gap-3 md:flex-row">
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search cuisine, city, or vibe"
            className="w-full rounded-full border border-[#dfd1c0] bg-white px-5 py-3 text-sm outline-none"
          />
          <button className="rounded-full bg-[#7a1338] px-7 py-3 font-semibold text-white">Start Adventure</button>
        </form>


        {isAuthenticated ? (
          <p className="mt-3 text-sm font-semibold text-[#7a1338]">Welcome back, {currentUser?.name || "Traveler"}. Your account is active.</p>
        ) : (
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <button onClick={() => navigate("/login")} className="rounded-full border border-[#e3d1bd] bg-white px-4 py-2 text-sm font-semibold text-[#7a1338]">
              Login
            </button>
            <button onClick={() => navigate("/signup")} className="rounded-full bg-[#7a1338] px-4 py-2 text-sm font-semibold text-white">
              Signup
            </button>
          </div>
        )}

        <div className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          {userModes.map((item) => (
            <article key={item.id} className="rounded-2xl border border-[#e8ddd0] bg-white p-3 text-left shadow-sm">
              <button type="button" onClick={() => handleModeClick(item)} className="w-full text-left">
                <img src={modeImages[item.id]} alt={item.title} className="h-36 w-full rounded-xl object-cover" />
                <h3 className="mt-3 text-xl font-black text-[#171433]">{item.title}</h3>
                <p className="mt-1 text-sm text-gray-600">{item.description}</p>
              </button>
              <button
                type="button"
                onClick={() => handleModeClick(item)}
                className={`mt-3 rounded-full px-4 py-2 text-sm font-semibold ${
                  mode === item.id ? "bg-[#7a1338] text-white" : "bg-[#f6ebef] text-[#7a1338]"
                }`}
              >
                {mode === item.id ? "Selected" : "Use this mode"}
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        {quickStats.map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={() => navigate(statRoutes[item.label] || "/")}
            className="rounded-2xl border border-[#e6ddd2] bg-white p-5 text-left shadow-sm transition hover:border-[#d3bda5]"
          >
            <p className="text-sm text-gray-500">{item.label}</p>
            <p className="mt-1 text-2xl font-black text-[#171433] md:text-3xl">{item.value}</p>
          </button>
        ))}
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-3xl font-black text-[#171433] md:text-4xl">Popular Cities</h2>
          <Link to="/food-map-india" className="text-sm font-semibold text-[#7a1338]">View map</Link>
        </div>
        {loading ? (
          <Loader label="Loading city highlights..." />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {cities.map((city) => (
              <CityCard key={city.id} city={city} onExplore={handleCityExplore} />
            ))}
          </div>
        )}
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-3xl font-black text-[#171433] md:text-4xl">Food Discovery Highlights</h2>
          <Link to="/food-discovery" className="text-sm font-semibold text-[#7a1338]">See all</Link>
        </div>
        {loading ? (
          <Loader label="Plating local recommendations..." />
        ) : (
          <div className="grid gap-5 md:grid-cols-3">
            {spotlight.map((spot) => (
              <FoodCard key={spot.id} spot={spot} onDetails={handleFoodDetails} onFavorite={handleFavorite} />
            ))}
          </div>
        )}
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-3xl font-black text-[#171433] md:text-4xl">Curated Collections</h2>
          <Link to="/user-mode" className="text-sm font-semibold text-[#7a1338]">Personalize</Link>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {travelCollections.map((item) => (
            <button
              key={item.title}
              type="button"
              onClick={() => navigate(getCollectionRoute(item.title))}
              className="overflow-hidden rounded-3xl border border-[#e8ddd0] bg-white text-left shadow-sm"
            >
              <img src={item.image} alt={item.title} className="h-48 w-full object-cover" />
              <div className="p-4">
                <h3 className="text-2xl font-black text-[#171433]">{item.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{item.subtitle}</p>
                <p className="mt-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#7a1338]">Open Collection</p>
              </div>
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}





