import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import { authorizeRoles } from "../middlewares/authorize-roles";
import { createRecoveryLetter, deleteRecoveryLetter, getAllRecoveryLetter, getRecoveryLetterById, updateRecoveryLetter } from "../controllers/tabla-recobro_controller";

const router = Router();

router.get("/tabla-recobro", authenticate, authorizeRoles(["1"]), getAllRecoveryLetter)

router.get("/tabla-recobro/:id", authenticate, authorizeRoles(["1"]), getRecoveryLetterById)

router.post("/tabla-recobro", authenticate, authorizeRoles(["1"]), createRecoveryLetter)

router.put("/tabla-recobro/:id", authenticate, authorizeRoles(["1"]), updateRecoveryLetter)

router.delete("/tabla-recobro/:id", authenticate, authorizeRoles(["1"]), deleteRecoveryLetter)

export default router;