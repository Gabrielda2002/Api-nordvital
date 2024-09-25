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
exports.CupsRadicados = void 0;
const typeorm_1 = require("typeorm");
const radicacion_1 = require("./radicacion");
const unidad_funcional_1 = require("./unidad-funcional");
const class_validator_1 = require("class-validator");
const estados_1 = require("./estados");
let CupsRadicados = class CupsRadicados extends typeorm_1.BaseEntity {
};
exports.CupsRadicados = CupsRadicados;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: "IdCups" }),
    __metadata("design:type", Number)
], CupsRadicados.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "CodigoCupsPacientes" }),
    (0, class_validator_1.IsNotEmpty)({ message: "El código del cups es requerido" }),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CupsRadicados.prototype, "code", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "DescripcionCupsPacientes" }),
    (0, class_validator_1.IsNotEmpty)({ message: "La descripción del cups es requerida" }),
    __metadata("design:type", String)
], CupsRadicados.prototype, "DescriptionCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "Estado" }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CupsRadicados.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "observacionCups" }),
    (0, class_validator_1.IsNotEmpty)({ message: "La observación del cups es requerida" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 150, { message: "La observación debe tener entre 1 y 150 caracteres" }),
    __metadata("design:type", String)
], CupsRadicados.prototype, "observation", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "UnidadFuncional" }),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CupsRadicados.prototype, "functionalUnit", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "IDRADICADO" }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(999999),
    __metadata("design:type", Number)
], CupsRadicados.prototype, "idRadicacion", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: "UltimaModificacion" }),
    __metadata("design:type", Date)
], CupsRadicados.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: "FechaRegistro" }),
    __metadata("design:type", Date
    //* relaciones
    )
], CupsRadicados.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => radicacion_1.Radicacion, (radicacion) => radicacion.cupsRadicadosRelation),
    (0, typeorm_1.JoinColumn)({ name: "IDRADICADO" }),
    __metadata("design:type", radicacion_1.Radicacion
    // * relacion con autorizacion
    )
], CupsRadicados.prototype, "radicacionRelation", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => estados_1.Estados, (estados) => estados.cupsRelation),
    (0, typeorm_1.JoinColumn)({ name: "Estado" }),
    __metadata("design:type", estados_1.Estados)
], CupsRadicados.prototype, "statusRelation", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => unidad_funcional_1.UnidadFuncional, (unidadFuncional) => unidadFuncional.cupsRadicadosRelation),
    (0, typeorm_1.JoinColumn)({ name: "UnidadFuncional" }),
    __metadata("design:type", unidad_funcional_1.UnidadFuncional)
], CupsRadicados.prototype, "functionalUnitRelation", void 0);
exports.CupsRadicados = CupsRadicados = __decorate([
    (0, typeorm_1.Entity)("cupspaciente")
], CupsRadicados);
