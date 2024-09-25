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
exports.Carpeta = void 0;
const class_validator_1 = require("class-validator");
const typeorm_1 = require("typeorm");
const usuarios_1 = require("./usuarios");
const archivos_1 = require("./archivos");
const municipio_1 = require("./municipio");
let Carpeta = class Carpeta extends typeorm_1.BaseEntity {
};
exports.Carpeta = Carpeta;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'id' }),
    __metadata("design:type", Number)
], Carpeta.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'nombre' }),
    (0, class_validator_1.IsNotEmpty)({ message: "El nombre de la carpeta no puede estar vacío" }),
    __metadata("design:type", String)
], Carpeta.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id' })
    // @IsNotEmpty({message: "El id del usuario no puede estar vacío"})
    ,
    __metadata("design:type", Number)
], Carpeta.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'carpeta_padre_id', nullable: true }),
    __metadata("design:type", Object)
], Carpeta.prototype, "parentFolderId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ruta' }),
    (0, class_validator_1.IsNotEmpty)({ message: "La ruta de la carpeta no puede estar vacía" }),
    __metadata("design:type", String)
], Carpeta.prototype, "path", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'createdAt' }),
    __metadata("design:type", Date)
], Carpeta.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updatedAt' }),
    __metadata("design:type", Date)
], Carpeta.prototype, "updateAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "id_municipio", nullable: true }),
    __metadata("design:type", Number)
], Carpeta.prototype, "idMunicipio", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => usuarios_1.Usuarios, (usuario) => usuario.folderRelation),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", usuarios_1.Usuarios)
], Carpeta.prototype, "userRelation", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Carpeta, (carpeta) => carpeta.childRelation),
    (0, typeorm_1.JoinColumn)({ name: 'carpeta_padre_id' }),
    __metadata("design:type", Carpeta)
], Carpeta.prototype, "parentFolderRelation", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => municipio_1.Municipio, (municipio) => municipio.folderRelation),
    (0, typeorm_1.JoinColumn)({ name: "id_municipio" }),
    __metadata("design:type", municipio_1.Municipio)
], Carpeta.prototype, "municipioRelation", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Carpeta, (carpeta) => carpeta.parentFolderRelation),
    __metadata("design:type", Array)
], Carpeta.prototype, "childRelation", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => archivos_1.Archivos, (archivo) => archivo.folderRelation),
    __metadata("design:type", Array)
], Carpeta.prototype, "fileRelation", void 0);
exports.Carpeta = Carpeta = __decorate([
    (0, typeorm_1.Entity)({ name: "carpetas" })
], Carpeta);
