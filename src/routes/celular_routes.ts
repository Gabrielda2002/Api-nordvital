import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import { authorizeRoles } from "../middlewares/authorize-roles";
import { createPhone, getCountPhonesByHeadquartersId, getPhoneAgeByHeadquartersId, getPhoneBySedeId, getPhoneWarrantyStatistics, updatePhone } from "../controllers/celular_controller";
import { uploadDocDelivery } from "../middlewares/upload-doc-delivery_middleware";
import { validarId } from "../middlewares/validar-id";

const router = Router();

/**
 * @swagger
 * /inventario/celulares-sede/{id}:
 *   get:
 *     summary: Obtener celulares por ID de sede
 *     tags: [Celulares]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la sede
 *     responses:
 *       200:
 *         description: Lista de celulares por sede
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: ID del celular
 *                   name:
 *                     type: string
 *                     description: Nombre del celular
 *                   brand:
 *                     type: string
 *                     description: Marca del celular
 *                   model:
 *                     type: string
 *                     description: Modelo del celular
 *                   imei:
 *                     type: string
 *                     description: IMEI del celular
 *                   status:
 *                     type: string
 *                     description: Estado del celular
 *                   responsableName:
 *                     type: string
 *                     description: Nombre del responsable
 *       404:
 *         description: No se encontraron celulares para esta sede
 *       500:
 *         description: Error interno del servidor
 */
router.get('/inventario/celulares-sede/:id', authenticate, authorizeRoles(['1']), getPhoneBySedeId);

/**
 * @swagger
 * /celular:
 *   post:
 *     summary: Crear un nuevo celular
 *     tags: [Celulares]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Acta de entrega (opcional)
 *               name:
 *                 type: string
 *                 description: Nombre del celular
 *               brand:
 *                 type: string
 *                 description: Marca del celular
 *               model:
 *                 type: string
 *                 description: Modelo del celular
 *               serial:
 *                 type: string
 *                 description: Número de serie
 *               imei:
 *                 type: string
 *                 description: IMEI del celular
 *               operativeSystem:
 *                 type: string
 *                 description: Sistema operativo
 *               versionSO:
 *                 type: string
 *                 description: Versión del sistema operativo
 *               storage:
 *                 type: string
 *                 description: Capacidad de almacenamiento
 *               storageRam:
 *                 type: string
 *                 description: Capacidad de RAM
 *               phoneNumber:
 *                 type: string
 *                 description: Número telefónico
 *               operador:
 *                 type: string
 *                 description: Operador telefónico
 *               typePlan:
 *                 type: string
 *                 description: Tipo de plan
 *               dueDatePlan:
 *                 type: string
 *                 format: date
 *                 description: Fecha de vencimiento del plan
 *               warranty:
 *                 type: boolean
 *                 description: Estado de garantía
 *               acquisitionValue:
 *                 type: number
 *                 description: Valor de adquisición
 *               sedeId:
 *                 type: integer
 *                 description: ID de la sede
 *               responsable:
 *                 type: integer
 *                 description: ID del responsable
 *     responses:
 *       201:
 *         description: Celular creado con éxito
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Celular'
 *       400:
 *         description: Datos inválidos
 *       500:
 *         description: Error interno del servidor
 */
router.post('/celular', authenticate, authorizeRoles(['1']), uploadDocDelivery, createPhone);

/**
 * @swagger
 * /celular/{id}:
 *   put:
 *     summary: Actualizar un celular existente
 *     tags: [Celulares]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del celular
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Acta de entrega (opcional)
 *               name:
 *                 type: string
 *                 description: Nombre del celular
 *               brand:
 *                 type: string
 *                 description: Marca del celular
 *               model:
 *                 type: string
 *                 description: Modelo del celular
 *               serial:
 *                 type: string
 *                 description: Número de serie
 *               imei:
 *                 type: string
 *                 description: IMEI del celular
 *               operativeSystem:
 *                 type: string
 *                 description: Sistema operativo
 *               status:
 *                 type: string
 *                 description: Estado del celular
 *     responses:
 *       200:
 *         description: Celular actualizado con éxito
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Celular'
 *       404:
 *         description: Celular no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.put('/celular/:id', authenticate, authorizeRoles(['1']), validarId, uploadDocDelivery, updatePhone);

/**
 * @swagger
 * /celular/statics/headquarters:
 *   get:
 *     summary: Obtener estadísticas de celulares por sede
 *     tags: [Celulares]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estadísticas de celulares por sede
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
 *                     description: Cantidad de celulares
 *       404:
 *         description: No se encontraron datos
 *       500:
 *         description: Error interno del servidor
 */
router.get('/celular/statics/headquarters', authenticate, authorizeRoles(['1']), getCountPhonesByHeadquartersId);

/**
 * @swagger
 * /celular/statics/age:
 *   get:
 *     summary: Obtener estadísticas de antigüedad de celulares
 *     tags: [Celulares]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estadísticas de antigüedad de celulares
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
 *                         description: Cantidad de celulares en ese rango
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
router.get('/celular/statics/age', authenticate, authorizeRoles(['1']), getPhoneAgeByHeadquartersId)

/**
 * @swagger
 * /celular/statics/warrantyExpiration:
 *   get:
 *     summary: Obtener estadísticas de expiración de garantía
 *     tags: [Celulares]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estadísticas de garantía de celulares
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   description: Total de celulares
 *                 inWarranty:
 *                   type: integer
 *                   description: Cantidad de celulares en garantía
 *                 percentage:
 *                   type: number
 *                   description: Porcentaje de celulares en garantía
 *       500:
 *         description: Error interno del servidor
 */
router.get('/celular/statics/warrantyExpiration', authenticate, authorizeRoles(['1']), getPhoneWarrantyStatistics);

export default router;