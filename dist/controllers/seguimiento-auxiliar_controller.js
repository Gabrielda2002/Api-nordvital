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
exports.getAllSeguimientosAuxiliares = getAllSeguimientosAuxiliares;
exports.getSeguimientoAuxiliar = getSeguimientoAuxiliar;
exports.createSeguimientoAuxiliar = createSeguimientoAuxiliar;
exports.updateSeguimientoAuxiliar = updateSeguimientoAuxiliar;
exports.deleteSeguimientoAuxiliar = deleteSeguimientoAuxiliar;
const seguimiento_auxiliar_1 = require("../entities/seguimiento-auxiliar");
const class_validator_1 = require("class-validator");
function getAllSeguimientosAuxiliares(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const seguimientosAuxiliares = yield seguimiento_auxiliar_1.SeguimietoAuxiliar.find({
                relations: ["radicacionRelation", "estadoSeguimientoRelation"]
            });
            return res.json(seguimientosAuxiliares);
        }
        catch (error) {
            next(error);
        }
    });
}
function getSeguimientoAuxiliar(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const seguimientoAuxiliar = yield seguimiento_auxiliar_1.SeguimietoAuxiliar.findOne({
                where: { id: parseInt(id) },
                relations: ["radicacionRelation", "estadoSeguimientoRelation"]
            });
            if (!seguimientoAuxiliar) {
                return res.status(404).json({ message: "Seguimiento auxiliar no encontrado" });
            }
            return res.json(seguimientoAuxiliar);
        }
        catch (error) {
            next(error);
        }
    });
}
function createSeguimientoAuxiliar(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { observation, status, codeCups, idRadicacion } = req.body;
            if (!observation || !status || !idRadicacion) {
                return res.status(400).json({ message: "Todos los campos son requeridos" });
            }
            const seguimientoAuxiliar = new seguimiento_auxiliar_1.SeguimietoAuxiliar();
            seguimientoAuxiliar.observation = observation;
            seguimientoAuxiliar.status = parseInt(status);
            seguimientoAuxiliar.codeCups = codeCups;
            seguimientoAuxiliar.idRadicacion = parseInt(idRadicacion);
            const errors = yield (0, class_validator_1.validate)(seguimientoAuxiliar);
            if (errors.length > 0) {
                const errorsMessage = errors.map(error => ({
                    property: error.property,
                    constraints: error.constraints
                }));
                return res.status(400).json({ message: "Error creando seguimiento auxiliar", errorsMessage });
            }
            yield seguimientoAuxiliar.save();
            return res.json(seguimientoAuxiliar);
        }
        catch (error) {
            next(error);
        }
    });
}
function updateSeguimientoAuxiliar(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const { observation, status, codeCups } = req.body;
            const seguimientoAuxiliar = yield seguimiento_auxiliar_1.SeguimietoAuxiliar.findOneBy({ id: parseInt(id) });
            if (!seguimientoAuxiliar) {
                return res.status(404).json({ message: "Seguimiento auxiliar no encontrado" });
            }
            seguimientoAuxiliar.observation = observation;
            seguimientoAuxiliar.status = status;
            seguimientoAuxiliar.codeCups = codeCups;
            const errors = yield (0, class_validator_1.validate)(seguimientoAuxiliar);
            if (errors.length > 0) {
                const errorsMessage = errors.map(error => ({
                    property: error.property,
                    constraints: error.constraints
                }));
                return res.status(400).json({ message: "Error actualizando seguimiento auxiliar", errorsMessage });
            }
            yield seguimientoAuxiliar.save();
            return res.json(seguimientoAuxiliar);
        }
        catch (error) {
            next(error);
        }
    });
}
function deleteSeguimientoAuxiliar(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const seguimientoAuxiliar = yield seguimiento_auxiliar_1.SeguimietoAuxiliar.findOneBy({ id: parseInt(id) });
            if (!seguimientoAuxiliar) {
                return res.status(404).json({ message: "Seguimiento auxiliar no encontrado" });
            }
            yield seguimientoAuxiliar.remove();
            return res.json({ message: "Seguimiento auxiliar eliminado" });
        }
        catch (error) {
            next(error);
        }
    });
}
