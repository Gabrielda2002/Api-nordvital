"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const municipio_controller_1 = require("../controllers/municipio_controller");
const validar_id_1 = require("../middlewares/validar-id");
const authorize_roles_1 = require("../middlewares/authorize-roles");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
router.get('/municipios', auth_1.authenticate, (0, authorize_roles_1.authorizeRoles)(['1', '2']), municipio_controller_1.getAllMunicipios);
router.get('/municipios/:id', auth_1.authenticate, (0, authorize_roles_1.authorizeRoles)(['1', '2']), validar_id_1.validarId, municipio_controller_1.getMunicipioById);
router.post('/municipios', auth_1.authenticate, (0, authorize_roles_1.authorizeRoles)(['1', '2']), municipio_controller_1.createMunicipio);
router.put('/municipios/:id', auth_1.authenticate, (0, authorize_roles_1.authorizeRoles)(['1', '2']), validar_id_1.validarId, municipio_controller_1.updateMunicipio);
router.delete('/municipios/:id', auth_1.authenticate, (0, authorize_roles_1.authorizeRoles)(['1']), validar_id_1.validarId, municipio_controller_1.deleteMunicipio);
exports.default = router;