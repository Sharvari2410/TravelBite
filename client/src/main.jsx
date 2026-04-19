import React from "react";
import ReactDOM from "react-dom/client";
import "leaflet/dist/leaflet.css";
import "./index.css";
import App from "./App.jsx";
import { UserProvider } from "./context/UserContext";
import ErrorBoundary from "./components/common/ErrorBoundary";

const rootElement = document.getElementById("root");
rootElement.setAttribute("data-mounted", "pending");

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ErrorBoundary>
      <UserProvider>
        <App />
      </UserProvider>
    </ErrorBoundary>
  </React.StrictMode>
);

rootElement.setAttribute("data-mounted", "true");