import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import { authorizeRoles } from "../middlewares/authorize-roles";
import { createParticipant, getAllParticipants } from "../controllers/participantes_controller";

const router = Router();

router.get('/participants', authenticate, authorizeRoles(['1']), getAllParticipants);

router.post('/participants', authenticate, authorizeRoles(['1']), createParticipant);

export default router;