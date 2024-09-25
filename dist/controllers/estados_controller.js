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
exports.getAllEstados = getAllEstados;
exports.getEstadosById = getEstadosById;
exports.createEstados = createEstados;
exports.updateEstados = updateEstados;
exports.deleteEstados = deleteEstados;
const estados_1 = require("../entities/estados");
const class_validator_1 = require("class-validator");
function getAllEstados(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const estados = yield estados_1.Estados.find();
            return res.json(estados);
        }
        catch (error) {
            next(error);
        }
    });
}
function getEstadosById(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const estado = yield estados_1.Estados.findOneBy({ id: parseInt(id) });
            if (!estado) {
                return res.status(404).json({ message: "Estado not found" });
            }
            return res.json(estado);
        }
        catch (error) {
            next(error);
        }
    });
}
function createEstados(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { name } = req.body;
            if (!name) {
                return res.status(400).json({ message: "Name is required" });
            }
            const estadoExist = yield estados_1.Estados.findOneBy({ name });
            if (estadoExist) {
                return res.status(400).json({ message: "Estado already exists" });
            }
            const newEstados = new estados_1.Estados();
            newEstados.name = name;
            const errors = yield (0, class_validator_1.validate)(newEstados);
            if (errors.length > 0) {
                const errorsMessage = errors.map(err => ({
                    property: err.property,
                    constraints: err.constraints
                }));
                return res.status(400).json(errorsMessage);
            }
            yield newEstados.save();
            return res.json(newEstados);
        }
        catch (error) {
            next(error);
        }
    });
}
function updateEstados(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const { name } = req.body;
            const estado = yield estados_1.Estados.findOneBy({ id: parseInt(id) });
            if (!estado) {
                return res.status(404).json({ message: "Estado not found" });
            }
            estado.name = name;
            const errors = yield (0, class_validator_1.validate)(estado);
            if (errors.length > 0) {
                const errorsMessage = errors.map(err => ({
                    property: err.property,
                    constraints: err.constraints
                }));
                return res.status(400).json(errorsMessage);
            }
            yield estado.save();
            return res.json(estado);
        }
        catch (error) {
            next(error);
        }
    });
}
function deleteEstados(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const estado = yield estados_1.Estados.findOneBy({ id: parseInt(id) });
            if (!estado) {
                return res.status(404).json({ message: "Estado not found" });
            }
            yield estado.remove();
            return res.json({ message: "Estado removed" });
        }
        catch (error) {
            next(error);
        }
    });
}
