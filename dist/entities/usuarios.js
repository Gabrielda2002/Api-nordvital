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
exports.Usuarios = void 0;
const typeorm_1 = require("typeorm");
const permisos_usuario_1 = require("./permisos-usuario");
const municipio_1 = require("./municipio");
const roles_1 = require("./roles");
const tipo_documento_1 = require("./tipo-documento");
const class_validator_1 = require("class-validator");
const carpeta_1 = require("./carpeta");
let Usuarios = class Usuarios extends typeorm_1.BaseEntity {
};
exports.Usuarios = Usuarios;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: "IdUsuario" }),
    __metadata("design:type", Number)
], Usuarios.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "CedulaUsuario" }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsNotEmpty)({ message: "El número de cédula es requerido" })
    // @Length(1, 10, {message: "El número de cédula debe tener entre 1 y 10 dígitos"})
    ,
    __metadata("design:type", Number)
], Usuarios.prototype, "dniNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "NombreUsuario" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: "El nombre del usuario es requerido" }),
    (0, class_validator_1.Length)(2, 150, { message: "El nombre del usuario debe tener entre 3 y 50 caracteres" }),
    __metadata("design:type", String)
], Usuarios.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "ApellidoUsuario" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: "El apellido del usuario es requerido" }),
    (0, class_validator_1.Length)(2, 150, { message: "El apellido del usuario debe tener entre 3 y 50 caracteres" }),
    __metadata("design:type", String)
], Usuarios.prototype, "lastName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "TipoCedula" }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsNotEmpty)({ message: "El tipo de cédula es requerido" })
    // @Length(0,3, {message: "El tipo de cédula debe tener entre 1 y 3 dígitos"})
    ,
    __metadata("design:type", Number)
], Usuarios.prototype, "dniType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "EmailUsuario" }),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], Usuarios.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "ClaveUsuario" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: "La contraseña del usuario es requerida" }),
    (0, class_validator_1.Length)(8, 150, { message: "La contraseña del usuario debe tener entre 8 y 150 caracteres" }),
    (0, class_validator_1.Matches)(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/, {
        message: "La contraseña debe tener al menos una letra mayúscula, una letra minúscula, un número y un caracter especial (!@#$%^&*)",
    }),
    __metadata("design:type", String)
], Usuarios.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "fecha" }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], Usuarios.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "Estado" }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsNotEmpty)({ message: "El estado del usuario es requerido" }),
    __metadata("design:type", Boolean)
], Usuarios.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "Nit_Municipio" }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsNotEmpty)({ message: "El municipio es requerido" })
    // @Length(1, 10, {message: "El municipio debe tener entre 1 y 10 dígitos"})
    ,
    __metadata("design:type", Number)
], Usuarios.prototype, "municipio", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "Tipo_rol" }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsNotEmpty)({ message: "El rol es requerido" }),
    __metadata("design:type", String)
], Usuarios.prototype, "rol", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "imagen" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], Usuarios.prototype, "photo", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: "fecha-actualizacion" }),
    __metadata("design:type", Date)
], Usuarios.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: "fecha-creacion" }),
    __metadata("design:type", Date
    // * relaciones
    // * relaciones sin llaves foraneas
    // * relaciones con permisos usuario
    )
], Usuarios.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => permisos_usuario_1.PermisosUsuarios, (permisosUsuarios) => permisosUsuarios.userRelation),
    __metadata("design:type", Array)
], Usuarios.prototype, "permisosUsuariosRelation", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => municipio_1.Municipio, (municipio) => municipio.usuarioRelation),
    (0, typeorm_1.JoinColumn)({ name: "Nit_Municipio" }),
    __metadata("design:type", municipio_1.Municipio)
], Usuarios.prototype, "municipioRelation", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => roles_1.Roles, (roles) => roles.usuarioRelation),
    (0, typeorm_1.JoinColumn)({ name: "Tipo_rol" }),
    __metadata("design:type", roles_1.Roles)
], Usuarios.prototype, "rolesRelation", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => tipo_documento_1.TipoDocumento, (tipoDocumento) => tipoDocumento.usuarioRelation),
    (0, typeorm_1.JoinColumn)({ name: "TipoCedula" }),
    __metadata("design:type", tipo_documento_1.TipoDocumento
    // * relacion con carpeta
    )
], Usuarios.prototype, "typeDocumentRelation", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => carpeta_1.Carpeta, (carpeta) => carpeta.userRelation),
    __metadata("design:type", Array)
], Usuarios.prototype, "folderRelation", void 0);
exports.Usuarios = Usuarios = __decorate([
    (0, typeorm_1.Entity)({ name: "usuario" })
], Usuarios);
