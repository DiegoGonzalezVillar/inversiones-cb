import React, { createContext, useContext, useEffect, useState } from "react";
import { apiFetch } from "../api/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const u = localStorage.getItem("user");
    return u ? JSON.parse(u) : null;
  });

  const [loading, setLoading] = useState(true);

  async function loadMe() {
    try {
      const data = await apiFetch("/auth/me"); // usa token desde apiFetch
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
    } catch (err) {
      // token inválido o expirado
      setUser(null);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // si hay token, validarlo
    const token = localStorage.getItem("token");
    if (token) loadMe();
    else setLoading(false);
  }, []);

  async function login(email, password) {
    const data = await apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
