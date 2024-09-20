"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const lugar_radicacion_controller_1 = require("../controllers/lugar-radicacion_controller");
const validar_id_1 = require("../middlewares/validar-id");
const authorize_roles_1 = require("../middlewares/authorize-roles");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
router.get("/lugares-radicacion", auth_1.authenticate, (0, authorize_roles_1.authorizeRoles)(['1', '2']), lugar_radicacion_controller_1.getAllLugaresRadicacion);
router.get("/lugares-radicacion/:id", auth_1.authenticate, (0, authorize_roles_1.authorizeRoles)(['1', '2']), validar_id_1.validarId, lugar_radicacion_controller_1.getLugarRadicacion);
router.post("/lugares-radicacion", auth_1.authenticate, (0, authorize_roles_1.authorizeRoles)(['1', '2']), lugar_radicacion_controller_1.createLugarRadicacion);
router.put("/lugares-radicacion/:id", auth_1.authenticate, (0, authorize_roles_1.authorizeRoles)(['1', '2']), validar_id_1.validarId, lugar_radicacion_controller_1.updateLugarRadicacion);
router.delete("/lugares-radicacion/:id", auth_1.authenticate, (0, authorize_roles_1.authorizeRoles)(['1']), validar_id_1.validarId, lugar_radicacion_controller_1.deleteLugarRadicacion);
router.post("/lugares-radicacion-name", auth_1.authenticate, (0, authorize_roles_1.authorizeRoles)(['1', '2']), lugar_radicacion_controller_1.getLugaresRadicacionByName);
exports.default = router;
