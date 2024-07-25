import { Router } from "express";
import { createIpsRemite, deleteIpsRemite, getAllIpsRemite, getIpsRemite, updateIpsRemite } from "../controllers/ips-remite_controller";
import { validarId } from "../middlewares/validar-id_middleware";

const router = Router();

router.get("/ips-remite", getAllIpsRemite);

router.get("/ips-remite/:id",validarId ,getIpsRemite);

router.post("/ips-remite" ,createIpsRemite);

router.put("/ips-remite/:id",validarId ,updateIpsRemite);

router.delete("/ips-remite/:id",validarId ,deleteIpsRemite);

export default router;