import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import "../styles/navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);

  function handleSectionClick(e, id) {
    e.preventDefault();
    setMenuOpen(false);

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

  // Cerrar menú si pasamos a desktop
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 900) setMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Lista de items (para no duplicar lógica)
  const items = useMemo(() => {
    const base = [
      {
        key: "inicio",
        type: "section",
        label: "Inicio",
        sectionId: "inicio",
      },
      {
        key: "servicios",
        type: "section",
        label: "Servicios",
        sectionId: "servicios",
      },
      {
        key: "about",
        type: "section",
        label: "Proyectos",
        sectionId: "about",
      },
      {
        key: "contacto",
        type: "section",
        label: "Contacto",
        sectionId: "contacto",
      },
    ];

    if (!user) {
      return [
        ...base,
        {
          key: "login",
          type: "action",
          label: "Iniciar sesión",
          action: "login",
        },
      ];
    }

    const authed = [
      ...base,
      {
        key: "dashboard",
        type: "route",
        label: "Dashboard",
        path: "/dashboard",
      },
      { key: "empresas", type: "route", label: "Empresas", path: "/empresas" },
    ];

    if (user.rol === "admin") {
      authed.push({
        key: "tools",
        type: "route",
        label: "Herramientas",
        path: "/tools",
      });
    }

    authed.push({
      key: "logout",
      type: "action",
      label: "Salir",
      action: "logout",
    });

    return authed;
  }, [user]);

  const handleItemClick = (e, item) => {
    if (item.type === "section") return handleSectionClick(e, item.sectionId);

    e.preventDefault();
    setMenuOpen(false);

    if (item.type === "route") {
      navigate(item.path);
      return;
    }

    if (item.type === "action" && item.action === "login") {
      navigate("/login");
      return;
    }

    if (item.type === "action" && item.action === "logout") {
      logout();
      navigate("/");
    }
  };

  return (
    <header style={header}>
      <div style={container}>
        {/* Brand */}
        <p style={{ margin: 0 }}>
          <a
            style={link2}
            onClick={() => {
              setMenuOpen(false);
              navigate("/");
            }}
          >
            CB & Asociados
          </a>
        </p>

        {/* NAV desktop (igual que antes) */}
        <nav style={nav} className="cb-nav-desktop">
          {/* Base */}
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
            <a style={loginBtn} onClick={() => navigate("/login")}>
              Iniciar sesión
            </a>
          )}
        </nav>

        {/* Botón hamburguesa (mobile) */}
        <button
          className="cb-burger"
          aria-label="Abrir menú"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
          style={burgerBtn}
        >
          <span className={`cb-burger-line ${menuOpen ? "open" : ""}`} />
          <span className={`cb-burger-line ${menuOpen ? "open" : ""}`} />
          <span className={`cb-burger-line ${menuOpen ? "open" : ""}`} />
        </button>
      </div>

      {/* Menú mobile desplegable */}
      {menuOpen && (
        <div style={mobilePanel} className="cb-nav-mobile">
          {items.map((item) => {
            const isLogout = item.type === "action" && item.action === "logout";
            const isLogin = item.type === "action" && item.action === "login";

            const styleToUse = isLogout ? logoutBtn : isLogin ? loginBtn : link;

            // href solo para anchors (por accesibilidad)
            const href = item.type === "section" ? `#${item.sectionId}` : "#";

            return (
              <a
                key={item.key}
                href={href}
                style={{
                  ...styleToUse,
                  display: "block",
                  padding: "12px 10px",
                }}
                onClick={(e) => handleItemClick(e, item)}
              >
                {item.label}
              </a>
            );
          })}
        </div>
      )}
    </header>
  );
}

/* ✅ Tus estilos originales (SIN CAMBIOS DE LOOK) */

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
  padding: "16px 24px", // 👈 mantiene tu altura
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

/* Burger button (solo posicion/estética mínima) */
const burgerBtn = {
  background: "transparent",
  border: "1px solid rgba(255,255,255,0.18)",
  borderRadius: 10,
  padding: "10px 12px",
  cursor: "pointer",
  display: "none", // lo muestra el CSS en mobile
};

const mobilePanel = {
  backgroundColor: "rgba(3, 14, 49, 0.98)",
  borderTop: "1px solid rgba(255,255,255,0.08)",
  padding: "8px 12px 14px",
};
