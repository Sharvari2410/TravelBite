import React from "react";
import { useUserMode } from "../context/UserContext";
import { userModes } from "../utils/constants";

export default function UserModePage() {
  const { mode, setMode } = useUserMode();

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 md:px-8">
      <section className="rounded-3xl border border-[#eadfce] bg-[#f8f1e6] px-4 py-8 text-center sm:px-6 md:px-12">
        <p className="mx-auto w-fit rounded-full bg-[#f2dfe4] px-4 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#7a1338]">
          Personalize Your Feed
        </p>
        <h1 className="mt-4 text-4xl font-black text-[#171433] md:text-6xl">
          Choose Your <span className="italic text-[#7a1338]">Journey</span>
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-base text-gray-600 md:text-lg">
          Select an exploration mode to curate your recommendations and discover the city your way.
        </p>

        <div className="mt-9 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {userModes.map((item) => {
            const active = mode === item.id;
            return (
              <article
                key={item.id}
                className={`rounded-3xl border bg-white p-4 text-left transition ${
                  active ? "border-[#7a1338] shadow-[0_12px_30px_rgba(122,19,56,0.18)]" : "border-[#e8ddd0]"
                }`}
              >
                <img
                  src={
                    item.id === "budget"
                      ? "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&w=900&q=80"
                      : item.id === "balanced"
                        ? "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?auto=format&fit=crop&w=900&q=80"
                        : item.id === "luxury"
                          ? "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=900&q=80"
                          : "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=900&q=80"
                  }
                  alt={item.title}
                  className="h-48 w-full rounded-2xl object-cover"
                />
                <h3 className="mt-4 text-2xl font-black text-[#171433] md:text-3xl">{item.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{item.description}</p>
                <button
                  className={`mt-4 rounded-full px-4 py-2 text-sm font-semibold ${
                    active ? "bg-[#7a1338] text-white" : "bg-[#f6ebef] text-[#7a1338]"
                  }`}
                  onClick={() => setMode(item.id)}
                >
                  {active ? "Selected" : "Use this mode"}
                </button>
              </article>
            );
          })}
        </div>

        <button className="mt-10 rounded-2xl bg-[#7a1338] px-6 py-3 text-base font-semibold text-white shadow-[0_12px_26px_rgba(122,19,56,0.25)] md:px-8 md:py-4 md:text-xl">
          Start My Adventure ?
        </button>
      </section>
    </main>
  );
}
