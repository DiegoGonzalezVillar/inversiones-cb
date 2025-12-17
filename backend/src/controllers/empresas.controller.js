import { pool } from "../config/db.js";

// GET /empresas
export const listarEmpresas = async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT id, nombre, rut, activo FROM empresas ORDER BY nombre"
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al listar empresas" });
  }
};

// POST /empresas
export const crearEmpresa = async (req, res) => {
  const { nombre, rut } = req.body;

  if (!nombre) {
    return res.status(400).json({
      error: "El nombre es obligatorio",
    });
  }

  try {
    const { rows } = await pool.query(
      `INSERT INTO empresas (nombre, rut)
       VALUES ($1, $2)
       RETURNING id, nombre, rut, activo`,
      [nombre, rut]
    );

    res.status(201).json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear empresa" });
  }
};
