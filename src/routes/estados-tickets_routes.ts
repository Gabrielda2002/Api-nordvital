import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import { authorizeRoles } from "../middlewares/authorize-roles";
import { createStatusTicket, deleteStatusTicket, getAllStatusTickets, getStatusTicketById, updateStatusTicket } from "../controllers/estados-tickets_controller";
import { validarId } from "../middlewares/validar-id";

const router = Router()

router.get('/estados-tickets', authenticate, authorizeRoles, getAllStatusTickets);

router.get('/estados-tickets/:id', authenticate, authorizeRoles,validarId ,getStatusTicketById);

router.post('/estados-tickets', authenticate, authorizeRoles, createStatusTicket);

router.put('/estados-tickets/:id', authenticate, authorizeRoles, validarId, updateStatusTicket);

router.delete('/estados-tickets/:id', authenticate, authorizeRoles, validarId, deleteStatusTicket);

export default router;