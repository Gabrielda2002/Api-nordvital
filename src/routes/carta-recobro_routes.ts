import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import { authorizeRoles } from "../middlewares/authorize-roles";
import { createRecoveryLetter, deleteRecoveryLetter, getAllRecoveryLetter, getRecoveryLetterById, getRequestLatter, getResponseLatter, updateRecoveryLetter } from "../controllers/carta-recobro_controller";

const router = Router();

router.get("/tabla-recobro", authenticate, authorizeRoles(["1"]), getAllRecoveryLetter)

router.get("/tabla-recobro/:id", authenticate, authorizeRoles(["1"]), getRecoveryLetterById)

router.post("/tabla-recobro", authenticate, authorizeRoles(["1"]), createRecoveryLetter)

router.put("/tabla-recobro/:id", authenticate, authorizeRoles(["1"]), updateRecoveryLetter)

router.delete("/tabla-recobro/:id", authenticate, authorizeRoles(["1"]), deleteRecoveryLetter)

router.get("/tabla-recobro-solicitar", authenticate, authorizeRoles(["1"]), getRequestLatter)

router.get("/tabla-recobro-auditar", authenticate, authorizeRoles(["1"]), getResponseLatter)

export default router;