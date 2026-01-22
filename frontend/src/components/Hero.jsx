import React, { useEffect, useRef } from "react";
import fondo from "../images/fondo.jpg";
import { useNavigate } from "react-router-dom";

export default function Hero() {
  const navigate = useNavigate();
  const sectionRef = useRef(null);
  const bgRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const bg = bgRef.current;
    if (!section || !bg) return;

    const startScale = 1.35; // bien notorio
    const endScale = 1.0;

    const update = () => {
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;

      // 0 cuando el hero está arriba, 1 cuando ya salió
      const t = clamp(-rect.top / rect.height, 0, 1);

      const scale = lerp(startScale, endScale, t);
      bg.style.transform = `scale(${scale})`;
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <section ref={sectionRef} id="inicio" style={hero}>
      <div
        ref={bgRef}
        className="hero-bg"
        style={{
          backgroundImage: `url(${fondo})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <div style={overlay} />

      <div style={card} className="hero-card enter-up">
        <p style={{ color: "#555" }}>Desarrollando los mejores proyectos</p>
        <h1 style={title}>TRABAJANDO EN EQUIPO</h1>
        <button style={button} onClick={() => navigate("/empresas")}>
          Nuestros proyectos
        </button>
      </div>
    </section>
  );
}

function clamp(n, a, b) {
  return Math.max(a, Math.min(b, n));
}
function lerp(a, b, t) {
  return a + (b - a) * t;
}

const hero = {
  height: "80vh",
  position: "relative",
  display: "flex",
  alignItems: "flex-end",
  justifyContent: "center",
  overflow: "hidden",
};

const overlay = {
  position: "absolute",
  inset: 0,
  marginTop: 100,
  backgroundColor: "rgba(255,255,255,0)",
  zIndex: 1,
};

const card = {
  position: "relative",
  backgroundColor: "#fff",
  padding: "60px 80px",
  textAlign: "center",
  maxWidth: 700,
  zIndex: 2,
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
