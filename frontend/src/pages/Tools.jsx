import React, { useMemo, useRef, useState } from "react";
import "../styles/tools.css";

const toolOptions = {
  "cfe-emitidos": {
    title: "Asientos Sol de Primavera",
    endpoint: "cfe-emitidos-to-txt",
    filenamePrefix: "cfe_emitidos",
    badge: "Nuevo",
    icon: "🧾",
    description:
      "Genera el TXT contable desde el Excel de comprobantes emitidos.",
    requirements: [
      "Columnas: Ser., Número, Fecha comp., Receptor, Rz. Social Rec.",
      "Importes: Mnt. Neto, Total IVA y Mnt. Total",
      "Notas de crédito: importes negativos automáticamente",
    ],
  },
  "asiento-completo": {
    title: "Asientos Abiltar",
    endpoint: "xls-to-txt",
    filenamePrefix: "asiento",
    badge: "Clásico",
    icon: "📄",
    description: "Mantiene el convertidor original de Excel a TXT.",
    requirements: [
      "Formato .xls o .xlsx",
      "Respeta el formato del script existente",
      "Pensado para el asiento completo ya utilizado",
    ],
  },
};

export default function Tools() {
  const API = import.meta.env.VITE_API_URL;
  const inputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [tipoTxt, setTipoTxt] = useState("cfe-emitidos");
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState(null);

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const selectedTool = toolOptions[tipoTxt];

  const fileSize = useMemo(() => {
    if (!file) return null;
    const kb = file.size / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    return `${(kb / 1024).toFixed(2)} MB`;
  }, [file]);

  const handleFile = (f) => {
    if (!f) return;

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

      const res = await fetch(`${API}/tools/${selectedTool.endpoint}`, {
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

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      setResultado({
        filename: `${selectedTool.filenamePrefix}_${Date.now()}.txt`,
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

  if (!user || user.rol !== "admin") {
    return (
      <main className="tools-page">
        <section className="tools-shell tools-access-card">
          <div className="tools-access-icon">🔒</div>
          <h1>Herramientas</h1>
          <p>No tenés permisos para acceder a esta sección.</p>
        </section>
      </main>
    );
  }

  return (
    <main className="tools-page">
      <section className="tools-shell">
        <header className="tools-hero">
          <div>
            <span className="tools-kicker">Panel administrativo</span>
            <h1>Herramientas</h1>
            <p>
              Convertí archivos Excel en TXT contables listos para cargar, con
              validaciones y descarga directa.
            </p>
          </div>

          <div className="tools-user-pill">
            <span>Admin</span>
            <small>{user.email}</small>
          </div>
        </header>

        <div className="tools-layout">
          <aside className="tools-selector-card">
            <div className="tools-section-title">
              <span>1</span>
              <div>
                <h2>Elegí el proceso</h2>
                <p>Seleccioná qué TXT querés generar.</p>
              </div>
            </div>

            <div className="tools-options">
              {Object.entries(toolOptions).map(([key, tool]) => (
                <button
                  key={key}
                  type="button"
                  className={`tools-option ${tipoTxt === key ? "is-active" : ""}`}
                  onClick={() => {
                    setTipoTxt(key);
                    setResultado(null);
                    setError(null);
                  }}
                >
                  <span className="tools-option-icon">{tool.icon}</span>
                  <span className="tools-option-copy">
                    <strong>{tool.title}</strong>
                    <small>{tool.description}</small>
                  </span>
                  <em>{tool.badge}</em>
                </button>
              ))}
            </div>
          </aside>

          <section className="tools-main-card">
            <div className="tools-section-title">
              <span>2</span>
              <div>
                <h2>Subí el Excel</h2>
                <p>Formatos permitidos: .xls y .xlsx</p>
              </div>
            </div>

            <div
              className={`tools-dropzone ${dragOver ? "is-dragging" : ""} ${file ? "has-file" : ""}`}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                handleFile(e.dataTransfer.files?.[0]);
              }}
              onClick={() => inputRef.current?.click()}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ")
                  inputRef.current?.click();
              }}
            >
              <input
                ref={inputRef}
                type="file"
                accept=".xls,.xlsx"
                onChange={(e) => handleFile(e.target.files?.[0])}
              />

              <div className="tools-drop-icon">{file ? "✅" : "⬆️"}</div>
              <h3>
                {file
                  ? "Archivo listo para procesar"
                  : "Arrastrá el archivo acá"}
              </h3>
              <p>
                {file
                  ? file.name
                  : "o hacé clic para seleccionarlo desde tu equipo"}
              </p>
              {file && <small>{fileSize}</small>}
            </div>

            <div className="tools-file-row">
              <div>
                <span>Archivo seleccionado</span>
                <strong>
                  {file ? file.name : "Ningún archivo seleccionado"}
                </strong>
              </div>
              <button type="button" onClick={reset} disabled={loading && !file}>
                Limpiar
              </button>
            </div>

            <div className="tools-actions">
              <button
                type="button"
                className="tools-primary-btn"
                disabled={!file || loading}
                onClick={onSubmit}
              >
                {loading ? "Procesando..." : "Generar TXT"}
              </button>

              {resultado && (
                <a
                  href={resultado.url}
                  download={resultado.filename}
                  className="tools-download-btn"
                >
                  Descargar TXT
                </a>
              )}
            </div>

            {error && (
              <div className="tools-alert is-error">
                <strong>Error:</strong> {error}
              </div>
            )}

            {resultado && (
              <div className="tools-alert is-ok">
                <strong>Listo.</strong> El archivo TXT fue generado
                correctamente.
              </div>
            )}
          </section>

          <aside className="tools-info-card">
            <div className="tools-info-header">
              <span>{selectedTool.icon}</span>
              <div>
                <h2>{selectedTool.title}</h2>
                <p>{selectedTool.description}</p>
              </div>
            </div>

            <div className="tools-mini-panel">
              <h3>Reglas principales</h3>
              <ul>
                {selectedTool.requirements.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            {tipoTxt === "cfe-emitidos" && (
              <div className="tools-mini-panel tools-highlight-panel">
                <h3>Salida CFE emitidos</h3>
                <p>Por cada línea del Excel se generan 3 líneas:</p>
                <ol>
                  <li>Neto al haber 4102</li>
                  <li>IVA al haber 21332</li>
                  <li>Total al debe 11111</li>
                </ol>
              </div>
            )}
          </aside>
        </div>
      </section>
    </main>
  );
}
