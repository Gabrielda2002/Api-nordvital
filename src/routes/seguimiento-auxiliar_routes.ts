import { Router } from "express";
import { getAllSeguimientosAuxiliares } from "../controllers/seguimiento-auxiliar_controller";

const routes = Router();

routes.get("/seguimientos-auxiliares", getAllSeguimientosAuxiliares);

export default routes;