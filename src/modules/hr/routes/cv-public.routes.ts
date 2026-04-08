import { Router } from "express";
import { servePublicCV, generateCVTokens } from "../controllers/cv-public.controller";
import rateLimit from 'express-rate-limit';

const router = Router();

/**
 * Rate limiting específico para CVs públicos
 * Más permisivo que archivos normales porque viene de emails públicos
 */
const cvAccessRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 50, // 50 accesos por IP cada 15 minutos
    message: {
        error: 'Demasiados accesos a CVs desde esta IP. Intenta nuevamente en 15 minutos.'
    },
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => {
        // Skip rate limiting para IPs internas o de desarrollo
        const clientIP = req.ip || req.connection.remoteAddress || '';
        return clientIP === '127.0.0.1' || clientIP === '::1' || clientIP.startsWith('192.168.');
    }
});

/**
 * @swagger
 * components:
 *   schemas:
 *     CVTokens:
 *       type: object
 *       properties:
 *         viewToken:
 *           type: string
 *           description: Token para visualizar el CV
 *         downloadToken:
 *           type: string
 *           description: Token para descargar el CV
 *         viewUrl:
 *           type: string
*           description: URL completa para visualizar el CVa[[]]
 *         downloadUrl:
 *           type: string
 *           description: URL completa para descargar el CV
 *         expiresInDays:
 *           type: integer
 *           description: Días hasta la expiración
 */

/**
 * @swagger
 * /public-cv/{token}:
 *   get:
 *     summary: Accede a un CV de forma pública usando un token temporal
 *     description: |
 *       Permite acceder a CVs enviados por email sin autenticación.
 *       El token determina si se visualiza o descarga el archivo.
 *       
 *       **Características:**
 *       - No requiere autenticación
 *       - Tokens de larga duración (30 días)
 *       - Rate limiting permisivo
 *       - Seguimiento de accesos para auditoría
 *     tags: [CVs Públicos]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Token JWT temporal generado para el CV
 *         example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *     responses:
 *       200:
 *         description: CV servido exitosamente
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *               description: Archivo PDF del CV
 *           application/octet-stream:
 *             schema:
 *               type: string
 *               format: binary
 *               description: Archivo del CV para descarga
 *       400:
 *         description: Token requerido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Token requerido para acceder al CV"
 *       403:
 *         description: Token inválido o expirado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Token de CV inválido o expirado"
 *                 error:
 *                   type: string
 *                   example: "Token expired - CV access link has expired"
 *       404:
 *         description: CV no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "CV no encontrado en el servidor"
 *       429:
 *         description: Demasiados accesos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Demasiados accesos a CVs desde esta IP. Intenta nuevamente en 15 minutos."
 */
router.get("/public-cv/:token", cvAccessRateLimit, servePublicCV);

/**
 * @swagger
 * /cv-tokens:
 *   post:
 *     summary: Genera tokens de acceso para un CV específico
 *     description: |
 *       Endpoint interno para generar tokens de acceso a CVs.
 *       Principalmente usado para debugging o regeneración de tokens.
 *       
 *       **Nota:** En producción, los tokens se generan automáticamente 
 *       cuando se envía el email con el CV.
 *     tags: [CVs Públicos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - cvFileName
 *               - originalName
 *             properties:
 *               cvFileName:
 *                 type: string
 *                 description: Nombre del archivo en el servidor
 *                 example: "1725123456789-cv.pdf"
 *               originalName:
 *                 type: string
 *                 description: Nombre original del archivo
 *                 example: "Juan Perez - CV.pdf"
 *               expirationDays:
 *                 type: integer
 *                 description: Días hasta la expiración (por defecto 30)
 *                 example: 30
 *                 default: 30
 *     responses:
 *       200:
 *         description: Tokens generados exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Tokens de CV generados exitosamente"
 *                 viewToken:
 *                   type: string
 *                   description: Token para visualizar el CV
 *                 downloadToken:
 *                   type: string
 *                   description: Token para descargar el CV
 *                 viewUrl:
 *                   type: string
 *                   description: URL relativa para visualizar
 *                   example: "/api/v1/public-cv/eyJhbGciOiJIUzI1NiIs..."
 *                 downloadUrl:
 *                   type: string
 *                   description: URL relativa para descargar
 *                   example: "/api/v1/public-cv/eyJhbGciOiJIUzI1NiIs..."
 *                 expiresInDays:
 *                   type: integer
 *                   description: Días hasta la expiración
 *                   example: 30
 *       400:
 *         description: Parámetros faltantes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "cvFileName y originalName son requeridos"
 *       404:
 *         description: CV no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "CV no encontrado"
 */
router.post("/cv-tokens", generateCVTokens);

export default router;
