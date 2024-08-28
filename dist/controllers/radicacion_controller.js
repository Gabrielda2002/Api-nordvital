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
exports.updateRadicado = updateRadicado;
exports.deleteRadicado = deleteRadicado;
exports.mostrarTabla = mostrarTabla;
exports.tablaPorAuditar = tablaPorAuditar;
exports.auditorRadicados = auditorRadicados;
const radicacion_1 = require("../entities/radicacion");
const class_validator_1 = require("class-validator");
function getAllRadicacion(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const radicacion = yield radicacion_1.Radicacion.find({
                relations: [
                    "specialtyRelation",
                    "placeRelation",
                    "ipsRemiteRelation",
                    "servicesGroupRelation",
                    "servicesRelation",
                    "radicadorRelation",
                    "patientRelation",
                ],
            });
            return res.json(radicacion);
        }
        catch (error) {
            next(error);
        }
    });
}
function getRadicacionById(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        try {
            const { id } = req.params;
            const radicacion = yield radicacion_1.Radicacion.createQueryBuilder("radicacion")
                .where("radicacion.id = :id", { id: parseInt(id) })
                .leftJoinAndSelect("radicacion.specialtyRelation", "specialty")
                .leftJoinAndSelect("radicacion.placeRelation", "place")
                .leftJoinAndSelect("radicacion.ipsRemiteRelation", "ipsRemite")
                .leftJoinAndSelect("radicacion.servicesGroupRelation", "servicesGroup")
                .leftJoinAndSelect("radicacion.servicesRelation", "services")
                .leftJoinAndSelect("radicacion.radicadorRelation", "radicador")
                .leftJoinAndSelect("radicacion.patientRelation", "patient")
                .leftJoinAndSelect("radicacion.cupsRadicadosRelation", "cupsRadicados")
                .getOne();
            if (!radicacion) {
                return res.status(404).json({ message: "Radicacion not found" });
            }
            const radicacionFormated = {
                id: radicacion.id,
                name: (_a = radicacion.patientRelation) === null || _a === void 0 ? void 0 : _a.name,
                document: (_b = radicacion.patientRelation) === null || _b === void 0 ? void 0 : _b.documentNumber,
                convenio: (_d = (_c = radicacion.patientRelation) === null || _c === void 0 ? void 0 : _c.convenioRelation) === null || _d === void 0 ? void 0 : _d.name,
                specialty: (_e = radicacion.specialtyRelation) === null || _e === void 0 ? void 0 : _e.name,
                place: (_f = radicacion.placeRelation) === null || _f === void 0 ? void 0 : _f.name,
                ipsRemite: (_g = radicacion.ipsRemiteRelation) === null || _g === void 0 ? void 0 : _g.name,
                servicesGroup: (_h = radicacion.servicesGroupRelation) === null || _h === void 0 ? void 0 : _h.name,
                services: (_j = radicacion.servicesRelation) === null || _j === void 0 ? void 0 : _j.name,
                radicador: (_k = radicacion.radicadorRelation) === null || _k === void 0 ? void 0 : _k.name,
                auditDate: radicacion.auditDate,
                createdAt: radicacion.createdAt,
                orderDate: radicacion.orderDate,
                profetional: radicacion.profetional,
                diagnosticCode: radicacion.diagnosticCode,
                diagnosticDescription: radicacion.diagnosticDescription,
                groupServices: radicacion.groupServices,
                typeServices: radicacion.typeServices,
                justify: radicacion.justify,
                auditConcept: radicacion.auditConcept,
                cupsRadicados: (_l = radicacion.cupsRadicadosRelation) === null || _l === void 0 ? void 0 : _l.map((c) => ({
                    id: c.id,
                    code: c.code,
                    DescriptionCode: c.DescriptionCode,
                    status: c.status,
                    observation: c.observation,
                    functionalUnit: c.functionalUnit,
                    idRadicacion: c.idRadicacion,
                    updatedAt: c.updatedAt,
                    createdAt: c.createdAt,
                })),
            };
            return res.json(radicacionFormated);
        }
        catch (error) {
            next(error);
        }
    });
}
function createRadicado(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { orderDate, place, ipsRemitente, profetional, specialty, diagnosticCode, diagnosticDescription, groupServices, radicador, typeServices, idPatient, idSoporte } = req.body;
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
            radicacado.auditora = "Pendiente";
            radicacado.justify = "Pendiente";
            radicacado.auditConcept = 6;
            radicacado.idPatient = idPatient;
            radicacado.idSoporte = idSoporte;
            const errors = yield (0, class_validator_1.validate)(radicacado);
            if (errors.length > 0) {
                const messages = errors.map((err) => ({
                    property: err.property,
                    constraints: err.constraints,
                }));
                return res
                    .status(400)
                    .json({ message: "Error creating radicacion", messages });
            }
            yield radicacado.save();
            return res.json(radicacado);
        }
        catch (error) {
            next(error);
        }
    });
}
function updateRadicado(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const { orderDate, place, ipsRemitente, profetional, specialty, diagnosticCode, diagnosticDescription, groupServices, radicador, auditora, auditDate, typeServices, justify, idPatient, auditConcept, } = req.body;
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
                return res
                    .status(400)
                    .json({ message: "Error updating radicacion", messages });
            }
            yield radicacado.save();
            return res.json(radicacado);
        }
        catch (error) {
            next(error);
        }
    });
}
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
function mostrarTabla(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const radicaciones = yield radicacion_1.Radicacion.createQueryBuilder("radicacion")
                .leftJoinAndSelect("radicacion.patientRelation", "pacientes")
                .leftJoinAndSelect("pacientes.convenioRelation", "convenio")
                .leftJoinAndSelect("pacientes.documentRelation", "document")
                .leftJoinAndSelect("radicacion.seguimientoAuxiliarRelation", "seguimientoAuxiliar")
                .orderBy("radicacion.id", "DESC")
                .getMany();
            const formatedRadicaciones = radicaciones.map((r) => {
                var _a, _b, _c, _d, _e, _f, _g;
                const latestSeguimiento = (_a = r.seguimientoAuxiliarRelation) === null || _a === void 0 ? void 0 : _a.sort((a, b) => b.id - a.id)[0];
                return {
                    createdAt: r.createdAt,
                    typeDocument: ((_c = (_b = r.patientRelation) === null || _b === void 0 ? void 0 : _b.documentRelation) === null || _c === void 0 ? void 0 : _c.name) || "N/A",
                    id: r.id,
                    convenio: ((_e = (_d = r.patientRelation) === null || _d === void 0 ? void 0 : _d.convenioRelation) === null || _e === void 0 ? void 0 : _e.name) || "N/A",
                    document: ((_f = r.patientRelation) === null || _f === void 0 ? void 0 : _f.documentNumber) || "N/A",
                    patientName: ((_g = r.patientRelation) === null || _g === void 0 ? void 0 : _g.name) || "N/A",
                    auditDate: r.auditDate,
                    management: latestSeguimiento ? latestSeguimiento.observation : "N/A",
                };
            });
            return res.json(formatedRadicaciones);
        }
        catch (error) {
            next(error);
        }
    });
}
function tablaPorAuditar(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const radicaciones = yield radicacion_1.Radicacion.createQueryBuilder("radicacion")
                .leftJoinAndSelect("radicacion.patientRelation", "pacientes")
                .leftJoinAndSelect("pacientes.convenioRelation", "convenio")
                .leftJoinAndSelect("pacientes.documentRelation", "document")
                .leftJoinAndSelect("radicacion.placeRelation", "place")
                .leftJoinAndSelect("radicacion.ipsRemiteRelation", "ipsRemite")
                .leftJoinAndSelect("radicacion.specialtyRelation", "specialty")
                .leftJoinAndSelect("radicacion.servicesRelation", "services")
                .leftJoinAndSelect("radicacion.radicadorRelation", "radicador")
                .leftJoinAndSelect("radicacion.cupsRadicadosRelation", "cupsRadicados")
                .where("cupsRadicados.status = 6")
                .orderBy("radicacion.id", "DESC")
                .getMany();
            const formatedRadicaciones = yield radicaciones.map((r) => {
                var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
                return ({
                    radicadoDate: r.createdAt,
                    documentType: ((_a = r.patientRelation) === null || _a === void 0 ? void 0 : _a.documentRelation.name) || "N/A",
                    documentNumber: ((_b = r.patientRelation) === null || _b === void 0 ? void 0 : _b.documentNumber) || "N/A",
                    namePatient: ((_c = r.patientRelation) === null || _c === void 0 ? void 0 : _c.name) || "N/A",
                    convenio: ((_e = (_d = r.patientRelation) === null || _d === void 0 ? void 0 : _d.convenioRelation) === null || _e === void 0 ? void 0 : _e.name) || "N/A",
                    ipsPrimary: r.patientRelation.ipsPrimaria || "N/A",
                    orderDate: r.orderDate || "N/A",
                    place: ((_f = r.placeRelation) === null || _f === void 0 ? void 0 : _f.name) || "N/A",
                    ipsRemitente: ((_g = r.ipsRemiteRelation) === null || _g === void 0 ? void 0 : _g.name) || "N/A",
                    profetional: r.profetional || "N/A",
                    speciality: ((_h = r.specialtyRelation) === null || _h === void 0 ? void 0 : _h.name) || "N/A",
                    typeServices: ((_j = r.servicesRelation) === null || _j === void 0 ? void 0 : _j.name) || "N/A",
                    radicador: ((_k = r.radicadorRelation) === null || _k === void 0 ? void 0 : _k.name) || "N/A",
                    statusCups: ((_l = r.cupsRadicadosRelation) === null || _l === void 0 ? void 0 : _l.map((c) => ({
                        code: c.code,
                        description: c.DescriptionCode,
                        observation: c.observation
                    }))) || "N/A",
                });
            });
            return res.json(formatedRadicaciones);
        }
        catch (error) {
            next(error);
        }
    });
}
function auditorRadicados(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const radicaciones = yield radicacion_1.Radicacion.createQueryBuilder("radicacion")
                .leftJoinAndSelect("radicacion.patientRelation", "pacientes")
                .leftJoinAndSelect("pacientes.convenioRelation", "convenio")
                .leftJoinAndSelect("pacientes.documentRelation", "document")
                .leftJoinAndSelect("radicacion.cupsRadicadosRelation", "cupsRadicados")
                .orderBy("radicacion.id", "DESC")
                .getMany();
            const formatedRadicaciones = radicaciones.map((r) => {
                var _a, _b, _c, _d;
                return ({
                    id: r.id,
                    document: ((_a = r.patientRelation) === null || _a === void 0 ? void 0 : _a.documentNumber) || "N/A",
                    patientName: ((_b = r.patientRelation) === null || _b === void 0 ? void 0 : _b.name) || "N/A",
                    codeCup: ((_c = r.cupsRadicadosRelation) === null || _c === void 0 ? void 0 : _c.map((c) => c.code)) || "N/A",
                    descriptionCup: ((_d = r.cupsRadicadosRelation) === null || _d === void 0 ? void 0 : _d.map((c) => c.DescriptionCode)) || "N/A",
                });
            });
            return res.json(formatedRadicaciones);
        }
        catch (error) {
            next(error);
        }
    });
}
