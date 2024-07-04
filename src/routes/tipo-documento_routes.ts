
import { Router  } from "express";
import { getAllDocumentType } from "../controllers/tipo-documento_controller";


const router = Router();

router.get('/documento', getAllDocumentType);

export default router;
