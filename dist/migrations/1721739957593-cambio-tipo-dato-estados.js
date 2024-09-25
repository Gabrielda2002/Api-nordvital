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
exports.CambioTipoDatoEstados1721739957593 = void 0;
const tables = [
    'convenio',
    'documento',
    'especialidad',
    'estadoseguimiento',
    'gruposervicio',
    'ipsprimaria',
    'ipsremite',
    'lugarradicacion',
    'municipio',
    'servicio',
    'serviciosolicitado',
    'unidadfuncional',
    'usuario',
    'pacientes',
    'radicador'
];
const columns = [
    "EstadoConvenio",
    "EstadoDocumento",
    "EstadoEspecialidad",
    "Estado",
    "EstadoGrupoServicio",
    "EstadoIpsPrimaria",
    "EstadoIpsRemite",
    "EstadoLugar",
    "EstadoMunicipio",
    "EstadoServicio",
    "EstadoCup",
    "EstadoUnidad",
    "EstadoUsuario",
    "EstadoPaciente",
    "EstadoRadicador"
];
class CambioTipoDatoEstados1721739957593 {
    constructor() {
        this.name = "CambioTipoDatoEstados1721739957593";
    }
    changeType(queryRunner, table, column) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE \`${table}\` CHANGE COLUMN \`${column}\` Estado VARCHAR(255) NOT NULL`);
            yield queryRunner.query(`UPDATE \`${table}\` SET \`Estado\` = 1 WHERE \`Estado\` = 'Activo'`);
            yield queryRunner.query(`UPDATE \`${table}\` SET \`Estado\` = 0 WHERE \`Estado\` = 'Inactivo'`);
            yield queryRunner.query(`ALTER TABLE \`${table}\` MODIFY COLUMN \`Estado\` TINYINT(1) NOT NULL`);
        });
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            for (let i = 0; i < tables.length; i++) {
                try {
                    yield this.changeType(queryRunner, tables[i], columns[i]);
                }
                catch (error) {
                    console.error(`Error cambiando el tipo de dato de la columna ${columns[i]} en la tabla ${tables[i]}:`, error);
                }
            }
        });
    }
    revertType(queryRunner, table, column) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE \`${table}\` CHANGE COLUMN \`Estado\` \`${column}\` VARCHAR(255) NOT NULL`);
            yield queryRunner.query(`UPDATE \`${table}\` SET \`${column}\` = 'Activo' WHERE \`Estado\` = 1`);
            yield queryRunner.query(`UPDATE \`${table}\` SET \`${column}\` = 'Inactivo' WHERE \`Estado\` = 0`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            for (let i = 0; i < tables.length; i++) {
                try {
                    yield this.revertType(queryRunner, tables[i], columns[i]);
                }
                catch (error) {
                    console.error(`Error revirtiendo el tipo de dato de la columna ${columns[i]} en la tabla ${tables[i]}:`, error);
                }
            }
        });
    }
}
exports.CambioTipoDatoEstados1721739957593 = CambioTipoDatoEstados1721739957593;
