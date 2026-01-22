import React, { useRef, useState } from "react";
import { apiFetch } from "../api/api";
import "../styles/tools.css";

export default function Tools() {
  const API = import.meta.env.VITE_API_URL;
  const inputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState(null); // { filename, url }
  const [error, setError] = useState(null);

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const handleFile = (f) => {
    if (!f) return;

    // Aceptar solo xls/xlsx
    const ok =
      f.name.toLowerCase().endsWith(".xls") ||
      f.name.toLowerCase().endsWith(".xlsx");

    if (!ok) {
      setError("Solo se permiten archivos .xls o .xlsx");
      setFile(null);
      return;
    }

    setError(null);
    setResultado(null);
    setFile(f);
  };

  const onSubmit = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);
    setResultado(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`${API}/tools/xls-to-txt`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Error al procesar el archivo");
      }

      // Recibimos un TXT como archivo para descargar
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const outName = `asiento_${Date.now()}.txt`;

      setResultado({
        filename: outName,
        url,
      });
    } catch (e) {
      setError(e.message || "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setResultado(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  // Opcional: si querés limitar a admin
  if (!user || user.rol !== "admin") {
    return (
      <div style={page}>
        <div style={container}>
          <div style={card}>
            <h1 style={title}>Herramientas</h1>
            <p style={muted}>No tenés permisos para acceder a esta sección.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={page}>
      <div style={container}>
        {/* HEADER */}
        <div style={header} className="tools-header">
          <div>
            <h1 style={title} className="tools-title">
              Herramientas
            </h1>
            <p style={subtitle}>
              Convertí tu Excel de facturación al archivo TXT listo para cargar.
            </p>
          </div>

          <div style={badge}>
            <span style={{ fontWeight: 700 }}>Admin</span>
            <span style={{ opacity: 0.8, fontSize: 13 }}>{user.email}</span>
          </div>
        </div>

        {/* CARD PRINCIPAL */}
        <div style={card} className="tools-card">
          <div style={grid} className="tools-grid">
            {/* IZQUIERDA */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <h2 style={h2}>Convertidor Excel → TXT</h2>

              <div
                style={{
                  ...dropzone,
                  borderColor: dragOver ? "#60a5fa" : "rgba(255,255,255,0.20)",
                  backgroundColor: dragOver
                    ? "rgba(96,165,250,0.08)"
                    : "rgba(255,255,255,0.03)",
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(false);
                  const f = e.dataTransfer.files?.[0];
                  handleFile(f);
                }}
                onClick={() => inputRef.current?.click()}
              >
                <input
                  ref={inputRef}
                  type="file"
                  accept=".xls,.xlsx"
                  style={{ display: "none" }}
                  onChange={(e) => handleFile(e.target.files?.[0])}
                />

                <div style={{ textAlign: "center" }}>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: 16 }}>
                    Arrastrá tu archivo acá
                  </p>
                  <p style={{ margin: "6px 0 0", opacity: 0.8 }}>
                    o hacé clic para seleccionarlo (.xls / .xlsx)
                  </p>
                </div>
              </div>

              {/* DETALLE ARCHIVO */}
              <div style={fileInfo} className="tools-fileinfo">
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span style={{ opacity: 0.85, fontSize: 13 }}>
                    Archivo seleccionado
                  </span>
                  <span style={{ fontWeight: 700 }}>
                    {file ? file.name : "—"}
                  </span>
                </div>

                <button style={ghostBtn} onClick={reset}>
                  Limpiar
                </button>
              </div>

              {/* BOTONES */}
              <div
                style={{ display: "flex", gap: 12 }}
                className="tools-actions"
              >
                <button
                  style={{
                    ...primaryBtn,
                    opacity: !file || loading ? 0.6 : 1,
                    cursor: !file || loading ? "not-allowed" : "pointer",
                  }}
                  disabled={!file || loading}
                  onClick={onSubmit}
                >
                  {loading ? "Procesando..." : "Convertir a TXT"}
                </button>

                {resultado && (
                  <a
                    href={resultado.url}
                    download={resultado.filename}
                    style={downloadBtn}
                  >
                    Descargar TXT
                  </a>
                )}
              </div>

              {/* ERROR / OK */}
              {error && (
                <div style={alertError}>
                  <strong>Error:</strong> {error}
                </div>
              )}

              {resultado && (
                <div style={alertOk}>✅ Listo. Tu archivo está generado.</div>
              )}
            </div>

            {/* DERECHA - INFO */}
            <div style={rightCard}>
              <h3 style={h3}>¿Cómo funciona?</h3>

              <ul style={list}>
                <li style={li}>
                  Subís un archivo Excel exportado desde tu sistema / DGI.
                </li>
                <li style={li}>
                  El backend ejecuta tu script de Python y genera el TXT.
                </li>
                <li style={li}>
                  Descargás el archivo listo para cargar en el sistema contable.
                </li>
              </ul>

              <div style={divider} />

              <h3 style={h3}>Requisitos del Excel</h3>

              <ul style={list}>
                <li style={li}>Formato válido: .xls o .xlsx</li>
                <li style={li}>Debe contener las columnas esperadas</li>
                <li style={li}>Evitar filas vacías en el encabezado</li>
              </ul>

              <div style={hint}>
                💡 Si un Excel falla, revisá que la columna de Serie-Número
                tenga el formato correcto.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===== Styles ===== */

const page = {
  width: "100%",
  minHeight: "calc(100vh)", // ajusta si tu header/footer ocupa más/menos
  display: "flex",
  justifyContent: "center",
  padding: "40px 0px",
  background: "linear-gradient(120deg, #030e31, #0b2d7a)",
};

const container = {
  maxWidth: 1200,
};

const header = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: 16,
  marginBottom: 20,
};

const title = {
  margin: 0,
  fontSize: 34,
  letterSpacing: 0.3,
  color: "rgba(255,255,255,0.95)",
};

const subtitle = {
  marginTop: 8,
  marginBottom: 0,
  opacity: 0.85,
  maxWidth: 720,
};

const badge = {
  display: "flex",
  flexDirection: "column",
  gap: 2,
  padding: "10px 14px",
  border: "1px solid rgba(255,255,255,0.18)",
  backgroundColor: "rgba(255,255,255,0.04)",
  borderRadius: 12,
  backdropFilter: "blur(8px)",
};

const card = {
  borderRadius: 18,
  border: "1px solid rgba(255,255,255,0.14)",
  background:
    "linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
  boxShadow: "0 20px 50px rgba(0,0,0,0.35)",
  padding: 24,
};

const grid = {
  display: "grid",
  gap: 18,
};

const h2 = {
  margin: 0,
  fontSize: 20,
  color: "rgba(255,255,255,0.95)",
};

const h3 = {
  margin: 0,
  fontSize: 16,
  color: "rgba(255,255,255,0.95)",
};

const dropzone = {
  border: "2px dashed rgba(255,255,255,0.20)",
  borderRadius: 18,
  padding: "26px 18px",
  cursor: "pointer",
  transition: "all 0.15s ease",
};

const fileInfo = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "12px 14px",
  borderRadius: 14,
  border: "1px solid rgba(255,255,255,0.14)",
  backgroundColor: "rgba(255,255,255,0.03)",
};

const primaryBtn = {
  padding: "12px 16px",
  borderRadius: 12,
  border: "1px solid rgba(96,165,250,0.5)",
  background: "rgba(96,165,250,0.18)",
  color: "rgba(255,255,255,0.95)",
  fontWeight: 700,
};

const downloadBtn = {
  padding: "12px 16px",
  borderRadius: 12,
  border: "1px solid rgba(34,197,94,0.50)",
  background: "rgba(34,197,94,0.14)",
  color: "rgba(255,255,255,0.95)",
  fontWeight: 700,
  textDecoration: "none",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
};

const ghostBtn = {
  padding: "10px 14px",
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.18)",
  backgroundColor: "rgba(255,255,255,0.03)",
  color: "rgba(255,255,255,0.90)",
  cursor: "pointer",
};

const alertError = {
  marginTop: 14,
  padding: "12px 14px",
  borderRadius: 12,
  border: "1px solid rgba(239,68,68,0.45)",
  backgroundColor: "rgba(239,68,68,0.10)",
};

const alertOk = {
  marginTop: 14,
  padding: "12px 14px",
  borderRadius: 12,
  border: "1px solid rgba(34,197,94,0.45)",
  backgroundColor: "rgba(34,197,94,0.10)",
};

const rightCard = {
  borderRadius: 18,
  border: "1px solid rgba(255,255,255,0.14)",
  backgroundColor: "rgba(255,255,255,0.03)",
  padding: 18,
  display: "flex",
  flexDirection: "column",
  gap: 14,
};

const list = {
  margin: 0,
  paddingLeft: 18,
  opacity: 0.9,
};

const li = {
  marginBottom: 8,
};

const divider = {
  height: 1,
  backgroundColor: "rgba(255,255,255,0.12)",
  margin: "4px 0",
};

const hint = {
  padding: "12px 14px",
  borderRadius: 14,
  border: "1px solid rgba(255,255,255,0.14)",
  backgroundColor: "rgba(255,255,255,0.03)",
  opacity: 0.92,
};

const muted = {
  opacity: 0.8,
};
