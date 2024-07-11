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
exports.Especialidad = void 0;
const typeorm_1 = require("typeorm");
let Especialidad = class Especialidad extends typeorm_1.BaseEntity {
};
exports.Especialidad = Especialidad;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: "IdEspecialidad" }),
    __metadata("design:type", Number)
], Especialidad.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "NombreEspecialidad" }),
    __metadata("design:type", String)
], Especialidad.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "EstadoEspecialidad" }),
    __metadata("design:type", String)
], Especialidad.prototype, "status", void 0);
exports.Especialidad = Especialidad = __decorate([
    (0, typeorm_1.Entity)("especialidad")
], Especialidad);
