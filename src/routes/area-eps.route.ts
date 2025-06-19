import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import { authorizeRoles } from "../middlewares/authorize-roles";
import {
  getAllAreaEps,
  getAreaEpsByName,
} from "../controllers/area-eps.controller";

const router = Router();

router.get(
  "/area-eps/demanda-inducida",
  authenticate,
  authorizeRoles(["1"]),
  getAllAreaEps
);

router.post(
  "/area-eps/demanda-inducida/buscar",
  authenticate,
  authorizeRoles(["1"]),
  getAreaEpsByName
);


export default router;
