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
exports.autorizarRadicado = autorizarRadicado;
const radicacion_1 = require("../entities/radicacion");
const class_validator_1 = require("class-validator");
function getAllRadicacion(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const radicacion = yield radicacion_1.Radicacion.createQueryBuilder("radicacion")
                .leftJoinAndSelect("radicacion.specialtyRelation", "specialty")
                .leftJoinAndSelect("radicacion.placeRelation", "place")
                .leftJoinAndSelect("radicacion.ipsRemiteRelation", "ipsRemite")
                .leftJoinAndSelect("radicacion.servicesGroupRelation", "servicesGroup")
                .leftJoinAndSelect("radicacion.servicesRelation", "services")
                .leftJoinAndSelect("radicacion.radicadorRelation", "radicador")
                .leftJoinAndSelect("radicacion.patientRelation", "patient")
                .leftJoinAndSelect("patient.convenioRelation", "convenio")
                .leftJoinAndSelect("patient.documentRelation", "document")
                .leftJoinAndSelect("patient.ipsPrimariaRelation", "ipsPrimaria")
                .leftJoinAndSelect("radicacion.cupsRadicadosRelation", "cupsRadicados")
                .leftJoinAndSelect("cupsRadicados.statusRelation", "status")
                .leftJoinAndSelect("cupsRadicados.functionalUnitRelation", "unidadFuncional")
                .leftJoinAndSelect("radicacion.diagnosticoRelation", "diagnostic")
                .leftJoinAndSelect("radicacion.soportesRelation", "soporte")
                .leftJoinAndSelect("radicacion.seguimientoAuxiliarRelation", "seguimientoAuxiliar")
                .leftJoinAndSelect("seguimientoAuxiliar.estadoSeguimientoRelation", "estadoSeguimiento")
                .orderBy("radicacion.id", "DESC")
                .getMany();
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
            const { orderDate, place, ipsRemitente, profetional, specialty, groupServices, radicador, typeServices, idPatient, idSoporte, idDiagnostico } = req.body;
            const radicacado = new radicacion_1.Radicacion();
            radicacado.orderDate = orderDate;
            radicacado.place = parseInt(place);
            radicacado.ipsRemitente = parseInt(ipsRemitente);
            radicacado.profetional = profetional;
            radicacado.specialty = parseInt(specialty);
            radicacado.groupServices = parseInt(groupServices);
            radicacado.typeServices = parseInt(typeServices);
            radicacado.radicador = parseInt(radicador);
            radicacado.auditora = "Pendiente";
            radicacado.justify = "Pendiente";
            radicacado.auditConcept = 6;
            radicacado.idPatient = parseInt(idPatient);
            radicacado.idSoporte = parseInt(idSoporte);
            radicacado.idDiagnostico = parseInt(idDiagnostico);
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
                .leftJoinAndSelect("pacientes.ipsPrimariaRelation", "ipsPrimaria")
                .leftJoinAndSelect("radicacion.placeRelation", "place")
                .leftJoinAndSelect("radicacion.ipsRemiteRelation", "ipsRemite")
                .leftJoinAndSelect("radicacion.specialtyRelation", "specialty")
                .leftJoinAndSelect("radicacion.servicesRelation", "services")
                .leftJoinAndSelect("radicacion.radicadorRelation", "radicador")
                .leftJoinAndSelect("radicacion.cupsRadicadosRelation", "cupsRadicados")
                .leftJoinAndSelect("cupsRadicados.statusRelation", "status")
                .leftJoinAndSelect("cupsRadicados.functionalUnitRelation", "unidadFuncional")
                .leftJoinAndSelect("radicacion.soportesRelation", "soportes")
                .where("cupsRadicados.status = 6")
                .orderBy("radicacion.id", "DESC")
                .getMany();
            const formatedRadicaciones = yield radicaciones.map((r) => {
                var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
                return ({
                    id: r.id,
                    radicadoDate: r.createdAt,
                    documentType: ((_a = r.patientRelation) === null || _a === void 0 ? void 0 : _a.documentRelation.name) || "N/A",
                    documentNumber: ((_b = r.patientRelation) === null || _b === void 0 ? void 0 : _b.documentNumber) || "N/A",
                    namePatient: ((_c = r.patientRelation) === null || _c === void 0 ? void 0 : _c.name) || "N/A",
                    convenio: ((_e = (_d = r.patientRelation) === null || _d === void 0 ? void 0 : _d.convenioRelation) === null || _e === void 0 ? void 0 : _e.name) || "N/A",
                    ipsPrimary: r.patientRelation.ipsPrimariaRelation.name || "N/A",
                    orderDate: r.orderDate || "N/A",
                    place: ((_f = r.placeRelation) === null || _f === void 0 ? void 0 : _f.name) || "N/A",
                    ipsRemitente: ((_g = r.ipsRemiteRelation) === null || _g === void 0 ? void 0 : _g.name) || "N/A",
                    profetional: r.profetional || "N/A",
                    speciality: ((_h = r.specialtyRelation) === null || _h === void 0 ? void 0 : _h.name) || "N/A",
                    typeServices: ((_j = r.servicesRelation) === null || _j === void 0 ? void 0 : _j.name) || "N/A",
                    radicador: ((_k = r.radicadorRelation) === null || _k === void 0 ? void 0 : _k.name) || "N/A",
                    statusCups: ((_l = r.cupsRadicadosRelation) === null || _l === void 0 ? void 0 : _l.map((c) => ({
                        id: c.id,
                        code: c.code,
                        description: c.DescriptionCode,
                        observation: c.observation,
                        status: c.statusRelation.name,
                        unidadFuncional: c.functionalUnitRelation.name,
                        idRadicado: c.idRadicacion,
                    }))) || "N/A",
                    soportes: ((_m = r.soportesRelation) === null || _m === void 0 ? void 0 : _m.nameSaved) || "N/A",
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
                .leftJoinAndSelect("cupsRadicados.statusRelation", "status")
                .orderBy("radicacion.id", "DESC")
                .where("cupsRadicados.status <> 6 AND cupsRadicados.idRadicacion = radicacion.id")
                .getMany();
            const formatedRadicaciones = radicaciones.map((r) => {
                var _a, _b, _c;
                return ({
                    id: r.id,
                    document: ((_a = r.patientRelation) === null || _a === void 0 ? void 0 : _a.documentNumber) || "N/A",
                    patientName: ((_b = r.patientRelation) === null || _b === void 0 ? void 0 : _b.name) || "N/A",
                    CUPS: (_c = r.cupsRadicadosRelation) === null || _c === void 0 ? void 0 : _c.map((c) => ({
                        id: c.id,
                        code: c.code,
                        description: c.DescriptionCode,
                        status: c.statusRelation.name,
                        observation: c.observation,
                        modifyDate: c.updatedAt,
                    }))
                });
            });
            return res.json(formatedRadicaciones);
        }
        catch (error) {
            next(error);
        }
    });
}
function autorizarRadicado(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            console.log(id);
            const { auditora, fechaAuditoria, justificacion } = req.body;
            console.log(req.body);
            const existRadicado = yield radicacion_1.Radicacion.findOneBy({ id: parseInt(id) });
            if (!existRadicado) {
                return res.status(404).json({ message: "Cups not found" });
            }
            existRadicado.auditora = auditora;
            existRadicado.auditDate = fechaAuditoria;
            existRadicado.justify = justificacion;
            const errors = yield (0, class_validator_1.validate)(existRadicado);
            if (errors.length > 0) {
                const messages = errors.map((err) => ({
                    property: err.property,
                    constraints: err.constraints,
                }));
                return res
                    .status(400)
                    .json({ message: "Error updating radicacion", messages });
            }
            yield existRadicado.save();
            res.json(existRadicado);
        }
        catch (error) {
            next(error);
        }
    });
}
