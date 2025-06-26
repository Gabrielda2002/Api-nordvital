import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import { authorizeRoles } from "../middlewares/authorize-roles";
import {
  createProfesionales,
  getProfesionalByName,
} from "../controllers/profesionales.controller";

const router = Router();

router.post(
  "/profesionales/buscar",
  authenticate,
  authorizeRoles(["1", "3", "10", "15", "6"]),
  getProfesionalByName
);

router.post(
  "/profesionales",
  authenticate,
  authorizeRoles(["1", "3", "10", "15", "6"]),
  createProfesionales
);

export default router;
