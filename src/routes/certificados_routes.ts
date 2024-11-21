import { Router } from "express";
import { createCertificate, downloadCertificate, getCertificateByDni } from "../controllers/certificados_controller";
import { uploadCertificate } from "../middlewares/multer-config-certificate";

const router = Router();

/**
 * @swagger
 * /certificados:
 *   post:
 *     summary: Crear un nuevo certificado
 *     tags: [Certificados]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               dni:
 *                 type: string
 *                 description: DNI del usuario
 *               certificate:
 *                 type: string
 *                 format: binary
 *                 description: Archivo del certificado
 *     responses:
 *       201:
 *         description: Certificado creado exitosamente
 *       409:
 *         description: El certificado ya existe
 *       400:
 *         description: Error en la validación de datos
 */
router.post("/certificados", uploadCertificate.single("certificate") ,createCertificate)

/**
 * @swagger
 * /certificados/{dni}:
 *   get:
 *     summary: Obtener certificado por DNI
 *     tags: [Certificados]
 *     parameters:
 *       - in: path
 *         name: dni
 *         schema:
 *           type: string
 *         required: true
 *         description: DNI del usuario
 *     responses:
 *       200:
 *         description: Certificado encontrado
 *       404:
 *         description: Certificado no encontrado
 */
router.get("/certificados/:dni", getCertificateByDni)

/**
 * @swagger
 * /certificados-download/{dni}:
 *   get:
 *     summary: Descargar certificado por DNI
 *     tags: [Certificados]
 *     parameters:
 *       - in: path
 *         name: dni
 *         schema:
 *           type: string
 *         required: true
 *         description: DNI del usuario
 *     responses:
 *       200:
 *         description: Descarga exitosa del certificado
 *         content:
 *           application/octet-stream:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: Certificado no encontrado
 */
router.get("/certificados-download/:dni", downloadCertificate)

export default router;