import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import { authorizeRoles } from "../middlewares/authorize-roles";
import {
  getAllTypeDemandInduced,
  getTypeDemandInducedByName,
} from "../controllers/tipo-demanda-inducida.controller";

const router = Router();

router.get(
  "/tipo/demanda-inducida",
  authenticate,
  authorizeRoles(["1"]),
  getAllTypeDemandInduced
);

router.post(
  "/tipo/demanda-inducida/buscar",
  authenticate,
  authorizeRoles(["1"]),
  getTypeDemandInducedByName
);

export default router;