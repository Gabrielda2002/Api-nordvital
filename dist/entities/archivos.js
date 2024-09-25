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
exports.Archivos = void 0;
const class_validator_1 = require("class-validator");
const typeorm_1 = require("typeorm");
const carpeta_1 = require("./carpeta");
let Archivos = class Archivos extends typeorm_1.BaseEntity {
};
exports.Archivos = Archivos;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: "id" }),
    __metadata("design:type", Number)
], Archivos.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "nombre" }),
    (0, class_validator_1.IsNotEmpty)({ message: "El nombre del archivo no puede estar vacío" }),
    __metadata("design:type", String)
], Archivos.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "ruta" }),
    (0, class_validator_1.IsNotEmpty)({ message: "La ruta del archivo no puede estar vacía" }),
    __metadata("design:type", String)
], Archivos.prototype, "path", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "tamano" }),
    (0, class_validator_1.IsNotEmpty)({ message: "El tamaño del archivo no puede estar vacío" }),
    __metadata("design:type", Number)
], Archivos.prototype, "size", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "carpeta_id" })
    // @IsNotEmpty({message: "El id de la carpeta no puede estar vacío"})
    ,
    __metadata("design:type", Number)
], Archivos.prototype, "folderId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "mimeType" }),
    (0, class_validator_1.IsNotEmpty)({ message: "El tipo de archivo no puede estar vacío" }),
    __metadata("design:type", String)
], Archivos.prototype, "mimeType", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: "createdAt" }),
    __metadata("design:type", Date)
], Archivos.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: "updatedAt" }),
    __metadata("design:type", Date)
], Archivos.prototype, "updateAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "name_saved" }),
    __metadata("design:type", String)
], Archivos.prototype, "nameSaved", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => carpeta_1.Carpeta, (carpeta) => carpeta.fileRelation),
    (0, typeorm_1.JoinColumn)({ name: "carpeta_id" }),
    __metadata("design:type", carpeta_1.Carpeta)
], Archivos.prototype, "folderRelation", void 0);
exports.Archivos = Archivos = __decorate([
    (0, typeorm_1.Entity)({ name: "archivos" })
], Archivos);
