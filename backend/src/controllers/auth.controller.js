import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../config/db.js";

export async function login(req, res) {
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

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      rol: user.rol,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  console.log("JWT_SECRET en login:", process.env.JWT_SECRET);

  res.json({
    token,
    user: {
      id: user.id,
      nombre: user.nombre,
      email: user.email,
      rol: user.rol,
    },
  });
}

export function me(req, res) {
  res.json({ user: req.user });
}
