import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import { authorizeRoles } from "../middlewares/authorize-roles";
import { creatAuditRequestLetter, createRecoveryLetter, createRequestLetter, deleteRecoveryLetter, getAllRecoveryLetter, getRecoveryLetterById, getRequestLetter, getResponseLetter, updateRecoveryLetter } from "../controllers/carta-recobro_controller";

const router = Router();

router.get("/recover-letter", authenticate, authorizeRoles(["1"]), getAllRecoveryLetter)

router.get("/recover-letter/:id", authenticate, authorizeRoles(["1"]), getRecoveryLetterById)

router.post("/recover-letter", authenticate, authorizeRoles(["1"]), createRecoveryLetter)

router.put("/recover-letter/:id", authenticate, authorizeRoles(["1"]), updateRecoveryLetter)

router.delete("/recover-letter/:id", authenticate, authorizeRoles(["1"]), deleteRecoveryLetter)

router.get("/table-request-letter", authenticate, authorizeRoles(["1"]), getRequestLetter)

router.get("/table-response-letter", authenticate, authorizeRoles(["1"]), getResponseLetter)

router.post("/create-request-letter", authenticate, authorizeRoles(["1"]), createRequestLetter)

router.put("/update-request-letter/:id", authenticate, authorizeRoles(["1"]), creatAuditRequestLetter)

export default router;