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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadReportExcel = downloadReportExcel;
exports.downloadReportExcelFilter = downloadReportExcelFilter;
const radicacion_1 = require("../entities/radicacion");
const exceljs_1 = __importDefault(require("exceljs"));
const crypto_1 = require("crypto");
function downloadReportExcel(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const dataRadicacion = yield radicacion_1.Radicacion.createQueryBuilder("radicacion")
                .leftJoinAndSelect("radicacion.patientRelation", "pacientes")
                .leftJoinAndSelect("pacientes.documentRelation", "tipo_documento")
                .leftJoinAndSelect("pacientes.convenioRelation", "convenio")
                .leftJoinAndSelect("pacientes.ipsPrimariaRelation", "ips_primaria")
                .leftJoinAndSelect("radicacion.placeRelation", "lugar_radicacion")
                .leftJoinAndSelect("radicacion.ipsRemiteRelation", "ips_remitente")
                .leftJoinAndSelect("radicacion.servicesGroupRelation", "grupo_servicios")
                .leftJoinAndSelect("radicacion.servicesRelation", "servicios")
                .leftJoinAndSelect("radicacion.radicadorRelation", "radicador")
                .leftJoinAndSelect("radicacion.specialtyRelation", "especialidad")
                .leftJoinAndSelect("radicacion.cupsRadicadosRelation", "cups")
                .leftJoinAndSelect("radicacion.seguimientoAuxiliarRelation", "seguimiento_auxiliar")
                .leftJoinAndSelect("cups.functionalUnitRelation", "unidad_funcional")
                .leftJoinAndSelect("cups.statusRelation", "estado_cups")
                .orderBy("radicacion.createdAt", "DESC")
                .getMany();
            // Crear un nuevo libro de Excel y una hoja
            const workbook = new exceljs_1.default.Workbook();
            const worksheet = workbook.addWorksheet("Reporte radicacion");
            // Definir las columnas en la hoja de Excel
            worksheet.columns = [
                { header: "Fecha de Radicado", key: "radicadoDate", width: 20 },
                { header: "ID", key: "Id", width: 10 },
                { header: "Tipo de Documento", key: "Tipo_de_documento", width: 20 },
                { header: "Nombre del Paciente", key: "Nombre_del_paciente", width: 30 },
                { header: "Teléfono Celular", key: "Telefono_celular", width: 20 },
                { header: "Teléfono Fijo", key: "Telefono_fijo", width: 20 },
                { header: "Correo Electrónico", key: "Correo_electronico", width: 30 },
                { header: "Dirección", key: "Direccion", width: 30 },
                { header: "Convenio", key: "Convenio", width: 20 },
                { header: "IPS Primaria", key: "IPS_Primaria", width: 20 },
                { header: "Fecha de Orden", key: "Fecha_de_orden", width: 20 },
                { header: "Lugar de Radicación", key: "Lugar_de_radicacion", width: 30 },
                { header: "IPS Remitente", key: "IPS_Remitente", width: 30 },
                { header: "Profesional", key: "Profesional", width: 30 },
                { header: "Especialidad", key: "Especialidad", width: 30 },
                { header: "Grupo de Servicios", key: "Grupo_de_servicios", width: 20 },
                { header: "Servicios", key: "Servicios", width: 20 },
                { header: "Radicador", key: "Radicador", width: 20 },
                { header: "Auditora", key: "Auditora", width: 20 },
                { header: "Fecha de Auditoría", key: "Fecha_de_auditoria", width: 20 },
                { header: "Código CUPS", key: "Codigo_cups", width: 30 },
                { header: "Descripción CUPS", key: "Descripcion_cups", width: 30 },
                { header: "Estado CUPS", key: "Estado_cups", width: 20 },
                { header: "Unidad Funcional", key: "Unidad_funcional", width: 30 },
                {
                    header: "Fecha Actualización CUPS",
                    key: "Fecha_actualizacion",
                    width: 20,
                },
                {
                    header: "Observación Seguimiento Auxiliar",
                    key: "Observacion_seguimiento_auxiliar",
                    width: 30,
                },
                {
                    header: "Fecha Registro Seguimiento",
                    key: "Fecha_registro",
                    width: 20,
                },
            ];
            dataRadicacion.forEach((data) => {
                var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
                const row = {
                    radicadoDate: data.createdAt || "N/A",
                    Id: data.id || "N/A",
                    Tipo_de_documento: ((_a = data.patientRelation) === null || _a === void 0 ? void 0 : _a.documentRelation.name) || "N/A",
                    Nombre_del_paciente: ((_b = data.patientRelation) === null || _b === void 0 ? void 0 : _b.name) || "N/A",
                    Telefono_celular: ((_c = data.patientRelation) === null || _c === void 0 ? void 0 : _c.phoneNumber) || "N/A",
                    Telefono_fijo: ((_d = data.patientRelation) === null || _d === void 0 ? void 0 : _d.landline) || "N/A",
                    Correo_electronico: ((_e = data.patientRelation) === null || _e === void 0 ? void 0 : _e.email) || "N/A",
                    Direccion: ((_f = data.patientRelation) === null || _f === void 0 ? void 0 : _f.address) || "N/A",
                    Convenio: ((_g = data.patientRelation) === null || _g === void 0 ? void 0 : _g.convenioRelation.name) || "N/A",
                    IPS_Primaria: ((_h = data.patientRelation) === null || _h === void 0 ? void 0 : _h.ipsPrimariaRelation.name) || "N/A",
                    Fecha_de_orden: data.orderDate || "N/A",
                    Lugar_de_radicacion: ((_j = data.placeRelation) === null || _j === void 0 ? void 0 : _j.name) || "N/A",
                    IPS_Remitente: ((_k = data.ipsRemiteRelation) === null || _k === void 0 ? void 0 : _k.name) || "N/A",
                    Profesional: data.profetional || "N/A",
                    Especialidad: ((_l = data.specialtyRelation) === null || _l === void 0 ? void 0 : _l.name) || "N/A",
                    Grupo_de_servicios: ((_m = data.servicesGroupRelation) === null || _m === void 0 ? void 0 : _m.name) || "N/A",
                    Servicios: ((_o = data.servicesRelation) === null || _o === void 0 ? void 0 : _o.name) || "N/A",
                    Radicador: ((_p = data.radicadorRelation) === null || _p === void 0 ? void 0 : _p.name) || "N/A",
                    Auditora: data.auditora || "N/A",
                    Fecha_de_auditoria: data.auditDate || "N/A",
                };
                // * agregar filas por cada CUPS
                if (((_q = data.cupsRadicadosRelation) === null || _q === void 0 ? void 0 : _q.length) > 0) {
                    data.cupsRadicadosRelation.forEach((cups) => {
                        var _a, _b;
                        worksheet.addRow(Object.assign(Object.assign({}, row), { Codigo_cups: cups.code || "N/A", Descripcion_cups: cups.DescriptionCode || "N/A", Estado_cups: ((_a = cups.statusRelation) === null || _a === void 0 ? void 0 : _a.name) || "N/A", Unidad_funcional: ((_b = cups.functionalUnitRelation) === null || _b === void 0 ? void 0 : _b.name) || "N/A", Fecha_actualizacion: cups.updatedAt || "N/A" }));
                    });
                }
                else {
                    worksheet.addRow(row);
                }
                // * agregar filas por cada seguimiento auxiliar
                if (((_r = data.seguimientoAuxiliarRelation) === null || _r === void 0 ? void 0 : _r.length) > 0) {
                    data.seguimientoAuxiliarRelation.forEach((seguimiento) => {
                        worksheet.addRow(Object.assign(Object.assign({}, row), { Observacion_seguimiento_auxiliar: seguimiento.observation || "N/A", Fecha_registro: seguimiento.createdAt || "N/A" }));
                    });
                }
            });
            // const dateStr = format(new Date(), "yyyyMMdd_HHmmss");
            const randomStr = (0, crypto_1.randomBytes)(4).toString("hex");
            const fileName = `Reporte_Radicacion_${randomStr}.xlsx`;
            // Configurar la respuesta para enviar el archivo Excel
            res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            // *  colocarle como nombre al archivo la fecha actual
            const date = new Date();
            res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);
            // Escribir el archivo en la respuesta
            yield workbook.xlsx.write(res);
            res.end();
        }
        catch (error) {
            next(error);
        }
    });
}
// *  reporte excel con filtros de fecha e auditora, fecha de radicado y codigo cups
function downloadReportExcelFilter(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { auditDateStart, auditDateEnd, radicadoDateStart, radicadoDateEnd, cupsCode, } = req.body;
            const query = yield radicacion_1.Radicacion.createQueryBuilder("radicacion")
                .leftJoinAndSelect("radicacion.patientRelation", "pacientes")
                .leftJoinAndSelect("pacientes.documentRelation", "tipo_documento")
                .leftJoinAndSelect("pacientes.convenioRelation", "convenio")
                .leftJoinAndSelect("pacientes.ipsPrimariaRelation", "ips_primaria")
                .leftJoinAndSelect("radicacion.placeRelation", "lugar_radicacion")
                .leftJoinAndSelect("radicacion.ipsRemiteRelation", "ips_remitente")
                .leftJoinAndSelect("radicacion.servicesGroupRelation", "grupo_servicios")
                .leftJoinAndSelect("radicacion.servicesRelation", "servicios")
                .leftJoinAndSelect("radicacion.radicadorRelation", "radicador")
                .leftJoinAndSelect("radicacion.specialtyRelation", "especialidad")
                .leftJoinAndSelect("radicacion.cupsRadicadosRelation", "cups")
                .leftJoinAndSelect("radicacion.seguimientoAuxiliarRelation", "seguimiento_auxiliar")
                .leftJoinAndSelect("cups.functionalUnitRelation", "unidad_funcional")
                .leftJoinAndSelect("cups.statusRelation", "estado_cups");
            // .orderBy("radicacion.createdAt", "DESC")
            // .getMany();
            // * filtro por fecha de auditoria
            if (auditDateStart && auditDateEnd) {
                query.andWhere("radicacion.auditDate BETWEEN :auditDateStart AND :auditDateEnd", { auditDateStart, auditDateEnd });
            }
            // * filtro por fecha de radicado
            if (radicadoDateStart && radicadoDateEnd) {
                query.andWhere("radicacion.createdAt BETWEEN :radicadoDateStart AND :radicadoDateEnd", { radicadoDateStart, radicadoDateEnd });
            }
            // * filtro por codigo cups
            if (cupsCode) {
                query.andWhere("cups.code = :cupsCode", { cupsCode });
            }
            query.orderBy("radicacion.createdAt", "DESC");
            const dataRadicacion = yield query.getMany();
            // Crear un nuevo libro de Excel y una hoja
            const workbook = new exceljs_1.default.Workbook();
            const worksheet = workbook.addWorksheet("Reporte radicacion");
            // Definir las columnas en la hoja de Excel
            worksheet.columns = [
                { header: "Fecha de Radicado", key: "radicadoDate", width: 20 },
                { header: "ID", key: "Id", width: 10 },
                { header: "Tipo de Documento", key: "Tipo_de_documento", width: 20 },
                { header: "Nombre del Paciente", key: "Nombre_del_paciente", width: 30 },
                { header: "Teléfono Celular", key: "Telefono_celular", width: 20 },
                { header: "Teléfono Fijo", key: "Telefono_fijo", width: 20 },
                { header: "Correo Electrónico", key: "Correo_electronico", width: 30 },
                { header: "Dirección", key: "Direccion", width: 30 },
                { header: "Convenio", key: "Convenio", width: 20 },
                { header: "IPS Primaria", key: "IPS_Primaria", width: 20 },
                { header: "Fecha de Orden", key: "Fecha_de_orden", width: 20 },
                { header: "Lugar de Radicación", key: "Lugar_de_radicacion", width: 30 },
                { header: "IPS Remitente", key: "IPS_Remitente", width: 30 },
                { header: "Profesional", key: "Profesional", width: 30 },
                { header: "Especialidad", key: "Especialidad", width: 30 },
                { header: "Código Diagnóstico", key: "Codigo_diagnostico", width: 20 },
                {
                    header: "Descripción Diagnóstico",
                    key: "Descripcion_diagnostico",
                    width: 30,
                },
                { header: "Grupo de Servicios", key: "Grupo_de_servicios", width: 20 },
                { header: "Servicios", key: "Servicios", width: 20 },
                { header: "Radicador", key: "Radicador", width: 20 },
                { header: "Auditora", key: "Auditora", width: 20 },
                { header: "Fecha de Auditoría", key: "Fecha_de_auditoria", width: 20 },
                { header: "Código CUPS", key: "Codigo_cups", width: 30 },
                { header: "Descripción CUPS", key: "Descripcion_cups", width: 30 },
                { header: "Estado CUPS", key: "Estado_cups", width: 20 },
                { header: "Unidad Funcional", key: "Unidad_funcional", width: 30 },
                {
                    header: "Fecha Actualización CUPS",
                    key: "Fecha_actualizacion",
                    width: 20,
                },
                {
                    header: "Observación Seguimiento Auxiliar",
                    key: "Observacion_seguimiento_auxiliar",
                    width: 30,
                },
                {
                    header: "Fecha Registro Seguimiento",
                    key: "Fecha_registro",
                    width: 20,
                },
            ];
            dataRadicacion.forEach((data) => {
                var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
                const row = {
                    radicadoDate: data.createdAt || "N/A",
                    Id: data.id || "N/A",
                    Tipo_de_documento: ((_a = data.patientRelation) === null || _a === void 0 ? void 0 : _a.documentRelation.name) || "N/A",
                    Nombre_del_paciente: ((_b = data.patientRelation) === null || _b === void 0 ? void 0 : _b.name) || "N/A",
                    Telefono_celular: ((_c = data.patientRelation) === null || _c === void 0 ? void 0 : _c.phoneNumber) || "N/A",
                    Telefono_fijo: ((_d = data.patientRelation) === null || _d === void 0 ? void 0 : _d.landline) || "N/A",
                    Correo_electronico: ((_e = data.patientRelation) === null || _e === void 0 ? void 0 : _e.email) || "N/A",
                    Direccion: ((_f = data.patientRelation) === null || _f === void 0 ? void 0 : _f.address) || "N/A",
                    Convenio: ((_g = data.patientRelation) === null || _g === void 0 ? void 0 : _g.convenioRelation.name) || "N/A",
                    IPS_Primaria: ((_h = data.patientRelation) === null || _h === void 0 ? void 0 : _h.ipsPrimariaRelation.name) || "N/A",
                    Fecha_de_orden: data.orderDate || "N/A",
                    Lugar_de_radicacion: ((_j = data.placeRelation) === null || _j === void 0 ? void 0 : _j.name) || "N/A",
                    IPS_Remitente: ((_k = data.ipsRemiteRelation) === null || _k === void 0 ? void 0 : _k.name) || "N/A",
                    Profesional: data.profetional || "N/A",
                    Especialidad: ((_l = data.specialtyRelation) === null || _l === void 0 ? void 0 : _l.name) || "N/A",
                    Grupo_de_servicios: ((_m = data.servicesGroupRelation) === null || _m === void 0 ? void 0 : _m.name) || "N/A",
                    Servicios: ((_o = data.servicesRelation) === null || _o === void 0 ? void 0 : _o.name) || "N/A",
                    Radicador: ((_p = data.radicadorRelation) === null || _p === void 0 ? void 0 : _p.name) || "N/A",
                    Auditora: data.auditora || "N/A",
                    Fecha_de_auditoria: data.auditDate || "N/A",
                };
                // * agregar filas por cada CUPS
                if (((_q = data.cupsRadicadosRelation) === null || _q === void 0 ? void 0 : _q.length) > 0) {
                    data.cupsRadicadosRelation.forEach((cups) => {
                        var _a, _b;
                        worksheet.addRow(Object.assign(Object.assign({}, row), { Codigo_cups: cups.code || "N/A", Descripcion_cups: cups.DescriptionCode || "N/A", Estado_cups: ((_a = cups.statusRelation) === null || _a === void 0 ? void 0 : _a.name) || "N/A", Unidad_funcional: ((_b = cups.functionalUnitRelation) === null || _b === void 0 ? void 0 : _b.name) || "N/A", Fecha_actualizacion: cups.updatedAt || "N/A" }));
                    });
                }
                else {
                    worksheet.addRow(row);
                }
                // * agregar filas por cada seguimiento auxiliar
                if (((_r = data.seguimientoAuxiliarRelation) === null || _r === void 0 ? void 0 : _r.length) > 0) {
                    data.seguimientoAuxiliarRelation.forEach((seguimiento) => {
                        worksheet.addRow(Object.assign(Object.assign({}, row), { Observacion_seguimiento_auxiliar: seguimiento.observation || "N/A", Fecha_registro: seguimiento.createdAt || "N/A" }));
                    });
                }
            });
            // const dateStr = format(new Date(), "yyyyMMdd_HHmmss");
            const randomStr = (0, crypto_1.randomBytes)(4).toString("hex");
            const fileName = `Reporte_Radicacion_${randomStr}.xlsx`;
            // Configurar la respuesta para enviar el archivo Excel
            res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            // *  colocarle como nombre al archivo la fecha actual
            const date = new Date();
            res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);
            // Escribir el archivo en la respuesta
            yield workbook.xlsx.write(res);
            res.end();
        }
        catch (error) {
            next(error);
        }
    });
}
