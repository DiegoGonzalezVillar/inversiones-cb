import React from "react";
import fondo from "../images/fondo.jpg";
import { useNavigate } from "react-router-dom";

// components/Hero.jsx
export default function Hero() {
  const navigate = useNavigate();
  return (
    <section id="inicio" style={hero}>
      <div style={overlay} />

      <div style={card}>
        <p style={{ color: "#555" }}>Desarrollando los mejores proyectos</p>

        <h1 style={title}>TRABAJANDO EN EQUIPO</h1>

        <button style={button} onClick={() => navigate("/empresas")}>
          Nuestros proyectos
        </button>
      </div>
    </section>
  );
}

const hero = {
  height: "80vh",
  backgroundImage: `url(${fondo})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  position: "relative",
  display: "flex",
  alignItems: "flex-end",
  justifyContent: "center",
};

const overlay = {
  position: "absolute",
  inset: 0,
  marginTop: 100,
  backgroundColor: "rgba(255,255,255,0)",
};

const card = {
  position: "relative",
  backgroundColor: "#fff",
  padding: "60px 80px",
  textAlign: "center",
  maxWidth: 700,
};

const title = {
  fontSize: 40,
  margin: "20px 0",
  color: "#0b3a5b",
  letterSpacing: 1,
};

const button = {
  marginTop: 20,
  padding: "14px 32px",
  border: "1px solid #0b3a5b",
  backgroundColor: "#0b3a5b",
  cursor: "pointer",
};
