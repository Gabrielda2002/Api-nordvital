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
exports.AlterTableCarpetas1725651867417 = void 0;
const typeorm_1 = require("typeorm");
class AlterTableCarpetas1725651867417 {
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            // Agregar la columna id_municipio a la tabla carpetas
            yield queryRunner.addColumn("carpetas", new typeorm_1.TableColumn({
                name: "id_municipio",
                type: "int",
                isNullable: true,
            }));
            ;
            // Crear la clave foránea para la relación con la tabla municipios
            yield queryRunner.createForeignKey("carpetas", new typeorm_1.TableForeignKey({
                columnNames: ["id_municipio"],
                referencedTableName: "municipio",
                referencedColumnNames: ["IdMunicipio"],
                onDelete: "CASCADE",
            }));
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            // Eliminar la clave foránea
            const municipioExist = yield queryRunner.hasColumn("carpetas", "id_municipio");
            if (municipioExist) {
                const table = yield queryRunner.getTable("carpetas");
                const foreignKey = table === null || table === void 0 ? void 0 : table.foreignKeys.find((fk) => fk.columnNames.indexOf("id_municipio") !== -1);
                if (foreignKey) {
                    yield queryRunner.dropForeignKey("carpetas", foreignKey);
                }
                yield queryRunner.dropColumn("carpetas", "id_municipio");
            }
        });
    }
}
exports.AlterTableCarpetas1725651867417 = AlterTableCarpetas1725651867417;
