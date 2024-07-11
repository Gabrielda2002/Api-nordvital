import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeRadicacion1720623338300 implements MigrationInterface {
    name = 'ChangeRadicacion1720623338300'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`radicacion\` ADD \`Informacion\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`radicacion\` CHANGE \`FechaOrden\` \`FechaOrden\` date NULL`);
        await queryRunner.query(`ALTER TABLE \`radicacion\` CHANGE \`FechaAuditoria\` \`FechaAuditoria\` date NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`radicacion\` CHANGE \`FechaAuditoria\` \`FechaAuditoria\` date NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`radicacion\` CHANGE \`FechaOrden\` \`FechaOrden\` date NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`radicacion\` DROP COLUMN \`Informacion\``);
    }

}
