import React from "react";

// components/Footer.jsx
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer style={footer}>© {year} – Gestión de Inversiones Uruguay</footer>
  );
}

const footer = {
  padding: "30px",
  backgroundColor: "#020617",
  color: "#94a3b8",
  textAlign: "center",
  fontSize: 14,
};
