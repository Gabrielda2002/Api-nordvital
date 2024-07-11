import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeRadicacion1720623107529 implements MigrationInterface {
    name = 'ChangeRadicacion1720623107529'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`radicacion\` CHANGE \`FechaOrden\` \`FechaOrden\` date NULL`);
        await queryRunner.query(`ALTER TABLE \`radicacion\` CHANGE \`FechaAuditoria\` \`FechaAuditoria\` date NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`radicacion\` CHANGE \`FechaAuditoria\` \`FechaAuditoria\` date NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`radicacion\` CHANGE \`FechaOrden\` \`FechaOrden\` date NULL DEFAULT 'NULL'`);
    }

}
