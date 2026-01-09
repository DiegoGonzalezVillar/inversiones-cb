import { Router } from "express";
import {
  listarProyectos,
  crearProyecto,
  listarProyectosPorEmpresa,
} from "../controllers/proyectos.controller.js";

const router = Router();

// GET /proyectos
router.get("/", listarProyectos);

// POST /proyectos
router.post("/", crearProyecto);

router.get("/empresa/:empresaId", listarProyectosPorEmpresa);

export default router;
