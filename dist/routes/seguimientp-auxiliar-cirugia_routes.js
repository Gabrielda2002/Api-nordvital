"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middlewares/auth");
const authorize_roles_1 = require("../middlewares/authorize-roles");
const seguimiento_auxiliar_cirugias_controller_1 = require("../controllers/seguimiento-auxiliar-cirugias_controller");
const validar_id_1 = require("../middlewares/validar-id");
const router = (0, express_1.Router)();
router.get('/seguimiento-auxiliar-cirugia', auth_1.authenticate, (0, authorize_roles_1.authorizeRoles)(['1', '2']), seguimiento_auxiliar_cirugias_controller_1.getAllAuxiliarySurgeries);
router.get('/seguimiento-auxiliar-cirugia/:id', auth_1.authenticate, (0, authorize_roles_1.authorizeRoles)(['1', '2']), validar_id_1.validarId, seguimiento_auxiliar_cirugias_controller_1.getAuxiliarySurgery);
router.post('/seguimiento-auxiliar-cirugia', auth_1.authenticate, (0, authorize_roles_1.authorizeRoles)(['1', '2']), seguimiento_auxiliar_cirugias_controller_1.createAuxiliarySurgery);
router.put('/seguimiento-auxiliar-cirugia/:id', auth_1.authenticate, (0, authorize_roles_1.authorizeRoles)(['1', '2']), validar_id_1.validarId, seguimiento_auxiliar_cirugias_controller_1.updateAuxiliarySurgery);
router.delete('/seguimiento-auxiliar-cirugia/:id', auth_1.authenticate, (0, authorize_roles_1.authorizeRoles)(['1', '2']), validar_id_1.validarId, seguimiento_auxiliar_cirugias_controller_1.deleteAuxiliarySurgery);
exports.default = router;
