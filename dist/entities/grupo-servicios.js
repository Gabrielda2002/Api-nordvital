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
exports.GrupoServicios = void 0;
const typeorm_1 = require("typeorm");
let GrupoServicios = class GrupoServicios extends typeorm_1.BaseEntity {
};
exports.GrupoServicios = GrupoServicios;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: "IdGrupo" }),
    __metadata("design:type", Number)
], GrupoServicios.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "NombreGrupo" }),
    __metadata("design:type", String)
], GrupoServicios.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "EstadoGrupoServicio" }),
    __metadata("design:type", String)
], GrupoServicios.prototype, "status", void 0);
exports.GrupoServicios = GrupoServicios = __decorate([
    (0, typeorm_1.Entity)("gruposervicio")
], GrupoServicios);
