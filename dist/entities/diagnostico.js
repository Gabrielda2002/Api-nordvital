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
exports.Diagnostico = void 0;
const class_validator_1 = require("class-validator");
const typeorm_1 = require("typeorm");
const radicacion_1 = require("./radicacion");
let Diagnostico = class Diagnostico extends typeorm_1.BaseEntity {
};
exports.Diagnostico = Diagnostico;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: "id" }),
    __metadata("design:type", Number)
], Diagnostico.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "codigo" }),
    (0, class_validator_1.Matches)(/^[a-zA-Z]{1,2}(\d{1,3}[a-zA-Z]?|[a-zA-Z]{1})$/, { message: "El código debe tener 1 o 2 letras seguidas de 1 a 3 dígitos y opcionalmente una letra" }),
    (0, class_validator_1.IsNotEmpty)({ message: "El codigo es requerido" }),
    __metadata("design:type", String)
], Diagnostico.prototype, "code", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "descripcion" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: "La descripcion es requerido" }),
    (0, class_validator_1.Length)(1, 150, { message: "La descripción debe tener entre 1 y 150 caracteres" }),
    __metadata("design:type", String)
], Diagnostico.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: "fecha-actualizacion" }),
    __metadata("design:type", Date)
], Diagnostico.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: "fecha-creacion" }),
    __metadata("design:type", Date)
], Diagnostico.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => radicacion_1.Radicacion, (radicacion) => radicacion.diagnosticoRelation),
    __metadata("design:type", Array)
], Diagnostico.prototype, "radicacionRelation", void 0);
exports.Diagnostico = Diagnostico = __decorate([
    (0, typeorm_1.Entity)("diagnostico")
], Diagnostico);
