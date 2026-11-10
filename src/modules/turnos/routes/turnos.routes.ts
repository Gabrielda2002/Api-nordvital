import { Router } from "express";
import turnosPublicRoutes from "./turnos-public.routes";
import turnosAtencionRoutes from "./turnos-atencion.routes";
import turnosAdminRoutes from "./turnos-admin.routes";

const router = Router();

// Rutas públicas (QR, emisión móvil, ticket en vivo, TV y encuesta)
router.use("/", turnosPublicRoutes);

// Rutas de asesor (gestión de sesión y máquina de estados de atención)
router.use("/atencion", turnosAtencionRoutes);

// Rutas de administración (geocercas, módulos y métricas operativas)
router.use("/admin", turnosAdminRoutes);

export default router;

