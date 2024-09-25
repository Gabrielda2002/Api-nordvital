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
exports.getAllPermisos = getAllPermisos;
exports.getPermiso = getPermiso;
exports.createPermiso = createPermiso;
exports.updatePermiso = updatePermiso;
exports.deletePermiso = deletePermiso;
const permisos_1 = require("../entities/permisos");
const class_validator_1 = require("class-validator");
function getAllPermisos(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const permisos = yield permisos_1.Permisos.find();
            return res.json(permisos);
        }
        catch (error) {
            next(error);
        }
    });
}
function getPermiso(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const permiso = yield permisos_1.Permisos.findOneBy({ id: parseInt(id) });
            if (!permiso) {
                return res.status(404).json({ message: "Permiso not found" });
            }
            return res.json(permiso);
        }
        catch (error) {
            next(error);
        }
    });
}
function createPermiso(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { name, description, nameVariable, relatedModule } = req.body;
            if (!name || !description || !relatedModule) {
                return res.status(400).json({ message: "name, description, nameVariable and relatedModule are required" });
            }
            const permisoExist = yield permisos_1.Permisos.findOneBy({ name });
            if (permisoExist) {
                return res.status(400).json({ message: "Permiso already exists" });
            }
            const permiso = new permisos_1.Permisos();
            permiso.name = name;
            permiso.description = description;
            permiso.nameVariable = nameVariable;
            permiso.relatedModule = relatedModule;
            const errors = yield (0, class_validator_1.validate)(permiso);
            if (errors.length > 0) {
                const messages = errors.map(err => ({
                    property: err.property,
                    constraints: err.constraints
                }));
                return res.status(400).json({ message: "Error creating permiso", messages });
            }
            yield permiso.save();
            return res.json(permiso);
        }
        catch (error) {
            next(error);
        }
    });
}
function updatePermiso(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const { name, description, nameVariable, relatedModule } = req.body;
            const permiso = yield permisos_1.Permisos.findOneBy({ id: parseInt(id) });
            if (!permiso) {
                return res.status(404).json({ message: "Permiso not found" });
            }
            permiso.name = name;
            permiso.description = description;
            permiso.nameVariable = nameVariable;
            permiso.relatedModule = relatedModule;
            const errors = yield (0, class_validator_1.validate)(permiso);
            if (errors.length > 0) {
                const messages = errors.map(err => ({
                    property: err.property,
                    constraints: err.constraints
                }));
                return res.status(400).json({ message: "Error updating permiso", messages });
            }
            yield permiso.save();
            return res.json(permiso);
        }
        catch (error) {
            next(error);
        }
    });
}
function deletePermiso(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const permiso = yield permisos_1.Permisos.findOneBy({ id: parseInt(id) });
            if (!permiso) {
                return res.status(404).json({ message: "Permiso not found" });
            }
            yield permiso.remove();
            return res.json({ message: "Permiso deleted" });
        }
        catch (error) {
            next(error);
        }
    });
}
