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
exports.AgregarCamposCreateUpdate1721656857249 = void 0;
const tables = [
    'convenio',
    'diagnostico',
    'documento',
    'especialidad',
    'estadoseguimiento',
    'gruposervicio',
    'ipsprimaria',
    'ipsremite',
    'lugarradicacion',
    'municipio',
    'autorizacion',
    'rol',
    'seguimientoauxiliar',
    'servicio',
    'serviciosolicitado',
    'unidadfuncional',
    'usuario',
    'permisos',
    'permisosusuario',
    'permisosrol',
    'pacientes',
    'radicador'
];
class AgregarCamposCreateUpdate1721656857249 {
    constructor() {
        this.name = 'AgregarCamposCreateUpdate1721656857249';
    }
    addTimestamps(queryRunner, table) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE \`${table}\` ADD \`fecha-creacion\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP`);
            yield queryRunner.query(`ALTER TABLE \`${table}\` ADD \`fecha-actualizacion\` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`);
        });
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const table of tables) {
                try {
                    yield this.addTimestamps(queryRunner, table);
                }
                catch (error) {
                    console.error(`Error adding timestamps to table ${table}:`, error);
                }
            }
        });
    }
    dropTimestamps(queryRunner, table) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE \`${table}\` DROP COLUMN \`fecha-actualizacion\``);
            yield queryRunner.query(`ALTER TABLE \`${table}\` DROP COLUMN \`fecha-creacion\``);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const table of tables) {
                try {
                    yield this.dropTimestamps(queryRunner, table);
                }
                catch (error) {
                    console.error(`Error dropping timestamps from table ${table}:`, error);
                }
            }
        });
    }
}
exports.AgregarCamposCreateUpdate1721656857249 = AgregarCamposCreateUpdate1721656857249;
