import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Analytics } from "@vercel/analytics/react";
import App from "./App";
import { queryClient } from "./lib/queryClient";
import "./styles/tokens.css";
import "./styles/typography.css";
import "./styles/global.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <div className="app-container">
        <App />
      </div>
      <SpeedInsights />
      <Analytics />
    </QueryClientProvider>
  </React.StrictMode>,
);
