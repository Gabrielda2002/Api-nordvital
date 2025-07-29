import { Router } from 'express';
import { authenticate } from '../middlewares/auth';
import { authorizeRoles } from '../middlewares/authorize-roles';
import { getAllAreaPerson, getAreaPersonByName } from '../controllers/area-persona-seguimiento.controller';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     AreaPersonaSeguimiento:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID del área persona seguimiento
 *         name:
 *           type: string
 *           description: Nombre del área persona seguimiento
 */

/**
 * @swagger
 * /area-persona/demanda-inducida:
 *   get:
 *     summary: Obtiene todas las áreas persona para demanda inducida
 *     security:
 *       - bearerAuth: []
 *     tags: [Area Persona Seguimiento]
 *     responses:
 *       200:
 *         description: Lista de áreas persona seguimiento
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AreaPersonaSeguimiento'
 *       404:
 *         description: Area Person not found
 */
router.get('/area-persona/demanda-inducida', authenticate, authorizeRoles(['1']), getAllAreaPerson);

/**
 * @swagger
 * /area-persona/demanda-inducida/buscar:
 *   post:
 *     summary: Busca áreas persona por nombre
 *     security:
 *       - bearerAuth: []
 *     tags: [Area Persona Seguimiento]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre del área persona a buscar (usar "@" para obtener primeros 100 registros)
 *     responses:
 *       200:
 *         description: Áreas persona encontradas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AreaPersonaSeguimiento'
 *       404:
 *         description: Area Person not found
 */
router.post('/area-persona/demanda-inducida/buscar', authenticate, authorizeRoles(['1', '19', '20']), getAreaPersonByName);

export default router;