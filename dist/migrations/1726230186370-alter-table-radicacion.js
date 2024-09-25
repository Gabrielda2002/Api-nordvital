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
exports.AlterTableRadicacion1726230186370 = void 0;
const typeorm_1 = require("typeorm");
class AlterTableRadicacion1726230186370 {
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.dropColumn('radicacion', 'CodDiagnostico');
            yield queryRunner.dropColumn('radicacion', 'DescripcionDiagnostico');
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.addColumn('radicacion', new typeorm_1.TableColumn({
                name: 'CodDiagnostico',
                type: 'varchar',
                isNullable: true
            }));
            yield queryRunner.addColumn('radicacion', new typeorm_1.TableColumn({
                name: 'DescripcionDiagnostico',
                type: 'varchar',
                isNullable: true
            }));
        });
    }
}
exports.AlterTableRadicacion1726230186370 = AlterTableRadicacion1726230186370;
