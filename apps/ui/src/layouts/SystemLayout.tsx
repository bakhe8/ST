import React from "react";
import { Outlet, Link } from "react-router-dom";
import { Terminal, Settings } from "lucide-react";

const SystemLayout = () => {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        color: "white",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* System Header */}
      <header
        style={{
          padding: "0 24px",
          height: 64,
          borderBottom: "1px solid #1e293b",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "#1e293b",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 32,
              height: 32,
              background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Terminal size={18} color="white" />
          </div>
          <span style={{ fontWeight: 700, fontSize: 18 }}>SimSalla Helper</span>
        </div>
        <div style={{ display: "flex", gap: 16 }}>
          <Link
            to="/"
            style={{ color: "#94a3b8", textDecoration: "none", fontSize: 14 }}
          >
            Stores
          </Link>
          <Link
            to="/settings"
            style={{ color: "#94a3b8", textDecoration: "none", fontSize: 14 }}
          >
            System Settings
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ flex: 1, padding: 24, overflowY: "auto" }}>
        <Outlet />
      </main>
    </div>
  );
};

export default SystemLayout;
