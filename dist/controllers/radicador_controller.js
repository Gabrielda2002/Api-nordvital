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
exports.getAllRadicador = getAllRadicador;
exports.getRadicador = getRadicador;
exports.createRadicador = createRadicador;
exports.updateRadicador = updateRadicador;
exports.deleteRadicador = deleteRadicador;
exports.updateStatusRadicador = updateStatusRadicador;
const radicador_1 = require("../entities/radicador");
const class_validator_1 = require("class-validator");
function getAllRadicador(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const radicador = yield radicador_1.Radicador.find();
            return res.json(radicador);
        }
        catch (error) {
            next(error);
        }
    });
}
function getRadicador(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const radicador = yield radicador_1.Radicador.findOneBy({ id: parseInt(id) });
            if (!radicador) {
                return res.status(404).json({ message: 'Radicador no encontrado' });
            }
            return res.json(radicador);
        }
        catch (error) {
            next(error);
        }
    });
}
function createRadicador(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { name } = req.body;
            const radicacadorExist = yield radicador_1.Radicador.findOneBy({ name });
            if (radicacadorExist) {
                return res.status(409).json({ message: 'Radicador ya existe' });
            }
            const radicador = new radicador_1.Radicador();
            radicador.name = name;
            radicador.status = true;
            const errors = yield (0, class_validator_1.validate)(radicador);
            if (errors.length > 0) {
                const messages = errors.map(err => ({
                    property: err.property,
                    constraints: err.constraints
                }));
                return res.status(400).json({ message: 'Error creando radicador', messages });
            }
            yield radicador.save();
            return res.json(radicador);
        }
        catch (error) {
            next(error);
        }
    });
}
function updateRadicador(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const { name, status } = req.body;
            const radicador = yield radicador_1.Radicador.findOneBy({ id: parseInt(id) });
            if (!radicador) {
                return res.status(404).json({ message: 'Radicador no encontrado' });
            }
            radicador.name = name;
            radicador.status = status;
            const errors = yield (0, class_validator_1.validate)(radicador);
            if (errors.length > 0) {
                const messages = errors.map(err => ({
                    property: err.property,
                    constraints: err.constraints
                }));
                return res.status(400).json({ message: 'Error actualizando radicador', messages });
            }
            yield radicador.save();
            return res.json(radicador);
        }
        catch (error) {
            next(error);
        }
    });
}
function deleteRadicador(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const radicador = yield radicador_1.Radicador.findOneBy({ id: parseInt(id) });
            if (!radicador) {
                return res.status(404).json({ message: 'Radicador no encontrado' });
            }
            yield radicador.remove();
            return res.json({ message: 'Radicador eliminado' });
        }
        catch (error) {
            next(error);
        }
    });
}
// controlador actualizar estado radicador
function updateStatusRadicador(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const { status } = req.body;
            console.log(status);
            console.log(Boolean(status));
            const radicador = yield radicador_1.Radicador.findOneBy({ id: parseInt(id) });
            if (!radicador) {
                return res.status(404).json({ message: 'Radicador not fond' });
            }
            radicador.status = status == "1";
            const errors = yield (0, class_validator_1.validate)(radicador);
            if (errors.length > 0) {
                const messages = errors.map(err => ({
                    property: err.property,
                    constraints: err.constraints
                }));
                return res.status(400).json({ message: 'Error actualizando estado radicador', messages });
            }
            yield radicador.save();
            return res.json(radicador);
        }
        catch (error) {
            next(error);
        }
    });
}
