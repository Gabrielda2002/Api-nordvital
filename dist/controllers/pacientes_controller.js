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
exports.getAllPacientes = getAllPacientes;
exports.getPaciente = getPaciente;
exports.createPaciente = createPaciente;
exports.updatePaciente = updatePaciente;
exports.deletePaciente = deletePaciente;
exports.getPacientesByDocument = getPacientesByDocument;
const pacientes_1 = require("../entities/pacientes");
const class_validator_1 = require("class-validator");
function getAllPacientes(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const pacientes = yield pacientes_1.Pacientes.find({
                relations: ["convenioRelation", "ipsPrimariaRelation", "documentRelation"],
            });
            return res.json(pacientes);
        }
        catch (error) {
            next(error);
        }
    });
}
function getPaciente(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const paciente = yield pacientes_1.Pacientes.findOne({
                where: { id: parseInt(id) },
                relations: ["convenioRelation", "ipsPrimariaRelation", "documentRelation"]
            });
            if (!paciente) {
                return res.status(404).json({ message: "Paciente not found" });
            }
            return res.json(paciente);
        }
        catch (error) {
            next(error);
        }
    });
}
function createPaciente(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { documentType, documentNumber, name, phoneNumber, landline, email, address, convenio, ipsPrimaria } = req.body;
            const pacienteExist = yield pacientes_1.Pacientes.findOneBy({ documentNumber });
            if (pacienteExist) {
                return res.status(400).json({ message: "Paciente already exists" });
            }
            const paciente = new pacientes_1.Pacientes();
            paciente.documentType = documentType;
            paciente.documentNumber = documentNumber;
            paciente.name = name;
            paciente.phoneNumber = phoneNumber;
            paciente.landline = landline;
            paciente.email = email;
            paciente.address = address;
            paciente.convenio = convenio;
            paciente.ipsPrimaria = ipsPrimaria;
            paciente.status = true;
            const errors = yield (0, class_validator_1.validate)(paciente);
            if (errors.length > 0) {
                const messages = errors.map((err) => ({
                    property: err.property,
                    constraints: err.constraints,
                }));
                return res
                    .status(400)
                    .json({ message: "Error creating paciente", messages });
            }
            yield paciente.save();
            return res.json(paciente);
        }
        catch (error) {
            next(error);
        }
    });
}
function updatePaciente(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const { documentType, documentNumber, name, phoneNumber, landline, email, address, convenio, ipsPrimaria, status } = req.body;
            const paciente = yield pacientes_1.Pacientes.findOneBy({ id: parseInt(id) });
            if (!paciente) {
                return res.status(404).json({ message: "Paciente not found" });
            }
            // paciente.documentType = documentType;
            // paciente.documentNumber = documentNumber;
            // paciente.name = name;
            paciente.phoneNumber = phoneNumber;
            paciente.landline = landline;
            paciente.email = email;
            paciente.address = address;
            // paciente.convenio = convenio;
            // paciente.ipsPrimaria = ipsPrimaria;
            // paciente.status = status;
            const errors = yield (0, class_validator_1.validate)(paciente);
            if (errors.length > 0) {
                const messages = errors.map((err) => ({
                    property: err.property,
                    constraints: err.constraints,
                }));
                return res
                    .status(400)
                    .json({ message: "Error updating paciente", messages });
            }
            yield paciente.save();
            return res.json(paciente);
        }
        catch (error) {
            next(error);
        }
    });
}
function deletePaciente(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const paciente = yield pacientes_1.Pacientes.findOneBy({ id: parseInt(id) });
            if (!paciente) {
                return res.status(404).json({ message: "Paciente not found" });
            }
            yield paciente.remove();
            return res.json({ message: "Paciente deleted" });
        }
        catch (error) {
            next(error);
        }
    });
}
function getPacientesByDocument(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { documentNumber } = req.body;
            console.log(documentNumber);
            const paciente = yield pacientes_1.Pacientes.createQueryBuilder("pacientes")
                .where("pacientes.documentNumber = :documentNumber", { documentNumber })
                .leftJoinAndSelect("pacientes.convenioRelation", "convenioRelation")
                .leftJoinAndSelect("pacientes.ipsPrimariaRelation", "ipsPrimariaRelation")
                .leftJoinAndSelect("pacientes.documentRelation", "documentRelation")
                .getOne();
            if (!paciente) {
                return res.status(404).json({ message: "Paciente not found" });
            }
            return res.json(paciente);
        }
        catch (error) {
            next(error);
        }
    });
}
