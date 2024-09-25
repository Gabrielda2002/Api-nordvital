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
exports.Permisos = void 0;
const typeorm_1 = require("typeorm");
const permisos_rol_1 = require("./permisos-rol");
const permisos_usuario_1 = require("./permisos-usuario");
const class_validator_1 = require("class-validator");
let Permisos = class Permisos extends typeorm_1.BaseEntity {
};
exports.Permisos = Permisos;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: "Id" }),
    __metadata("design:type", Number)
], Permisos.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "Nombre" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: "El nombre es requerido" }),
    (0, class_validator_1.Length)(3, 50, { message: "El nombre debe tener entre $constraint1 y $constraint2 caracteres" }),
    __metadata("design:type", String)
], Permisos.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "Descripcion" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: "La descripción es requerida" }),
    (0, class_validator_1.Length)(3, 50, { message: "La descripción debe tener entre $constraint1 y $constraint2 caracteres" }),
    __metadata("design:type", String)
], Permisos.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "nombre_variable" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: "El nombre de la variable es requerido" }),
    (0, class_validator_1.Length)(3, 50, { message: "El nombre de la variable debe tener entre $constraint1 y $constraint2 caracteres" }),
    __metadata("design:type", String)
], Permisos.prototype, "nameVariable", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "Modulo_Relacionado" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Length)(3, 50, { message: "El modulo relacionado debe tener entre $constraint1 y $constraint2 caracteres" }),
    __metadata("design:type", String)
], Permisos.prototype, "relatedModule", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: "Fecha_Creacion" }),
    __metadata("design:type", Date)
], Permisos.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: "fecha-actualizacion" }),
    __metadata("design:type", Date
    // * relaciones
    // * relacion con permisosRol
    )
], Permisos.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => permisos_rol_1.PermisosRol, (permisosRol) => permisosRol.permisosRelation),
    __metadata("design:type", Array)
], Permisos.prototype, "permisosRolRelation", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => permisos_usuario_1.PermisosUsuarios, (permisosUsuario) => permisosUsuario.permisoRelation),
    __metadata("design:type", Array)
], Permisos.prototype, "permisosUsuariosRelation", void 0);
exports.Permisos = Permisos = __decorate([
    (0, typeorm_1.Entity)("permisos")
], Permisos);
