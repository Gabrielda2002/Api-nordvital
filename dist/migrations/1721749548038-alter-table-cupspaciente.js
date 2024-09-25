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
exports.AlterTableCupspaciente1721749548038 = void 0;
class AlterTableCupspaciente1721749548038 {
    constructor() {
        this.name = "AlterTableCupspaciente1721749548038";
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE \`cupspaciente\` CHANGE COLUMN \`EstadoCupsRadicacion\` \`Estado\` VARCHAR(255) NOT NULL`);
            yield queryRunner.query(`INSERT INTO \`autorizacion\` (\`OpcionAutorizacion\`) VALUES ('EN TRAMITE')`);
            yield queryRunner.query(`INSERT INTO \`autorizacion\` (\`OpcionAutorizacion\`) VALUES ('YA AUTORIZADO')`);
            // Eliminar registros con valores inesperados en la columna Estado
            yield queryRunner.query(`
                    DELETE FROM \`cupspaciente\`
                    WHERE \`Estado\` NOT IN ('AUTORIZADO', 'REDIRECCIONADO', 'NO AUTORIZADO', 'YA AUDITADO', 'OTRO', 'PENDIENTE', 'EN TRAMITE', 'YA AUTORIZADO')
                `);
            yield queryRunner.query(`
            UPDATE \`cupspaciente\`
            SET \`Estado\` = CASE
                WHEN \`Estado\` IS null OR \`Estado\` = ' ' THEN 6   
                WHEN \`Estado\` = 'AUTORIZADO' THEN 1
                WHEN \`Estado\` = 'REDIRECCIONADO' THEN 2
                WHEN \`Estado\` = 'NO AUTORIZADO' THEN 3
                WHEN \`Estado\` = 'YA AUDITADO' THEN 4
                WHEN \`Estado\` = 'OTRO' THEN 5
                WHEN \`Estado\` = 'PENDIENTE' THEN 6
                WHEN \`Estado\` = 'EN TRAMITE' THEN 7
                WHEN \`Estado\` = 'YA AUTORIZADO' THEN 8
            END
        `);
            yield queryRunner.query(`ALTER TABLE \`cupspaciente\` MODIFY COLUMN \`Estado\` INT NOT NULL`);
            yield queryRunner.query(`ALTER TABLE \`cupspaciente\` ADD CONSTRAINT \`FK_autorizacion\`
                                FOREIGN KEY (\`Estado\`) REFERENCES \`autorizacion\`(\`IdAutorizacion\`)`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE \`cupspaciente\` DROP CONSTRAINT \`FK_autorizacion\``);
            yield queryRunner.query(`ALTER TABLE \`cupspaciente\` CHANGE COLUMN \`Estado\` \`EstadoCupsRadicacion\` VARCHAR(255) NOT NULL`);
            yield queryRunner.query(`
            UPDATE \`cupspaciente\`
            SET \`Estado\` = CASE
                WHEN \`Estado\` = 1 THEN 'AUTORIZADO'
                WHEN \`Estado\` = 2 THEN 'REDIRECCIONADO'
                WHEN \`Estado\` = 3 THEN 'NO AUTORIZADO'
                WHEN \`Estado\` = 4 THEN 'YA AUDITADO'
                WHEN \`Estado\` = 5 THEN 'OTRO'
                WHEN \`Estado\` = 6 THEN 'PENDIENTE'
                WHEN \`Estado\` = 7 THEN 'EN TRAMITE'
                WHEN \`Estado\` = 8 THEN 'YA AUTORIZADO'
            END
        `);
            yield queryRunner.query(`ALTER TABLE \`cupspaciente\` MODIFY COLUMN \`Estado\` VARCHAR(255) NOT NULL`);
            yield queryRunner.query(`ALTER TABLE \`cupspaciente\` CHANGE COLUMN \`Estado\` \`EstadoCupsRadicacion\` VARCHAR(255) NOT NULL`);
        });
    }
}
exports.AlterTableCupspaciente1721749548038 = AlterTableCupspaciente1721749548038;
