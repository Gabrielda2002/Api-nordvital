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
exports.alterTableSoportes1722266464859 = void 0;
class alterTableSoportes1722266464859 {
    constructor() {
        this.name = 'alterTableSoportes1722266464859';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            // Añadir columna para el tamaño del archivo
            yield queryRunner.query(`ALTER TABLE \`soportes\` ADD \`size\` BIGINT NOT NULL DEFAULT 0`);
            // Añadir columna para el tipo de archivo
            yield queryRunner.query(`ALTER TABLE \`soportes\` ADD \`tipo\` VARCHAR(100)`);
            // Añadir columna para la fecha de creación
            yield queryRunner.query(`ALTER TABLE \`soportes\` ADD \`fechaCreacion\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP`);
            // Añadir columna para la fecha de actualización
            yield queryRunner.query(`ALTER TABLE \`soportes\` ADD \`fechaActualizacion\` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            // Eliminar columna de tamaño
            yield queryRunner.query(`ALTER TABLE \`soportes\` DROP COLUMN \`size\``);
            // Eliminar columna de tipo
            yield queryRunner.query(`ALTER TABLE \`soportes\` DROP COLUMN \`tipo\``);
            // Eliminar columna de fecha de creación
            yield queryRunner.query(`ALTER TABLE \`soportes\` DROP COLUMN \`fechaCreacion\``);
            // Eliminar columna de fecha de actualización
            yield queryRunner.query(`ALTER TABLE \`soportes\` DROP COLUMN \`fechaActualizacion\``);
        });
    }
}
exports.alterTableSoportes1722266464859 = alterTableSoportes1722266464859;
