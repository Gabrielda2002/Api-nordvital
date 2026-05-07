import { Router } from "express";
import { createContact, createVolunteer } from "../controllers/research-center.controller";

const router = Router();

/**
 * @swagger
 * /research-center/contact:
 *   post:
 *     summary: Crea un nuevo registro de contacto del centro de investigación
 *     tags: [Research Center]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - lastname
 *               - phone
 *               - email
 *               - subject
 *               - description
 *             properties:
 *               name:
 *                 type: string
 *                 example: Juan
 *               lastname:
 *                 type: string
 *                 example: Pérez
 *               phone:
 *                 type: string
 *                 example: "3001234567"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: juan.perez@example.com
 *               subject:
 *                 type: string
 *                 example: Consulta sobre investigación
 *               description:
 *                 type: string
 *                 example: Me gustaría obtener más información sobre los proyectos de investigación
 *     responses:
 *       201:
 *         description: Contacto creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *       400:
 *         description: Datos inválidos
 */
router.post("/research-center/contact", createContact);

/**
 * @swagger
 * /research-center/volunteer:
 *   post:
 *     summary: Crea un nuevo registro de voluntario del centro de investigación
 *     tags: [Research Center]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - lastname
 *               - phone
 *               - email
 *               - identificationType
 *               - identificationNumber
 *               - department
 *               - municipality
 *               - eps
 *               - age
 *               - nationality
 *               - date
 *             properties:
 *               name:
 *                 type: string
 *                 example: María
 *               lastname:
 *                 type: string
 *                 example: González
 *               phone:
 *                 type: string
 *                 example: "3009876543"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: maria.gonzalez@example.com
 *               identificationType:
 *                 type: string
 *                 example: CC
 *               identificationNumber:
 *                 type: string
 *                 example: "1234567890"
 *               department:
 *                 type: string
 *                 example: Atlántico
 *               municipality:
 *                 type: string
 *                 example: Barranquilla
 *               eps:
 *                 type: string
 *                 example: Nueva EPS
 *               age:
 *                 type: string
 *                 example: "25"
 *               nationality:
 *                 type: string
 *                 example: Colombiana
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2026-05-05"
 *     responses:
 *       201:
 *         description: Voluntario registrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *       400:
 *         description: Datos inválidos
 */
router.post("/research-center/volunteer", createVolunteer);

export default router;
