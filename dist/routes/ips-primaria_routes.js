"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ips_primaria_controller_1 = require("../controllers/ips-primaria_controller");
const validar_id_1 = require("../middlewares/validar-id");
const authorize_roles_1 = require("../middlewares/authorize-roles");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
router.get('/ips-primaria', auth_1.authenticate, (0, authorize_roles_1.authorizeRoles)(['1', '2']), ips_primaria_controller_1.getAllIpsPrimaria);
router.get('/ips-primaria/:id', auth_1.authenticate, (0, authorize_roles_1.authorizeRoles)(['1', '2']), validar_id_1.validarId, ips_primaria_controller_1.getIpsPrimaria);
router.post('/ips-primaria', auth_1.authenticate, (0, authorize_roles_1.authorizeRoles)(['1', '2']), ips_primaria_controller_1.createIpsPrimaria);
router.put('/ips-primaria/:id', auth_1.authenticate, (0, authorize_roles_1.authorizeRoles)(['1', '2']), validar_id_1.validarId, ips_primaria_controller_1.updateIpsPrimaria);
router.delete('/ips-primaria/:id', auth_1.authenticate, (0, authorize_roles_1.authorizeRoles)(['1']), validar_id_1.validarId, ips_primaria_controller_1.deleteIpsPrimaria);
router.post('/ips-primaria-name', auth_1.authenticate, (0, authorize_roles_1.authorizeRoles)(['1', '2']), ips_primaria_controller_1.getIpsPrimariaByName);
exports.default = router;
