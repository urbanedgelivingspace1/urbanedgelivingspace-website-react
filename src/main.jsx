import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Analytics } from "@vercel/analytics/react";
import App from "./App";
import { queryClient } from "./lib/queryClient";
import { LanguageProvider } from "./i18n/LanguageContext";
import "./styles/tokens.css";
import "./styles/typography.css";
import "./styles/global.css";
import "./styles/accessibility.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
const enableVercelTelemetry =
  import.meta.env.PROD &&
  !["localhost", "127.0.0.1"].includes(window.location.hostname);

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <div className="app-container">
          <App />
        </div>
      </LanguageProvider>
      {enableVercelTelemetry && <SpeedInsights />}
      {enableVercelTelemetry && <Analytics />}
    </QueryClientProvider>
  </React.StrictMode>,
);
