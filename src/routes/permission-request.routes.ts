import { Router } from "express";
import { actOnPermissionStep, createPermissionRequest, getPermissionRequestById } from "../controllers/permission.controller";
import { authenticate } from "../middlewares/auth";
import { uploadAttachmentsPermissions } from "../middlewares/multer-attechments-permissions";
import { authorizeRoles } from "../middlewares/authorize-roles";

const router = Router();

// Base: /permisos
router.post("/permisos/requests", authenticate, uploadAttachmentsPermissions.single("file"), createPermissionRequest);
router.get("/permisos/requests/:id", authenticate, getPermissionRequestById);
router.post("/permisos/requests/:id/steps/:stepId/actions", authenticate, actOnPermissionStep);

export default router;
