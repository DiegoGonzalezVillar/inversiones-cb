import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError("Credenciales inválidas");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={page}>
      <div style={card}>
        <h1 style={title}>Iniciar sesión</h1>
        <p style={subtitle}>Accedé a la plataforma interna</p>

        <form onSubmit={handleSubmit} style={{ marginTop: 24 }}>
          <label style={label}>Email</label>
          <input
            style={input}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label style={{ ...label, marginTop: 16 }}>Contraseña</label>
          <input
            style={input}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p style={errorStyle}>{error}</p>}

          <button style={button} disabled={loading}>
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>
      </div>
    </div>
  );
}

const page = {
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "linear-gradient(120deg, #030e31, #0b2d7a)",
};

const card = {
  width: "100%",
  maxWidth: 460,
  padding: "40px 36px",
  borderRadius: 18,
  backgroundColor: "rgba(255,255,255,0.95)",
  boxShadow: "0 20px 50px rgba(0,0,0,0.25)",
};

const title = {
  margin: 0,
  color: "#0f172a",
  fontSize: 28,
  fontWeight: 800,
};

const subtitle = {
  marginTop: 10,
  marginBottom: 0,
  color: "#475569",
  fontSize: 14,
};

const label = {
  display: "block",
  fontWeight: 600,
  fontSize: 13,
  color: "#334155",
  marginBottom: 8,
};

const input = {
  width: "93%",
  padding: "12px 14px",
  borderRadius: 10,
  border: "1px solid rgba(15,23,42,0.15)",
  outline: "none",
  fontSize: 14,
  color: "#d1d6e0ff",
};

const button = {
  width: "100%",
  marginTop: 22,
  padding: "12px 14px",
  borderRadius: 12,
  border: "none",
  backgroundColor: "#0f172a",
  color: "white",
  cursor: "pointer",
  fontWeight: 700,
  fontSize: 15,
};

const errorStyle = {
  marginTop: 14,
  marginBottom: 0,
  color: "#b91c1c",
  fontSize: 13,
  fontWeight: 600,
};
