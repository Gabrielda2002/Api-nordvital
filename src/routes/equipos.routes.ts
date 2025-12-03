import { Router } from "express";
import { authorizeRoles } from "../middlewares/authorize-roles.middleware";
import { authenticate } from "../middlewares/authenticate.middleware";
import { createEquipment, deleteEquipment, getAllEquipments, getEquipmentAgeBySede, getEquipmentBySede, getEquipmentHeadquartersDistribution, getEquipmentLockStatistics, getEquipmentTypeDistribution, getEquipmentWarrantyStatistics, searchEquipmentGlobal, updateEquipment } from "../controllers/equipos.controller";
import { validarId } from "../middlewares/validate-type-id.middleware";
import { uploadDocDelivery } from "../middlewares/multer-delivery.middleware";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Equipo:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         sedeId:
 *           type: integer
 *         name:
 *           type: string
 *         typeEquipment:
 *           type: string
 *         brand:
 *           type: string
 *         model:
 *           type: string
 *         serial:
 *           type: string
 *         operationalSystem:
 *           type: string
 *         addressIp:
 *           type: string
 *         mac:
 *           type: string
 *         purchaseDate:
 *           type: string
 *           format: date
 *         warrantyTime:
 *           type: string
 *         warranty:
 *           type: boolean
 *         deliveryDate:
 *           type: string
 *           format: date
 *         inventoryNumber:
 *           type: string
 *         dhcp:
 *           type: boolean
 *         idUsuario:
 *           type: integer
 *           nullable: true
 *         lock: 
 *           type: boolean
 *         lockKey:
 *           type: string
 *           nullable: true
 */        

/**
 * @swagger
 * /equipos:
 *   get:
 *     summary: Obtiene todos los equipos
 *     tags: [Equipos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de equipos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Equipo'
 */
router.get("/equipos", authenticate, authorizeRoles(['1']), getAllEquipments);

/**
 * @swagger
 * /equipos/{id}:
 *   get:
 *     summary: Obtiene un equipo por ID
 *     tags: [Equipos]
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
 *         description: Equipo encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Equipo'
 *       404:
 *         description: Equipo no encontrado
 */
router.get("/equipos/:id", authenticate, authorizeRoles(['1']), validarId, getAllEquipments);

/**
 * @swagger
 * /equipos:
 *   post:
 *     summary: Crea un nuevo equipo
 *     tags: [Equipos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Equipo'
 *     responses:
 *       200:
 *         description: Equipo creado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Equipo'
 *       400:
 *         description: Datos inválidos
 */
router.post("/equipos", authenticate, authorizeRoles(['1']), uploadDocDelivery, createEquipment);

/**
 * @swagger
 * /equipos/{id}:
 *   put:
 *     summary: Actualiza un equipo
 *     tags: [Equipos]
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
 *             $ref: '#/components/schemas/Equipo'
 *     responses:
 *       200:
 *         description: Equipo actualizado
 *       404:
 *         description: Equipo no encontrado
 */
router.put("/equipos/:id", authenticate, authorizeRoles(['1']), validarId, uploadDocDelivery, updateEquipment);

/**
 * @swagger
 * /equipos/{id}:
 *   delete:
 *     summary: Elimina un equipo
 *     tags: [Equipos]
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
 *         description: Equipo eliminado
 *       404:
 *         description: Equipo no encontrado
 */
router.delete("/equipos/:id", authenticate, authorizeRoles(['1']), validarId, deleteEquipment);

/**
 * @swagger
 * /equipos-sede/{id}:
 *   get:
 *     summary: Obtiene equipos por sede
 *     tags: [Equipos]
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
 *         description: Lista de equipos de la sede
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Equipo'
 *       404:
 *         description: No se encontraron equipos
 */
router.get("/equipos-sede/:id", authenticate, authorizeRoles(['1', '4','2']), validarId, getEquipmentBySede);

/**
 * @swagger
 * /equipments/statics/typeEquipment:
 *   get:
 *     summary: Obtiene estadísticas de equipos por tipo
 *     tags: [Equipos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Distribución de equipos por tipo
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   typeEquipment:
 *                     type: string
 *                     description: Tipo de equipo
 *                   count:
 *                     type: integer
 *                     description: Cantidad de equipos de este tipo
 *       404:
 *         description: No se encontraron equipos
 */
router.get('/equipments/statics/typeEquipment/:id', authenticate, authorizeRoles(['1', '2']), validarId, getEquipmentTypeDistribution);

/**
 * @swagger
 * /equipments/statics/headquarters:
 *   get:
 *     summary: Obtiene estadísticas de equipos por sede
 *     tags: [Equipos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Distribución de equipos por sede
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
 *                     type: integer
 *                     description: Cantidad de equipos en la sede
 *       404:
 *         description: No se encontraron equipos
 */
router.get('/equipments/statics/headquarters/:id', authenticate, authorizeRoles(['1', '2']), validarId, getEquipmentHeadquartersDistribution);

/**
 * @swagger
 * /equipments/statics/age:
 *   get:
 *     summary: Obtiene estadísticas de antigüedad de equipos
 *     tags: [Equipos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estadísticas de antigüedad de equipos
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
 *                         description: Cantidad de equipos en ese rango
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
 *       404:
 *         description: No se encontraron equipos
 */
router.get('/equipments/statics/age/:id', authenticate, authorizeRoles(['1', '2']), validarId, getEquipmentAgeBySede);

/**
 * @swagger
 * /equipments/statics/warrantyExpiration:
 *   get:
 *     summary: Obtiene estadísticas de expiración de garantía
 *     tags: [Equipos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estadísticas de garantía de equipos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   description: Total de equipos
 *                 inWarranty:
 *                   type: integer
 *                   description: Cantidad de equipos en garantía
 *                 percentage:
 *                   type: string
 *                   description: Porcentaje de equipos en garantía
 *                 expiringSoon:
 *                   type: object
 *                   properties:
 *                     count:
 *                       type: integer
 *                       description: Cantidad de equipos con garantía próxima a vencer
 *                     equiment:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Equipo'
 *       404:
 *         description: No se encontraron equipos
 */
router.get('/equipments/statics/warrantyExpiration/:id', authenticate, authorizeRoles(['1', '2']), validarId, getEquipmentWarrantyStatistics);

/**
 * @swagger
 * /equipments/statics/withLock:
 *   get:
 *     summary: Obtiene estadísticas de equipos con candado
 *     tags: [Equipos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estadísticas de equipos con candado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   description: Total de equipos
 *                 withLock:
 *                   type: integer
 *                   description: Cantidad de equipos con candado
 *                 percentage:
 *                   type: string
 *                   description: Porcentaje de equipos con candado
 *       404:
 *         description: No se encontraron equipos
 */
router.get('/equipments/statics/withLock/:id', authenticate, authorizeRoles(['1', '2']),validarId, getEquipmentLockStatistics);

/**
 * @swagger
 * /search/equipos:
 *   get:
 *     summary: Buscar equipos por nombre, serial, marca, modelo o responsable
 *     tags: [Equipos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *           minLength: 2
 *         required: true
 *         description: Término de búsqueda (mínimo 2 caracteres)
 *         example: "Dell"
 *     responses:
 *       200:
 *         description: Equipos encontrados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   item:
 *                     $ref: '#/components/schemas/Equipo'
 *                   departmentId:
 *                     type: integer
 *                     description: ID del departamento
 *                   departmentRelationName:
 *                     type: string
 *                     description: Nombre del departamento
 *                   sedeId:
 *                     type: integer
 *                     description: ID de la sede
 *                   sedeName:
 *                     type: string
 *                     description: Nombre de la sede
 *       400:
 *         description: Consulta inválida (debe ser una cadena de al menos 2 caracteres)
 *       404:
 *         description: No se encontraron equipos que coincidan con la búsqueda
 */
router.get('/search/equipos', authenticate, authorizeRoles(['1', '2']), searchEquipmentGlobal);

export default router;