import { Router } from "express";
import { createIpsRemite, deleteIpsRemite, getAllIpsRemite, getIpsRemite, getIpsRemiteByName, updateIpsRemite } from "../controllers/ips-remite_controller";
import { validarId } from "../middlewares/validar-id";
import { authorizeRoles } from "../middlewares/authorize-roles";
import { authenticate } from "../middlewares/auth";

const router = Router();

router.get("/ips-remite",authenticate, authorizeRoles(['1', '2']), getAllIpsRemite);

router.get("/ips-remite/:id",authenticate, authorizeRoles(['1', '2']),validarId ,getIpsRemite);

router.post("/ips-remite" ,authenticate, authorizeRoles(['1', '2']),createIpsRemite);

router.put("/ips-remite/:id",authenticate, authorizeRoles(['1', '2']),validarId ,updateIpsRemite);

router.delete("/ips-remite/:id",authenticate, authorizeRoles(['1']),validarId ,deleteIpsRemite);

router.post("/ips-remite-name",authenticate, authorizeRoles(['1', '2']), getIpsRemiteByName);

export default router;