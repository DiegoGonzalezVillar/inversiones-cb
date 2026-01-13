import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./src/pages/Home";
import Dashboard from "./src/pages/Dashboard";
import Empresas from "./src/pages/Empresas";
import Login from "./src/pages/Login";
import Tools from "./src/pages/Tools";

import Navbar from "./src/components/Navbar";
import Footer from "./src/components/Footer";

import { ProtectedRoute, AdminRoute } from "./src/auth/ProtectedRoute";

export default function App() {
  return (
    <>
      <Navbar />

      <div style={{ paddingTop: 72, minHeight: "100vh" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/empresas"
            element={
              <ProtectedRoute>
                <Empresas />
              </ProtectedRoute>
            }
          />

          <Route
            path="/tools"
            element={
              <AdminRoute>
                <Tools />
              </AdminRoute>
            }
          />
        </Routes>
      </div>

      <Footer />
    </>
  );
}
