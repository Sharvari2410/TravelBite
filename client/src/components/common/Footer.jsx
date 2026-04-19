import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mt-14 border-t border-[#eadfce] bg-[#faf7f4]">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-3 md:px-8">
        <div>
          <p className="text-2xl font-black text-[#1a1730]">Travel<span className="text-[#7a1338]">Bite</span></p>
          <p className="mt-3 text-sm text-gray-600">Curating city memories through food trails, hidden gems, and local stories.</p>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <Link to="/food-discovery" className="text-gray-700 hover:text-[#7a1338]">Discover</Link>
          <Link to="/food-map-india" className="text-gray-700 hover:text-[#7a1338]">Food Map</Link>
          <Link to="/itinerary" className="text-gray-700 hover:text-[#7a1338]">Itinerary</Link>
          <Link to="/journal" className="text-gray-700 hover:text-[#7a1338]">Journal</Link>
          <Link to="/hidden-gems" className="text-gray-700 hover:text-[#7a1338]">Hidden Gems</Link>
          <Link to="/hotels" className="text-gray-700 hover:text-[#7a1338]">Luxury Stays</Link>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">Contact</p>
          <p className="mt-2 text-sm text-gray-600">hello@travelbite.app</p>
          <p className="text-sm text-gray-600">+91 90000 12345</p>
        </div>
      </div>
      <div className="border-t border-[#eadfce] py-4 text-center text-xs text-gray-500">
        Copyright 2026 TravelBite. All rights reserved.
      </div>
    </footer>
  );
}