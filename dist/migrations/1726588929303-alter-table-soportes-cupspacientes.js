"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlterTableSoportesCupspacientes1726588929303 = void 0;
const typeorm_1 = require("typeorm");
class AlterTableSoportesCupspacientes1726588929303 {
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.addColumn("soportes", new typeorm_1.TableColumn({
                name: "name_saved",
                type: "varchar",
                isNullable: true
            }));
            // Eliminar las columnas FechaRegistro y UltimaModificacion de la tabla cupspaciente
            yield queryRunner.dropColumn("cupspaciente", "FechaRegistro");
            yield queryRunner.dropColumn("cupspaciente", "UltimaModificacion");
            // Crear las columnas FechaRegistro y UltimaModificacion en la tabla cupspaciente
            yield queryRunner.addColumn("cupspaciente", new typeorm_1.TableColumn({
                name: "FechaRegistro",
                type: "timestamp",
                default: "CURRENT_TIMESTAMP",
                isNullable: false
            }));
            yield queryRunner.addColumn("cupspaciente", new typeorm_1.TableColumn({
                name: "UltimaModificacion",
                type: "timestamp",
                default: "CURRENT_TIMESTAMP",
                isNullable: false
            }));
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            // Eliminar las columnas FechaRegistro y UltimaModificacion de la tabla cupspaciente
            yield queryRunner.dropColumn("cupspaciente", "FechaRegistro");
            yield queryRunner.dropColumn("cupspaciente", "UltimaModificacion");
        });
    }
}
exports.AlterTableSoportesCupspacientes1726588929303 = AlterTableSoportesCupspacientes1726588929303;
