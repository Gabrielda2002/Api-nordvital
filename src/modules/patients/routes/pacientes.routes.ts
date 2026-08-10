import { Router } from "express";
import { confirmarCargaMasivaPacientes, createPatient, deletePaciente, getAllPacientes, getPaciente, getPacientesByDocument, updatePaciente, updatePacienteTable, validarCargaMasivaPacientes } from "../controllers/pacientes.controller";
import { validarId } from "@core/middlewares/validate-type-id.middleware";
import { authenticate } from "@core/middlewares/authenticate.middleware";
import { authorizeRoles } from "@core/middlewares/authorize-roles.middleware";
import { ROLE_IDS, ROLE_GROUPS } from "@core/constants/roles";
import { uploadCsv } from "@core/middlewares/upload-csv.middleware";

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
router.get("/pacientes", authenticate, authorizeRoles([ROLE_IDS.ADMINISTRADOR, ROLE_IDS.AUDITOR, ROLE_IDS.RADICADOR, ROLE_IDS.CIRUGIA]), getAllPacientes);

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
router.get("/pacientes/:id", authenticate, authorizeRoles([ROLE_IDS.ADMINISTRADOR, ROLE_IDS.GERENTE, ROLE_IDS.AUDITOR, ROLE_IDS.AUXILIAR]), validarId, getPaciente);

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
router.post("/patient", authenticate, authorizeRoles(ROLE_GROUPS.RADICACION_NURSING), createPatient);

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
router.put("/pacientes/:id", authenticate, authorizeRoles([...ROLE_GROUPS.COORDINADORES, ROLE_IDS.AUDITOR, ROLE_IDS.RADICADOR, ROLE_IDS.CIRUGIA]), validarId, updatePaciente);

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
router.delete("/pacientes/:id", authenticate, authorizeRoles([ROLE_IDS.ADMINISTRADOR]), validarId, deletePaciente);

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
router.post("/pacientes-documento", authenticate, authorizeRoles(ROLE_GROUPS.SEARCH_PATIENTS), getPacientesByDocument);

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
router.put("/table/patient/:id", authenticate, authorizeRoles([ROLE_IDS.ADMINISTRADOR, ROLE_IDS.GERENTE, ROLE_IDS.AUDITOR, ROLE_IDS.AUXILIAR]), validarId, updatePacienteTable);

/**
 * @swagger
 * /pacientes/carga-masiva/validar:
 *   post:
 *     summary: Valida un archivo CSV para carga masiva de pacientes
 *     tags: [Pacientes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Archivo CSV con datos de pacientes
 *     responses:
 *       200:
 *         description: Resultado de la validación
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                 totalRows:
 *                   type: integer
 *                 validRows:
 *                   type: integer
 *                 invalidRows:
 *                   type: integer
 *                 duplicateRows:
 *                   type: array
 *                   items:
 *                     type: string
 *                 alreadyExistsRows:
 *                   type: array
 *                   items:
 *                     type: string
 *                 rows:
 *                   type: array
 *                   items:
 *                     type: object
 *       400:
 *         description: Error en el archivo
 */
router.post("/pacientes/carga-masiva/validar", authenticate, authorizeRoles([ROLE_IDS.ADMINISTRADOR]), uploadCsv, validarCargaMasivaPacientes);

/**
 * @swagger
 * /pacientes/carga-masiva/confirmar:
 *   post:
 *     summary: Confirma la carga masiva de pacientes desde un archivo CSV
 *     tags: [Pacientes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Archivo CSV con datos de pacientes previamente validado
 *     responses:
 *       200:
 *         description: Carga confirmada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 inserted:
 *                   type: integer
 *       400:
 *         description: Error al confirmar la carga
 */
router.post("/pacientes/carga-masiva/confirmar", authenticate, authorizeRoles([ROLE_IDS.ADMINISTRADOR]), uploadCsv, confirmarCargaMasivaPacientes);

export default router;
