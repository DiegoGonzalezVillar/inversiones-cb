import React from "react";
import fondo from "../images/fondo.jpg"; // podés usar la misma imagen si querés

export default function About() {
  return (
    <section id="about" style={section}>
      {/* Overlay */}
      <div style={overlay} />

      {/* Contenido */}
      <div style={content}>
        <h2 style={title}>SOBRE NOSOTROS</h2>

        <p style={text}>
          Acompañamos a empresas en el desarrollo, gestión y seguimiento de
          proyectos de inversión, brindando una visión estratégica, clara y
          profesional en cada etapa del proceso.
        </p>

        <p style={text}>
          Nuestro enfoque combina experiencia técnica, conocimiento normativo y
          una gestión eficiente, permitiendo a nuestros clientes tomar mejores
          decisiones y maximizar el valor de sus proyectos.
        </p>

        <button style={button}>Más información</button>
      </div>
    </section>
  );
}

const section = {
  position: "relative",
  minHeight: "80vh",
  backgroundImage: `url(${fondo})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const overlay = {
  position: "absolute",
  inset: 0,
  backgroundColor: "rgba(255,255,255,0.9)",
};

const content = {
  position: "relative",
  maxWidth: 800,
  textAlign: "center",
  padding: "20px 16px",
  color: "#0f172a",
};

const title = {
  letterSpacing: 2,
  fontSize: 28,
  marginBottom: 30,
  color: "#183274ff",
};

const text = {
  fontSize: 16,
  lineHeight: 1.8,
  marginBottom: 20,
  color: "#183274ff",
};

const button = {
  marginTop: 20,
  padding: "14px 36px",
  border: "1px solid #0b3a5b",
  backgroundColor: "#0b3a5b",
  cursor: "pointer",
  fontSize: 14,
};
