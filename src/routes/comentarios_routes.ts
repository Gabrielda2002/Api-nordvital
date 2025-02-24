import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import { authorizeRoles } from "../middlewares/authorize-roles";
import { createComment, deleteComment, getAllComments, getCommentById, updateComment } from "../controllers/comentarios_controller";
import { validarId } from "../middlewares/validar-id";

const router = Router();

router.get('/comentarios', authenticate, authorizeRoles(['1']), getAllComments);

router.get('/comentarios/:id', authenticate, authorizeRoles(['1']),validarId ,getCommentById);

router.post('/comentarios', authenticate, authorizeRoles(['1']), createComment);

router.put('/comentarios/:id', authenticate, authorizeRoles(['1']),validarId , updateComment);

router.delete('/comentarios/:id', authenticate, authorizeRoles(['1']),validarId , deleteComment);

export default router;