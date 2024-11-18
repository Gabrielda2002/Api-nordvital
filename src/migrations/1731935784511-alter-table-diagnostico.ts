import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterTableDiagnostico1731935784511 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE diagnostico
            MODIFY COLUMN id INT AUTO_INCREMENT
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE diagnostico
            MODIFY COLUMN id INT NOT NULL
        `);
    }
}