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
exports.AlterTableRadicacion1727816016045 = void 0;
const typeorm_1 = require("typeorm");
class AlterTableRadicacion1727816016045 {
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.dropColumn("radicacion", "ServicioSolicitado");
            yield queryRunner.dropColumn("radicacion", "DescripcionCup");
            yield queryRunner.dropColumn("radicacion", "NombreSoporte");
            yield queryRunner.dropColumn("radicacion", "TipoSoporte");
            yield queryRunner.dropColumn("radicacion", "ObservacionAuditoria");
            yield queryRunner.dropColumn("radicacion", "Informacion");
            yield queryRunner.dropColumn("radicacion", "contenido");
            //? se busca la llave foranea de pacientes y si se encuentra se elimina
            const unidadFuncionalExist = yield queryRunner.hasColumn("radicacion", "UnidadFuncional");
            if (unidadFuncionalExist) {
                const table = yield queryRunner.getTable("radicacion");
                const foreignKey = table === null || table === void 0 ? void 0 : table.foreignKeys.find((fk) => fk.columnNames.indexOf("UnidadFuncional") !== -1);
                if (foreignKey) {
                    yield queryRunner.dropForeignKey("radicacion", foreignKey);
                }
                yield queryRunner.dropColumn("radicacion", "UnidadFuncional");
            }
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.addColumn("radicacion", new typeorm_1.TableColumn({
                name: "ServicioSolicitado",
                type: "varchar",
                isNullable: true
            }));
            yield queryRunner.addColumn("radicacion", new typeorm_1.TableColumn({
                name: "DescripcionCup",
                type: "varchar",
                isNullable: true
            }));
            yield queryRunner.addColumn("radicacion", new typeorm_1.TableColumn({
                name: "NombreSoporte",
                type: "varchar",
                isNullable: true
            }));
            yield queryRunner.addColumn("radicacion", new typeorm_1.TableColumn({
                name: "TipoSoporte",
                type: "varchar",
                isNullable: true
            }));
            yield queryRunner.addColumn("radicacion", new typeorm_1.TableColumn({
                name: "contenido",
                type: "text",
                isNullable: true
            }));
            yield queryRunner.addColumn("radicacion", new typeorm_1.TableColumn({
                name: "UnidadFuncional",
                type: "varchar",
                isNullable: true
            }));
            yield queryRunner.addColumn("radicacion", new typeorm_1.TableColumn({
                name: "ObservacionAuditoria",
                type: "text",
                isNullable: true
            }));
            yield queryRunner.addColumn("radicacion", new typeorm_1.TableColumn({
                name: "Informacion",
                type: "text",
                isNullable: true
            }));
        });
    }
}
exports.AlterTableRadicacion1727816016045 = AlterTableRadicacion1727816016045;
