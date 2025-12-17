import { pool } from "../config/db.js";

// GET /facturas
export const listarFacturas = async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT
        f.id,
        f.fecha,
        f.estado,
        f.tipo,
        f.serie,
        f.numero,
        f.moneda,
        f.neto,
        f.iva,
        f.total,
        p.numero_expediente,
        e.nombre AS empresa
      FROM facturas f
      JOIN proyectos p ON p.id = f.proyecto_id
      JOIN empresas e ON e.id = p.empresa_id
      ORDER BY f.fecha DESC
    `);

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al listar facturas" });
  }
};

// POST /facturas
export const crearFactura = async (req, res) => {
  const {
    proyecto_id,
    fecha,
    estado,
    tipo,
    serie,
    numero,
    moneda,
    tipo_cambio,
    neto,
    iva,
    total,
  } = req.body;

  if (!proyecto_id || !fecha || !estado || !moneda || !total) {
    return res.status(400).json({ error: "Faltan campos obligatorios" });
  }

  try {
    const { rows } = await pool.query(
      `
      INSERT INTO facturas
        (proyecto_id, fecha, estado, tipo, serie, numero,
         moneda, tipo_cambio, neto, iva, total)
      VALUES
        ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
      RETURNING *
      `,
      [
        proyecto_id,
        fecha,
        estado,
        tipo,
        serie,
        numero,
        moneda,
        tipo_cambio,
        neto,
        iva,
        total,
      ]
    );

    res.status(201).json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear factura" });
  }
};
