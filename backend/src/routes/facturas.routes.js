import { Router } from "express";
import {
  listarFacturas,
  crearFactura,
  listarFacturasPorProyecto,
} from "../controllers/facturas.controller.js";

const router = Router();

// GET /facturas
router.get("/", listarFacturas);

// POST /facturas
router.post("/", crearFactura);

router.get("/proyecto/:proyectoId", listarFacturasPorProyecto);

export default router;
