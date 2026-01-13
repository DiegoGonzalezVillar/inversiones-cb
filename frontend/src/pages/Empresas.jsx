import React, { useEffect, useState } from "react";
import { apiFetch } from "../api/api";
import Proyectos from "./Proyectos";
import "../styles/empresas.css";

export default function Empresas() {
  const [empresas, setEmpresas] = useState([]);
  const [empresaSeleccionada, setEmpresaSeleccionada] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    apiFetch("/empresas")
      .then(setEmpresas)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p style={stateText}>Cargando empresas…</p>;
  if (error) return <p style={{ ...stateText, color: "red" }}>{error}</p>;

  return (
    <div style={page} className="empresas-page">
      <h1 style={pageTitle} className="empresas-title">
        Empresas & Proyectos
      </h1>

      <div style={layout} className="empresas-layout">
        {/* EMPRESAS */}
        <div style={card} className="empresas-card">
          <h2 style={cardTitle}>Empresas</h2>

          <div style={tableContainer} className="empresas-tableWrap">
            <table style={table} className="empresas-table">
              <thead>
                <tr>
                  <th style={th}>Nombre</th>
                  <th style={th}>RUT</th>
                  <th style={th}>Email</th>
                </tr>
              </thead>
              <tbody>
                {empresas.map((e) => {
                  const selected = empresaSeleccionada?.id === e.id;

                  return (
                    <tr
                      key={e.id}
                      onClick={() => setEmpresaSeleccionada(e)}
                      style={{
                        ...row,
                        backgroundColor: selected ? "#e6f0f7" : "transparent",
                      }}
                    >
                      <td style={tdStrong} data-label="Nombre">
                        {e.nombre}
                      </td>
                      <td style={td} data-label="RUT">
                        {e.rut || "-"}
                      </td>
                      <td style={td} data-label="Email">
                        {e.email || "-"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* PROYECTOS */}
        <div style={card} className="empresas-card">
          <h2 style={cardTitle}>Proyectos</h2>

          {empresaSeleccionada ? (
            <Proyectos empresa={empresaSeleccionada} />
          ) : (
            <div style={emptyState}>
              <p>Seleccioná una empresa para ver sus proyectos</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* base */
const page = {
  maxWidth: 1200,
  margin: "0 auto",
  padding: "100px 60px",
};

const pageTitle = {
  fontSize: 32,
  marginBottom: 40,
  color: "#0b3a5b",
};

/* 👇 sacamos gridTemplateColumns para que lo maneje CSS */
const layout = {
  display: "grid",
  gap: 30,
};

const card = {
  backgroundColor: "#fff",
  padding: 30,
  borderRadius: 6,
  boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
};

const cardTitle = {
  marginBottom: 20,
  fontSize: 22,
  color: "#0b3a5b",
};

const table = {
  width: "100%",
  borderCollapse: "collapse",
};

const th = {
  textAlign: "left",
  fontSize: 13,
  paddingBottom: 10,
  color: "#64748b",
  borderBottom: "1px solid #e5e7eb",
};

const row = {
  cursor: "pointer",
};

const td = {
  padding: "14px 8px",
  borderBottom: "1px solid #f1f5f9",
  fontSize: 14,
};

const tdStrong = {
  ...td,
  fontWeight: 600,
  color: "#0f172a",
};

const emptyState = {
  padding: 40,
  border: "2px dashed #cbd5e1",
  textAlign: "center",
  color: "#64748b",
};

const stateText = {
  padding: 40,
  textAlign: "center",
};

const tableContainer = {
  maxHeight: "60vh",
  overflowY: "auto",
};
