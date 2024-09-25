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
exports.EstadosSeguimiento = void 0;
const typeorm_1 = require("typeorm");
const seguimiento_auxiliar_1 = require("./seguimiento-auxiliar");
const class_validator_1 = require("class-validator");
const seguimiento_auxiliar_cirugias_1 = require("./seguimiento-auxiliar-cirugias");
let EstadosSeguimiento = class EstadosSeguimiento extends typeorm_1.BaseEntity {
};
exports.EstadosSeguimiento = EstadosSeguimiento;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: "id" }),
    __metadata("design:type", Number)
], EstadosSeguimiento.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "NombreEstadoSeguimiento" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(3, 50, { message: "El nombre del estado de seguimiento debe tener entre $constraint1 y $constraint2 caracteres" }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], EstadosSeguimiento.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "Estado" }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Boolean)
], EstadosSeguimiento.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: "fecha-actualizacion" }),
    __metadata("design:type", Date)
], EstadosSeguimiento.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: "fecha-creacion" }),
    __metadata("design:type", Date
    // * relaciones
    )
], EstadosSeguimiento.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => seguimiento_auxiliar_1.SeguimietoAuxiliar, (seguimientoAuxiliar) => seguimientoAuxiliar.estadoSeguimientoRelation),
    __metadata("design:type", Array)
], EstadosSeguimiento.prototype, "seguimientoAuxiliarRelation", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => seguimiento_auxiliar_cirugias_1.SeguimientoAuxiliarCirugias, (seguimientoAuxiliarCirugias) => seguimientoAuxiliarCirugias.estadoSeguimientoRelation),
    __metadata("design:type", Array)
], EstadosSeguimiento.prototype, "statusRelation", void 0);
exports.EstadosSeguimiento = EstadosSeguimiento = __decorate([
    (0, typeorm_1.Entity)("estadoseguimiento")
], EstadosSeguimiento);
