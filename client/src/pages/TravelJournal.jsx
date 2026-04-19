import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import JournalEntry from "../components/cards/JournalEntry";
import Loader from "../components/common/Loader";
import { journalEntries } from "../utils/constants";
import { wait } from "../utils/helpers";

function NewMemoryModal({ open, onClose, onCreate, initialTitle }) {
  const [form, setForm] = useState({
    city: "",
    title: initialTitle || "",
    snippet: "",
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80"
  });

  useEffect(() => {
    if (!open) return;
    setForm((prev) => ({ ...prev, title: initialTitle || prev.title }));
  }, [open, initialTitle]);

  if (!open) return null;

  const submit = (event) => {
    event.preventDefault();
    if (!form.city.trim() || !form.title.trim() || !form.snippet.trim()) return;

    onCreate({
      id: `entry-${Date.now()}`,
      author: "You",
      city: form.city.trim(),
      title: form.title.trim(),
      date: new Date().toISOString().slice(0, 10),
      snippet: form.snippet.trim(),
      image: form.image.trim()
    });

    setForm({
      city: "",
      title: "",
      snippet: "",
      image:
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80"
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4" onClick={onClose}>
      <form
        onSubmit={submit}
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-xl rounded-3xl border border-[#e4d5de] bg-white p-6 shadow-2xl"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-black text-[#171433]">Add New Memory</h2>
          <button type="button" onClick={onClose} className="rounded-full border border-[#e5dbe2] px-3 py-1 text-xs">
            Close
          </button>
        </div>

        <div className="grid gap-3">
          <input
            value={form.city}
            onChange={(event) => setForm((prev) => ({ ...prev, city: event.target.value }))}
            placeholder="City (e.g., Mumbai, India)"
            className="rounded-xl border border-[#e5dbe2] px-4 py-3 text-sm outline-none"
          />
          <input
            value={form.title}
            onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
            placeholder="Memory title"
            className="rounded-xl border border-[#e5dbe2] px-4 py-3 text-sm outline-none"
          />
          <textarea
            value={form.snippet}
            onChange={(event) => setForm((prev) => ({ ...prev, snippet: event.target.value }))}
            placeholder="What made this place special?"
            rows={4}
            className="rounded-xl border border-[#e5dbe2] px-4 py-3 text-sm outline-none"
          />
          <input
            value={form.image}
            onChange={(event) => setForm((prev) => ({ ...prev, image: event.target.value }))}
            placeholder="Image URL"
            className="rounded-xl border border-[#e5dbe2] px-4 py-3 text-sm outline-none"
          />
        </div>

        <button type="submit" className="mt-4 rounded-full bg-[#7a1338] px-5 py-3 font-semibold text-white">
          Save Memory
        </button>
      </form>
    </div>
  );
}

function StatsModal({ open, onClose, entries }) {
  if (!open) return null;

  const uniqueCities = new Set(entries.map((entry) => entry.city)).size;
  const latest = entries[0]?.title || "No entries yet";
  const total = entries.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4" onClick={onClose}>
      <article
        className="w-full max-w-lg rounded-3xl border border-[#e4d5de] bg-white p-6 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-2xl font-black text-[#171433]">Journal Stats Summary</h3>
          <button type="button" onClick={onClose} className="rounded-full border border-[#e5dbe2] px-3 py-1 text-xs">
            Close
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl bg-[#f7eff4] p-3">
            <p className="text-xs text-gray-500">Memories</p>
            <p className="text-2xl font-black text-[#7a1338]">{total}</p>
          </div>
          <div className="rounded-xl bg-[#f7eff4] p-3">
            <p className="text-xs text-gray-500">Cities</p>
            <p className="text-2xl font-black text-[#7a1338]">{uniqueCities}</p>
          </div>
          <div className="rounded-xl bg-[#f7eff4] p-3">
            <p className="text-xs text-gray-500">Latest</p>
            <p className="text-sm font-bold text-[#7a1338]">{latest}</p>
          </div>
        </div>
      </article>
    </div>
  );
}

export default function TravelJournal() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [entries, setEntries] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  const savedTitle = params.get("saved") || "";

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      await wait(220);
      if (!isMounted) return;
      setEntries(journalEntries);
      setLoading(false);
      if (savedTitle) setShowModal(true);
    };
    load();
    return () => {
      isMounted = false;
    };
  }, [savedTitle]);

  const filteredEntries = useMemo(() => {
    if (activeTab === "favorites") return entries.filter((entry) => entry.title.length % 2 === 0);
    if (activeTab === "city") return [...entries].sort((a, b) => a.city.localeCompare(b.city));
    return entries;
  }, [entries, activeTab]);

  const addEntry = (entry) => {
    setEntries((prev) => [entry, ...prev]);
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 md:px-8">
      <section className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-[#171433] md:text-6xl">Culinaria Diary</h1>
          <p className="mt-2 text-base text-gray-600 md:text-xl">Archiving tastes and memories from across the globe.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="rounded-full bg-[#7a1338] px-5 py-3 font-semibold text-white"
        >
          + New Memory
        </button>
      </section>

      <div className="mt-5 flex flex-wrap gap-3 border-b border-[#e5dadf] pb-3 text-sm font-semibold">
        <button onClick={() => setActiveTab("all")} className={activeTab === "all" ? "text-[#7a1338]" : "text-gray-500"}>All Memories</button>
        <button onClick={() => setActiveTab("city")} className={activeTab === "city" ? "text-[#7a1338]" : "text-gray-500"}>By City</button>
        <button onClick={() => setActiveTab("favorites")} className={activeTab === "favorites" ? "text-[#7a1338]" : "text-gray-500"}>Favorites</button>
      </div>

      <section className="mt-6">
        {loading ? (
          <Loader label="Loading traveler stories..." />
        ) : (
          <>
            <div className="grid gap-5 md:grid-cols-3">
              {filteredEntries.map((entry) => (
                <JournalEntry key={entry.id} entry={entry} />
              ))}
            </div>

            <article className="mt-7 rounded-3xl border border-[#e3d7de] bg-[#7a1338] p-4 text-white md:p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em]">Global Food Map</p>
              <h3 className="mt-2 text-2xl font-black md:text-4xl">You've tasted the world across 14 cities!</h3>
              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  onClick={() => navigate("/food-map-india?source=journal")}
                  className="rounded-full bg-white/95 px-4 py-2 text-sm font-semibold text-[#7a1338]"
                >
                  Explore Map
                </button>
                <button
                  onClick={() => setShowStats(true)}
                  className="rounded-full border border-white/40 px-4 py-2 text-sm font-semibold text-white"
                >
                  Stats Summary
                </button>
              </div>
            </article>
          </>
        )}
      </section>

      <NewMemoryModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onCreate={addEntry}
        initialTitle={savedTitle}
      />
      <StatsModal open={showStats} onClose={() => setShowStats(false)} entries={entries} />
    </main>
  );
}


