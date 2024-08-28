"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tipo_documento_controller_1 = require("../controllers/tipo-documento_controller");
const validar_id_1 = require("../middlewares/validar-id");
const auth_1 = require("../middlewares/auth");
const authorize_roles_1 = require("../middlewares/authorize-roles");
const router = (0, express_1.Router)();
router.get('/documento', auth_1.authenticate, (0, authorize_roles_1.authorizeRoles)(['1', '2']), tipo_documento_controller_1.getAllDocumentType);
router.get('/documento/:id', auth_1.authenticate, (0, authorize_roles_1.authorizeRoles)(['1', '2']), validar_id_1.validarId, tipo_documento_controller_1.getDocumentTypeById);
router.post('/documento', auth_1.authenticate, (0, authorize_roles_1.authorizeRoles)(['1', '2']), tipo_documento_controller_1.createDocumentType);
router.put('/documento/:id', auth_1.authenticate, (0, authorize_roles_1.authorizeRoles)(['1', '2']), validar_id_1.validarId, tipo_documento_controller_1.updateDocumentType);
router.delete('/documento/:id', auth_1.authenticate, (0, authorize_roles_1.authorizeRoles)(['1']), validar_id_1.validarId, tipo_documento_controller_1.deleteDocumentType);
exports.default = router;
