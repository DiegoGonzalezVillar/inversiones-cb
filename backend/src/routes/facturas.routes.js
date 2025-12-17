import { Router } from "express";
import {
  listarFacturas,
  crearFactura,
} from "../controllers/facturas.controller.js";

const router = Router();

// GET /facturas
router.get("/", listarFacturas);

// POST /facturas
router.post("/", crearFactura);

export default router;
