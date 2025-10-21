import { Router } from "express";
import { actOnPermissionStep, createPermissionRequest, generatePermissionAttachmentAccessToken, getPermissionRequestById, listAllRequestsByUser, listPermissionRequests, serveSecurePermissionAttachment } from "../controllers/permission.controller";
import { authenticate } from "../middlewares/auth";
import { uploadAttachmentsPermissions } from "../middlewares/multer-attechments-permissions";
import { authorizeRoles } from "../middlewares/authorize-roles";
import { fileAccessRateLimit } from "../middlewares/file-rate-limit";
import { validarId } from "../middlewares/validar-id";

const router = Router();

// Base: /permisos
router.post("/permisos/requests", authenticate, uploadAttachmentsPermissions.single("file"), createPermissionRequest);
router.get("/permisos/requests/:id", authenticate, getPermissionRequestById);
router.post("/permissions/requests/:id/steps/:stepId/actions", authenticate, actOnPermissionStep);
router.get('/list/requests', authenticate, listPermissionRequests);
router.get('/list/requests/user', authenticate, listAllRequestsByUser);
router.post('/attachments/:id/access-token', fileAccessRateLimit, authenticate, authorizeRoles(['1', '2', '3', '5', '18']), validarId, generatePermissionAttachmentAccessToken);
router.get('/secure-attachments/:token', serveSecurePermissionAttachment);

export default router;
