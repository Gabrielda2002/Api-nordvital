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
exports.CreateTablesSsc1723755656508 = void 0;
const typeorm_1 = require("typeorm");
class CreateTablesSsc1723755656508 {
    constructor() {
        this.name = 'CreateTablesSsc1723755656508';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            // * Eliminar columna "Municipio" si existe en la tabla "archivo"
            const municipioColumnExists = yield queryRunner.hasColumn("archivo", 'Municipio');
            if (municipioColumnExists) {
                const table = yield queryRunner.getTable("archivo");
                const foreignKey = table === null || table === void 0 ? void 0 : table.foreignKeys.find(fk => fk.columnNames.indexOf("Municipio") !== -1);
                if (foreignKey) {
                    yield queryRunner.dropForeignKey("archivo", foreignKey);
                }
                yield queryRunner.dropColumn("archivo", "Municipio");
            }
            // * Eliminar columna "Carpeta" si existe en la tabla "archivo"
            const carpetaColumnExists = yield queryRunner.hasColumn("archivo", 'Carpeta');
            if (carpetaColumnExists) {
                const table = yield queryRunner.getTable("archivo");
                const foreignKey = table === null || table === void 0 ? void 0 : table.foreignKeys.find(fk => fk.columnNames.indexOf("Carpeta") !== -1);
                if (foreignKey) {
                    yield queryRunner.dropForeignKey("archivo", foreignKey);
                }
                yield queryRunner.dropColumn("archivo", "Carpeta");
            }
            // * eliminar campo municipios de protoformatos
            const columnExists3 = yield queryRunner.hasColumn("protoformatos", "Municipio");
            if (columnExists3) {
                const table = yield queryRunner.getTable("protoformatos");
                const foreignKey = table === null || table === void 0 ? void 0 : table.foreignKeys.find(fk => fk.columnNames.indexOf("Municipio") !== -1);
                if (foreignKey) {
                    yield queryRunner.dropForeignKey("protoformatos", foreignKey);
                }
                yield queryRunner.dropColumn("protoformatos", "Municipio");
            }
            // * eliminar campo carpeta de protoformatos
            // const columnExists4 = await queryRunner.hasColumn("protoformatos", "Carpeta");
            // if (columnExists4) {
            //     const table = await queryRunner.getTable("protoformatos");
            //     const foreignKey = table?.foreignKeys.find(fk => fk.columnNames.indexOf("Carpeta") !== -1);
            //     if (foreignKey) {
            //         await queryRunner.dropForeignKey("protoformatos", foreignKey);
            //     }
            //     await queryRunner.dropColumn("protoformatos", "Carpeta");
            // }
            // * eliminar  tabla "protoformatos" si existe
            const protoformatosTableExists = yield queryRunner.hasTable("protoformatos");
            if (protoformatosTableExists) {
                yield queryRunner.dropTable("protoformatos");
            }
            // * Eliminar tabla "archivo" si existe
            const archivoTableExists = yield queryRunner.hasTable("archivo");
            if (archivoTableExists) {
                yield queryRunner.dropTable("archivo");
            }
            // * Eliminar tabla "carpetas" si existe
            const carpetasTableExists = yield queryRunner.hasTable("carpetas");
            if (carpetasTableExists) {
                yield queryRunner.dropTable("carpetas");
            }
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            // * Revertir los cambios, recreando las tablas eliminadas
            yield queryRunner.createTable(new typeorm_1.Table({
                name: "archivo",
                columns: [
                    {
                        name: "id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment"
                    },
                    {
                        name: "Municipio",
                        type: "varchar"
                    },
                    {
                        name: "Carpeta",
                        type: "varchar"
                    }
                ]
            }), true);
            yield queryRunner.createTable(new typeorm_1.Table({
                name: "carpetas",
                columns: [
                    {
                        name: "id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment"
                    },
                    {
                        name: "Municipio",
                        type: "varchar"
                    }
                ]
            }), true);
            // * Recrear llaves foráneas si es necesario
            yield queryRunner.createForeignKey("archivo", new typeorm_1.TableForeignKey({
                columnNames: ["Municipio"],
                referencedColumnNames: ["id"],
                referencedTableName: "municipios",
                onDelete: "CASCADE"
            }));
            yield queryRunner.createForeignKey("archivo", new typeorm_1.TableForeignKey({
                columnNames: ["Carpeta"],
                referencedColumnNames: ["id"],
                referencedTableName: "carpetas",
                onDelete: "CASCADE"
            }));
        });
    }
}
exports.CreateTablesSsc1723755656508 = CreateTablesSsc1723755656508;
