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
exports.AlterTableRadicacion1722007000819 = void 0;
const typeorm_1 = require("typeorm");
const columns = [
    "TipoDocumento",
    "Identificacion",
    "NombreCompleto",
    "NumeroCel",
    "TelFijo",
    "Email",
    "Direccion",
    "Convenio",
    "IpsPrimaria",
];
// Nombres reales de las claves foráneas en la base de datos
class AlterTableRadicacion1722007000819 {
    constructor() {
        this.name = "AlterTableRadicacion1722007000819";
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            // Obtener la tabla 'radicacion'
            const columnExists = yield queryRunner.hasColumn("radicacion", "TipoDocumento");
            if (columnExists) {
                // * Verificar si la llave foránea existe en la tabla "soportes"
                const table = yield queryRunner.getTable("radicacion");
                const foreignKey = table === null || table === void 0 ? void 0 : table.foreignKeys.find(fk => fk.columnNames.indexOf("TipoDocumento") !== -1);
                if (foreignKey) {
                    // * Si la llave foránea existe, eliminarla
                    yield queryRunner.dropForeignKey("radicacion", foreignKey);
                }
                // * Si la columna existe, eliminarla
                yield queryRunner.dropColumn("radicacion", "TipoDocumento");
            }
            // * Eliminar las columnas y las llaves foránea convenio"
            const columnConvenioExists = yield queryRunner.hasColumn("radicacion", "Convenio");
            if (columnConvenioExists) {
                // * Verificar si la llave foránea existe en la tabla "soportes"
                const table = yield queryRunner.getTable("radicacion");
                const foreignKey = table === null || table === void 0 ? void 0 : table.foreignKeys.find(fk => fk.columnNames.indexOf("Convenio") !== -1);
                if (foreignKey) {
                    // * Si la llave foránea existe, eliminarla
                    yield queryRunner.dropForeignKey("radicacion", foreignKey);
                }
                // * Si la columna existe, eliminarla
                yield queryRunner.dropColumn("radicacion", "Convenio");
            }
            // * Eliminar las columnas y las llaves foránea IpsPrimaria"
            const columnIpsPrimariaExists = yield queryRunner.hasColumn("radicacion", "IpsPrimaria");
            if (columnIpsPrimariaExists) {
                // * Verificar si la llave foránea existe en la tabla "soportes"
                const table = yield queryRunner.getTable("radicacion");
                const foreignKey = table === null || table === void 0 ? void 0 : table.foreignKeys.find(fk => fk.columnNames.indexOf("IpsPrimaria") !== -1);
                if (foreignKey) {
                    // * Si la llave foránea existe, eliminarla
                    yield queryRunner.dropForeignKey("radicacion", foreignKey);
                }
                // * Si la columna existe, eliminarla
                yield queryRunner.dropColumn("radicacion", "IpsPrimaria");
            }
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            // Restaurar las columnas
            yield queryRunner.addColumn("radicacion", new typeorm_1.TableColumn({
                name: "TipoDocumento",
                type: "int",
            }));
            yield queryRunner.addColumn("radicacion", new typeorm_1.TableColumn({
                name: "Identificacion",
                type: "varchar",
            }));
            yield queryRunner.addColumn("radicacion", new typeorm_1.TableColumn({
                name: "NombreCompleto",
                type: "varchar",
            }));
            yield queryRunner.addColumn("radicacion", new typeorm_1.TableColumn({
                name: "NumeroCel",
                type: "varchar",
            }));
            yield queryRunner.addColumn("radicacion", new typeorm_1.TableColumn({
                name: "TelFijo",
                type: "varchar",
            }));
            yield queryRunner.addColumn("radicacion", new typeorm_1.TableColumn({
                name: "Email",
                type: "varchar",
            }));
            yield queryRunner.addColumn("radicacion", new typeorm_1.TableColumn({
                name: "Direccion",
                type: "varchar",
            }));
            yield queryRunner.addColumn("radicacion", new typeorm_1.TableColumn({
                name: "Convenio",
                type: "int",
            }));
            yield queryRunner.addColumn("radicacion", new typeorm_1.TableColumn({
                name: "IpsPrimaria",
                type: "int", // Reemplazar con el tipo de dato correcto
            }));
            // Restaurar claves foráneas
            yield queryRunner.createForeignKey("radicacion", new typeorm_1.TableForeignKey({
                columnNames: ["TipoDocumento"],
                referencedColumnNames: ["IdDocumento"], // Reemplazar con el nombre correcto de la columna referenciada
                referencedTableName: "documento", // Reemplazar con el nombre correcto de la tabla referenciada
                onDelete: "SET NULL", // Ajustar según sea necesario
            }));
            yield queryRunner.createForeignKey("radicacion", new typeorm_1.TableForeignKey({
                columnNames: ["Convenio"],
                referencedColumnNames: ["IdConvenio"], // Reemplazar con el nombre correcto de la columna referenciada
                referencedTableName: "convenio", // Reemplazar con el nombre correcto de la tabla referenciada
                onDelete: "SET NULL", // Ajustar según sea necesario
            }));
            yield queryRunner.createForeignKey("radicacion", new typeorm_1.TableForeignKey({
                columnNames: ["IpsPrimaria"],
                referencedColumnNames: ["IdIpsPrimaria"], // Reemplazar con el nombre correcto de la columna referenciada
                referencedTableName: "ipsprimaria", // Reemplazar con el nombre correcto de la tabla referenciada
                onDelete: "SET NULL", // Ajustar según sea necesario
            }));
        });
    }
}
exports.AlterTableRadicacion1722007000819 = AlterTableRadicacion1722007000819;
