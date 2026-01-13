import React from "react";

export default function UltimasFacturas({ data }) {
  if (!data || data.length === 0) {
    return (
      <div style={card}>
        <h3 style={title}>Últimas facturas</h3>
        <p style={empty}>No hay facturas recientes.</p>
      </div>
    );
  }

  return (
    <div style={card}>
      <h3 style={title}>Últimas facturas</h3>

      {data.map((f) => (
        <div key={f.id} style={row}>
          <span>{f.nombre_cliente}</span>
          <strong>
            {f.moneda} {Number(f.total).toLocaleString("es-UY")}
          </strong>
        </div>
      ))}
    </div>
  );
}

const card = {
  backgroundColor: "#fff",
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
  color: "#0b3a5b",
};

const empty = {
  color: "#64748b",
};
