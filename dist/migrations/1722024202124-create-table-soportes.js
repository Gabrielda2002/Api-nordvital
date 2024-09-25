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
exports.CreateTableSoportes1722024202124 = void 0;
const typeorm_1 = require("typeorm");
class CreateTableSoportes1722024202124 {
    constructor() {
        this.name = 'CreateTableSoportes1722024202124';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            queryRunner.createTable(new typeorm_1.Table({
                name: "soportes",
                columns: [
                    {
                        name: "id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment"
                    },
                    {
                        name: "nombre",
                        type: "varchar",
                        length: "150",
                        isNullable: false
                    },
                    {
                        name: "url",
                        type: "text",
                        length: "200",
                        isNullable: false
                    },
                    {
                        name: "id_radicacion",
                        type: "int",
                        isNullable: false
                    }
                ]
            }));
            yield queryRunner.createForeignKey('soportes', new typeorm_1.TableForeignKey({
                columnNames: ['id_radicacion'],
                referencedColumnNames: ['IdRadicacion'],
                referencedTableName: 'radicacion',
                onDelete: 'CASCADE'
            }));
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            const table = yield queryRunner.getTable("soportes");
            const foreignKey = table === null || table === void 0 ? void 0 : table.foreignKeys.find(fk => fk.columnNames.indexOf("id_radicacion") !== -1);
            if (foreignKey) {
                yield queryRunner.dropForeignKey("soportes", foreignKey);
            }
            yield queryRunner.dropTable("soportes");
        });
    }
}
exports.CreateTableSoportes1722024202124 = CreateTableSoportes1722024202124;
