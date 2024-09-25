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
exports.Soportes = void 0;
const class_validator_1 = require("class-validator");
const typeorm_1 = require("typeorm");
const radicacion_1 = require("./radicacion");
let Soportes = class Soportes extends typeorm_1.BaseEntity {
};
exports.Soportes = Soportes;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: "id" }),
    __metadata("design:type", Number)
], Soportes.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "nombre" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 150, { message: "El nombre del soporte debe tener entre $constraint1 y $constraint2 caracteres" }),
    (0, class_validator_1.IsNotEmpty)({ message: "El nombre del soporte es requerido" }),
    __metadata("design:type", String)
], Soportes.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "url" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 200, { message: "La url del soporte debe tener entre $constraint1 y $constraint2 caracteres" }),
    (0, class_validator_1.IsNotEmpty)({ message: "La url del soporte es requerida" }),
    __metadata("design:type", String)
], Soportes.prototype, "url", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "size" }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsNotEmpty)({ message: "El tamaño del soporte es requerido" }),
    __metadata("design:type", Number)
], Soportes.prototype, "size", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "tipo" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 100, { message: "El tipo del soporte debe tener entre $constraint1 y $constraint2 caracteres" }),
    (0, class_validator_1.IsNotEmpty)({ message: "El tipo del soporte es requerido" }),
    __metadata("design:type", String)
], Soportes.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: "fechaCreacion" }),
    __metadata("design:type", Date)
], Soportes.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: "fechaActualizacion" }),
    __metadata("design:type", Date)
], Soportes.prototype, "updateAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "name_saved" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Soportes.prototype, "nameSaved", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => radicacion_1.Radicacion, radicacion => radicacion.soportesRelation),
    __metadata("design:type", Array)
], Soportes.prototype, "radicacionRelation", void 0);
exports.Soportes = Soportes = __decorate([
    (0, typeorm_1.Entity)("soportes")
], Soportes);
