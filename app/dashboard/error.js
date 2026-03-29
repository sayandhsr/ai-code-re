"use client";

import { useEffect } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

export default function ErrorBoundary({ error, reset }) {
  useEffect(() => {
    console.error("Dashboard Error:", error);
  }, [error]);

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "24px",
      background: "var(--bg)",
      color: "var(--text-primary)",
      padding: "24px"
    }}>
      <div style={{
        padding: "24px",
        borderRadius: "var(--radius-xl)",
        background: "var(--card-muted)",
        border: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        maxWidth: "400px",
        textAlign: "center"
      }}>
        <AlertCircle size={48} color="#FF3B30" style={{ marginBottom: "16px" }} />
        <h2 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "8px" }}>Something went wrong</h2>
        <p style={{ color: "var(--text-muted)", fontSize: "14px", lineHeight: "1.6", marginBottom: "24px" }}>
          {error.message || "An unexpected error occurred while loading the dashboard or communicating with the API. Please check your environment configuration."}
        </p>
        <button
          onClick={() => reset()}
          style={{
            padding: "10px 20px",
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-sm)",
            color: "var(--text-primary)",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            cursor: "pointer",
            fontWeight: "500",
            transition: "all 0.2s"
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = "var(--border)";
            e.currentTarget.style.borderColor = "var(--text-muted)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = "var(--card)";
            e.currentTarget.style.borderColor = "var(--border)";
          }}
        >
          <RefreshCw size={16} />
          Try Again
        </button>
      </div>
    </div>
  );
}
