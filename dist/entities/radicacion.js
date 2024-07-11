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
const tipo_documento_1 = require("./tipo-documento");
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
    (0, typeorm_1.Column)({ name: "TipoDocumento" }),
    __metadata("design:type", Number)
], Radicacion.prototype, "documentType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "Identificacion" }),
    __metadata("design:type", Number)
], Radicacion.prototype, "documentNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "NombreCompleto" }),
    __metadata("design:type", String)
], Radicacion.prototype, "patientName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "NumeroCel" }),
    __metadata("design:type", String)
], Radicacion.prototype, "phoneNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "Email" }),
    __metadata("design:type", String)
], Radicacion.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "TelFijo" }),
    __metadata("design:type", Number)
], Radicacion.prototype, "landline", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "Direccion" }),
    __metadata("design:type", String)
], Radicacion.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "Convenio" }),
    __metadata("design:type", Number)
], Radicacion.prototype, "agreement", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "IpsPrimaria" }),
    __metadata("design:type", Number)
], Radicacion.prototype, "ipsPrimaria", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "FechaOrden", type: "date", nullable: true }),
    __metadata("design:type", Date)
], Radicacion.prototype, "orderDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "LugarRadicacion" }),
    __metadata("design:type", Number)
], Radicacion.prototype, "place", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "IpsRemite" }),
    __metadata("design:type", Number)
], Radicacion.prototype, "ipsRemitente", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "Profesional" }),
    __metadata("design:type", String)
], Radicacion.prototype, "profetional", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "Especialidad" }),
    __metadata("design:type", Number)
], Radicacion.prototype, "specialty", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "CodDiagnostico" }),
    __metadata("design:type", String)
], Radicacion.prototype, "diagnosticCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "DescripcionDiagnostico" }),
    __metadata("design:type", String)
], Radicacion.prototype, "diagnosticDescription", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "GrupoServicios" }),
    __metadata("design:type", Number)
], Radicacion.prototype, "groupServices", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "TipoServicio" }),
    __metadata("design:type", Number)
], Radicacion.prototype, "typeServices", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "QuienRadica" }),
    __metadata("design:type", Number)
], Radicacion.prototype, "radicador", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "Auditora" }),
    __metadata("design:type", String)
], Radicacion.prototype, "auditora", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "FechaAuditoria", type: "date", nullable: true }),
    __metadata("design:type", Date)
], Radicacion.prototype, "auditDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "JustificacionAuditoria" }),
    __metadata("design:type", String)
], Radicacion.prototype, "justify", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => tipo_documento_1.TipoDocumento, (tipoDocumento) => tipoDocumento.radicacion),
    (0, typeorm_1.JoinColumn)({ name: "TipoDocumento" }),
    __metadata("design:type", tipo_documento_1.TipoDocumento)
], Radicacion.prototype, "typeDocumentRelation", void 0);
exports.Radicacion = Radicacion = __decorate([
    (0, typeorm_1.Entity)("radicacion")
], Radicacion);
