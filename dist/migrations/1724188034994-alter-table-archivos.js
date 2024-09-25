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
exports.alterTableArchivos1724188034994 = void 0;
const typeorm_1 = require("typeorm");
const saltRounds = 10;
class alterTableArchivos1724188034994 {
    constructor() {
        this.name = 'alterTableArchivos1724188034994';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.addColumn('archivos', new typeorm_1.TableColumn({
                name: 'name_saved',
                type: 'varchar',
                isNullable: true
            }));
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.dropColumn('archivos', 'name_saved');
        });
    }
}
exports.alterTableArchivos1724188034994 = alterTableArchivos1724188034994;
