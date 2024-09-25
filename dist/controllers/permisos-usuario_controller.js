"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllPermisosUsuarios = getAllPermisosUsuarios;
exports.getPermisoUsuario = getPermisoUsuario;
exports.createPermisoUsuario = createPermisoUsuario;
exports.updatePermisoUsuario = updatePermisoUsuario;
exports.deletePermisoUsuario = deletePermisoUsuario;
const permisos_usuario_1 = require("../entities/permisos-usuario");
const class_validator_1 = require("class-validator");
function getAllPermisosUsuarios(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const permisosUsuarios = yield permisos_usuario_1.PermisosUsuarios.find({
                relations: ['userRelation', 'permisoRelation']
            });
            res.json(permisosUsuarios);
        }
        catch (error) {
            next(error);
        }
    });
}
function getPermisoUsuario(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const permisoUsuario = yield permisos_usuario_1.PermisosUsuarios.findOne({
                where: { id: parseInt(id) },
                relations: ['userRelation', 'permisoRelation']
            });
            if (!permisoUsuario) {
                return res.status(404).json({ message: "PermisoUsuario not found" });
            }
            return res.json(permisoUsuario);
        }
        catch (error) {
            next(error);
        }
    });
}
function createPermisoUsuario(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { idUser, idPermiso } = req.body;
            const permisoUsuarioExist = yield permisos_usuario_1.PermisosUsuarios.findOneBy({ idUser, idPermiso });
            if (permisoUsuarioExist) {
                return res.status(400).json({ message: "PermisoUsuario already exists" });
            }
            const permisoUsuario = new permisos_usuario_1.PermisosUsuarios();
            permisoUsuario.idUser = idUser;
            permisoUsuario.idPermiso = idPermiso;
            const errors = yield (0, class_validator_1.validate)(permisoUsuario);
            if (errors.length > 0) {
                const messages = errors.map(err => ({
                    property: err.property,
                    constraints: err.constraints
                }));
                return res.status(400).json({ message: "Error creating permiso usuario", messages });
            }
            yield permisoUsuario.save();
            return res.json(permisoUsuario);
        }
        catch (error) {
            next(error);
        }
    });
}
function updatePermisoUsuario(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const { idUser, idPermiso } = req.body;
            const permisoUsuario = yield permisos_usuario_1.PermisosUsuarios.findOneBy({ id: parseInt(id) });
            if (!permisoUsuario) {
                return res.status(404).json({ message: "PermisoUsuario not found" });
            }
            permisoUsuario.idUser = idUser;
            permisoUsuario.idPermiso = idPermiso;
            const errors = yield (0, class_validator_1.validate)(permisoUsuario);
            if (errors.length > 0) {
                const messages = errors.map(err => ({
                    property: err.property,
                    constraints: err.constraints
                }));
                return res.status(400).json({ message: "Error updating permiso usuario", messages });
            }
            yield permisoUsuario.save();
            return res.json(permisoUsuario);
        }
        catch (error) {
            next(error);
        }
    });
}
function deletePermisoUsuario(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const permisoUsuario = yield permisos_usuario_1.PermisosUsuarios.findOneBy({ id: parseInt(id) });
            if (!permisoUsuario) {
                return res.status(404).json({ message: "PermisoUsuario not found" });
            }
            yield permisoUsuario.remove();
            return res.json({ message: "PermisoUsuario deleted" });
        }
        catch (error) {
            next(error);
        }
    });
}
