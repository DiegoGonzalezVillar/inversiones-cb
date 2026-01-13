import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  function handleSectionClick(e, id) {
    e.preventDefault();

    // si ya estamos en home → scroll suave
    if (location.pathname === "/") {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
      return;
    }

    // si estamos en otra ruta → ir a home y luego scroll
    navigate("/");
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 200);
  }

  return (
    <header style={header}>
      <div style={container}>
        {/* Brand */}
        <p style={{ margin: 0 }}>
          <a style={link2} onClick={() => navigate("/")}>
            CB & Asociados
          </a>
        </p>

        <nav style={nav}>
          <a
            href="#inicio"
            style={link}
            onClick={(e) => handleSectionClick(e, "inicio")}
          >
            Inicio
          </a>

          <a
            href="#servicios"
            style={link}
            onClick={(e) => handleSectionClick(e, "servicios")}
          >
            Servicios
          </a>

          <a
            href="#about"
            style={link}
            onClick={(e) => handleSectionClick(e, "about")}
          >
            Proyectos
          </a>

          <a
            href="#contacto"
            style={link}
            onClick={(e) => handleSectionClick(e, "contacto")}
          >
            Contacto
          </a>

          {/* Si hay sesión */}
          {user ? (
            <>
              <a style={link} onClick={() => navigate("/dashboard")}>
                Dashboard
              </a>

              <a style={link} onClick={() => navigate("/empresas")}>
                Empresas
              </a>

              {user.rol === "admin" && (
                <a style={link} onClick={() => navigate("/tools")}>
                  Herramientas
                </a>
              )}

              {/* Logout */}
              <a
                style={logoutBtn}
                onClick={() => {
                  logout();
                  navigate("/");
                }}
              >
                Salir
              </a>
            </>
          ) : (
            // Sin sesión
            <a style={loginBtn} onClick={() => navigate("/login")}>
              Iniciar sesión
            </a>
          )}
        </nav>
      </div>
    </header>
  );
}

/* ✅ Estilos (manteniendo el look pro y consistente) */

const header = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  zIndex: 1000,
  backgroundColor: "rgba(3, 14, 49, 0.92)",
  backdropFilter: "blur(10px)",
  borderBottom: "1px solid rgba(255,255,255,0.08)",
};

const container = {
  maxWidth: 1000,
  margin: "0 auto",
  padding: "16px 24px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};

const nav = {
  display: "flex",
  gap: 24,
  alignItems: "center",
};

/* Links base */
const link = {
  color: "rgba(255,255,255,0.92)",
  fontWeight: 600,
  cursor: "pointer",
  fontSize: 13,
  textTransform: "uppercase",
  letterSpacing: 0.6,
};

/* Brand */
const link2 = {
  color: "#fff",
  fontWeight: 800,
  fontSize: 18,
  cursor: "pointer",
  letterSpacing: 0.4,
};

/* Botones */
const loginBtn = {
  ...link,
  padding: "10px 14px",
  border: "1px solid rgba(255,255,255,0.25)",
  borderRadius: 999,
};

const logoutBtn = {
  ...link,
  padding: "10px 14px",
  borderRadius: 999,
  background: "rgba(255,255,255,0.12)",
};
