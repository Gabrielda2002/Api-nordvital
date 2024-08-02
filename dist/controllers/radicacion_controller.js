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
exports.deleteRadicado = exports.updateRadicado = exports.createRadicado = exports.getRadicacionById = exports.getAllRadicacion = void 0;
const radicacion_1 = require("../entities/radicacion");
const class_validator_1 = require("class-validator");
function getAllRadicacion(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const radicacion = yield radicacion_1.Radicacion.find();
            return res.json(radicacion);
        }
        catch (error) {
            next(error);
        }
    });
}
exports.getAllRadicacion = getAllRadicacion;
function getRadicacionById(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const radicacion = yield radicacion_1.Radicacion.findOneBy({ id: parseInt(id) });
            if (!radicacion) {
                return res.status(404).json({ message: "Radicacion not found" });
            }
            return res.json(radicacion);
        }
        catch (error) {
            next(error);
        }
    });
}
exports.getRadicacionById = getRadicacionById;
function createRadicado(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { orderDate, place, ipsRemitente, profetional, specialty, diagnosticCode, diagnosticDescription, groupServices, radicador, auditora, auditDate, typeServices, justify, idPatient, auditConcept } = req.body;
            const radicacado = new radicacion_1.Radicacion();
            radicacado.orderDate = orderDate;
            radicacado.place = place;
            radicacado.ipsRemitente = ipsRemitente;
            radicacado.profetional = profetional;
            radicacado.specialty = specialty;
            radicacado.diagnosticCode = diagnosticCode;
            radicacado.diagnosticDescription = diagnosticDescription;
            radicacado.groupServices = groupServices;
            radicacado.typeServices = typeServices;
            radicacado.radicador = radicador;
            radicacado.auditora = auditora;
            radicacado.auditDate = auditDate;
            radicacado.justify = justify;
            radicacado.idPatient = idPatient;
            radicacado.auditConcept = auditConcept;
            const errors = yield (0, class_validator_1.validate)(radicacado);
            if (errors.length > 0) {
                const messages = errors.map((err) => ({
                    property: err.property,
                    constraints: err.constraints,
                }));
                return res.status(400).json({ message: "Error creating radicacion", messages });
            }
            yield radicacado.save();
            return res.json(radicacado);
        }
        catch (error) {
            next(error);
        }
    });
}
exports.createRadicado = createRadicado;
function updateRadicado(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const { orderDate, place, ipsRemitente, profetional, specialty, diagnosticCode, diagnosticDescription, groupServices, radicador, auditora, auditDate, typeServices, justify, idPatient, auditConcept } = req.body;
            const radicacado = yield radicacion_1.Radicacion.findOneBy({ id: parseInt(id) });
            if (!radicacado) {
                return res.status(404).json({ message: "Radicacion not found" });
            }
            radicacado.orderDate = orderDate;
            radicacado.place = place;
            radicacado.ipsRemitente = ipsRemitente;
            radicacado.profetional = profetional;
            radicacado.specialty = specialty;
            radicacado.diagnosticCode = diagnosticCode;
            radicacado.diagnosticDescription = diagnosticDescription;
            radicacado.groupServices = groupServices;
            radicacado.typeServices = typeServices;
            radicacado.radicador = radicador;
            radicacado.auditora = auditora;
            radicacado.auditDate = auditDate;
            radicacado.justify = justify;
            radicacado.idPatient = idPatient;
            radicacado.auditConcept = auditConcept;
            const errors = yield (0, class_validator_1.validate)(radicacado);
            if (errors.length > 0) {
                const messages = errors.map((err) => ({
                    property: err.property,
                    constraints: err.constraints,
                }));
                return res.status(400).json({ message: "Error updating radicacion", messages });
            }
            yield radicacado.save();
            return res.json(radicacado);
        }
        catch (error) {
            next(error);
        }
    });
}
exports.updateRadicado = updateRadicado;
function deleteRadicado(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const radicacado = yield radicacion_1.Radicacion.findOneBy({ id: parseInt(id) });
            if (!radicacado) {
                return res.status(404).json({ message: "Radicacion not found" });
            }
            yield radicacado.remove();
            return res.json({ message: "Radicacion deleted" });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.deleteRadicado = deleteRadicado;
