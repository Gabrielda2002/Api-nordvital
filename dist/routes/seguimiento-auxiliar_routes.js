"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const seguimiento_auxiliar_controller_1 = require("../controllers/seguimiento-auxiliar_controller");
const validar_id_1 = require("../middlewares/validar-id");
const authorize_roles_1 = require("../middlewares/authorize-roles");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
router.get("/seguimientos-auxiliares", auth_1.authenticate, (0, authorize_roles_1.authorizeRoles)(['1', '2', '5']), seguimiento_auxiliar_controller_1.getAllSeguimientosAuxiliares);
router.get("/seguimientos-auxiliares/:id", auth_1.authenticate, (0, authorize_roles_1.authorizeRoles)(['1', '2', '5']), validar_id_1.validarId, seguimiento_auxiliar_controller_1.getSeguimientoAuxiliar);
router.post("/seguimientos-auxiliares", auth_1.authenticate, (0, authorize_roles_1.authorizeRoles)(['1', '2', '5']), seguimiento_auxiliar_controller_1.createSeguimientoAuxiliar);
router.put("/seguimientos-auxiliares/:id", auth_1.authenticate, (0, authorize_roles_1.authorizeRoles)(['1', '2', '5']), validar_id_1.validarId, seguimiento_auxiliar_controller_1.updateSeguimientoAuxiliar);
router.delete("/seguimientos-auxiliares/:id", auth_1.authenticate, (0, authorize_roles_1.authorizeRoles)(['1']), validar_id_1.validarId, seguimiento_auxiliar_controller_1.deleteSeguimientoAuxiliar);
exports.default = router;