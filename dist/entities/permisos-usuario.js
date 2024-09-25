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
exports.PermisosUsuarios = void 0;
const typeorm_1 = require("typeorm");
const usuarios_1 = require("./usuarios");
const permisos_1 = require("./permisos");
const class_validator_1 = require("class-validator");
let PermisosUsuarios = class PermisosUsuarios extends typeorm_1.BaseEntity {
};
exports.PermisosUsuarios = PermisosUsuarios;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: "id" }),
    __metadata("design:type", Number)
], PermisosUsuarios.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "id_usuario" }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsNotEmpty)({ message: "El campo id_usuario no puede estar vacio" }),
    __metadata("design:type", Number)
], PermisosUsuarios.prototype, "idUser", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "id_permiso" }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsNotEmpty)({ message: "El campo id_permiso no puede estar vacio" }),
    __metadata("design:type", Number)
], PermisosUsuarios.prototype, "idPermiso", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: "fecha_creacion" }),
    __metadata("design:type", Date)
], PermisosUsuarios.prototype, "createdat", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: "fecha-actualizacion" }),
    __metadata("design:type", Date
    // * relaciones
    )
], PermisosUsuarios.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => usuarios_1.Usuarios, (usuarios) => usuarios.permisosUsuariosRelation),
    (0, typeorm_1.JoinColumn)({ name: "id_usuario" }),
    __metadata("design:type", usuarios_1.Usuarios)
], PermisosUsuarios.prototype, "userRelation", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => permisos_1.Permisos, (permisos) => permisos.permisosUsuariosRelation),
    (0, typeorm_1.JoinColumn)({ name: "id_permiso" }),
    __metadata("design:type", permisos_1.Permisos)
], PermisosUsuarios.prototype, "permisoRelation", void 0);
exports.PermisosUsuarios = PermisosUsuarios = __decorate([
    (0, typeorm_1.Entity)({ name: "permisosusuario" })
], PermisosUsuarios);
