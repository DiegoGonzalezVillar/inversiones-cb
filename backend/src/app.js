import express from "express";
import cors from "cors";
import empresasRoutes from "./routes/empresas.routes.js";
import proyectosRoutes from "./routes/proyectos.routes.js";
import facturasRoutes from "./routes/facturas.routes.js";
import pagosRoutes from "./routes/pagos.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/empresas", empresasRoutes);
app.use("/proyectos", proyectosRoutes);
app.use("/facturas", facturasRoutes);
app.use("/pagos", pagosRoutes);

export default app;
