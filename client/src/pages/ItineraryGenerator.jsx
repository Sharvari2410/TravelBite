import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Button from "../components/common/Button";
import Loader from "../components/common/Loader";
import ItineraryTimeline from "../components/itinerary/ItineraryTimeline";
import ItineraryMapView from "../components/itinerary/ItineraryMapView";
import { generateItinerary, getCitySpotCatalog } from "../services/itineraryService";
import { useUserMode } from "../context/UserContext";

const cityOptions = ["Pune", "Mumbai", "Jaipur", "Kochi", "Delhi"];
const regionToCity = {
  North: "Delhi",
  West: "Mumbai",
  South: "Kochi",
  East: "Delhi"
};

function normalizeCity(rawCity, rawRegion) {
  if (rawCity && cityOptions.includes(rawCity)) return rawCity;
  if (rawRegion && regionToCity[rawRegion]) return regionToCity[rawRegion];
  return "Pune";
}

function normalizeDays(rawDays) {
  const days = Number(rawDays);
  if (Number.isNaN(days)) return 3;
  return Math.max(1, Math.min(10, days));
}

export default function ItineraryGenerator() {
  const { mode } = useUserMode();
  const [params] = useSearchParams();
  const [form, setForm] = useState({ city: "Pune", days: 3, travelMode: mode });
  const [loading, setLoading] = useState(false);
  const [itinerary, setItinerary] = useState([]);
  const [selectedSpotId, setSelectedSpotId] = useState("");
  const [trailLabel, setTrailLabel] = useState("");
  const handledParamKey = useRef("");

  const tips = useMemo(() => ["Authentic Local", "Fine Dining", "Street Food"], []);

  const previewItinerary = useMemo(
    () => [
      {
        id: "preview-1",
        day: 1,
        title: `Cultural Heart of ${form.city}`,
        spots: getCitySpotCatalog(form.city),
        activities: getCitySpotCatalog(form.city).map(
          (spot) => `${spot.time} - ${spot.name}: ${spot.description}`
        )
      }
    ],
    [form.city]
  );

  const activeItinerary = itinerary.length ? itinerary : previewItinerary;
  const allMapSpots = activeItinerary.flatMap((day) => day.spots || []);
  const activeSpotId = selectedSpotId || allMapSpots[0]?.id || "";

  const runGeneration = async (payload) => {
    setLoading(true);
    const result = await generateItinerary(payload);
    setItinerary(result);
    const firstSpot = result?.[0]?.spots?.[0]?.id || "";
    setSelectedSpotId(firstSpot);
    setLoading(false);
  };

  useEffect(() => {
    const key = params.toString();
    if (key === handledParamKey.current) return;
    handledParamKey.current = key;

    const paramCity = params.get("city");
    const paramRegion = params.get("region");
    const nextCity = normalizeCity(paramCity, paramRegion);
    const nextDays = normalizeDays(params.get("days") || 3);
    const nextTrail = params.get("trail") || "";

    const nextForm = {
      city: nextCity,
      days: nextDays,
      travelMode: mode
    };

    setForm(nextForm);
    setTrailLabel(nextTrail);

    if (params.get("autostart") === "1" || nextTrail) {
      runGeneration(nextForm);
    } else {
      setItinerary([]);
      setSelectedSpotId(getCitySpotCatalog(nextCity)?.[0]?.id || "");
    }
  }, [mode, params]);

  const onSubmit = async (event) => {
    event.preventDefault();
    await runGeneration(form);
  };

  return (
    <main className="min-h-screen bg-[#12050d] text-white">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 md:grid-cols-[360px_1fr] md:px-8">
        <section className="space-y-6">
          <form onSubmit={onSubmit} className="rounded-3xl border border-[#3a1b2f] bg-[#1a0c16] p-4 shadow-[0_18px_40px_rgba(0,0,0,0.35)] md:p-6">
            <h2 className="text-3xl font-black md:text-4xl">Plan Your Adventure</h2>
            <p className="mt-2 text-sm text-[#cab8c7]">Our AI curates high-end experiences tailored to your style.</p>

            <div className="mt-4 space-y-3">
              <label className="text-xs font-semibold uppercase tracking-wide text-[#f6b56a]">Destination City</label>
              <select
                className="w-full rounded-xl border border-[#3a1b2f] bg-[#12050d] px-3 py-3 text-sm"
                value={form.city}
                onChange={(event) => {
                  const nextCity = event.target.value;
                  setForm((prev) => ({ ...prev, city: nextCity }));
                  setItinerary([]);
                  setSelectedSpotId(getCitySpotCatalog(nextCity)?.[0]?.id || "");
                }}
              >
                {cityOptions.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>

              <div className="grid grid-cols-2 gap-3">
                <label className="text-xs font-semibold uppercase tracking-wide text-[#f6b56a]">
                  Trip Days
                  <input
                    type="number"
                    min="1"
                    max="10"
                    className="mt-1 w-full rounded-xl border border-[#3a1b2f] bg-[#12050d] px-3 py-3 text-sm"
                    value={form.days}
                    onChange={(event) => setForm((prev) => ({ ...prev, days: normalizeDays(event.target.value) }))}
                  />
                </label>
                <label className="text-xs font-semibold uppercase tracking-wide text-[#f6b56a]">
                  Budget
                  <select
                    className="mt-1 w-full rounded-xl border border-[#3a1b2f] bg-[#12050d] px-3 py-3 text-sm"
                    value={form.travelMode}
                    onChange={(event) => setForm((prev) => ({ ...prev, travelMode: event.target.value }))}
                  >
                    <option value="budget">Budget</option>
                    <option value="balanced">Balanced</option>
                    <option value="luxury">Luxury</option>
                    <option value="insider">Local Insider</option>
                  </select>
                </label>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {tips.map((tip) => (
                  <span key={tip} className="rounded-full bg-[#2a1225] px-3 py-1 text-xs text-[#f7d0a1]">{tip}</span>
                ))}
              </div>

              <Button type="submit" className="mt-2 w-full justify-center text-base">
                Regenerate Itinerary
              </Button>
            </div>
          </form>

          <ItineraryMapView
            spots={allMapSpots}
            city={form.city}
            selectedSpotId={activeSpotId}
            onSpotSelect={setSelectedSpotId}
          />
        </section>

        <section className="rounded-3xl border border-[#2d1122] bg-[#12050d] p-5 md:p-6">
          <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="text-3xl font-black md:text-5xl">Day 1: <span className="text-[#ffab47]">Cultural Heart of {form.city}</span></h1>
              <p className="mt-1 text-[#baa8b8]">Exploring signature heritage and iconic local flavors.</p>
              {trailLabel ? (
                <p className="mt-2 inline-flex rounded-full bg-[#2d1023] px-3 py-1 text-xs font-semibold text-[#f7d0a1]">
                  Trail: {trailLabel}
                </p>
              ) : null}
            </div>
            <div className="flex gap-2">
              <button className="rounded-full border border-[#3a1b2f] px-4 py-2 text-sm">Share</button>
              <button className="rounded-full border border-[#3a1b2f] px-4 py-2 text-sm">PDF</button>
            </div>
          </div>

          {loading ? (
            <Loader label="Building your day-by-day itinerary..." />
          ) : (
            <ItineraryTimeline
              days={activeItinerary}
              onSpotSelect={setSelectedSpotId}
              activeSpotId={activeSpotId}
            />
          )}
        </section>
      </div>
    </main>
  );
}




