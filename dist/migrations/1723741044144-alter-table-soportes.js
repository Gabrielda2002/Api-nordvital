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
exports.AlterTableSoportes1723741044144 = void 0;
class AlterTableSoportes1723741044144 {
    constructor() {
        this.name = 'AlterTableSoportes1723741044144';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            // * Verificar si la columna "id_radicacion" existe en la tabla "soportes"
            const columnExists = yield queryRunner.hasColumn("soportes", "id_radicacion");
            if (columnExists) {
                // * Verificar si la llave foránea existe en la tabla "soportes"
                const table = yield queryRunner.getTable("soportes");
                const foreignKey = table === null || table === void 0 ? void 0 : table.foreignKeys.find(fk => fk.columnNames.indexOf("id_radicacion") !== -1);
                if (foreignKey) {
                    // * Si la llave foránea existe, eliminarla
                    yield queryRunner.dropForeignKey("soportes", foreignKey);
                }
                // * Si la columna existe, eliminarla
                yield queryRunner.dropColumn("soportes", "id_radicacion");
            }
            // * Crear la columna y la llave foránea en la tabla "radicacion"
            const soporteColumnExists = yield queryRunner.hasColumn("radicacion", "id_soportes");
            if (!soporteColumnExists) {
                yield queryRunner.query('ALTER TABLE `radicacion` ADD `id_soportes` int');
            }
            const soporteForeignKey = yield queryRunner.getTable("radicacion").then(table => table === null || table === void 0 ? void 0 : table.foreignKeys.find(fk => fk.columnNames.indexOf("id_soportes") !== -1));
            if (!soporteForeignKey) {
                yield queryRunner.query(`
                ALTER TABLE \`radicacion\` 
                ADD CONSTRAINT \`FK_562879cc83c074dc6dd614844b1\` 
                FOREIGN KEY (\`id_soportes\`) 
                REFERENCES \`soportes\`(\`id\`) 
                ON DELETE CASCADE
            `);
            }
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            // * Revertir los cambios en la tabla radicacion
            const soporteForeignKey = yield queryRunner.getTable("radicacion").then(table => table === null || table === void 0 ? void 0 : table.foreignKeys.find(fk => fk.columnNames.indexOf("id_soportes") !== -1));
            if (soporteForeignKey) {
                yield queryRunner.query('ALTER TABLE `radicacion` DROP CONSTRAINT `FK_562879cc83c074dc6dd614844b1`');
            }
            const soporteColumnExists = yield queryRunner.hasColumn("radicacion", "id_soportes");
            if (soporteColumnExists) {
                yield queryRunner.query('ALTER TABLE `radicacion` DROP COLUMN `id_soportes`');
            }
            // * Revertir la eliminación de la columna y la llave foránea en la tabla "soportes"
            const columnExists = yield queryRunner.hasColumn("soportes", "id_radicacion");
            if (!columnExists) {
                yield queryRunner.query('ALTER TABLE `soportes` ADD `id_radicacion` int');
            }
            const table = yield queryRunner.getTable("soportes");
            const foreignKey = table === null || table === void 0 ? void 0 : table.foreignKeys.find(fk => fk.columnNames.indexOf("id_radicacion") !== -1);
            if (!foreignKey) {
                yield queryRunner.query(`
                ALTER TABLE \`soportes\` 
                ADD CONSTRAINT \`FK_562879cc83c074dc6dd614844b1\` 
                FOREIGN KEY (\`id_radicacion\`) 
                REFERENCES \`radicacion\`(\`id\`) 
                ON DELETE CASCADE
            `);
            }
        });
    }
}
exports.AlterTableSoportes1723741044144 = AlterTableSoportes1723741044144;
