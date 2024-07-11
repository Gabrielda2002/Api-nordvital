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
let Convenio = class Convenio extends typeorm_1.BaseEntity {
};
exports.Convenio = Convenio;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: "IdConvenio" }),
    __metadata("design:type", Number)
], Convenio.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "NombreConvenio" }),
    __metadata("design:type", String)
], Convenio.prototype, "nameAgreement", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "EstadoConvenio" }),
    __metadata("design:type", String)
], Convenio.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "roles", type: "text" }),
    __metadata("design:type", String)
], Convenio.prototype, "roles", void 0);
exports.Convenio = Convenio = __decorate([
    (0, typeorm_1.Entity)("convenio")
], Convenio);
