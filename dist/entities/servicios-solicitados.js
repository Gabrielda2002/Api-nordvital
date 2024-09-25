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
exports.ServiciosSolicitados = void 0;
const class_validator_1 = require("class-validator");
const typeorm_1 = require("typeorm");
const seguimiento_auxiliar_cirugias_1 = require("./seguimiento-auxiliar-cirugias");
let ServiciosSolicitados = class ServiciosSolicitados extends typeorm_1.BaseEntity {
};
exports.ServiciosSolicitados = ServiciosSolicitados;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: "IdServicioSolicitado" }),
    __metadata("design:type", Number)
], ServiciosSolicitados.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "Codigo" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: "El código es requerido" }),
    (0, class_validator_1.Length)(1, 10, { message: "El código debe tener entre $constraint1 y $constraint2 caracteres" }),
    __metadata("design:type", String)
], ServiciosSolicitados.prototype, "code", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "NombreSolicitado" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: "El nombre es requerido" }),
    (0, class_validator_1.Length)(1, 100, { message: "El nombre debe tener entre $constraint1 y $constraint2 caracteres" }),
    __metadata("design:type", String)
], ServiciosSolicitados.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "Estado" }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsNotEmpty)({ message: "El estado es requerido" }),
    __metadata("design:type", Boolean)
], ServiciosSolicitados.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: "fecha-actualizacion" }),
    __metadata("design:type", Date)
], ServiciosSolicitados.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: "fecha-creacion" }),
    __metadata("design:type", Date
    // * relacion con gestion auxiliar cirugias
    )
], ServiciosSolicitados.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => seguimiento_auxiliar_cirugias_1.SeguimientoAuxiliarCirugias, (seguimientoAuxiliarCirugias) => seguimientoAuxiliarCirugias.cupsRelation),
    __metadata("design:type", Array)
], ServiciosSolicitados.prototype, "statusRelation", void 0);
exports.ServiciosSolicitados = ServiciosSolicitados = __decorate([
    (0, typeorm_1.Entity)({ name: "serviciosolicitado" })
], ServiciosSolicitados);
