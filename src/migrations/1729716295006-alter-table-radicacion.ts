import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterTableRadicacion1729716295006 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE radicacion
            MODIFY COLUMN JustificacionAuditoria VARCHAR(500);
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE radicacion
            MODIFY COLUMN JustificacionAuditoria VARCHAR(255);
        `);
    }
}