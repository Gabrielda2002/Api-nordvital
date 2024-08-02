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
exports.Convenio = void 0;
const typeorm_1 = require("typeorm");
const pacientes_1 = require("./pacientes");
const class_validator_1 = require("class-validator");
let Convenio = class Convenio extends typeorm_1.BaseEntity {
};
exports.Convenio = Convenio;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: "IdConvenio" }),
    __metadata("design:type", Number)
], Convenio.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "NombreConvenio" }),
    (0, class_validator_1.IsNotEmpty)({ message: "El nombre del convenio no puede estar vacío" }),
    (0, class_validator_1.Length)(3, 50, { message: "El nombre del convenio debe tener entre $constraint1 y $constraint2 caracteres" }),
    __metadata("design:type", String)
], Convenio.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "Estado", type: "boolean" }),
    (0, class_validator_1.IsBoolean)({ message: "El estado del convenio debe ser un valor booleano" }),
    __metadata("design:type", Boolean)
], Convenio.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: "fecha-actualizacion" }),
    __metadata("design:type", Date)
], Convenio.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: "fecha-creacion" }),
    __metadata("design:type", Date
    // * Relaciones
    )
], Convenio.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => pacientes_1.Pacientes, (pacientes) => pacientes.convenioRelation),
    __metadata("design:type", Array)
], Convenio.prototype, "patientRelation", void 0);
exports.Convenio = Convenio = __decorate([
    (0, typeorm_1.Entity)("convenio")
], Convenio);
