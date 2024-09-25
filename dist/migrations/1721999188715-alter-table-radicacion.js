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
exports.alterTalePacientes1721999188715 = void 0;
const typeorm_1 = require("typeorm");
class alterTalePacientes1721999188715 {
    constructor() {
        this.name = 'alterTalePacientes1721999188715';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.addColumn('radicacion', new typeorm_1.TableColumn({
                name: 'Paciente_id',
                type: 'int',
                isNullable: true
            }));
            yield queryRunner.createForeignKey('radicacion', new typeorm_1.TableForeignKey({
                columnNames: ['Paciente_id'],
                referencedColumnNames: ['IdUsuarios'],
                referencedTableName: 'pacientes',
                onDelete: 'SET NULL'
            }));
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            // Obtener la clave foránea existente
            const table = yield queryRunner.getTable('radicacion');
            const foreignKey = table === null || table === void 0 ? void 0 : table.foreignKeys.find(fk => fk.columnNames.indexOf('Paciente_id') !== -1);
            // Eliminar la clave foránea
            if (foreignKey) {
                yield queryRunner.dropForeignKey('radicacion', foreignKey);
            }
            // Eliminar la columna
            yield queryRunner.dropColumn('radicacion', 'Paciente_id');
        });
    }
}
exports.alterTalePacientes1721999188715 = alterTalePacientes1721999188715;
