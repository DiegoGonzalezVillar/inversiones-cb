import { pool } from "../config/db.js";

export async function getDashboard(req, res) {
  try {
    const empresas = await pool.query("SELECT COUNT(*) FROM empresas");

    const proyectos = await pool.query("SELECT COUNT(*) FROM proyectos");

    const totalFacturado = await pool.query(`
      SELECT COALESCE(SUM(total), 0) AS total
      FROM facturas
      WHERE estado = 'FACTURADO'
    `);

    const facturasPendientes = await pool.query(`
      SELECT COUNT(*) FROM facturas
      WHERE estado <> 'FACTURADO'
    `);

    const ultimosProyectos = await pool.query(`
      SELECT p.id, e.nombre AS empresa, p.numero_expediente
      FROM proyectos p
      JOIN empresas e ON e.id = p.empresa_id
      ORDER BY p.id DESC
      LIMIT 5
    `);

    const ultimasFacturas = await pool.query(`
      SELECT id, cliente_nombre, total, moneda
      FROM facturas
      ORDER BY fecha DESC
      LIMIT 5
    `);

    res.json({
      empresas: Number(empresas.rows[0].count),
      proyectos: Number(proyectos.rows[0].count),
      totalFacturado: Number(totalFacturado.rows[0].total),
      facturasPendientes: Number(facturasPendientes.rows[0].count),
      ultimosProyectos: ultimosProyectos.rows,
      ultimasFacturas: ultimasFacturas.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al cargar dashboard" });
  }
}
