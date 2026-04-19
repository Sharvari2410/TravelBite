import React from "react";
import Button from "../common/Button";

export default function HeroSearch({
  title,
  description,
  placeholder,
  value,
  onChange,
  onSubmit,
  buttonLabel = "Search"
}) {
  return (
    <section className="hero-shell fade-in">
      <div className="max-w-3xl">
        <p className="inline-flex rounded-full bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-dark">
          Curated Travel + Food Planner
        </p>
        <h1 className="mt-3 text-4xl font-black leading-tight text-dark md:text-5xl">{title}</h1>
        <p className="mt-3 max-w-2xl text-base text-gray-700 md:text-lg">{description}</p>

        <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-3 md:flex-row">
          <input
            type="text"
            value={value}
            placeholder={placeholder}
            onChange={onChange}
            className="w-full rounded-xl border border-orange-200 bg-white px-4 py-3 text-sm text-dark outline-none ring-primary focus:ring-2"
          />
          <Button type="submit" className="md:w-auto">
            {buttonLabel}
          </Button>
        </form>
      </div>
    </section>
  );
}