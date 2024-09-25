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
exports.SeguimietoAuxiliar = void 0;
const typeorm_1 = require("typeorm");
const radicacion_1 = require("./radicacion");
const estados_seguimiento_1 = require("./estados-seguimiento");
const class_validator_1 = require("class-validator");
let SeguimietoAuxiliar = class SeguimietoAuxiliar extends typeorm_1.BaseEntity {
};
exports.SeguimietoAuxiliar = SeguimietoAuxiliar;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: "IdSeguimiento" }),
    __metadata("design:type", Number)
], SeguimietoAuxiliar.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: "fecha-creacion" }),
    __metadata("design:type", Date)
], SeguimietoAuxiliar.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "ObservacionSeguimiento" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: "La observación es requerida" }),
    (0, class_validator_1.Length)(10, 200, { message: "La observación debe tener entre 10 y 200 caracteres" }),
    __metadata("design:type", String)
], SeguimietoAuxiliar.prototype, "observation", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "EstadoSeguimiento" }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsNotEmpty)({ message: "El estado es requerido" }),
    __metadata("design:type", Number)
], SeguimietoAuxiliar.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "CodigoCups" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Length)(1, 10, { message: "El código cups debe tener entre 4 y 10 caracteres" }),
    __metadata("design:type", String)
], SeguimietoAuxiliar.prototype, "codeCups", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "Radicacion" }),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], SeguimietoAuxiliar.prototype, "idRadicacion", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: "fecha-actualizacion" }),
    __metadata("design:type", Date)
], SeguimietoAuxiliar.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => radicacion_1.Radicacion, (radicacion) => radicacion.seguimientoAuxiliarRelation),
    (0, typeorm_1.JoinColumn)({ name: "Radicacion" }),
    __metadata("design:type", radicacion_1.Radicacion)
], SeguimietoAuxiliar.prototype, "radicacionRelation", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => estados_seguimiento_1.EstadosSeguimiento, (estadoSeguimiento) => estadoSeguimiento.seguimientoAuxiliarRelation),
    (0, typeorm_1.JoinColumn)({ name: "EstadoSeguimiento" }),
    __metadata("design:type", estados_seguimiento_1.EstadosSeguimiento)
], SeguimietoAuxiliar.prototype, "estadoSeguimientoRelation", void 0);
exports.SeguimietoAuxiliar = SeguimietoAuxiliar = __decorate([
    (0, typeorm_1.Entity)({ name: "seguimientoauxiliar" })
], SeguimietoAuxiliar);
