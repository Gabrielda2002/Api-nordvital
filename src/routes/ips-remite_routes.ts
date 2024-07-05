import { Router } from "express";
import { getAllIpsRemite } from "../controllers/ips-remite_controller";

const router = Router();

router.get("/ips-remite", getAllIpsRemite);

export default router;