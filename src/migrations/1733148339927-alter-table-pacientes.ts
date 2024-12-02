import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterTablePacientes1733148339927 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE pacientes
            MODIFY COLUMN Identificacion BIGINT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE pacientes ALTER COLUMN Identificacion TYPE INTEGER`);
    }
}