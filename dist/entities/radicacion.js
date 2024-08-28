"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Radicacion = void 0;
const typeorm_1 = require("typeorm");
const especialidad_1 = require("./especialidad");
const lugar_radicacion_1 = require("./lugar-radicacion");
const ips_remite_1 = require("./ips-remite");
const grupo_servicios_1 = require("./grupo-servicios");
const radicador_1 = require("./radicador");
const cups_radicados_1 = require("./cups-radicados");
const seguimiento_auxiliar_1 = require("./seguimiento-auxiliar");
const class_validator_1 = require("class-validator");
const pacientes_1 = require("./pacientes");
const soportes_1 = require("./soportes");
const servicios_1 = require("./servicios");
const cirugias_1 = require("./cirugias");
let Radicacion = class Radicacion extends typeorm_1.BaseEntity {
};
exports.Radicacion = Radicacion;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: "IdRadicacion" }),
    __metadata("design:type", Number)
], Radicacion.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: "FechaRadicado" }),
    __metadata("design:type", Date)
], Radicacion.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "FechaOrden", type: "date", nullable: true }),
    (0, class_validator_1.IsNotEmpty)({ message: "La fecha de la orden es requerida" }),
    __metadata("design:type", Date)
], Radicacion.prototype, "orderDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "LugarRadicacion" }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsNotEmpty)({ message: "El lugar de radicacion es requerido" }),
    __metadata("design:type", Number)
], Radicacion.prototype, "place", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "IpsRemite" }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsNotEmpty)({ message: "La ips remitente es requerida" }),
    __metadata("design:type", Number)
], Radicacion.prototype, "ipsRemitente", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "Profesional" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: "El profesional es requerido" }),
    (0, class_validator_1.Length)(3, 100, { message: "El profesional debe tener entre 3 y 100 caracteres" }),
    __metadata("design:type", String)
], Radicacion.prototype, "profetional", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "Especialidad" }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsNotEmpty)({ message: "La especialidad es requerida" }),
    __metadata("design:type", Number)
], Radicacion.prototype, "specialty", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "CodDiagnostico" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: "El codigo de diagnostico es requerido" }),
    __metadata("design:type", String)
], Radicacion.prototype, "diagnosticCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "DescripcionDiagnostico" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: "La descripcion del diagnostico es requerida" }),
    __metadata("design:type", String)
], Radicacion.prototype, "diagnosticDescription", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "GrupoServicios" }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsNotEmpty)({ message: "El grupo de servicios es requerido" }),
    __metadata("design:type", Number)
], Radicacion.prototype, "groupServices", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "TipoServicio" }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsNotEmpty)({ message: "El tipo de servicio es requerido" }),
    __metadata("design:type", Number)
], Radicacion.prototype, "typeServices", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "QuienRadica" }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsNotEmpty)({ message: "Quien radica es requerido" }),
    __metadata("design:type", Number)
], Radicacion.prototype, "radicador", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "Auditora" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: "La auditoria es requerida" }),
    (0, class_validator_1.Length)(3, 100, { message: "La auditoria debe tener entre 3 y 100 caracteres" }),
    __metadata("design:type", String)
], Radicacion.prototype, "auditora", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: "FechaAuditoria", type: "date", nullable: true })
    // @IsDate()
    ,
    __metadata("design:type", Date)
], Radicacion.prototype, "auditDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "JustificacionAuditoria" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: "La justificacion de la auditoria es requerida" }),
    (0, class_validator_1.Length)(3, 100, { message: "La justificacion de la auditoria debe tener entre 3 y 100 caracteres" }),
    __metadata("design:type", String)
], Radicacion.prototype, "justify", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "ConceptoAuditoria" }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)({ message: "El concepto de la auditoria es requerido" }),
    __metadata("design:type", Number)
], Radicacion.prototype, "auditConcept", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "Paciente_id" }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], Radicacion.prototype, "idPatient", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "id_soportes" }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsNotEmpty)({ message: "El soporte es requerido" }),
    __metadata("design:type", Number)
], Radicacion.prototype, "idSoporte", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => especialidad_1.Especialidad, (Especialidad) => Especialidad.radicacionRelation),
    (0, typeorm_1.JoinColumn)({ name: "Especialidad" }),
    __metadata("design:type", especialidad_1.Especialidad)
], Radicacion.prototype, "specialtyRelation", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => lugar_radicacion_1.LugarRadicacion, (lugarRadicacion) => lugarRadicacion.radicacionRelation),
    (0, typeorm_1.JoinColumn)({ name: "LugarRadicacion" }),
    __metadata("design:type", lugar_radicacion_1.LugarRadicacion)
], Radicacion.prototype, "placeRelation", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => ips_remite_1.IpsRemite, (ipsRemite) => ipsRemite.radicacionRelation),
    (0, typeorm_1.JoinColumn)({ name: "IpsRemite" }),
    __metadata("design:type", ips_remite_1.IpsRemite)
], Radicacion.prototype, "ipsRemiteRelation", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => grupo_servicios_1.GrupoServicios, (grupoServicios) => grupoServicios.radicacionRelation),
    (0, typeorm_1.JoinColumn)({ name: "GrupoServicios" }),
    __metadata("design:type", grupo_servicios_1.GrupoServicios)
], Radicacion.prototype, "servicesGroupRelation", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => servicios_1.Servicios, (servicio) => servicio.radicacionRelation),
    (0, typeorm_1.JoinColumn)({ name: "TipoServicio" }),
    __metadata("design:type", servicios_1.Servicios)
], Radicacion.prototype, "servicesRelation", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => radicador_1.Radicador, (radicador) => radicador.radicacionRelation),
    (0, typeorm_1.JoinColumn)({ name: "QuienRadica" }),
    __metadata("design:type", radicador_1.Radicador)
], Radicacion.prototype, "radicadorRelation", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => pacientes_1.Pacientes, (pacientes) => pacientes.radicacionRelation),
    (0, typeorm_1.JoinColumn)({ name: "Paciente_id" }),
    __metadata("design:type", pacientes_1.Pacientes)
], Radicacion.prototype, "patientRelation", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => soportes_1.Soportes, (soportes) => soportes.radicacionRelation),
    (0, typeorm_1.JoinColumn)({ name: "id_soportes" }),
    __metadata("design:type", soportes_1.Soportes)
], Radicacion.prototype, "soportesRelation", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => cups_radicados_1.CupsRadicados, (cupsRadicados) => cupsRadicados.radicacionRelation),
    __metadata("design:type", Array)
], Radicacion.prototype, "cupsRadicadosRelation", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => seguimiento_auxiliar_1.SeguimietoAuxiliar, (seguimientoAuxiliar) => seguimientoAuxiliar.radicacionRelation),
    __metadata("design:type", Array)
], Radicacion.prototype, "seguimientoAuxiliarRelation", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => cirugias_1.Cirugias, (cirugias) => cirugias.radicacionRelation),
    __metadata("design:type", Array)
], Radicacion.prototype, "cirugiasRelation", void 0);
exports.Radicacion = Radicacion = __decorate([
    (0, typeorm_1.Entity)("radicacion")
], Radicacion);
