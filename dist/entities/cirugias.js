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
exports.Cirugias = void 0;
const class_validator_1 = require("class-validator");
const typeorm_1 = require("typeorm");
const especialidad_1 = require("./especialidad");
const radicacion_1 = require("./radicacion");
const ips_remite_1 = require("./ips-remite");
const seguimiento_auxiliar_cirugias_1 = require("./seguimiento-auxiliar-cirugias");
let Cirugias = class Cirugias extends typeorm_1.BaseEntity {
};
exports.Cirugias = Cirugias;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'id' }),
    __metadata("design:type", Number)
], Cirugias.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'fecha_ordenamiento' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'La fecha de ordenamiento es requerida' }),
    __metadata("design:type", Date)
], Cirugias.prototype, "orderingDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'fecha_paraclinicos' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'La fecha de paraclinicos es requerida' }),
    __metadata("design:type", Date)
], Cirugias.prototype, "paraclinicalDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'fecha_valoracion_anestencia' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'La fecha de valoracion de anestesia es requerida' }),
    __metadata("design:type", Date)
], Cirugias.prototype, "anesthesiaAssessmentDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'fecha_cirugia' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'La fecha de cirugia es requerida' }),
    __metadata("design:type", Date)
], Cirugias.prototype, "surgeryDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'hora_programada' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'La fecha de hospitalizacion es requerida' }),
    __metadata("design:type", String)
], Cirugias.prototype, "scheduledTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ips_remitente' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'La ips remitente es requerida' }),
    __metadata("design:type", Number)
], Cirugias.prototype, "ipsRemite", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'observaciones' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Las observaciones son requeridas' }),
    __metadata("design:type", String)
], Cirugias.prototype, "observation", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'nombre_especialista' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'El nombre del especialista es requerido' }),
    __metadata("design:type", String)
], Cirugias.prototype, "specialistName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'especialidad_id' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'La especialidad es requerida' }),
    __metadata("design:type", Number)
], Cirugias.prototype, "specialityId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'estado' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'el estado es requerido' }),
    __metadata("design:type", Boolean)
], Cirugias.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'radicado_id' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'El radicado es requerido' }),
    __metadata("design:type", Number)
], Cirugias.prototype, "radicadoId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'createdAt' }),
    __metadata("design:type", Date)
], Cirugias.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updatedAt' }),
    __metadata("design:type", Date)
], Cirugias.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => especialidad_1.Especialidad, (especialidades) => especialidades.cirugiasRelation),
    (0, typeorm_1.JoinColumn)({ name: 'especialidad_id' }),
    __metadata("design:type", especialidad_1.Especialidad)
], Cirugias.prototype, "specialityRelation", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => radicacion_1.Radicacion, (radicacion) => radicacion.cirugiasRelation),
    (0, typeorm_1.JoinColumn)({ name: 'radicado_id' }),
    __metadata("design:type", radicacion_1.Radicacion)
], Cirugias.prototype, "radicacionRelation", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => ips_remite_1.IpsRemite, (ipsRemite) => ipsRemite.cirugiasRelation),
    (0, typeorm_1.JoinColumn)({ name: 'ips_remitente' }),
    __metadata("design:type", ips_remite_1.IpsRemite)
], Cirugias.prototype, "ipsRemiteRelation", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => seguimiento_auxiliar_cirugias_1.SeguimientoAuxiliarCirugias, (seguimientoAuxiliarCirugias) => seguimientoAuxiliarCirugias.cirugiasRelation),
    __metadata("design:type", Array)
], Cirugias.prototype, "statusRelation", void 0);
exports.Cirugias = Cirugias = __decorate([
    (0, typeorm_1.Entity)('cirugias')
], Cirugias);
