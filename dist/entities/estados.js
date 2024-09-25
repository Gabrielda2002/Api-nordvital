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
exports.Estados = void 0;
const class_validator_1 = require("class-validator");
const typeorm_1 = require("typeorm");
const cups_radicados_1 = require("./cups-radicados");
let Estados = class Estados extends typeorm_1.BaseEntity {
};
exports.Estados = Estados;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: "IdAutorizacion" }),
    __metadata("design:type", Number)
], Estados.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "OpcionAutorizacion" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: "El nombre es requerido" }),
    (0, class_validator_1.Length)(1, 50, { message: "La longitud del nombre debe ser de 1 a 50 caracteres" }),
    __metadata("design:type", String)
], Estados.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: "fecha-actualizacion" }),
    __metadata("design:type", Date)
], Estados.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: "fecha-creacion" }),
    __metadata("design:type", Date
    // * relaciones
    // * relacion con cups
    )
], Estados.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => cups_radicados_1.CupsRadicados, (cupsRadicados) => cupsRadicados.statusRelation),
    __metadata("design:type", Array)
], Estados.prototype, "cupsRelation", void 0);
exports.Estados = Estados = __decorate([
    (0, typeorm_1.Entity)("autorizacion")
], Estados);
