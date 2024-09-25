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
exports.getAllDiagnosticos = getAllDiagnosticos;
exports.getDiagnosticoById = getDiagnosticoById;
exports.createDiagnostico = createDiagnostico;
exports.updateDiagnostico = updateDiagnostico;
exports.deleteDiagnostico = deleteDiagnostico;
exports.getDiagnosticosByName = getDiagnosticosByName;
const diagnostico_1 = require("../entities/diagnostico");
const class_validator_1 = require("class-validator");
function getAllDiagnosticos(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const diagnosticos = yield diagnostico_1.Diagnostico.find();
            if (diagnosticos.length === 0) {
                return res.status(404).json({ message: "No se encontraron diagnosticos" });
            }
            return res.json(diagnosticos);
        }
        catch (error) {
            next(error);
        }
    });
}
function getDiagnosticoById(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const diagnostico = yield diagnostico_1.Diagnostico.findOneBy({ id: parseInt(id) });
            if (!diagnostico) {
                return res.status(404).json({ message: "Diagnostico not found" });
            }
            return res.json(diagnostico);
        }
        catch (error) {
            next(error);
        }
    });
}
function createDiagnostico(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { code, description } = req.body;
            if (!code || !description) {
                return res.status(400).json({ message: "Todos los campos son requeridos." });
            }
            const diagnosticoExists = yield diagnostico_1.Diagnostico.findOneBy({ code });
            if (diagnosticoExists) {
                return res.status(409).json({ message: "El diagnóstico ya existe." });
            }
            const diagnostico = diagnostico_1.Diagnostico.create({
                code,
                description,
            });
            const errors = yield (0, class_validator_1.validate)(diagnostico);
            if (errors.length > 0) {
                const errorsMessage = errors.map(err => ({
                    property: err.property,
                    constraints: err.constraints,
                }));
                return res.status(400).json({ message: "Error al crear el diagnóstico", errors: errorsMessage });
            }
            yield diagnostico.save();
            return res.status(201).json(diagnostico);
        }
        catch (error) {
            next(error);
        }
    });
}
function updateDiagnostico(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ message: "Id is required" });
            }
            const { code, description } = req.body;
            if (!code || !description) {
                return res.status(400).json({ message: "All fields are required" });
            }
            const diagnostico = yield diagnostico_1.Diagnostico.findOneBy({ id: parseInt(id) });
            if (!diagnostico) {
                return res.status(404).json({ message: "Diagnostico not found" });
            }
            diagnostico.code = code;
            diagnostico.description = description;
            const errors = yield (0, class_validator_1.validate)(diagnostico);
            if (errors.length > 0) {
                const errorsMessage = errors.map(err => ({
                    property: err.property,
                    constraints: err.constraints
                }));
                return res.status(400).json({ message: "Error updating diagnostico", errors: errorsMessage });
            }
            yield diagnostico.save();
            return res.json(diagnostico);
        }
        catch (error) {
            next(error);
        }
    });
}
function deleteDiagnostico(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ message: "Id is required" });
            }
            const diagnostico = yield diagnostico_1.Diagnostico.findOneBy({ id: parseInt(id) });
            if (!diagnostico) {
                return res.status(404).json({ message: "Diagnostico not found" });
            }
            yield diagnostico.remove();
            return res.json({ message: "Diagnostico deleted" });
        }
        catch (error) {
            next(error);
        }
    });
}
function getDiagnosticosByName(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { code } = req.body;
            const diagnosticos = yield diagnostico_1.Diagnostico.createQueryBuilder("diagnostico")
                .where("diagnostico.code = :code", { code })
                .getMany();
            if (diagnosticos.length === 0) {
                return res.status(404).json({ message: "No diagnosticos found" });
            }
            return res.json(diagnosticos);
        }
        catch (error) {
            next(error);
        }
    });
}
