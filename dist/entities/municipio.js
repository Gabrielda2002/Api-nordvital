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
exports.Municipio = void 0;
const typeorm_1 = require("typeorm");
const usuarios_1 = require("./usuarios");
const class_validator_1 = require("class-validator");
const carpeta_1 = require("./carpeta");
let Municipio = class Municipio extends typeorm_1.BaseEntity {
};
exports.Municipio = Municipio;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: "IdMunicipio" }),
    __metadata("design:type", Number)
], Municipio.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "NombreMunicipio" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'El nombre del municipio no puede estar vacio' }),
    (0, class_validator_1.Length)(3, 50, { message: 'El nombre del municipio debe tener entre $constraint1 y $constraint2 caracteres' }),
    __metadata("design:type", String)
], Municipio.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "NitMunicipio" }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'El nit del municipio no puede estar vacio' }),
    (0, class_validator_1.Min)(1, { message: 'El nit del municipio debe tener 1 caracteres' })
    // @Max(9, {message: 'El nit del municipio debe tener 9 caracteres'})
    ,
    __metadata("design:type", Number)
], Municipio.prototype, "nitMunicipio", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "Estado" }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'El estado del municipio no puede estar vacio' }),
    __metadata("design:type", Boolean)
], Municipio.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: "fecha-actualizacion" }),
    __metadata("design:type", Date)
], Municipio.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: "fecha-creacion" }),
    __metadata("design:type", Date)
], Municipio.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => carpeta_1.Carpeta, (carpeta) => carpeta.municipioRelation),
    __metadata("design:type", Array)
], Municipio.prototype, "folderRelation", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => usuarios_1.Usuarios, (usuarios) => usuarios.municipioRelation),
    __metadata("design:type", Array)
], Municipio.prototype, "usuarioRelation", void 0);
exports.Municipio = Municipio = __decorate([
    (0, typeorm_1.Entity)("municipio")
], Municipio);
