import { Router } from "express";
import { createIpsRemite, deleteIpsRemite, getAllIpsRemite, getIpsRemite, getIpsRemiteByName, updateIpsRemite, updateStatusIpsRemite } from "../controllers/ips-remite.controller";
import { validarId } from "../middlewares/validate-type-id.middleware";
import { authorizeRoles } from "../middlewares/authorize-roles.middleware";
import { authenticate } from "../middlewares/authenticate.middleware";

const router = Router();

/**
 * @swagger
 * /ips-remite:
 *   get:
 *     summary: Obtiene todas las IPS Remite
 *     tags: [IPS Remite]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de IPS Remite
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/IpsRemite'
 */
router.get("/ips-remite", authenticate, authorizeRoles(['1']), getAllIpsRemite);

/**
 * @swagger
 * /ips-remite/{id}:
 *   get:
 *     summary: Obtiene una IPS Remite por ID
 *     tags: [IPS Remite]
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
 *         description: IPS Remite encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/IpsRemite'
 *       404:
 *         description: IPS Remite no encontrada
 */
router.get("/ips-remite/:id", authenticate, authorizeRoles(['1', '2']), validarId, getIpsRemite);

/**
 * @swagger
 * /ips-remite:
 *   post:
 *     summary: Crea una nueva IPS Remite
 *     tags: [IPS Remite]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: IPS Remite creada
 *       400:
 *         description: Error en la creación
 */
router.post("/ips-remite", authenticate, authorizeRoles(['1', '2']), createIpsRemite);


/**
 * @swagger
 * /ips-remite/{id}:
 *   put:
 *     summary: Actualiza una IPS Remite
 *     tags: [IPS Remite]
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
 *         description: IPS Remite actualizada
 *       404:
 *         description: IPS Remite no encontrada
 */
router.put("/ips-remite/:id", authenticate, authorizeRoles(['1', '2']), validarId, updateIpsRemite);


/**
 * @swagger
 * /ips-remite/{id}:
 *   delete:
 *     summary: Elimina una IPS Remite
 *     tags: [IPS Remite]
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
 *         description: IPS Remite eliminada
 *       404:
 *         description: IPS Remite no encontrada
 */
router.delete("/ips-remite/:id", authenticate, authorizeRoles(['1']), validarId, deleteIpsRemite);

/**
 * @swagger
 * /ips-remite-name:
 *   post:
 *     summary: Busca IPS Remite por nombre
 *     tags: [IPS Remite]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: IPS Remite encontradas
 *       404:
 *         description: No se encontraron resultados
 */
router.post("/ips-remite-name", authenticate, authorizeRoles(['1', '3','10', '15', '6']), getIpsRemiteByName);

/**
 * @swagger
 * /update-status-ips-remite/{id}:
 *   put:
 *     summary: Actualiza el estado de una IPS Remite
 *     tags: [IPS Remite]
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
 *         description: Estado actualizado
 *       404:
 *         description: IPS Remite no encontrada
 */
router.put("/update-status-ips-remite/:id", authenticate, authorizeRoles(['1', '2']), validarId, updateStatusIpsRemite);

export default router;