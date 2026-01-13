import React from "react";

export default function Contacto() {
  return (
    <section id="contacto" style={section}>
      <h2 style={title}>CONTACTO</h2>

      <form style={form}>
        <div style={row} className="contact-row">
          <div style={field}>
            <label style={label}>Nombre</label>
            <input style={input} />
          </div>

          <div style={field}>
            <label style={label}>Apellido</label>
            <input style={input} />
          </div>
        </div>

        <div style={row} className="contact-row">
          <div style={field}>
            <label style={label}>Email *</label>
            <input style={input} type="email" required />
          </div>

          <div style={field}>
            <label style={label}>Asunto</label>
            <input style={input} />
          </div>
        </div>

        <div style={{ ...field, marginTop: 40 }}>
          <label style={label}>Mensaje *</label>
          <textarea style={textarea} rows={4} required />
        </div>

        <div style={buttonRow}>
          <button style={button}>Enviar</button>
        </div>
      </form>
    </section>
  );
}

const section = {
  padding: "100px 24px",
  backgroundColor: "#0b3a5b",
  color: "#fff",
};

const title = {
  textAlign: "center",
  fontSize: 32,
  letterSpacing: 3,
  marginBottom: 80,
};

const form = {
  maxWidth: 900,
  margin: "0 auto",
};

const row = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 40,
  marginBottom: 40,
};

const field = {
  display: "flex",
  flexDirection: "column",
};

const label = {
  marginBottom: 10,
  fontSize: 14,
};

const input = {
  background: "transparent",
  border: "none",
  borderBottom: "1px solid rgba(255,255,255,0.6)",
  padding: "8px 4px",
  color: "#fff",
  fontSize: 15,
  outline: "none",
};

const textarea = {
  ...input,
  resize: "none",
};

const buttonRow = {
  display: "flex",
  justifyContent: "flex-end",
  marginTop: 50,
};

const button = {
  backgroundColor: "#fff",
  color: "#0b3a5b",
  border: "none",
  padding: "14px 50px",
  fontSize: 14,
  cursor: "pointer",
};
