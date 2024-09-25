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
exports.AlterTableCirugias1724354772491 = void 0;
const typeorm_1 = require("typeorm");
const saltRounds = 10;
class AlterTableCirugias1724354772491 {
    constructor() {
        this.name = "AlterTableCirugias1724354772491";
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            // ? se busca la llave foranea de pacientes y si se encuentra se elimina
            const pacienteExist = yield queryRunner.hasColumn("cirugias", "paciente_id");
            if (pacienteExist) {
                const table = yield queryRunner.getTable("cirugias");
                const foreignKey = table === null || table === void 0 ? void 0 : table.foreignKeys.find((fk) => fk.columnNames.indexOf("paciente_id") !== -1);
                if (foreignKey) {
                    yield queryRunner.dropForeignKey("cirugias", foreignKey);
                }
                yield queryRunner.dropColumn("cirugias", "paciente_id");
            }
            // ? se crea la columna estado en la tabla cirugias
            yield queryRunner.addColumn('cirugias', new typeorm_1.TableColumn({
                name: 'estado',
                type: 'tinyint',
                isNullable: true
            }));
            //?  se eliminan campos sobrantes en la tabla archivos
            const nameSavedExist = yield queryRunner.hasColumn("archivos", "fecha");
            if (nameSavedExist) {
                yield queryRunner.dropColumn("archivos", "fecha");
            }
            const nameSavedExist2 = yield queryRunner.hasColumn("archivos", "tipo");
            if (nameSavedExist2) {
                yield queryRunner.dropColumn("archivos", "tipo");
            }
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            // ? se crea la columna paciente_id en la tabla cirugias
            yield queryRunner.addColumn('cirugias', new typeorm_1.TableColumn({
                name: 'paciente_id',
                type: 'int',
                isNullable: true
            }));
            // ? se crea la llave foranea de pacientes a cirugias
            yield queryRunner.createForeignKey("cirugias", new typeorm_1.TableForeignKey({
                columnNames: ["paciente_id"],
                referencedColumnNames: ["id"],
                referencedTableName: "pacientes",
                onDelete: "CASCADE",
            }));
            // ? se elimina la columna estado en la tabla cirugias
            const estadoExist = yield queryRunner.hasColumn("cirugias", "estado");
            if (estadoExist) {
                yield queryRunner.dropColumn("cirugias", "estado");
            }
            // ? se crean las columnas fecha y tipo en la tabla archivos
            yield queryRunner.addColumn('archivos', new typeorm_1.TableColumn({
                name: 'fecha',
                type: 'timestamp',
                isNullable: true
            }));
            yield queryRunner.addColumn('archivos', new typeorm_1.TableColumn({
                name: 'tipo',
                type: 'varchar',
                isNullable: true
            }));
        });
    }
}
exports.AlterTableCirugias1724354772491 = AlterTableCirugias1724354772491;
