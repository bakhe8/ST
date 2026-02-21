import React from "react";
import { useParams } from "react-router-dom";

const StoreDashboard = () => {
  const { storeId } = useParams();

  const stats = [
    { label: "Total Orders", value: "1,204", change: "+12%" },
    { label: "Sales (SAR)", value: "450,200", change: "+8%" },
    { label: "Visits", value: "45,302", change: "+24%" },
  ];

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24 }}>
        Dashboard Overview
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 24,
          marginBottom: 32,
        }}
      >
        {stats.map((stat, i) => (
          <div
            key={i}
            style={{
              background: "#1e293b",
              borderRadius: 12,
              padding: 24,
              border: "1px solid #334155",
            }}
          >
            <div style={{ fontSize: 14, color: "#94a3b8", marginBottom: 8 }}>
              {stat.label}
            </div>
            <div
              style={{
                fontSize: 28,
                fontWeight: 700,
                color: "white",
                marginBottom: 4,
              }}
            >
              {stat.value}
            </div>
            <div style={{ fontSize: 12, color: "#34d399" }}>
              {stat.change} vs last month
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          background: "#1e293b",
          borderRadius: 12,
          padding: 24,
          border: "1px solid #334155",
        }}
      >
        <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>
          Recent Activity
        </h3>
        <div style={{ fontSize: 14, color: "#94a3b8" }}>
          Store <span style={{ color: "white" }}>{storeId}</span> connected
          successfully.
        </div>
      </div>
    </div>
  );
};

export default StoreDashboard;
