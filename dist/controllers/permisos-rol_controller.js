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
exports.getAllPermisosRol = getAllPermisosRol;
exports.getPermisosRolById = getPermisosRolById;
exports.createPermisosRol = createPermisosRol;
exports.updatePermisosRol = updatePermisosRol;
exports.deletePermisosRol = deletePermisosRol;
const permisos_rol_1 = require("../entities/permisos-rol");
const class_validator_1 = require("class-validator");
function getAllPermisosRol(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const permisosRol = yield permisos_rol_1.PermisosRol.find({
                relations: ["rolRelation", "permisosRelation"]
            });
            res.json(permisosRol);
        }
        catch (error) {
            next(error);
        }
    });
}
function getPermisosRolById(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const permisosRol = yield permisos_rol_1.PermisosRol.findOne({
                where: { id: parseInt(id) },
                relations: ["rolRelation", "permisosRelation"]
            });
            if (!permisosRol) {
                res.status(404).json({ message: "PermisosRol not found" });
            }
            res.json(permisosRol);
        }
        catch (error) {
            next(error);
        }
    });
}
function createPermisosRol(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { idRol, idPermisos } = req.body;
            if (!idRol || !idPermisos) {
                return res.status(400).json({ message: "The fields idRol and idPermisos are required" });
            }
            const permisosRolExist = yield permisos_rol_1.PermisosRol.findOneBy({ idRol, idPermisos });
            if (permisosRolExist) {
                return res.status(400).json({ message: "The PermisosRol already exists" });
            }
            const permisosRol = new permisos_rol_1.PermisosRol();
            permisosRol.idRol = idRol;
            permisosRol.idPermisos = idPermisos;
            const errors = yield (0, class_validator_1.validate)(permisosRol);
            if (errors.length > 0) {
                const messages = errors.map(err => ({
                    property: err.property,
                    constraints: err.constraints
                }));
                return res.status(400).json({ message: "Error creating permisosRol", messages });
            }
            yield permisosRol.save();
            res.json(permisosRol);
        }
        catch (error) {
            next(error);
        }
    });
}
function updatePermisosRol(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const { idRol, idPermisos } = req.body;
            const permisosRol = yield permisos_rol_1.PermisosRol.findOneBy({ id: parseInt(id) });
            if (!permisosRol) {
                return res.status(404).json({ message: "PermisosRol not found" });
            }
            permisosRol.idRol = idRol;
            permisosRol.idPermisos = idPermisos;
            const errors = yield (0, class_validator_1.validate)(permisosRol);
            if (errors.length > 0) {
                const messages = errors.map(err => ({
                    property: err.property,
                    constraints: err.constraints
                }));
                return res.status(400).json({ message: "Error updating permisosRol", messages });
            }
            yield permisosRol.save();
            res.json(permisosRol);
        }
        catch (error) {
            next(error);
        }
    });
}
function deletePermisosRol(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const permisosRol = yield permisos_rol_1.PermisosRol.findOneBy({ id: parseInt(id) });
            if (!permisosRol) {
                return res.status(404).json({ message: "PermisosRol not found" });
            }
            yield permisosRol.remove();
            res.json({ message: "PermisosRol deleted" });
        }
        catch (error) {
            next(error);
        }
    });
}
