import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import { authorizeRoles } from "../middlewares/authorize-roles";
import { sendEmailWorkUs } from "../controllers/send-emails_controller";
import { UploadFileEmail } from "../middlewares/save-file_middleware";

const router = Router();

router.post('/send-email', UploadFileEmail.single('cv'), sendEmailWorkUs);

export default router;