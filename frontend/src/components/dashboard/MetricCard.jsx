import React from "react";

export default function MetricCard({ label, value }) {
  return (
    <div style={card}>
      <div style={labelStyle}>{label}</div>
      <div style={valueStyle}>{value}</div>
    </div>
  );
}

const card = {
  backgroundColor: "#fff",
  border: "1px solid #e5e7eb",
  borderRadius: 6,
  padding: 20,
};

const labelStyle = {
  fontSize: 13,
  color: "#64748b",
};

const valueStyle = {
  fontSize: 28,
  fontWeight: 700,
  color: "#0f172a",
};
