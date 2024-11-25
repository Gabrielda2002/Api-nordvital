import { Router } from "express";
import { createMunicipio, deleteMunicipio, getAllMunicipios, getMunicipioById, updateMunicipio, updateStatusMunicipio } from "../controllers/municipio_controller";
import { validarId } from "../middlewares/validar-id";
import { Municipio } from "../entities/municipio";
import { authorizeRoles } from "../middlewares/authorize-roles";
import { authenticate } from "../middlewares/auth";

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
 *         description: Lista de municipios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Municipio'
 */
router.get('/municipios',authenticate, authorizeRoles(['1', '2']), getAllMunicipios);

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
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Municipio encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Municipio'
 *       404:
 *         description: Municipio no encontrado
 */
router.get('/municipios/:id',authenticate, authorizeRoles(['1', '2']), validarId, getMunicipioById);

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
 *             required: [name, nitMunicipio]
 *             properties:
 *               name:
 *                 type: string
 *               nitMunicipio:
 *                 type: string
 *     responses:
 *       200:
 *         description: Municipio creado
 *       400:
 *         description: Datos inválidos
 */
router.post('/municipios',authenticate, authorizeRoles(['1', '2']), createMunicipio);

/**
 * @swagger
 * /municipios/{id}:
 *   put:
 *     summary: Actualiza un municipio
 *     tags: [Municipios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
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
 *               nitMunicipio:
 *                 type: string
 *               status:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Municipio actualizado
 *       404:
 *         description: Municipio no encontrado
 */
router.put('/municipios/:id',authenticate, authorizeRoles(['1', '2']), validarId ,updateMunicipio);

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
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Municipio eliminado
 *       404:
 *         description: Municipio no encontrado
 */
router.delete('/municipios/:id',authenticate, authorizeRoles(['1']), validarId, deleteMunicipio);

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
 *     responses:
 *       200:
 *         description: Estado del municipio actualizado
 *       404:
 *         description: Municipio no encontrado
 */
router.put("/update-status-municipio/:id",authenticate, authorizeRoles(['1']), validarId, updateStatusMunicipio);

export default router;