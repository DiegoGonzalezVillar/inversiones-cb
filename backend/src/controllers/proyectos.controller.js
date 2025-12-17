import { pool } from "../config/db.js";

// GET /proyectos
export const listarProyectos = async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT
        p.id,
        p.fecha_ingreso,
        p.numero_expediente,
        p.estado,
        p.ministerio,
        p.decreto,
        e.id AS empresa_id,
        e.nombre AS empresa_nombre
      FROM proyectos p
      JOIN empresas e ON e.id = p.empresa_id
      ORDER BY p.fecha_ingreso DESC
    `);

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al listar proyectos" });
  }
};

// POST /proyectos
export const crearProyecto = async (req, res) => {
  const {
    empresa_id,
    fecha_ingreso,
    numero_expediente,
    estado,
    ministerio,
    decreto,
  } = req.body;

  // Validaciones mínimas
  if (!empresa_id || !fecha_ingreso || !numero_expediente || !estado) {
    return res.status(400).json({
      error: "Faltan campos obligatorios",
    });
  }

  try {
    const { rows } = await pool.query(
      `
      INSERT INTO proyectos
        (empresa_id, fecha_ingreso, numero_expediente, estado, ministerio, decreto)
      VALUES
        ($1, $2, $3, $4, $5, $6)
      RETURNING *
      `,
      [
        empresa_id,
        fecha_ingreso,
        numero_expediente,
        estado,
        ministerio,
        decreto,
      ]
    );

    res.status(201).json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear proyecto" });
  }
};
