import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import { authorizeRoles } from "../middlewares/authorize-roles";
import { createEvent, deleteEvent, getAllEvents, getEventById, updateEvent } from "../controllers/eventos_controller";
import { validarId } from "../middlewares/validar-id";

const router = Router();

router.get("/eventos", authenticate, authorizeRoles(['1']), getAllEvents )

router.get("/evento/:id", authenticate, authorizeRoles(['1']),validarId, getEventById )

router.post("/eventos", authenticate, authorizeRoles(['1']), createEvent )

router.put("/eventos/:id", authenticate, authorizeRoles(['1']),validarId, updateEvent )

router.delete("/eventos/:id", authenticate, authorizeRoles(['1']),validarId, deleteEvent )

export default router;