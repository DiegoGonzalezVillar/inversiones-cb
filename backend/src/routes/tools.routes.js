import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { execFile } from "child_process";

import { authRequired } from "../middlewares/auth.middleware.js";
import { requireAdmin } from "../middlewares/role.middleware.js";

const router = Router();

const tmpDir = path.resolve("tmp");
if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, tmpDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `upload_${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15 MB
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== ".xls" && ext !== ".xlsx") {
      return cb(new Error("Solo se permiten archivos .xls o .xlsx"));
    }
    cb(null, true);
  },
});

router.post(
  "/xls-to-txt",
  authRequired,
  requireAdmin,
  upload.single("file"),
  (req, res) => {
    if (!req.file) return res.status(400).json({ error: "Archivo requerido" });

    const inputPath = req.file.path;
    const outputPath = path.join(tmpDir, `output_${Date.now()}.txt`);
    const scriptPath = path.resolve("scripts", "convert.py");

    execFile(
      "python3",
      [scriptPath, inputPath, outputPath],
      { timeout: 60_000 },
      (err, stdout, stderr) => {
        if (err) {
          console.error("PY ERROR:", err);
          console.error("STDERR:", stderr);

          try {
            fs.unlinkSync(inputPath);
          } catch {}
          return res.status(500).json({ error: "Error procesando archivo" });
        }

        res.download(outputPath, "asiento_completo.txt", (downloadErr) => {
          try {
            fs.unlinkSync(inputPath);
          } catch {}
          try {
            fs.unlinkSync(outputPath);
          } catch {}

          if (downloadErr) console.error("Download error:", downloadErr);
        });
      }
    );
  }
);

export default router;
