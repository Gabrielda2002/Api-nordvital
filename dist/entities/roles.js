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
exports.Roles = void 0;
const typeorm_1 = require("typeorm");
const permisos_rol_1 = require("./permisos-rol");
const usuarios_1 = require("./usuarios");
const class_validator_1 = require("class-validator");
let Roles = class Roles extends typeorm_1.BaseEntity {
};
exports.Roles = Roles;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'IdRol' }),
    __metadata("design:type", Number)
], Roles.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'TipoRol' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'El nombre del rol es requerido' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(3, 50, { message: 'El nombre del rol debe tener entre $constraint1 y $constraint2 caracteres' }),
    __metadata("design:type", String)
], Roles.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: "fecha-actualizacion" }),
    __metadata("design:type", Date)
], Roles.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: "fecha-creacion" }),
    __metadata("design:type", Date
    // * relaciones
    )
], Roles.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => permisos_rol_1.PermisosRol, (permisosRol) => permisosRol.rolRelation),
    __metadata("design:type", Array)
], Roles.prototype, "permisosRolRelation", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => usuarios_1.Usuarios, (usuarios) => usuarios.rolesRelation),
    __metadata("design:type", Array)
], Roles.prototype, "usuarioRelation", void 0);
exports.Roles = Roles = __decorate([
    (0, typeorm_1.Entity)("rol")
], Roles);
