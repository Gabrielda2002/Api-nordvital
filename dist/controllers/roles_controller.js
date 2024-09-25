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
exports.getAllRoles = getAllRoles;
exports.getRole = getRole;
exports.createRole = createRole;
exports.updateRole = updateRole;
exports.deleteRole = deleteRole;
const roles_1 = require("../entities/roles");
const class_validator_1 = require("class-validator");
function getAllRoles(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const roles = yield roles_1.Roles.find();
            return res.json(roles);
        }
        catch (error) {
            next(error);
        }
    });
}
function getRole(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const role = yield roles_1.Roles.findOneBy({ id: parseInt(id) });
            if (!role) {
                return res.status(404).json({ message: 'roles no encontrados' });
            }
            return res.json(role);
        }
        catch (error) {
            next(error);
        }
    });
}
function createRole(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { name } = req.body;
            const roleExist = yield roles_1.Roles.findOneBy({ name });
            if (roleExist) {
                return res.status(400).json({ message: 'El rol ya existe' });
            }
            const roles = new roles_1.Roles();
            roles.name = name;
            const errors = yield (0, class_validator_1.validate)(roles);
            if (errors.length > 0) {
                const errorsMessage = errors.map(error => ({
                    property: error.property,
                    constraints: error.constraints
                }));
                return res.status(400).json({ message: 'Error creando rol', errorsMessage });
            }
            yield roles.save();
            return res.json(roles);
        }
        catch (error) {
            next(error);
        }
    });
}
function updateRole(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const { name } = req.body;
            const rolExist = yield roles_1.Roles.findOneBy({ id: parseInt(id) });
            if (!rolExist) {
                return res.status(404).json({ message: 'Rol no encontrado' });
            }
            rolExist.name = name;
            const errors = yield (0, class_validator_1.validate)(rolExist);
            if (errors.length > 0) {
                const errorsMessage = errors.map(error => ({
                    property: error.property,
                    constraints: error.constraints
                }));
                return res.status(400).json({ message: 'Error actualizando rol', errorsMessage });
            }
            yield rolExist.save();
            return res.json(rolExist);
        }
        catch (error) {
            next(error);
        }
    });
}
function deleteRole(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const rolExist = yield roles_1.Roles.findOneBy({ id: parseInt(id) });
            if (!rolExist) {
                return res.status(404).json({ message: 'Rol no encontrado' });
            }
            yield rolExist.remove();
            return res.json({ message: 'Rol eliminado' });
        }
        catch (error) {
            next(error);
        }
    });
}
