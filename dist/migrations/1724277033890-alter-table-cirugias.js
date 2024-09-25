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
exports.AlterTableCirugias1724277033890 = void 0;
const typeorm_1 = require("typeorm");
class AlterTableCirugias1724277033890 {
    constructor() {
        this.name = "AlterTableCirugias1724277033890";
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            // * se crea la relacion cirugias a ips_remite
            yield queryRunner.createForeignKey("cirugias", new typeorm_1.TableForeignKey({
                columnNames: ["ips_remitente"],
                referencedColumnNames: ["IdIpsRemite"],
                referencedTableName: "ipsremite",
                onDelete: "CASCADE",
            }));
            yield queryRunner.createForeignKey("gestion_auxiliar_cirugias", new typeorm_1.TableForeignKey({
                columnNames: ["cup_id"],
                referencedColumnNames: ["IdServicioSolicitado"],
                referencedTableName: "serviciosolicitado",
                onDelete: "CASCADE",
            }));
            yield queryRunner.createForeignKey('gestion_auxiliar_cirugias', new typeorm_1.TableForeignKey({
                columnNames: ['estado'],
                referencedColumnNames: ['id'],
                referencedTableName: 'estadoseguimiento',
                onDelete: 'CASCADE'
            }));
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            const ipsRemitenteExist = yield queryRunner.hasColumn("cirugias", "ips_remitente");
            if (ipsRemitenteExist) {
                const table = yield queryRunner.getTable("cirugias");
                const foreignKey = table === null || table === void 0 ? void 0 : table.foreignKeys.find((fk) => fk.columnNames.indexOf("ips_remitente") !== -1);
                if (foreignKey) {
                    yield queryRunner.dropForeignKey("cirugias", foreignKey);
                }
                yield queryRunner.dropColumn("cirugias", "ips_remitente");
            }
            const cupIdExist = yield queryRunner.hasColumn("gestion_auxiliar_cirugias", "cup_id");
            if (cupIdExist) {
                const table = yield queryRunner.getTable("gestion_auxiliar_cirugias");
                const foreignKey = table === null || table === void 0 ? void 0 : table.foreignKeys.find((fk) => fk.columnNames.indexOf("cup_id") !== -1);
                if (foreignKey) {
                    yield queryRunner.dropForeignKey("gestion_auxiliar_cirugias", foreignKey);
                }
                yield queryRunner.dropColumn("gestion_auxiliar_cirugias", "cup_id");
            }
            const estadoExist = yield queryRunner.hasColumn("gestion_auxiliar_cirugias", "estado");
            if (estadoExist) {
                const table = yield queryRunner.getTable("gestion_auxiliar_cirugias");
                const foreignKey = table === null || table === void 0 ? void 0 : table.foreignKeys.find((fk) => fk.columnNames.indexOf("estado") !== -1);
                if (foreignKey) {
                    yield queryRunner.dropForeignKey("gestion_auxiliar_cirugias", foreignKey);
                }
                yield queryRunner.dropColumn("gestion_auxiliar_cirugias", "estado");
            }
        });
    }
}
exports.AlterTableCirugias1724277033890 = AlterTableCirugias1724277033890;
