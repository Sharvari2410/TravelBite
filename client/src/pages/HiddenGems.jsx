import React, { useEffect, useState } from "react";
import HiddenGemCard from "../components/cards/HiddenGemCard";
import Loader from "../components/common/Loader";
import { getHiddenGems } from "../services/mapService";

function GemStoryModal({ gem, onClose }) {
  if (!gem) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4" onClick={onClose}>
      <article
        className="max-h-[90vh] w-full max-w-3xl overflow-auto rounded-3xl border border-[#4a1c3f] bg-[#120926] text-white"
        onClick={(event) => event.stopPropagation()}
      >
        <img src={gem.image} alt={gem.place} className="h-64 w-full object-cover" />
        <div className="space-y-4 p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#f67bb4]">Local Story</p>
              <h2 className="mt-1 text-3xl font-black md:text-4xl">{gem.place}</h2>
              <p className="mt-1 text-sm text-[#cbb8dd]">{gem.city} • Best time: {gem.bestTime}</p>
            </div>
            <button type="button" onClick={onClose} className="rounded-full border border-[#4a1c3f] px-3 py-1 text-xs">
              Close
            </button>
          </div>

          <p className="text-[#ded3ea]">
            Tucked away from tourist-heavy streets, {gem.place} is one of those places locals pass down by word of mouth.
            The atmosphere shifts with the day, and if you arrive around {gem.bestTime.toLowerCase()}, you will catch its
            most authentic rhythm.
          </p>

          <p className="text-[#cbb8dd]">
            Why people love it: {gem.whyVisit} Start with a slow walk around the area, talk to nearby vendors, and ask for
            what regulars order. That is usually where the best experience begins.
          </p>

          <div className="rounded-2xl border border-[#3a1f4a] bg-[#1a0f30] p-4 text-sm text-[#dacbe7]">
            <p className="font-semibold text-white">Insider Tips</p>
            <ul className="mt-2 space-y-1">
              <li>Go during {gem.bestTime.toLowerCase()} for the best vibe and photos.</li>
              <li>Carry cash for small local stalls.</li>
              <li>Ask one local for their favorite nearby bite before leaving.</li>
            </ul>
          </div>
        </div>
      </article>
    </div>
  );
}

export default function HiddenGems() {
  const [loading, setLoading] = useState(true);
  const [gems, setGems] = useState([]);
  const [activeStory, setActiveStory] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      const data = await getHiddenGems();
      if (!isMounted) return;
      setGems(data);
      setLoading(false);
    };
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <main className="bg-[#04061f] text-white">
      <section className="mx-auto max-w-7xl px-4 py-10 md:px-8">
        <p className="inline-flex rounded-full bg-[#2a1a45] px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#f67bb4]">Curated Selection</p>
        <h1 className="mt-4 text-4xl font-black md:text-6xl">Only <span className="italic text-[#f26b9c]">Locals</span> Know</h1>
        <p className="mt-3 max-w-3xl text-xl text-[#b7b2cf]">Discover best-kept city corners, hidden kitchens, and soulful stories tourists miss.</p>

        <section className="mt-8 grid gap-5 md:grid-cols-3">
          {loading ? (
            <Loader label="Uncovering local secrets..." />
          ) : (
            gems.map((gem) => <HiddenGemCard key={gem.id} gem={gem} onReadStory={setActiveStory} />)
          )}
        </section>

        <section className="mt-10 rounded-3xl border border-[#35214c] bg-[#10122d] p-4 md:p-6">
          <h3 className="text-2xl font-black md:text-3xl">Recent Activity</h3>
          <div className="mt-4 grid gap-4 text-sm text-[#c8bdd8] md:grid-cols-3">
            <p>Comment: "The chai at midnight is unbeatable!"</p>
            <p>Shared: Paris Bakery added to Europe Eats</p>
            <p>Saved: Night Spice Market saved by 12 people</p>
          </div>
        </section>
      </section>

      <GemStoryModal gem={activeStory} onClose={() => setActiveStory(null)} />
    </main>
  );
}


