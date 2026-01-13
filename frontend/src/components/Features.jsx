import React from "react";

export default function Features() {
  return (
    <section id="servicios" style={section}>
      <div style={grid}>
        <Feature
          title="SERVICIOS"
          text="Acompañamos a empresas en la planificación, gestión y seguimiento de sus inversiones, brindando una visión integral y profesional."
        />

        <Feature
          title="PROYECTOS"
          text="Gestionamos proyectos de inversión de principio a fin, asegurando control, trazabilidad y cumplimiento normativo."
        />

        <Feature
          title="CLIENTES"
          text="Trabajamos junto a nuestros clientes como socios estratégicos, priorizando la confianza y los resultados a largo plazo."
        />
      </div>
    </section>
  );
}

function Feature({ title, text }) {
  return (
    <div style={card}>
      <h3 style={titleStyle}>{title}</h3>

      <p style={textStyle}>{text}</p>

      <button style={button}>Más información</button>
    </div>
  );
}

const section = {
  padding: "100px 32px",
  backgroundColor: "#fff",
};

const grid = {
  maxWidth: 1200,
  margin: "0 auto",
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  border: "1px solid #d1d5db",
};

const card = {
  padding: "60px 40px",
  textAlign: "center",
  borderRight: "1px solid #d1d5db",
};

const titleStyle = {
  fontSize: 28,
  letterSpacing: 2,
  marginBottom: 30,
  color: "#183274ff",
};

const textStyle = {
  fontSize: 15,
  lineHeight: 1.8,
  color: "#183274ff",
  marginBottom: 50,
};

const button = {
  padding: "14px 32px",
  backgroundColor: "#0b3a5b",
  color: "#fff",
  border: "none",
  cursor: "pointer",
};
