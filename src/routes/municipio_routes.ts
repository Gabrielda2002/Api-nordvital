import { Router } from "express";
import { createMunicipio, deleteMunicipio, getAllMunicipios, getMunicipioById, updateMunicipio, updateStatusMunicipio } from "../controllers/municipio.controller";
import { validarId } from "../middlewares/validate-type-id.middleware";
import { Municipio } from "../entities/municipio";
import { authorizeRoles } from "../middlewares/authorize-roles.middleware";
import { authenticate } from "../middlewares/authenticate.middleware";

const router = Router();

/**
 * @swagger
 * /municipios:
 *   get:
 *     summary: Obtiene todos los municipios
 *     tags: [Municipios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de municipios obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Municipio'
 *       401:
 *         description: No autorizado - Token inválido o expirado
 *       403:
 *         description: Prohibido - No tiene permisos suficientes
 */
router.get('/municipios', authenticate, authorizeRoles(['1', '2']), getAllMunicipios);

/**
 * @swagger
 * /municipios/{id}:
 *   get:
 *     summary: Obtiene un municipio por ID
 *     tags: [Municipios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID numérico del municipio
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Municipio encontrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Municipio'
 *       401:
 *         description: No autorizado - Token inválido o expirado
 *       403:
 *         description: Prohibido - No tiene permisos suficientes
 *       404:
 *         description: Municipio no encontrado
 */
router.get('/municipios/:id', authenticate, authorizeRoles(['1', '2']), validarId, getMunicipioById);

/**
 * @swagger
 * /municipios:
 *   post:
 *     summary: Crea un nuevo municipio
 *     tags: [Municipios]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, code]
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre del municipio
 *                 minLength: 3
 *                 maxLength: 50
 *               code:
 *                 type: integer
 *                 description: Código del municipio
 *                 minimum: 1
 *     responses:
 *       200:
 *         description: Municipio creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Municipio'
 *       400:
 *         description: Datos inválidos en la solicitud
 *       401:
 *         description: No autorizado - Token inválido o expirado
 *       403:
 *         description: Prohibido - No tiene permisos suficientes
 */
router.post('/municipios', authenticate, authorizeRoles(['1', '2']), createMunicipio);

/**
 * @swagger
 * /municipios/{id}:
 *   put:
 *     summary: Actualiza un municipio existente
 *     tags: [Municipios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID numérico del municipio a actualizar
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre del municipio
 *                 minLength: 3
 *                 maxLength: 50
 *               code:
 *                 type: integer
 *                 description: Código del municipio
 *                 minimum: 1
 *               status:
 *                 type: boolean
 *                 description: Estado del municipio
 *     responses:
 *       200:
 *         description: Municipio actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Municipio'
 *       400:
 *         description: Datos inválidos en la solicitud
 *       401:
 *         description: No autorizado - Token inválido o expirado
 *       403:
 *         description: Prohibido - No tiene permisos suficientes
 *       404:
 *         description: Municipio no encontrado
 */
router.put('/municipios/:id', authenticate, authorizeRoles(['1', '2']), validarId, updateMunicipio);

/**
 * @swagger
 * /municipios/{id}:
 *   delete:
 *     summary: Elimina un municipio
 *     tags: [Municipios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID numérico del municipio a eliminar
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Municipio eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Municipio deleted"
 *       401:
 *         description: No autorizado - Token inválido o expirado
 *       403:
 *         description: Prohibido - No tiene permisos suficientes
 *       404:
 *         description: Municipio no encontrado
 */
router.delete('/municipios/:id', authenticate, authorizeRoles(['1']), validarId, deleteMunicipio);

/**
 * @swagger
 * /update-status-municipio/{id}:
 *   put:
 *     summary: Actualiza el estado de un municipio
 *     tags: [Municipios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID numérico del municipio
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: ['0', '1']
 *                 description: Estado del municipio (0 = inactivo, 1 = activo)
 *     responses:
 *       200:
 *         description: Estado del municipio actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Municipio'
 *       400:
 *         description: Datos inválidos en la solicitud
 *       401:
 *         description: No autorizado - Token inválido o expirado
 *       403:
 *         description: Prohibido - No tiene permisos suficientes
 *       404:
 *         description: Municipio no encontrado
 */
router.put("/update-status-municipio/:id", authenticate, authorizeRoles(['1']), validarId, updateStatusMunicipio);

export default router;