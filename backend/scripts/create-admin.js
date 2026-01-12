import bcrypt from "bcrypt";
import { pool } from "../src/config/db.js";

const email = "admin@cb.com";
const password = "admin123";
const nombre = "Administrador";
const rol = "admin";

const main = async () => {
  const hash = await bcrypt.hash(password, 10);

  const result = await pool.query(
    `INSERT INTO usuarios (nombre, email, password_hash, rol)
     VALUES ($1,$2,$3,$4)
     ON CONFLICT (email) DO NOTHING
     RETURNING id, nombre, email, rol`,
    [nombre, email, hash, rol]
  );

  console.log("Admin creado:", result.rows[0] || "ya existía");
  process.exit(0);
};

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
