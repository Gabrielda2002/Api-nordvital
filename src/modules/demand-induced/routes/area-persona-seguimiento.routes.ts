import { Router } from 'express';
import { authenticate } from '@core/middlewares/authenticate.middleware';
import { authorizeRoles } from '@core/middlewares/authorize-roles.middleware';
import { ROLE_IDS, ROLE_GROUPS } from "@core/constants/roles";
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
router.get('/area-persona/demanda-inducida', authenticate, authorizeRoles([ROLE_IDS.ADMINISTRADOR]), getAllAreaPerson);

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
router.post('/area-persona/demanda-inducida/buscar', authenticate, authorizeRoles(ROLE_GROUPS.ADMIN_NURSING), getAreaPersonByName);

export default router;