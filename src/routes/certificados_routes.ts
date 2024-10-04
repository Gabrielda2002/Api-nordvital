import { Router } from "express";
import { createCertificate, downloadCertificate, getCertificateByDni } from "../controllers/certificados_controller";
import { uploadCertificate } from "../middlewares/multer-config-certificate";

const router = Router();

router.post("/certificados", uploadCertificate.single("certificate") ,createCertificate)

router.get("/certificados/:dni", getCertificateByDni)

router.get("/certificados-download/:dni", downloadCertificate)

export default router;