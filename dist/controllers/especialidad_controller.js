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
exports.deleteEspecialidad = exports.updateEspecialidad = exports.createEspecialidad = exports.getEspecialidad = exports.getAllEspecialidades = void 0;
const especialidad_1 = require("../entities/especialidad");
const class_validator_1 = require("class-validator");
function getAllEspecialidades(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const especialidades = yield especialidad_1.Especialidad.find();
            return res.json(especialidades);
        }
        catch (error) {
            next(error);
        }
    });
}
exports.getAllEspecialidades = getAllEspecialidades;
function getEspecialidad(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const especialidad = yield especialidad_1.Especialidad.findOneBy({ id: parseInt(id) });
            if (!especialidad) {
                return res.status(404).json({ message: "Especialidad not found" });
            }
            return res.json(especialidad);
        }
        catch (error) {
            next(error);
        }
    });
}
exports.getEspecialidad = getEspecialidad;
function createEspecialidad(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { name } = req.body;
            if (!name) {
                return res.status(400).json({ message: "Name is required" });
            }
            const especialidadExist = yield especialidad_1.Especialidad.findOneBy({ name });
            if (especialidadExist) {
                return res.status(400).json({ message: "Especialidad already exists" });
            }
            const especialidad = new especialidad_1.Especialidad();
            especialidad.name = name;
            especialidad.status = true;
            const errors = yield (0, class_validator_1.validate)(especialidad);
            if (errors.length > 0) {
                const errorsMessage = errors.map(err => ({
                    property: err.property,
                    constraints: err.constraints
                }));
                return res.status(400).json({ message: "Error creating especialidad", errors: errorsMessage });
            }
            yield especialidad.save();
            return res.status(201).json(especialidad);
        }
        catch (error) {
            next(error);
        }
    });
}
exports.createEspecialidad = createEspecialidad;
function updateEspecialidad(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const { name, status } = req.body;
            if (!id) {
                return res.status(400).json({ message: "Id is required" });
            }
            if (!name) {
                return res.status(400).json({ message: "Name is required" });
            }
            const especialidad = yield especialidad_1.Especialidad.findOneBy({ id: parseInt(id) });
            if (!especialidad) {
                return res.status(404).json({ message: "Especialidad not found" });
            }
            especialidad.name = name;
            especialidad.status = status;
            const errors = yield (0, class_validator_1.validate)(especialidad);
            if (errors.length > 0) {
                const errorsMessage = errors.map(err => ({
                    property: err.property,
                    constraints: err.constraints
                }));
                return res.status(400).json({ message: "Error updating especialidad", errors: errorsMessage });
            }
            yield especialidad.save();
            return res.json(especialidad);
        }
        catch (error) {
            next(error);
        }
    });
}
exports.updateEspecialidad = updateEspecialidad;
function deleteEspecialidad(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ message: "Id is required" });
            }
            const especialidad = yield especialidad_1.Especialidad.findOneBy({ id: parseInt(id) });
            if (!especialidad) {
                return res.status(404).json({ message: "Especialidad not found" });
            }
            yield especialidad.remove();
            return res.json({ message: "Especialidad deleted" });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.deleteEspecialidad = deleteEspecialidad;
