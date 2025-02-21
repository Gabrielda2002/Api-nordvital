import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import { authorizeRoles } from "../middlewares/authorize-roles";
import { createTicket, deleteTicket, getAllTickets, getTicketById, updateTicket } from "../controllers/tickets_controller";
import { validarId } from "../middlewares/validar-id";

const router = Router();

router.get('/tickets', authenticate, authorizeRoles(['1']), getAllTickets)

router.get('/tickets/:id', authenticate, authorizeRoles(['1']), validarId, getTicketById)

router.post('/tickets', authenticate, authorizeRoles(['1']), createTicket)

router.put('/tickets/:id', authenticate, authorizeRoles(['1']), validarId, updateTicket)

router.delete('/tickets/:id', authenticate, authorizeRoles(['1']), validarId, deleteTicket)

export default router;