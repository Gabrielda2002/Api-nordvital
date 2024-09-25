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
exports.SeguimientoAuxiliarCirugias = void 0;
const class_validator_1 = require("class-validator");
const typeorm_1 = require("typeorm");
const estados_seguimiento_1 = require("./estados-seguimiento");
const cirugias_1 = require("./cirugias");
const servicios_solicitados_1 = require("./servicios-solicitados");
let SeguimientoAuxiliarCirugias = class SeguimientoAuxiliarCirugias extends typeorm_1.BaseEntity {
};
exports.SeguimientoAuxiliarCirugias = SeguimientoAuxiliarCirugias;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'id' }),
    __metadata("design:type", Number)
], SeguimientoAuxiliarCirugias.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'observacion' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'La observacion es requerida' }),
    __metadata("design:type", String)
], SeguimientoAuxiliarCirugias.prototype, "observation", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'estado' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'El estado es requerido' }),
    __metadata("design:type", Number)
], SeguimientoAuxiliarCirugias.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cup_id' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], SeguimientoAuxiliarCirugias.prototype, "cupsId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cirugia_id' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'La cirugia es requerida' }),
    __metadata("design:type", Number)
], SeguimientoAuxiliarCirugias.prototype, "surgeryId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'createdAt' }),
    __metadata("design:type", Date)
], SeguimientoAuxiliarCirugias.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updatedAt' }),
    __metadata("design:type", Date)
], SeguimientoAuxiliarCirugias.prototype, "updateAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => estados_seguimiento_1.EstadosSeguimiento, (estadoSeguimiento) => estadoSeguimiento.statusRelation),
    (0, typeorm_1.JoinColumn)({ name: 'estado' }),
    __metadata("design:type", estados_seguimiento_1.EstadosSeguimiento)
], SeguimientoAuxiliarCirugias.prototype, "estadoSeguimientoRelation", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => cirugias_1.Cirugias, (cirugias) => cirugias.statusRelation),
    (0, typeorm_1.JoinColumn)({ name: 'cirugia_id' }),
    __metadata("design:type", cirugias_1.Cirugias)
], SeguimientoAuxiliarCirugias.prototype, "cirugiasRelation", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => servicios_solicitados_1.ServiciosSolicitados, (cirugias) => cirugias.statusRelation),
    (0, typeorm_1.JoinColumn)({ name: 'cup_id' }),
    __metadata("design:type", cirugias_1.Cirugias)
], SeguimientoAuxiliarCirugias.prototype, "cupsRelation", void 0);
exports.SeguimientoAuxiliarCirugias = SeguimientoAuxiliarCirugias = __decorate([
    (0, typeorm_1.Entity)('gestion_auxiliar_cirugias')
], SeguimientoAuxiliarCirugias);
