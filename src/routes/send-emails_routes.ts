import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import { authorizeRoles } from "../middlewares/authorize-roles";
import { sendEmailWorkUs } from "../controllers/send-emails_controller";
import { UploadFileEmail } from "../middlewares/save-file_middleware";

const router = Router();

/**
 * @swagger
 * /send-email:
 *   post:
 *     summary: Envía un correo con el CV adjunto.
 *     tags: [Guardar-email]
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               cv:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: OK
 */

router.post('/send-email', UploadFileEmail.single('cv'), sendEmailWorkUs);

export default router;