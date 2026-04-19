import React from "react";

export default function PageWrapper({ title, subtitle, children, aside }) {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 md:px-6">
      <div className="glass-panel mb-6 p-5 md:p-6">
        <h1 className="section-title text-3xl text-dark md:text-4xl">{title}</h1>
        {subtitle ? <p className="mt-2 max-w-2xl text-gray-600">{subtitle}</p> : null}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        <section>{children}</section>
        {aside ? <aside>{aside}</aside> : null}
      </div>
    </main>
  );
}