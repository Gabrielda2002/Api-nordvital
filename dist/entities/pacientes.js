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
exports.Pacientes = void 0;
const typeorm_1 = require("typeorm");
const convenio_1 = require("./convenio");
const tipo_documento_1 = require("./tipo-documento");
const ips_primaria_1 = require("./ips-primaria");
const class_validator_1 = require("class-validator");
const radicacion_1 = require("./radicacion");
let Pacientes = class Pacientes extends typeorm_1.BaseEntity {
};
exports.Pacientes = Pacientes;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: "id" }),
    __metadata("design:type", Number)
], Pacientes.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "Documento" }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsNotEmpty)({ message: "El campo Documento no puede estar vacio" }),
    __metadata("design:type", Number)
], Pacientes.prototype, "documentType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "Identificacion" }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsNotEmpty)({ message: "El campo Identificacion no puede estar vacio" }),
    __metadata("design:type", Number)
], Pacientes.prototype, "documentNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "NombreCompleto" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: "El campo NombreCompleto no puede estar vacio" }),
    (0, class_validator_1.Length)(3, 50, { message: "El campo NombreCompleto debe tener entre $constraint1 y $constraint2 caracteres" }),
    __metadata("design:type", String)
], Pacientes.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "NumeroCelular" }),
    (0, class_validator_1.IsNotEmpty)({ message: "El campo NumeroCelular no puede estar vacio" }),
    (0, class_validator_1.Length)(10, 15, { message: "El campo NumeroCelular debe tener 10 caracteres" }),
    __metadata("design:type", String)
], Pacientes.prototype, "phoneNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "TelefonoFijo" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Length)(7, 20, { message: "El campo TelefonoFijo debe tener entre $constraint1 y $constraint2 caracteres" }),
    __metadata("design:type", String)
], Pacientes.prototype, "landline", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "Email" }),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsNotEmpty)({ message: "El campo Email no puede estar vacio" }),
    __metadata("design:type", String)
], Pacientes.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "Direccion" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: "El campo Direccion no puede estar vacio" }),
    __metadata("design:type", String)
], Pacientes.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "Convenio" }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsNotEmpty)({ message: "El campo Convenio no puede estar vacio" }),
    __metadata("design:type", Number)
], Pacientes.prototype, "convenio", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "ipsPrimaria" }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsNotEmpty)({ message: "El campo ipsPrimaria no puede estar vacio" }),
    __metadata("design:type", Number)
], Pacientes.prototype, "ipsPrimaria", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "Estado" }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsNotEmpty)({ message: "El campo Estado no puede estar vacio" }),
    __metadata("design:type", Boolean)
], Pacientes.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: "fecha-actualizacion" }),
    __metadata("design:type", Date)
], Pacientes.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: "fecha-creacion" }),
    __metadata("design:type", Date
    // * relaciones 
    // ? relacion con convenio
    )
], Pacientes.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => convenio_1.Convenio, (convenio) => convenio.patientRelation),
    (0, typeorm_1.JoinColumn)({ name: "Convenio" }),
    __metadata("design:type", convenio_1.Convenio
    // ? relacion con documento
    )
], Pacientes.prototype, "convenioRelation", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => tipo_documento_1.TipoDocumento, (tipoDocumento) => tipoDocumento.patientRelation),
    (0, typeorm_1.JoinColumn)({ name: "Documento" }),
    __metadata("design:type", tipo_documento_1.TipoDocumento
    // * relacion con ips primaria
    )
], Pacientes.prototype, "documentRelation", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => ips_primaria_1.IpsPrimaria, (ipsPrimaria) => ipsPrimaria.patientRelation),
    (0, typeorm_1.JoinColumn)({ name: "ipsPrimaria" }),
    __metadata("design:type", ips_primaria_1.IpsPrimaria
    // * relacion con radicacion
    )
], Pacientes.prototype, "ipsPrimariaRelation", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => radicacion_1.Radicacion, (radicacion) => radicacion.patientRelation),
    __metadata("design:type", Array)
], Pacientes.prototype, "radicacionRelation", void 0);
exports.Pacientes = Pacientes = __decorate([
    (0, typeorm_1.Entity)("pacientes")
], Pacientes);
