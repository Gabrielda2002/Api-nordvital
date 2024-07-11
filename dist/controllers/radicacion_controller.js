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
exports.getAllRadicacion = getAllRadicacion;
exports.getRadicacionById = getRadicacionById;
exports.createRadicado = createRadicado;
const radicacion_1 = require("../entities/radicacion");
function getAllRadicacion(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const radicacion = yield radicacion_1.Radicacion.find();
            return res.json(radicacion);
        }
        catch (error) {
            if (error instanceof Error) {
                return res.status(500).json({ message: error.message });
            }
        }
    });
}
function getRadicacionById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const radicacion = yield radicacion_1.Radicacion.findOneBy({ id: parseInt(id) });
            return res.json(radicacion);
        }
        catch (error) {
            if (error instanceof Error) {
                return res.status(500).json({ message: error.message });
            }
        }
    });
}
function createRadicado(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { ipsPrimaria, orderDate, name, email, landline, phoneNumber, address, agreement, documentNumber, documentType, place, ipsRemitente, profetional, specialty, diagnosticCode, descriptionDiagnostic, groupServices, radicador, auditora, auditDate, typeServices, justify } = req.body;
            const radicacado = new radicacion_1.Radicacion();
            radicacado.documentNumber = documentNumber;
            radicacado.documentType = documentType;
            radicacado.patientName = name;
            radicacado.email = email;
            radicacado.phoneNumber = phoneNumber;
            radicacado.landline = landline;
            radicacado.address = address;
            radicacado.agreement = agreement;
            radicacado.ipsPrimaria = ipsPrimaria;
            radicacado.orderDate = orderDate;
            radicacado.place = place;
            radicacado.ipsRemitente = ipsRemitente;
            radicacado.profetional = profetional;
            radicacado.specialty = specialty;
            radicacado.diagnosticCode = diagnosticCode;
            radicacado.diagnosticDescription = descriptionDiagnostic;
            radicacado.groupServices = groupServices;
            radicacado.typeServices = typeServices;
            radicacado.radicador = radicador;
            radicacado.auditora = auditora;
            radicacado.auditDate = auditDate;
            radicacado.justify = justify;
            yield radicacado.save();
            return res.json(radicacado);
        }
        catch (error) {
            if (error instanceof Error) {
                return res.status(500).json({ message: error.message });
            }
        }
    });
}
