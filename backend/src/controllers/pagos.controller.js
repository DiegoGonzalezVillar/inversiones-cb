import { pool } from "../config/db.js";

// POST /pagos
export const crearPago = async (req, res) => {
  const { factura_id, fecha, monto, moneda, tipo_cambio, metodo } = req.body;

  if (!factura_id || !fecha || !monto || !moneda) {
    return res.status(400).json({ error: "Faltan campos obligatorios" });
  }

  try {
    const { rows } = await pool.query(
      `
      INSERT INTO pagos
        (factura_id, fecha, monto, moneda, tipo_cambio, metodo)
      VALUES
        ($1,$2,$3,$4,$5,$6)
      RETURNING *
      `,
      [factura_id, fecha, monto, moneda, tipo_cambio, metodo]
    );

    res.status(201).json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear pago" });
  }
};
