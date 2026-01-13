import React, { useEffect, useState } from "react";
import { apiFetch } from "../api/api";

export default function Facturas({ proyecto }) {
  const [facturas, setFacturas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    apiFetch(`/facturas/proyecto/${proyecto.id}`)
      .then(setFacturas)
      .finally(() => setLoading(false));
  }, [proyecto]);

  if (loading) {
    return <p style={stateText}>Cargando facturas…</p>;
  }

  return (
    <div style={card}>
      <div style={header}>
        <h3 style={title}>Facturas</h3>

        <span style={subtitle}>
          Proyecto: <strong>{proyecto.numero_expediente || "GENÉRICO"}</strong>
        </span>
      </div>

      {facturas.length === 0 ? (
        <div style={emptyState}>
          <p>No hay facturas para este proyecto.</p>
        </div>
      ) : (
        <div style={tableContainer}>
          <table style={table}>
            <thead>
              <tr>
                <th style={th}>Fecha</th>
                <th style={th}>Cliente</th>
                <th style={th}>Estado</th>
                <th style={{ ...th, textAlign: "right" }}>Total</th>
                <th style={th}>Moneda</th>
              </tr>
            </thead>
            <tbody>
              {facturas.map((f) => (
                <tr key={f.id} style={row}>
                  <td style={td}>
                    {new Date(f.fecha).toLocaleDateString("es-UY")}
                  </td>
                  <td style={tdStrong}>{f.nombre_cliente}</td>
                  <td style={td}>
                    <Estado estado={f.estado} />
                  </td>
                  <td style={{ ...td, textAlign: "right" }}>
                    {Number(f.total).toLocaleString("es-UY", {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                  <td style={td}>{f.moneda}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
function Estado({ estado }) {
  const colors = {
    FACTURADO: "#16a34a",
    ANULADO: "#dc2626",
    PENDIENTE: "#ca8a04",
  };

  return (
    <span
      style={{
        padding: "4px 10px",
        borderRadius: 12,
        fontSize: 12,
        fontWeight: 600,
        color: "#fff",
        backgroundColor: colors[estado] || "#64748b",
      }}
    >
      {estado}
    </span>
  );
}
const card = {
  backgroundColor: "#fff",
  border: "1px solid #e5e7eb",
  borderRadius: 6,
  padding: 20,
};

const header = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 16,
};

const title = {
  margin: 0,
  fontSize: 18,
  color: "#0b3a5b",
};

const subtitle = {
  fontSize: 13,
  color: "#64748b",
};

const tableContainer = {
  maxHeight: "300px",
  overflowY: "auto",
  paddingRight: 6,
};

const table = {
  width: "100%",
  borderCollapse: "collapse",
};

const th = {
  position: "sticky",
  top: 0,
  backgroundColor: "#fff",
  textAlign: "left",
  padding: "10px 8px",
  fontSize: 13,
  color: "#64748b",
  borderBottom: "1px solid #e5e7eb",
};

const row = {
  transition: "background 0.2s",
};

const td = {
  padding: "10px 8px",
  borderBottom: "1px solid #f1f5f9",
  fontSize: 14,
  color: "#0f172a",
};

const tdStrong = {
  ...td,
  fontWeight: 600,
};

const emptyState = {
  padding: 24,
  border: "2px dashed #cbd5e1",
  borderRadius: 6,
  textAlign: "center",
  color: "#64748b",
};

const stateText = {
  padding: 16,
  color: "#64748b",
};
