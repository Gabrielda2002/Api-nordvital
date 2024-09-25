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
exports.AlterTableRadicacion1726177365541 = void 0;
const typeorm_1 = require("typeorm");
class AlterTableRadicacion1726177365541 {
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.addColumn("radicacion", new typeorm_1.TableColumn({
                name: "id_diagnostico",
                type: "int",
                isNullable: true
            }));
            yield queryRunner.query(`
            UPDATE radicacion r
            SET id_diagnostico = (
                SELECT d.id
                FROM diagnostico d
                WHERE d.codigo = r.CodDiagnostico
            )
        `);
            // llave de radicacion a diagnostico
            yield queryRunner.createForeignKey('radicacion', new typeorm_1.TableForeignKey({
                columnNames: ['id_diagnostico'],
                referencedColumnNames: ['id'],
                referencedTableName: 'diagnostico',
                onDelete: 'CASCADE'
            }));
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.dropColumn("radicacion", "id_diagnostico");
            yield queryRunner.query(`
            UPDATE radicacion
            SET id_diagnostico = NULL
        `);
        });
    }
}
exports.AlterTableRadicacion1726177365541 = AlterTableRadicacion1726177365541;
