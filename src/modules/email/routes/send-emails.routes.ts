import { Router } from "express";
import { authenticate } from "@core/middlewares/authenticate.middleware";
import { authorizeRoles } from "@core/middlewares/authorize-roles.middleware";
import { sendEmailWorkUs } from "../controllers/send-emails.controller";
import { UploadFileEmail } from "@core/middlewares/multer-email-files.middleware";

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
