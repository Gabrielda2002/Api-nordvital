import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import { authorizeRoles } from "../middlewares/authorize-roles";
import { createCategory, deleteCategory, getAllCategories, getCategoryById, updateCategory } from "../controllers/categorias_controller";
import { validarId } from "../middlewares/validar-id";

const router = Router();

router.get('/categorias', authenticate, authorizeRoles(['1']), getAllCategories);

router.get('/categorias/:id', authenticate, authorizeRoles(['1']),validarId ,getCategoryById);

router.post('/categorias', authenticate, authorizeRoles(['1']), createCategory);

router.put('/categorias/:id', authenticate, authorizeRoles(['1']),validarId ,updateCategory);

router.delete('/categorias/:id', authenticate, authorizeRoles(['1']),validarId ,deleteCategory);

export default router;