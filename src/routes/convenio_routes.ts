import { Router } from "express";
import { getAllConvenio } from "../controllers/convenio-controller";

const router = Router();

router.get('/convenio', getAllConvenio);

export default router;