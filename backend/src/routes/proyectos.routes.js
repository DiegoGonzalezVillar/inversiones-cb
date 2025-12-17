import { Router } from "express";
import {
  listarProyectos,
  crearProyecto,
} from "../controllers/proyectos.controller.js";

const router = Router();

// GET /proyectos
router.get("/", listarProyectos);

// POST /proyectos
router.post("/", crearProyecto);

export default router;
