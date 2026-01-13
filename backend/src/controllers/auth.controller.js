import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../config/db.js";

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email y contraseña requeridos" });
    }

    const result = await pool.query(
      "SELECT id, nombre, email, password_hash, rol FROM usuarios WHERE email = $1",
      [email]
    );

    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return res.status(500).json({ error: "JWT_SECRET no configurado" });
    }

    // Acepta "1d", "12h", "15m" o "3600" (segundos)
    const expEnv = process.env.JWT_EXPIRES_IN || "1d";
    const expiresIn = /^\d+$/.test(expEnv) ? Number(expEnv) : expEnv;

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        rol: user.rol,
      },
      secret,
      { expiresIn }
    );

    return res.json({
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol,
      },
    });
  } catch (err) {
    console.error("Error en login:", err);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}

export function me(req, res) {
  return res.json({ user: req.user });
}
