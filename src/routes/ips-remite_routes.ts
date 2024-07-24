import { Router } from "express";
import { createIpsRemite, deleteIpsRemite, getAllIpsRemite, getIpsRemite, updateIpsRemite } from "../controllers/ips-remite_controller";

const router = Router();

router.get("/ips-remite", getAllIpsRemite);

router.get("/ips-remite/:id", getIpsRemite);

router.post("/ips-remite", createIpsRemite);

router.put("/ips-remite/:id", updateIpsRemite);

router.delete("/ips-remite/:id", deleteIpsRemite);

export default router;