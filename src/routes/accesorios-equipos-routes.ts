import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import { authorizeRoles } from "../middlewares/authorize-roles";
import { createAccessory, deleteAccessory, getAccessory, getAllAccessories, updateAccessory } from "../controllers/accesorios-equipos_controller";

const router = Router();

router.get("/accesorios-equipos", authenticate, authorizeRoles(['1']), getAllAccessories);

router.get("/accesorios-equipos/:id", authenticate, authorizeRoles(['1']), getAccessory);

router.post("/accesorios-equipos", authenticate, authorizeRoles(['1']), createAccessory);

router.put("/accesorios-equipos/:id", authenticate, authorizeRoles(['1']), updateAccessory);

router.delete("/accesorios-equipos/:id", authenticate, authorizeRoles(['1']), deleteAccessory);

export default router;