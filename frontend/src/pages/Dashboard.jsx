import React, { useEffect, useState } from "react";
import { apiFetch } from "../api/api";

import MetricCard from "../components/dashboard/MetricCard";
import UltimosProyectos from "../components/dashboard/UltimosProyectos";
import UltimasFacturas from "../components/dashboard/UltimasFacturas";

import "../styles/dashboard.css";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch("/dashboard")
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p style={{ padding: 40 }}>Cargando dashboard…</p>;
  if (!data) return <p style={{ padding: 40 }}>Error al cargar dashboard</p>;

  return (
    <div style={container} className="dashboard">
      <h1 style={title}>Dashboard</h1>

      {/* MÉTRICAS */}
      <div style={metricsGrid} className="dashboard__metrics">
        <MetricCard label="Empresas" value={data.empresas} />
        <MetricCard label="Proyectos" value={data.proyectos} />
        <MetricCard
          label="Total facturado"
          value={`USD ${Number(data.totalFacturado).toLocaleString("es-UY")}`}
        />
        <MetricCard
          label="Facturas pendientes"
          value={data.facturasPendientes}
        />
      </div>

      {/* LISTADOS */}
      <div style={listsGrid} className="dashboard__lists">
        <UltimosProyectos data={data.ultimosProyectos} />
        <UltimasFacturas data={data.ultimasFacturas} />
      </div>
    </div>
  );
}

/* ---------- estilos base (sin columnas fijas) ---------- */
const container = {
  maxWidth: 1200,
  margin: "0 auto",
  padding: "100px 60px",
  minHeight: "100vh",
};

const title = {
  fontSize: 36,
  color: "#0b3a5b",
  marginBottom: 30,
};

const metricsGrid = {
  display: "grid",
  gap: 20,
  marginBottom: 30,
};

const listsGrid = {
  display: "grid",
  gap: 20,
};
