import { Router } from "express";
import { createPaciente, deletePaciente, getAllPacientes, getPaciente, getPacientesByDocument, updatePaciente, updatePacienteTable } from "../controllers/pacientes_controller";
import { validarId } from "../middlewares/validar-id";
import { authenticate } from "../middlewares/auth";
import { authorizeRoles } from "../middlewares/authorize-roles";

const router = Router();

/**
 * @swagger
 * /pacientes:
 *   get:
 *     summary: Obtiene todos los pacientes
 *     tags: [Pacientes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de pacientes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Paciente'
 */
router.get("/pacientes", authenticate, authorizeRoles(['1', '3', '10', '15']), getAllPacientes);

/**
 * @swagger
 * /pacientes/{id}:
 *   get:
 *     summary: Obtiene un paciente por ID
 *     tags: [Pacientes]
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
 *         description: Paciente encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Paciente'
 *       404:
 *         description: Paciente no encontrado
 */
router.get("/pacientes/:id", authenticate, authorizeRoles(['1', '2', '3', '5']), validarId, getPaciente);

/**
 * @swagger
 * /pacientes:
 *   post:
 *     summary: Crea un nuevo paciente
 *     tags: [Pacientes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Paciente'
 *     responses:
 *       200:
 *         description: Paciente creado
 *       400:
 *         description: Error en la validación
 */
router.post("/pacientes", authenticate, authorizeRoles(['1', '3', '10', '15', '6',  '19', '20']), createPaciente);

/**
 * @swagger
 * /pacientes/{id}:
 *   put:
 *     summary: Actualiza un paciente existente
 *     tags: [Pacientes]
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
 *             $ref: '#/components/schemas/Paciente'
 *     responses:
 *       200:
 *         description: Paciente actualizado
 *       404:
 *         description: Paciente no encontrado
 */
router.put("/pacientes/:id", authenticate, authorizeRoles(['1', '3', '10', '15', '6']), validarId, updatePaciente);

/**
 * @swagger
 * /pacientes/{id}:
 *   delete:
 *     summary: Elimina un paciente
 *     tags: [Pacientes]
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
 *         description: Paciente eliminado
 *       404:
 *         description: Paciente no encontrado
 */
router.delete("/pacientes/:id", authenticate, authorizeRoles(['1']), validarId, deletePaciente);

/**
 * @swagger
 * /pacientes-documento:
 *   post:
 *     summary: Busca un paciente por número de documento
 *     tags: [Pacientes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - documentNumber
 *             properties:
 *               documentNumber:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Paciente encontrado
 *       404:
 *         description: Paciente no encontrado
 */
router.post("/pacientes-documento", authenticate, authorizeRoles(['1', '3', '10', '15', '6',  '19', '20']), getPacientesByDocument);

/**
 * @swagger
 * /pacientes-actualizar-tablet/{id}:
 *   put:
 *     summary: Actualiza un paciente en la tabla
 *     tags: [Pacientes]
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
 *             $ref: '#/components/schemas/Paciente'
 *     responses:
 *       200:
 *         description: Paciente actualizado en la tablet
 *       404:
 *         description: Paciente no encontrado
 */
router.put("/pacientes-actualizar-tablet/:id", authenticate, authorizeRoles(['1', '2', '3', '5']), validarId, updatePacienteTable);

export default router;