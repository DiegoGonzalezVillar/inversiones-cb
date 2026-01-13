import React, { useEffect, useState } from "react";
import { apiFetch } from "../api/api";
import Facturas from "./Facturas";

export default function Proyectos({ empresa }) {
  const [proyectos, setProyectos] = useState([]);
  const [proyectoSeleccionado, setProyectoSeleccionado] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!empresa) return;

    setLoading(true);
    setError(null);
    setProyectoSeleccionado(null);

    apiFetch(`/proyectos/empresa/${empresa.id}`)
      .then((data) => setProyectos(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [empresa]);

  if (loading) return <p style={stateText}>Cargando proyectos…</p>;
  if (error)
    return <p style={{ ...stateText, color: "red" }}>Error: {error}</p>;

  return (
    <div>
      <div style={header}>
        <div>
          <p style={subtitle}>
            Empresa: <strong>{empresa.nombre}</strong>
          </p>
        </div>

        {proyectoSeleccionado && (
          <div style={pill}>
            Proyecto seleccionado:{" "}
            <strong>
              {proyectoSeleccionado.numero_expediente || "GENÉRICO"}
            </strong>
          </div>
        )}
      </div>

      {proyectos.length === 0 ? (
        <div style={emptyState}>
          <p>No hay proyectos para esta empresa.</p>
        </div>
      ) : (
        <div style={tableContainer}>
          <table style={table}>
            <thead>
              <tr>
                <th style={th}>Fecha ingreso</th>
                <th style={th}>Expediente</th>
                <th style={th}>Estado</th>
                <th style={th}>Ministerio</th>
                <th style={th}>Decreto</th>
              </tr>
            </thead>
            <tbody>
              {proyectos.map((p) => {
                const selected = proyectoSeleccionado?.id === p.id;

                return (
                  <tr
                    key={p.id}
                    onClick={() => setProyectoSeleccionado(p)}
                    style={{
                      ...row,
                      backgroundColor: selected ? "#e6f0f7" : "transparent",
                    }}
                  >
                    <td style={td}>
                      {new Date(p.fecha_ingreso).toLocaleDateString("es-UY")}
                    </td>
                    <td style={tdStrong}>
                      {p.numero_expediente || "GENÉRICO"}
                    </td>
                    <td style={td}>{p.estado}</td>
                    <td style={td}>{p.ministerio || "-"}</td>
                    <td style={td}>{p.decreto || "-"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Facturas (mantiene tu flujo) */}
      <div style={{ marginTop: 20 }}>
        {proyectoSeleccionado ? (
          <div style={cardSoft}>
            <Facturas proyecto={proyectoSeleccionado} />
          </div>
        ) : (
          <div style={hint}>Seleccioná un proyecto para ver sus facturas.</div>
        )}
      </div>
    </div>
  );
}

const header = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: 16,
  marginBottom: 16,
};

const title = {
  margin: 0,
  fontSize: 22,
  color: "#0b3a5b",
};

const subtitle = {
  margin: "6px 0 0 0",
  color: "#64748b",
  fontSize: 13,
};

const pill = {
  backgroundColor: "#f1f5f9",
  border: "1px solid #e5e7eb",
  padding: "10px 12px",
  borderRadius: 6,
  color: "#0f172a",
  fontSize: 13,
  whiteSpace: "nowrap",
};

const tableContainer = {
  maxHeight: "calc(100vh - 380px)", // ajustable según navbar/footer
  overflowY: "auto",
  paddingRight: 6,
  border: "1px solid #e5e7eb",
  borderRadius: 6,
};

const table = {
  width: "100%",
  borderCollapse: "collapse",
  backgroundColor: "#fff",
};

const th = {
  position: "sticky",
  top: 0,
  backgroundColor: "#fff",
  textAlign: "left",
  fontSize: 13,
  padding: "12px 10px",
  color: "#64748b",
  borderBottom: "1px solid #e5e7eb",
};

const row = {
  cursor: "pointer",
};

const td = {
  padding: "12px 10px",
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

const hint = {
  padding: 16,
  border: "1px dashed #cbd5e1",
  borderRadius: 6,
  textAlign: "center",
  color: "#64748b",
  backgroundColor: "#fff",
};

const cardSoft = {
  backgroundColor: "#fff",
  border: "1px solid #e5e7eb",
  borderRadius: 6,
  padding: 16,
};

const stateText = {
  padding: 20,
  color: "#64748b",
};
