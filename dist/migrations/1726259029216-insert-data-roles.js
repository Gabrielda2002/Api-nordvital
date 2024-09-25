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
exports.InsertDataRoles1726259029216 = void 0;
class InsertDataRoles1726259029216 {
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`
            INSERT INTO \`rol\`(\`TipoRol\`) VALUES 
            ('Radicador'),
            ('Siau'),
            ('Contratacion'),
            ('Medico'),
            ('Jefe'),
            ('Cirugia'),
            ('Paramedico')
        `);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`
            DELETE FROM \`rol\` WHERE \`TipoRol\` IN ('RADICADOR', 'SIAU', 'CONTRATACION', 'MEDICO', 'JEFE', 'CIRUGIA', 'PARAMEDICO');
        `);
        });
    }
}
exports.InsertDataRoles1726259029216 = InsertDataRoles1726259029216;
