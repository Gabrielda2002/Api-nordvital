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
exports.getAllUnidadFuncional = getAllUnidadFuncional;
exports.getUnidadFuncionalById = getUnidadFuncionalById;
exports.createUnidadFuncional = createUnidadFuncional;
exports.updateUnidadFuncional = updateUnidadFuncional;
exports.deleteUnidadFuncional = deleteUnidadFuncional;
const unidad_funcional_1 = require("../entities/unidad-funcional");
const class_validator_1 = require("class-validator");
function getAllUnidadFuncional(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const unidadFuncional = yield unidad_funcional_1.UnidadFuncional.find();
            return res.json(unidadFuncional);
        }
        catch (error) {
            next(error);
        }
    });
}
function getUnidadFuncionalById(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const unidadFuncional = yield unidad_funcional_1.UnidadFuncional.findOneBy({ id: parseInt(id) });
            if (!unidadFuncional) {
                return res.status(404).json({ message: "Unidad Funcional no encontrada" });
            }
            return res.json(unidadFuncional);
        }
        catch (error) {
            next(error);
        }
    });
}
function createUnidadFuncional(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { name } = req.body;
            const unidadFuncionalExist = yield unidad_funcional_1.UnidadFuncional.findOneBy({ name });
            if (unidadFuncionalExist) {
                return res.status(409).json({ message: "La unidad funcional ya existe" });
            }
            const unidadFuncional = new unidad_funcional_1.UnidadFuncional();
            unidadFuncional.name = name;
            unidadFuncional.status = true;
            const errors = yield (0, class_validator_1.validate)(unidadFuncional);
            if (errors.length > 0) {
                const messageErrro = errors.map(err => ({
                    property: err.property,
                    constraints: err.constraints
                }));
                return res.status(400).json({ "message": "Ocurrio un error: ", messageErrro });
            }
            yield unidadFuncional.save();
            return res.json(unidadFuncional);
        }
        catch (error) {
            next(error);
        }
    });
}
function updateUnidadFuncional(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const { name, status } = req.body;
            const unidadFuncional = yield unidad_funcional_1.UnidadFuncional.findOneBy({ id: parseInt(id) });
            if (!unidadFuncional) {
                return res.status(404).json({ message: "Unidad Funcional no encontrada" });
            }
            unidadFuncional.name = name;
            unidadFuncional.status = status;
            const errors = yield (0, class_validator_1.validate)(unidadFuncional);
            if (errors.length > 0) {
                const messageErrro = errors.map(err => ({
                    property: err.property,
                    constraints: err.constraints
                }));
                return res.status(400).json({ "message": "Ocurrio un error: ", messageErrro });
            }
            yield unidadFuncional.save();
            return res.json(unidadFuncional);
        }
        catch (error) {
            next(error);
        }
    });
}
function deleteUnidadFuncional(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const unidadFuncional = yield unidad_funcional_1.UnidadFuncional.findOneBy({ id: parseInt(id) });
            if (!unidadFuncional) {
                return res.status(404).json({ message: "Unidad Funcional no encontrada" });
            }
            yield unidadFuncional.remove();
            return res.json({ message: "Unidad Funcional eliminada" });
        }
        catch (error) {
            next(error);
        }
    });
}
