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
exports.AgregarCamposCreateUpdate1721656495538 = void 0;
class AgregarCamposCreateUpdate1721656495538 {
    constructor() {
        this.name = 'AgregarCamposCreateUpdate1721656495538';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE \`autorizacion\` ADD \`fecha-creacion\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP`);
            yield queryRunner.query(`ALTER TABLE \`autorizacion\` ADD \`fecha-actualizacion\` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE \`autorizacion\` DROP COLUMN \`fecha-actualizacion\``);
            yield queryRunner.query(`ALTER TABLE \`autorizacion\` DROP COLUMN \`fecha-creacion\``);
        });
    }
}
exports.AgregarCamposCreateUpdate1721656495538 = AgregarCamposCreateUpdate1721656495538;
