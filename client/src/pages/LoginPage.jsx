import React, { useEffect, useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useUserMode } from "../context/UserContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, googleSignIn, isAuthenticated } = useUserMode();

  const redirect = new URLSearchParams(location.search).get("redirect") || "/";

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const googleButtonRef = useRef(null);

  useEffect(() => {
    if (isAuthenticated) navigate(redirect, { replace: true });
  }, [isAuthenticated, navigate, redirect]);

  useEffect(() => {
    // Initialize Google Sign-In
    if (window.google && googleButtonRef.current) {
      window.google.accounts.id.initialize({
        client_id: "681279924176-33ovvqjfl8rtbe7s7d0qdr1hpibrigj4.apps.googleusercontent.com",
        callback: handleGoogleSignIn,
        auto_select: false,
        cancel_on_tap_outside: true
      });

      window.google.accounts.id.renderButton(
        googleButtonRef.current,
        {
          theme: "outline",
          size: "large",
          text: "signin_with",
          shape: "rectangular",
          logo_alignment: "left",
          width: "100%"
        }
      );
    }
  }, []);

  const handleGoogleSignIn = async (response) => {
    setGoogleLoading(true);
    setError("");

    const result = await googleSignIn(response.credential);
    setGoogleLoading(false);

    if (!result.ok) {
      setError(result.message);
      return;
    }

    navigate(redirect, { replace: true });
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    const result = await login(form);
    setSubmitting(false);

    if (!result.ok) {
      setError(result.message);
      return;
    }

    navigate(redirect, { replace: true });
  };

  return (
    <main className="mx-auto max-w-md px-4 py-12">
      <section className="rounded-3xl border border-[#eadfce] bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-black text-[#171433]">Welcome Back</h1>
        <p className="mt-2 text-sm text-gray-600">Login to save memories, personalize journeys, and manage your profile.</p>

        <div className="mt-5">
          {googleLoading ? (
            <div className="flex w-full items-center justify-center rounded-full border border-[#e7dccc] bg-white px-4 py-3">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#7a1338] border-t-transparent"></div>
              <span className="ml-2 text-sm font-semibold text-[#171433]">Signing in with Google...</span>
            </div>
          ) : (
            <div 
              ref={googleButtonRef}
              className="flex w-full justify-center"
            />
          )}
        </div>

        <div className="my-4 flex items-center gap-3 text-xs text-gray-400">
          <span className="h-px flex-1 bg-[#ede4d8]" />
          OR
          <span className="h-px flex-1 bg-[#ede4d8]" />
        </div>

        <form onSubmit={onSubmit} className="space-y-3">
          <input
            type="email"
            required
            value={form.email}
            onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
            placeholder="Email"
            className="w-full rounded-xl border border-[#e7dccc] px-4 py-3 text-sm outline-none"
          />
          <input
            type="password"
            required
            value={form.password}
            onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
            placeholder="Password"
            className="w-full rounded-xl border border-[#e7dccc] px-4 py-3 text-sm outline-none"
          />

          {error ? <p className="text-sm font-semibold text-[#a21443]">{error}</p> : null}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-[#7a1338] px-4 py-3 font-semibold text-white"
          >
            {submitting ? "Signing in..." : "Login"}
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-600">
          New to TravelBite?{" "}
          <Link to={`/signup?redirect=${encodeURIComponent(redirect)}`} className="font-semibold text-[#7a1338]">
            Create account
          </Link>
        </p>
      </section>
    </main>
  );
}
