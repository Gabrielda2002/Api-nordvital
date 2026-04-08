import { Router } from "express";
import { authenticate } from "@core/middlewares/authenticate.middleware";
import { authorizeRoles } from "@core/middlewares/authorize-roles.middleware";
import { validarId } from "@core/middlewares/validate-type-id.middleware";
import { createTelevisor, getTelevisorBySedeId, getTvAgeByHeadquarter, getTvHeadquartersDistribution, getTvWarrantyStatistics, searchTv, updateTelevisor } from "../controllers/televisor.controller";

const router = Router();

/**
 * @swagger
    * /tv/inventory/sede/{id}:
 *   get:
 *     summary: Obtener televisores por ID de sede
 *     tags: [Televisores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la sede
 *     responses:
 *       200:
 *         description: Lista de televisores por sede
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: ID del televisor
 *                   name:
 *                     type: string
 *                     description: Nombre del televisor
 *                   location:
 *                     type: string
 *                     description: Ubicación del televisor
 *                   brand:
 *                     type: string
 *                     description: Marca del televisor
 *                   model:
 *                     type: string
 *                     description: Modelo del televisor
 *                   serial:
 *                     type: string
 *                     description: Número de serie
 *                   status:
 *                     type: string
 *                     description: Estado del televisor
 *                   responsableName:
 *                     type: string
 *                     description: Nombre del responsable
 *       404:
 *         description: No se encontraron televisores para esta sede
 *       500:
 *         description: Error interno del servidor
 */
router.get('/sede/:id', authenticate, authorizeRoles(['1', '4', '2', '17']), validarId, getTelevisorBySedeId);

/**
 * @swagger
 * /tv/inventory:
 *   post:
 *     summary: Crear un nuevo televisor
 *     tags: [Televisores]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - location
 *               - brand
 *               - model
 *               - serial
 *               - pulgadas
 *               - screenType
 *               - smartTv
 *               - resolution
 *               - sedeId
 *             properties:
 *               sedeId:
 *                 type: integer
 *                 description: ID de la sede
 *               name:
 *                 type: string
 *                 description: Nombre del televisor
 *               location:
 *                 type: string
 *                 description: Ubicación del televisor
 *               brand:
 *                 type: string
 *                 description: Marca del televisor
 *               model:
 *                 type: string
 *                 description: Modelo del televisor
 *               serial:
 *                 type: string
 *                 description: Número de serie
 *               pulgadas:
 *                 type: integer
 *                 description: Tamaño en pulgadas
 *               screenType:
 *                 type: string
 *                 description: Tipo de pantalla
 *               smartTv:
 *                 type: boolean
 *                 description: Indica si es Smart TV
 *               operativeSystem:
 *                 type: string
 *                 description: Sistema operativo (para Smart TVs)
 *               addressIp:
 *                 type: string
 *                 description: Dirección IP
 *               mac:
 *                 type: string
 *                 description: Dirección MAC
 *               resolution:
 *                 type: string
 *                 description: Resolución de pantalla
 *               warranty:
 *                 type: boolean
 *                 description: Estado de garantía
 *               purchaseDate:
 *                 type: string
 *                 format: date
 *                 description: Fecha de compra
 *               warrantyTime:
 *                 type: string
 *                 description: Tiempo de garantía
 *               inventoryNumber:
 *                 type: string
 *                 description: Número de inventario
 *               status:
 *                 type: string
 *                 description: Estado del televisor
 *               controlRemote:
 *                 type: boolean
 *                 description: Indica si tiene control remoto
 *               utility:
 *                 type: string
 *                 description: Utilidad del televisor
 *     responses:
 *       201:
 *         description: Televisor creado con éxito
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Televisor'
 *       400:
 *         description: Datos inválidos
 *       500:
 *         description: Error interno del servidor
 */
router.post('/', authenticate, authorizeRoles(['1']), createTelevisor);

/**
 * @swagger
 * /tv/inventory/{id}:
 *   put:
 *     summary: Actualizar un televisor existente
 *     tags: [Televisores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del televisor
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre del televisor
 *               location:
 *                 type: string
 *                 description: Ubicación del televisor
 *               brand:
 *                 type: string
 *                 description: Marca del televisor
 *               model:
 *                 type: string
 *                 description: Modelo del televisor
 *               serial:
 *                 type: string
 *                 description: Número de serie
 *               pulgadas:
 *                 type: integer
 *                 description: Tamaño en pulgadas
 *               screenType:
 *                 type: string
 *                 description: Tipo de pantalla
 *               status:
 *                 type: string
 *                 description: Estado del televisor
 *     responses:
 *       200:
 *         description: Televisor actualizado con éxito
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Televisor'
 *       404:
 *         description: Televisor no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.put('/:id', authenticate, authorizeRoles(['1']), validarId, updateTelevisor);

/**
 * @swagger
 * /tv/inventory/statics/headquarters:
 *   get:
 *     summary: Obtener estadísticas de televisores por sede
 *     tags: [Televisores]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estadísticas de televisores por sede
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   sedeName:
 *                     type: string
 *                     description: Nombre de la sede
 *                   count:
 *                     type: string
 *                     description: Cantidad de televisores
 *       404:
 *         description: No se encontraron datos
 *       500:
 *         description: Error interno del servidor
 */
router.get('/statics/headquarters/:id', authenticate, authorizeRoles(['1', '2', '17']), validarId, getTvHeadquartersDistribution);

/**
 * @swagger
 * /tv/inventory/statics/age:
 *   get:
 *     summary: Obtener estadísticas de antigüedad de televisores
 *     tags: [Televisores]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estadísticas de antigüedad de televisores
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 distribution:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       label:
 *                         type: string
 *                         description: Rango de antigüedad
 *                       value:
 *                         type: integer
 *                         description: Cantidad de televisores en ese rango
 *                 averageAge:
 *                   type: object
 *                   properties:
 *                     days:
 *                       type: integer
 *                       description: Promedio de antigüedad en días
 *                     months:
 *                       type: integer
 *                       description: Promedio de antigüedad en meses
 *                     years:
 *                       type: string
 *                       description: Promedio de antigüedad en años
 *       500:
 *         description: Error interno del servidor
 */
router.get('/statics/age/:id', authenticate, authorizeRoles(['1', '2', '17']),validarId, getTvAgeByHeadquarter);

/**
 * @swagger
 * /tv/inventory/statics/warrantyExpiration:
 *   get:
 *     summary: Obtener estadísticas de expiración de garantía de televisores
 *     tags: [Televisores]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estadísticas de garantía de televisores
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   description: Total de televisores
 *                 inWarranty:
 *                   type: integer
 *                   description: Cantidad de televisores en garantía
 *                 percentage:
 *                   type: number
 *                   description: Porcentaje de televisores en garantía
 *       500:
 *         description: Error interno del servidor
 */
router.get('/statics/warrantyExpiration/:id', authenticate, authorizeRoles(['1', '2', '17']), validarId, getTvWarrantyStatistics);

/**
 * @swagger
 * /tv/inventory/search:
 *   get:
 *     summary: Búsqueda global de televisores
 *     tags: [Televisores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         required: true
 *         description: Término de búsqueda (mínimo 2 caracteres)
 *     responses:
 *       200:
 *         description: Televisores encontrados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   item:
 *                     $ref: '#/components/schemas/Televisor'
 *                   departmentId:
 *                     type: integer
 *                     description: ID del departamento
 *                   departmentRelationName:
 *                     type: string
 *                     description: Nombre del departamento
 *                   sedeName:
 *                     type: string
 *                     description: Nombre de la sede
 *                   sedeId:
 *                     type: integer
 *                     description: ID de la sede
 *       400:
 *         description: Consulta inválida
 *       404:
 *         description: No se encontraron televisores
 *       500:
 *         description: Error interno del servidor
 */
router.get('/search', authenticate, authorizeRoles(['1', '2', '17']), searchTv);

export default router;