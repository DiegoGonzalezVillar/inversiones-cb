import React from "react";

export default function UltimosProyectos({ data }) {
  return (
    <div style={card}>
      <h3 style={title}>Últimos proyectos</h3>

      {data.map((p) => (
        <div key={p.id} style={row}>
          <span style={empresa}>{p.empresa}</span>
        </div>
      ))}
    </div>
  );
}

const card = {
  backgroundColor: "#ffffffff",
  border: "1px solid #e5e7eb",
  borderRadius: 6,
  padding: 20,
};

const title = {
  marginBottom: 16,
  color: "#0b3a5b",
};

const row = {
  display: "flex",
  justifyContent: "space-between",
  padding: "8px 0",
  borderBottom: "1px solid #f1f5f9",
};

const muted = {
  color: "#64748b",
  fontSize: 13,
};

const empty = {
  color: "#64748b",
};

const empresa = {
  fontWeight: 500,
  color: "#0b3a5b",
};

const badge = {
  fontSize: 12,
  padding: "4px 8px",
  borderRadius: 4,
  backgroundColor: "#f1f5f9",
  color: "#475569",
};
