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
exports.IpsPrimaria = void 0;
const typeorm_1 = require("typeorm");
const pacientes_1 = require("./pacientes");
const class_validator_1 = require("class-validator");
let IpsPrimaria = class IpsPrimaria extends typeorm_1.BaseEntity {
};
exports.IpsPrimaria = IpsPrimaria;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: "IdIpsPrimaria" }),
    __metadata("design:type", Number)
], IpsPrimaria.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "NombreIpsPrimaria" }),
    (0, class_validator_1.IsNotEmpty)({ message: "El nombre de la ips primaria es requerido" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(3, 50, { message: "El nombre de la ips primaria debe tener entre $constraint1 y $constraint2 caracteres" }),
    __metadata("design:type", String)
], IpsPrimaria.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "Estado" }),
    (0, class_validator_1.IsNotEmpty)({ message: "El estado de la ips primaria es requerido" }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], IpsPrimaria.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: "fecha-actualizacion" }),
    __metadata("design:type", Date)
], IpsPrimaria.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: "fecha-creacion" }),
    __metadata("design:type", Date
    // * relaciones
    )
], IpsPrimaria.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => pacientes_1.Pacientes, (pacientes) => pacientes.ipsPrimariaRelation),
    __metadata("design:type", Array)
], IpsPrimaria.prototype, "patientRelation", void 0);
exports.IpsPrimaria = IpsPrimaria = __decorate([
    (0, typeorm_1.Entity)("ipsprimaria")
], IpsPrimaria);
