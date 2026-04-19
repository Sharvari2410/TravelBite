import React, { useEffect, useMemo, useState } from "react";
import { BrowserRouter as Router, Navigate, Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import LandingPage from "./pages/LandingPage";
import ItineraryGenerator from "./pages/ItineraryGenerator";
import FoodDiscovery from "./pages/FoodDiscovery";
import HotelRecommendations from "./pages/HotelRecommendations";
import HiddenGems from "./pages/HiddenGems";
import TravelJournal from "./pages/TravelJournal";
import UserModePage from "./pages/UserModePage";
import FoodMapIndia from "./pages/FoodMapIndia";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import NotFound from "./pages/NotFound";
import { useUserMode } from "./context/UserContext";

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useUserMode();
  const location = useLocation();

  if (!isAuthenticated) {
    const redirect = encodeURIComponent(`${location.pathname}${location.search}`);
    return <Navigate to={`/login?redirect=${redirect}`} replace />;
  }

  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/itinerary" element={<ItineraryGenerator />} />
      <Route path="/food-discovery" element={<FoodDiscovery />} />
      <Route path="/hotels" element={<HotelRecommendations />} />
      <Route path="/hidden-gems" element={<HiddenGems />} />
      <Route path="/map" element={<FoodMapIndia />} />
      <Route path="/food-map-india" element={<FoodMapIndia />} />
      <Route
        path="/journal"
        element={
          <ProtectedRoute>
            <TravelJournal />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user-mode"
        element={
          <ProtectedRoute>
            <UserModePage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function AppShell() {
  return (
    <div className="min-h-screen bg-site text-dark">
      <Navbar />
      <AppRoutes />
      <Footer />
    </div>
  );
}

function AppViewport() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const inIframe = typeof window !== "undefined" && window.self !== window.top;
  const embedded = inIframe || params.get("embed") === "1";

  const [previewMode, setPreviewMode] = useState(() => {
    try {
      return localStorage.getItem("travelbite-preview-mode") || "desktop";
    } catch {
      return "desktop";
    }
  });

  useEffect(() => {
    window.__TRAVELBITE_LOADED__ = true;
  }, []);

  useEffect(() => {
    if (embedded) return;
    try {
      localStorage.setItem("travelbite-preview-mode", previewMode);
    } catch {
      // Ignore storage failures in restricted environments.
    }
  }, [previewMode, embedded]);

  const embeddedPath = useMemo(() => {
    const next = new URLSearchParams(location.search);
    next.set("embed", "1");
    const query = next.toString();
    return `${location.pathname}${query ? `?${query}` : ""}`;
  }, [location.pathname, location.search]);

  if (embedded) return <AppShell />;

  const mobilePreview = previewMode === "mobile";

  return (
    <>
      {mobilePreview ? (
        <div className="min-h-screen bg-[#efe5d8] px-3 py-4 md:px-6">
          <div className="mx-auto max-w-[460px]">
            <div className="mb-3 rounded-2xl border border-[#d8c4ad] bg-white/85 px-4 py-2 text-center text-xs font-semibold text-[#7a1338]">
              Mobile Preview (390px)
            </div>
            <div className="overflow-hidden rounded-[30px] border border-[#d8c4ad] bg-white shadow-[0_24px_60px_rgba(32,17,8,0.24)]">
              <iframe
                title="TravelBite Mobile Preview"
                src={embeddedPath}
                className="h-[calc(100vh-7.5rem)] min-h-[720px] w-full border-0"
              />
            </div>
          </div>
        </div>
      ) : (
        <AppShell />
      )}

      <button
        type="button"
        onClick={() => setPreviewMode((current) => (current === "mobile" ? "desktop" : "mobile"))}
        className="fixed bottom-4 right-4 z-[70] rounded-full border border-[#d9c6b1] bg-white px-4 py-2 text-xs font-semibold text-[#7a1338] shadow-[0_12px_24px_rgba(0,0,0,0.16)] md:text-sm"
      >
        {mobilePreview ? "Switch To Desktop View" : "Switch To Mobile View"}
      </button>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppViewport />
    </Router>
  );
}

export default App;

