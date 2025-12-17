import { Router } from "express";
import {
  listarEmpresas,
  crearEmpresa,
} from "../controllers/empresas.controller.js";

const router = Router();

// GET /empresas
router.get("/", listarEmpresas);

// POST /empresas
router.post("/", crearEmpresa);

export default router;
