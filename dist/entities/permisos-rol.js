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
exports.PermisosRol = void 0;
const typeorm_1 = require("typeorm");
const roles_1 = require("./roles");
const permisos_1 = require("./permisos");
const class_validator_1 = require("class-validator");
let PermisosRol = class PermisosRol extends typeorm_1.BaseEntity {
};
exports.PermisosRol = PermisosRol;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: "id" }),
    __metadata("design:type", Number)
], PermisosRol.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "id_rol" }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsNotEmpty)({ message: "El campo id_rol no puede estar vacio" }),
    __metadata("design:type", Number)
], PermisosRol.prototype, "idRol", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "id_permisos" }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsNotEmpty)({ message: "El campo id_permisos no puede estar vacio" }),
    __metadata("design:type", Number)
], PermisosRol.prototype, "idPermisos", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: "fecha-actualizacion" }),
    __metadata("design:type", Date)
], PermisosRol.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: "fecha-creacion" }),
    __metadata("design:type", Date
    // * relaciones
    )
], PermisosRol.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => roles_1.Roles, (roles) => roles.permisosRolRelation),
    (0, typeorm_1.JoinColumn)({ name: "id_rol" }),
    __metadata("design:type", roles_1.Roles)
], PermisosRol.prototype, "rolRelation", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => permisos_1.Permisos, (permisos) => permisos.permisosRolRelation),
    (0, typeorm_1.JoinColumn)({ name: "id_permisos" }),
    __metadata("design:type", permisos_1.Permisos)
], PermisosRol.prototype, "permisosRelation", void 0);
exports.PermisosRol = PermisosRol = __decorate([
    (0, typeorm_1.Entity)("permisosrol")
], PermisosRol);
