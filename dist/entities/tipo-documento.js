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
exports.TipoDocumento = void 0;
const typeorm_1 = require("typeorm");
const radicacion_1 = require("./radicacion");
let TipoDocumento = class TipoDocumento extends typeorm_1.BaseEntity {
};
exports.TipoDocumento = TipoDocumento;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: "IdDocumento" }),
    __metadata("design:type", Number)
], TipoDocumento.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "TipoDocumento" }),
    __metadata("design:type", String)
], TipoDocumento.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "EstadoDocumento" }),
    __metadata("design:type", String)
], TipoDocumento.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => radicacion_1.Radicacion, (radicacion) => radicacion.typeDocumentRelation),
    __metadata("design:type", Array)
], TipoDocumento.prototype, "radicacion", void 0);
exports.TipoDocumento = TipoDocumento = __decorate([
    (0, typeorm_1.Entity)("documento")
], TipoDocumento);
