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
exports.LugarRadicacion = void 0;
const typeorm_1 = require("typeorm");
const radicacion_1 = require("./radicacion");
const class_validator_1 = require("class-validator");
let LugarRadicacion = class LugarRadicacion extends typeorm_1.BaseEntity {
};
exports.LugarRadicacion = LugarRadicacion;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: "IdLugar" }),
    __metadata("design:type", Number)
], LugarRadicacion.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "NombreLugar" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: "El nombre del lugar es requerido" }),
    (0, class_validator_1.Length)(3, 50, { message: "El nombre del lugar debe tener entre $constraint1 y $constraint2 caracteres" }),
    __metadata("design:type", String)
], LugarRadicacion.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "Estado" }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsNotEmpty)({ message: "El estado del lugar es requerido" }),
    __metadata("design:type", Boolean)
], LugarRadicacion.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: "fecha-actualizacion" }),
    __metadata("design:type", Date)
], LugarRadicacion.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: "fecha-creacion" }),
    __metadata("design:type", Date
    // * relaciones
    )
], LugarRadicacion.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => radicacion_1.Radicacion, (radicacion) => radicacion.placeRelation),
    __metadata("design:type", Array)
], LugarRadicacion.prototype, "radicacionRelation", void 0);
exports.LugarRadicacion = LugarRadicacion = __decorate([
    (0, typeorm_1.Entity)("lugarradicacion")
], LugarRadicacion);
