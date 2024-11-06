import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import { authorizeRoles } from "../middlewares/authorize-roles";
import { createAccessory, deleteAccessory, getAccessory, getAllAccessories, updateAccessory } from "../controllers/accesorios-equipos_controller";
import { validarId } from "../middlewares/validar-id";

const router = Router();

/*
* @swagger
* components:
*   schemas:
*       AccesorioEquipo:
*               type: object
*               properties:
*                   id:
*                       type: integer
*                       description: Identificador del accesorio
*                   name:
*                       type: string
*                       description: Nombre del accesorio
*             required:
*              - name
*            example:
*              id: 1
*              name: Mouse
*/

/*
* @swagger
* /accesorios-equipos:
* get:
*  summary: Listar todos los accesorios de equipos
*  resopnses:
*   200:
*     description: Lista de accesorios de equipos
*     content: 
*        application/json:
*          schema: 
*           type: array
*           items:
*             
*/
router.get("/accesorios-equipos", authenticate, authorizeRoles(['1']), getAllAccessories);

router.get("/accesorios-equipos/:id", authenticate, authorizeRoles(['1']),validarId, getAccessory);

router.post("/accesorios-equipos", authenticate, authorizeRoles(['1']), createAccessory);

router.put("/accesorios-equipos/:id", authenticate, authorizeRoles(['1']),validarId, updateAccessory);

router.delete("/accesorios-equipos/:id", authenticate, authorizeRoles(['1']),validarId, deleteAccessory);

export default router;