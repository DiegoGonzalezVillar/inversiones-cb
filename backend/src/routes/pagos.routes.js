import { Router } from "express";
import { crearPago } from "../controllers/pagos.controller.js";

const router = Router();

// POST /pagos
router.post("/", crearPago);

export default router;
