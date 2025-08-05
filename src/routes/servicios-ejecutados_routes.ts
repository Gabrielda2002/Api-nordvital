import { Router } from "express";
import { authorizeRoles } from "../middlewares/authorize-roles";
import { authenticate } from "../middlewares/auth";
import { createServiciosEjecutados, deleteServiciosEjecutados, getAllServiciosEjecutados, updateServiciosEjecutados } from "../controllers/servicios-ejecutados.controller";
import { validarId } from "../middlewares/validar-id";

const router = Router();

/**
 * @swagger
 * /servicios-ejecutados:
 *   get:
 *     summary: Obtiene todos los servicios ejecutados
 *     tags: [Servicios Ejecutados]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de servicios ejecutados obtenida exitosamente
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido - No tiene permisos
 *       500:   
 *         description: Error del servidor
 */
router.get('/servicios-ejecutados', authenticate, authorizeRoles(['1']), getAllServiciosEjecutados);

/**
 * @swagger
 * /servicios-ejecutados/{id}:
 *   get:
 *     summary: Obtiene un servicio ejecutado por ID
 *     tags: [Servicios Ejecutados]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del servicio ejecutado
 *     responses:
 *       200:
 *         description: Servicio ejecutado encontrado
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido - No tiene permisos
 *       404:
 *         description: Servicio ejecutado no encontrado
 *       500:
 *         description: Error del servidor
 */
router.get('/servicios-ejecutados/:id', authenticate, authorizeRoles(['1']), validarId, getAllServiciosEjecutados);

/**
 * @swagger
 * /servicios-ejecutados:
 *   post:
 *     summary: Crea un nuevo servicio ejecutado
 *     tags: [Servicios Ejecutados]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - idSede
 *               - idService
 *               - amount
 *               - rate
 *               - statusService
 *               - subGroup
 *               - documentType
 *               - identification
 *               - patientName
 *               - patientSex
 *               - dateBirth
 *               - riasGroup
 *               - mainDx
 *               - medicoCode
 *               - medicoName
 *               - medicoSpc
 *               - nameContract
 *               - userRegimen
 *               - authorizationNumber
 *               - orderDate
 *               - prestDate
 *               - appointmentStatus
 *               - appointmentType
 *               - userGenerated
 *               - convenio
 *               - servicePgp
 *             properties:
 *               idSede:
 *                 type: integer
 *               idService:
 *                 type: integer
 *               amount:
 *                 type: integer
 *               rate:
 *                 type: integer
 *               statusService:
 *                 type: string
 *               group:
 *                 type: string
 *               subGroup:
 *                 type: string
 *               documentType:
 *                 type: integer
 *               identification:
 *                 type: integer
 *               patientName:
 *                 type: string
 *               patientSex:
 *                 type: string
 *               dateBirth:
 *                 type: string
 *                 format: date
 *               riasGroup:
 *                 type: string
 *               mainDx:
 *                 type: string
 *               medicoCode:
 *                 type: string
 *               medicoName:
 *                 type: string
 *               medicoSpc:
 *                 type: string
 *               nameContract:
 *                 type: string
 *               userRegimen:
 *                 type: string
 *               authorizationNumber:
 *                 type: string
 *               orderDate:
 *                 type: string
 *                 format: date
 *               prestDate:
 *                 type: string
 *                 format: date
 *               appointmentStatus:
 *                 type: string
 *               appointmentType:
 *                 type: string
 *               userGenerated:
 *                 type: string
 *               convenio:
 *                 type: string
 *               servicePgp:
 *                 type: string
 *     responses:
 *       201:
 *         description: Servicio ejecutado creado exitosamente
 *       400:
 *         description: Datos inválidos en la solicitud
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido - No tiene permisos
 *       500:
 *         description: Error del servidor
 */
router.post('/servicios-ejecutados', authenticate, authorizeRoles(['1']), createServiciosEjecutados);

/**
 * @swagger
 * /servicios-ejecutados/{id}:
 *   put:
 *     summary: Actualiza un servicio ejecutado existente
 *     tags: [Servicios Ejecutados]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del servicio ejecutado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ServiciosEjecutados'
 *     responses:
 *       200:
 *         description: Servicio ejecutado actualizado exitosamente
 *       400:
 *         description: Datos inválidos en la solicitud
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido - No tiene permisos
 *       404:
 *         description: Servicio ejecutado no encontrado
 *       500:
 *         description: Error del servidor
 */
router.put('/servicios-ejecutados/:id', authenticate, authorizeRoles(['1']), validarId, updateServiciosEjecutados);

/**
 * @swagger
 * /servicios-ejecutados/{id}:
 *   delete:
 *     summary: Elimina un servicio ejecutado
 *     tags: [Servicios Ejecutados]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del servicio ejecutado
 *     responses:
 *       200:
 *         description: Servicio ejecutado eliminado exitosamente
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido - No tiene permisos
 *       404:
 *         description: Servicio ejecutado no encontrado
 *       500:
 *         description: Error del servidor
 */
router.delete('/servicios-ejecutados/:id', authenticate, authorizeRoles(['1']), validarId, deleteServiciosEjecutados);

export default router;