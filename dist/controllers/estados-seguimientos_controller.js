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
exports.getEstadosSeguimientos = getEstadosSeguimientos;
exports.getEstadosSeguimiento = getEstadosSeguimiento;
exports.createEstadosSeguimiento = createEstadosSeguimiento;
exports.updateEstadosSeguimiento = updateEstadosSeguimiento;
exports.deleteEstadosSeguimiento = deleteEstadosSeguimiento;
const estados_seguimiento_1 = require("../entities/estados-seguimiento");
const class_validator_1 = require("class-validator");
function getEstadosSeguimientos(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const estadosSeguimientos = yield estados_seguimiento_1.EstadosSeguimiento.find();
            return res.json(estadosSeguimientos);
        }
        catch (error) {
            next(error);
        }
    });
}
function getEstadosSeguimiento(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ message: "Id is required" });
            }
            const estadoSeguimiento = yield estados_seguimiento_1.EstadosSeguimiento.findOneBy({ id: parseInt(id) });
            if (!estadoSeguimiento) {
                return res.status(404).json({ message: "Estado de seguimiento not found" });
            }
            return res.json(estadoSeguimiento);
        }
        catch (error) {
            next(error);
        }
    });
}
function createEstadosSeguimiento(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { name } = req.body;
            if (!name) {
                return res.status(400).json({ message: "Name and status are required" });
            }
            const estadoSeguimientoExist = yield estados_seguimiento_1.EstadosSeguimiento.findOneBy({ name });
            if (estadoSeguimientoExist) {
                return res.status(400).json({ message: "Estado de seguimiento already exists" });
            }
            const estadoSeguimiento = new estados_seguimiento_1.EstadosSeguimiento();
            estadoSeguimiento.name = name;
            estadoSeguimiento.status = true;
            const errors = yield (0, class_validator_1.validate)(estadoSeguimiento);
            if (errors.length > 0) {
                const errorsMessage = errors.map(err => ({
                    property: err.property,
                    constraints: err.constraints
                }));
                return res.status(400).json({ message: "Error creating estado de seguimiento", errors: errorsMessage });
            }
            yield estadoSeguimiento.save();
            return res.json(estadoSeguimiento);
        }
        catch (error) {
            next(error);
        }
    });
}
function updateEstadosSeguimiento(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ message: "Id is required" });
            }
            const { name, status } = req.body;
            if (!name || !status) {
                return res.status(400).json({ message: "Name and status are required" });
            }
            const estadoSeguimiento = yield estados_seguimiento_1.EstadosSeguimiento.findOneBy({ id: parseInt(id) });
            if (!estadoSeguimiento) {
                return res.status(404).json({ message: "Estado de seguimiento not found" });
            }
            estadoSeguimiento.name = name;
            estadoSeguimiento.status = status;
            const errors = yield (0, class_validator_1.validate)(estadoSeguimiento);
            if (errors.length > 0) {
                const errorsMessage = errors.map(err => ({
                    property: err.property,
                    constraints: err.constraints
                }));
                return res.status(400).json({ message: "Error updating estado de seguimiento", errors: errorsMessage });
            }
            yield estadoSeguimiento.save();
            return res.json(estadoSeguimiento);
        }
        catch (error) {
            next(error);
        }
    });
}
function deleteEstadosSeguimiento(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ message: "Id is required" });
            }
            const estadoSeguimiento = yield estados_seguimiento_1.EstadosSeguimiento.findOneBy({ id: parseInt(id) });
            if (!estadoSeguimiento) {
                return res.status(404).json({ message: "Estado de seguimiento not found" });
            }
            yield estadoSeguimiento.remove();
            return res.json({ message: "Estado de seguimiento deleted" });
        }
        catch (error) {
            next(error);
        }
    });
}
