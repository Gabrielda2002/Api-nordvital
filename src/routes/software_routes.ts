import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import { authorizeRoles } from "../middlewares/authorize-roles";
import { validarId } from "../middlewares/validar-id";
import { createSoftware, deleteSoftware, getAllSoftware, getSoftware, updateSoftware } from "../controllers/software_controller";

const router = Router();

router.get("/software", authenticate, authorizeRoles(["1"]), getAllSoftware);

router.get("/software/:id", authenticate, authorizeRoles(["1"]),validarId , getSoftware);

router.post("/software", authenticate, authorizeRoles(["1"]), createSoftware);

router.put("/software/:id", authenticate, authorizeRoles(["1"]), validarId, updateSoftware);

router.delete("/software/:id", authenticate, authorizeRoles(["1"]), validarId, deleteSoftware);

export default router;