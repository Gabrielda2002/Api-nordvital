import { Router } from "express";
import { authenticate } from "../middlewares/authenticate.middleware";
import { authorizeRoles } from "../middlewares/authorize-roles.middleware";
import { createServicioGeneral, deleteServicioGeneral, getServicioContratado, getServicioGeneral, getServicioGeneralById, updateServicioGeneral } from "../controllers/servicios-generales.controller";
import { validarId } from "../middlewares/validate-type-id.middleware";

const router = Router();

/**
 * @swagger
 * /servicios-generales:
 *   get:
 *     summary: Obtener todos los servicios generales
 *     tags: [Servicios Generales]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de servicios generales obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ServiciosGenerales'
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado
 *       500:
 *         description: Error del servidor
 */
router.get('/servicios-generales', authenticate, authorizeRoles(['1']), getServicioGeneral);

/**
 * @swagger
 * /servicios-generales/{id}:
 *   get:
 *     summary: Obtener un servicio general por ID
 *     tags: [Servicios Generales]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del servicio general
 *     responses:
 *       200:
 *         description: Servicio general obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServiciosGenerales'
 *       404:
 *         description: Servicio no encontrado
 */
router.get('/servicios-generales/:id', authenticate, authorizeRoles(['1']), validarId, getServicioGeneralById);

/**
 * @swagger
 * /servicios-generales:
 *   post:
 *     summary: Crear un nuevo servicio general
 *     tags: [Servicios Generales]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *               - description
 *             properties:
 *               code:
 *                 type: string
 *                 description: Código del servicio general
 *               description:
 *                 type: string
 *                 description: Descripción del servicio general
 *     responses:
 *       201:
 *         description: Servicio creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServiciosGenerales'
 *       400:
 *         description: Datos inválidos
 */
router.post('/servicios-generales', authenticate, authorizeRoles(['1']), createServicioGeneral);

/**
 * @swagger
 * /servicios-generales/{id}:
 *   put:
 *     summary: Actualizar un servicio general
 *     tags: [Servicios Generales]
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
 *               code:
 *                 type: string
 *                 description: Código del servicio general
 *               description:
 *                 type: string
 *                 description: Descripción del servicio general
 *     responses:
 *       200:
 *         description: Servicio actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServiciosGenerales'
 *       404:
 *         description: Servicio no encontrado
 */
router.put('/servicios-generales/:id', authenticate, authorizeRoles(['1']), validarId, updateServicioGeneral);

/**
 * @swagger
 * /servicios-generales/{id}:
 *   delete:
 *     summary: Eliminar un servicio general
 *     tags: [Servicios Generales]
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
 *         description: Servicio eliminado exitosamente
 *       404:
 *         description: Servicio no encontrado
 */
router.delete('/servicios-generales/:id', authenticate, authorizeRoles(['1']), validarId, deleteServicioGeneral);

/**
 * @swagger
 * /servicios-generales/contratados:
 *   post:
 *     summary: Consulta servicios contratados por código
 *     tags: [Servicios Generales]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *             properties:
 *               code:
 *                 type: string
 *                 description: Código del servicio a consultar
 *     responses:
 *       200:
 *         description: Lista de servicios contratados encontrados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: ID del servicio o N/A
 *                   code:
 *                     type: string
 *                     description: Código del servicio o N/A
 *                   description:
 *                     type: string
 *                     description: Descripción del servicio o N/A
 *                   Relations:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         nameConvenio:
 *                           type: string
 *                           description: Nombre del convenio
 *                         nameSede:
 *                           type: string
 *                           description: Nombre de la sede
 *                         isContrated:
 *                           type: boolean
 *                           description: Indica si está contratado
 *       404:
 *         description: Servicio no encontrado
 *       500:
 *         description: Error del servidor
 */
router.post("/servicio-contratado", authenticate, authorizeRoles(['1','2','3','4','5','6','10','11','12','13','14','15','16', '17', '18']), getServicioContratado);

export default router;