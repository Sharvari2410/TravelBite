import React, { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { navLinks } from "../../utils/constants";
import { useUserMode } from "../../context/UserContext";

export default function Navbar() {
  const navigate = useNavigate();
  const { currentUser, isAuthenticated, logout } = useUserMode();
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const onDocClick = (event) => {
      if (!profileRef.current) return;
      if (!profileRef.current.contains(event.target)) setProfileOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const onLogout = () => {
    logout();
    setProfileOpen(false);
    setOpen(false);
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-[#eadfce] bg-[#fcfbf8]/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 md:px-8">
        <Link to="/" className="flex items-center gap-2 text-lg font-black text-[#1a1730] md:text-xl">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#7a1338] text-xs text-white">TB</span>
          TravelBite
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {navLinks.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `rounded-full px-3 py-2 text-xs font-semibold transition ${
                  isActive ? "bg-[#f8e9ee] text-[#7a1338]" : "text-gray-600 hover:bg-[#f5f0ea] hover:text-[#7a1338]"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
          <NavLink
            to="/user-mode"
            className={({ isActive }) =>
              `rounded-full px-3 py-2 text-xs font-semibold transition ${
                isActive ? "bg-[#f8e9ee] text-[#7a1338]" : "text-gray-600 hover:bg-[#f5f0ea] hover:text-[#7a1338]"
              }`
            }
          >
            Journey
          </NavLink>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <input
            type="text"
            placeholder="Search pages..."
            className="w-44 rounded-full border border-[#ece4d9] bg-white px-4 py-2 text-sm outline-none focus:border-[#c8946b]"
          />

          {isAuthenticated ? (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen((prev) => !prev)}
                className="rounded-full border border-[#eadfce] bg-white px-3 py-2 text-xs font-semibold text-[#7a1338]"
              >
                {currentUser?.name?.split(" ")[0] || "Profile"}
              </button>

              {profileOpen ? (
                <div className="absolute right-0 mt-2 w-44 rounded-2xl border border-[#eadfce] bg-white p-2 shadow-lg">
                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      navigate("/user-mode");
                    }}
                    className="w-full rounded-xl px-3 py-2 text-left text-sm font-semibold text-gray-700 hover:bg-[#f8e9ee]"
                  >
                    My Account
                  </button>
                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      navigate("/journal");
                    }}
                    className="mt-1 w-full rounded-xl px-3 py-2 text-left text-sm font-semibold text-gray-700 hover:bg-[#f8e9ee]"
                  >
                    My Journal
                  </button>
                  <button
                    onClick={onLogout}
                    className="mt-1 w-full rounded-xl px-3 py-2 text-left text-sm font-semibold text-[#a21443] hover:bg-[#fdecef]"
                  >
                    Logout
                  </button>
                </div>
              ) : null}
            </div>
          ) : (
            <>
              <NavLink to="/login" className="rounded-full border border-[#eadfce] px-3 py-2 text-xs font-semibold text-[#7a1338]">
                Login
              </NavLink>
              <NavLink to="/signup" className="rounded-full bg-[#7a1338] px-3 py-2 text-xs font-semibold text-white">
                Signup
              </NavLink>
            </>
          )}
        </div>

        <button
          className="rounded-lg border border-[#e7dbc7] px-3 py-2 text-sm md:hidden"
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          Menu
        </button>
      </div>

      {open && (
        <nav className="border-t border-[#eadfce] px-4 py-3 md:hidden">
          <input
            type="text"
            placeholder="Search pages..."
            className="mb-3 w-full rounded-full border border-[#ece4d9] bg-white px-4 py-2 text-sm outline-none"
          />

          <div className="grid grid-cols-2 gap-2">
            {[...navLinks, { path: "/user-mode", label: "Journey" }].map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `rounded-md px-3 py-2 text-sm font-semibold ${
                    isActive ? "bg-[#f8e9ee] text-[#7a1338]" : "text-gray-600"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {isAuthenticated ? (
              <>
                <button
                  onClick={() => {
                    setOpen(false);
                    navigate("/user-mode");
                  }}
                  className="rounded-full border border-[#eadfce] px-3 py-2 text-xs font-semibold text-gray-700"
                >
                  My Account
                </button>
                <button
                  onClick={() => {
                    setOpen(false);
                    navigate("/journal");
                  }}
                  className="rounded-full border border-[#eadfce] px-3 py-2 text-xs font-semibold text-gray-700"
                >
                  My Journal
                </button>
                <button onClick={onLogout} className="rounded-full bg-[#f6ebef] px-3 py-2 text-xs font-semibold text-[#7a1338]">
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" onClick={() => setOpen(false)} className="rounded-full border border-[#eadfce] px-3 py-2 text-xs font-semibold text-[#7a1338]">
                  Login
                </NavLink>
                <NavLink to="/signup" onClick={() => setOpen(false)} className="rounded-full bg-[#7a1338] px-3 py-2 text-xs font-semibold text-white">
                  Signup
                </NavLink>
              </>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
