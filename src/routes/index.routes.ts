import { Router } from "express";
import modulesRoutes from "../modules";

const router = Router();

router.use(modulesRoutes);

export default router;
