"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authorize_roles_1 = require("../middlewares/authorize-roles");
const auth_1 = require("../middlewares/auth");
const carpeta_controller_1 = require("../controllers/carpeta_controller");
const validar_id_1 = require("../middlewares/validar-id");
const router = (0, express_1.Router)();
router.get('/carpetas', auth_1.authenticate, (0, authorize_roles_1.authorizeRoles)(['1', '2']), carpeta_controller_1.getAllFolders);
router.get('/carpetas/:id', auth_1.authenticate, (0, authorize_roles_1.authorizeRoles)(['1', '2']), validar_id_1.validarId, carpeta_controller_1.getFolderById);
router.post('/carpetas', auth_1.authenticate, (0, authorize_roles_1.authorizeRoles)(['1', '2']), carpeta_controller_1.createFolder);
router.put('/carpetas/:id', auth_1.authenticate, (0, authorize_roles_1.authorizeRoles)(['1', '2']), validar_id_1.validarId, carpeta_controller_1.updateFolder);
router.delete('/carpetas/:id', auth_1.authenticate, (0, authorize_roles_1.authorizeRoles)(['1', '2']), validar_id_1.validarId, carpeta_controller_1.deleteFolder);
router.get('/sistema-calidad/:id?', auth_1.authenticate, (0, authorize_roles_1.authorizeRoles)(['1', '2']), carpeta_controller_1.getSgcFoldersFiles);
exports.default = router;
