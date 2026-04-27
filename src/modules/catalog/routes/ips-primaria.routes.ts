import { Router } from "express";
import { createIpsPrimaria, deleteIpsPrimaria, getAllIpsPrimaria, getIpsPrimaria, getIpsPrimariaByName, updateIpsPrimaria, updateStatusIpsPrimaria } from "../controllers/ips-primaria.controller";
import { validarId } from "@core/middlewares/validate-type-id.middleware";
import { authorizeRoles } from "@core/middlewares/authorize-roles.middleware";
import { authenticate } from "@core/middlewares/authenticate.middleware";
import { ROLE_IDS, ROLE_GROUPS } from "@core/constants/roles";


const router = Router();

/**
 * @swagger
 * /ips-primaria:
 *   get:
 *     summary: Obtiene todas las IPS primarias
 *     tags: [IPS Primaria]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de IPS primarias
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   status:
 *                     type: boolean
 *       401:
 *         description: No autorizado
 */
router.get('/ips-primaria',authenticate, authorizeRoles(ROLE_GROUPS.RADICACION_NURSING), getAllIpsPrimaria);

/**
 * @swagger
 * /ips-primaria/{id}:
 *   get:
 *     summary: Obtiene una IPS primaria por ID
 *     tags: [IPS Primaria]
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
 *         description: IPS primaria encontrada
 *       404:
 *         description: IPS primaria no encontrada
 */
router.get('/ips-primaria/:id',authenticate, authorizeRoles(ROLE_GROUPS.MANAGEMENT),validarId ,getIpsPrimaria);

/**
 * @swagger
 * /ips-primaria:
 *   post:
 *     summary: Crea una nueva IPS primaria
 *     tags: [IPS Primaria]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *             required:
 *               - name
 *     responses:
 *       200:
 *         description: IPS primaria creada
 *       400:
 *         description: Error en los datos proporcionados
 */
router.post('/ips-primaria',authenticate, authorizeRoles(ROLE_GROUPS.MANAGEMENT),createIpsPrimaria);

/**
 * @swagger
 * /ips-primaria/{id}:
 *   put:
 *     summary: Actualiza una IPS primaria
 *     tags: [IPS Primaria]
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
 *               status:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: IPS primaria actualizada
 *       404:
 *         description: IPS primaria no encontrada
 */
router.put('/ips-primaria/:id',authenticate, authorizeRoles(ROLE_GROUPS.MANAGEMENT), validarId ,updateIpsPrimaria);

/**
 * @swagger
 * /ips-primaria/{id}:
 *   delete:
 *     summary: Elimina una IPS primaria
 *     tags: [IPS Primaria]
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
 *         description: IPS primaria eliminada
 *       404:
 *         description: IPS primaria no encontrada
 */
router.delete('/ips-primaria/:id',authenticate, authorizeRoles([ROLE_IDS.ADMINISTRADOR]),validarId ,deleteIpsPrimaria);

/**
 * @swagger
 * /ips-primaria-name:
 *   post:
 *     summary: Busca IPS primarias por nombre
 *     tags: [IPS Primaria]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: IPS primarias encontradas
 *       404:
 *         description: No se encontraron IPS primarias
 */
router.post('/ips-primaria-name',authenticate, authorizeRoles(ROLE_GROUPS.MANAGEMENT), getIpsPrimariaByName);

/**
 * @swagger
 * /update-status-ips-primaria/{id}:
 *   put:
 *     summary: Actualiza el estado de una IPS primaria
 *     tags: [IPS Primaria]
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
 *               status:
 *                 type: string
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Estado de IPS primaria actualizado
 *       404:
 *         description: IPS primaria no encontrada
 */
router.put('/update-status-ips-primaria/:id',authenticate, authorizeRoles(ROLE_GROUPS.MANAGEMENT), validarId, updateStatusIpsPrimaria);

export default router;