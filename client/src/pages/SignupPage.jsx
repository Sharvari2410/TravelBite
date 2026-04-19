import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useUserMode } from "../context/UserContext";

export default function SignupPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signup, isAuthenticated } = useUserMode();

  const redirect = new URLSearchParams(location.search).get("redirect") || "/";

  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) navigate(redirect, { replace: true });
  }, [isAuthenticated, navigate, redirect]);

  const onSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    const result = await signup({ name: form.name, email: form.email, password: form.password });
    setSubmitting(false);

    if (!result.ok) {
      setError(result.message);
      return;
    }

    navigate(redirect, { replace: true });
  };

  const onGooglePlaceholder = () => {
    setError("Google sign-up will be added in backend integration phase.");
  };

  return (
    <main className="mx-auto max-w-md px-4 py-12">
      <section className="rounded-3xl border border-[#eadfce] bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-black text-[#171433]">Create Account</h1>
        <p className="mt-2 text-sm text-gray-600">Sign up to unlock saved routes, custom itineraries, and your food journal.</p>

        <button
          type="button"
          onClick={onGooglePlaceholder}
          className="mt-5 w-full rounded-full border border-[#e7dccc] bg-white px-4 py-3 text-sm font-semibold text-[#171433]"
        >
          Continue with Google
        </button>

        <div className="my-4 flex items-center gap-3 text-xs text-gray-400">
          <span className="h-px flex-1 bg-[#ede4d8]" />
          OR
          <span className="h-px flex-1 bg-[#ede4d8]" />
        </div>

        <form onSubmit={onSubmit} className="space-y-3">
          <input
            type="text"
            required
            value={form.name}
            onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
            placeholder="Full name"
            className="w-full rounded-xl border border-[#e7dccc] px-4 py-3 text-sm outline-none"
          />
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
          <input
            type="password"
            required
            value={form.confirmPassword}
            onChange={(event) => setForm((prev) => ({ ...prev, confirmPassword: event.target.value }))}
            placeholder="Confirm password"
            className="w-full rounded-xl border border-[#e7dccc] px-4 py-3 text-sm outline-none"
          />

          {error ? <p className="text-sm font-semibold text-[#a21443]">{error}</p> : null}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-[#7a1338] px-4 py-3 font-semibold text-white"
          >
            {submitting ? "Creating account..." : "Signup"}
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-600">
          Already have an account?{" "}
          <Link to={`/login?redirect=${encodeURIComponent(redirect)}`} className="font-semibold text-[#7a1338]">
            Login
          </Link>
        </p>
      </section>
    </main>
  );
}
