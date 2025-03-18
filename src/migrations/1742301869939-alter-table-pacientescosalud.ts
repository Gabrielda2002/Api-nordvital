import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterTablePacientesCosalud1742301869939 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE pacientes_cosalud
            ADD COLUMN Estado VARCHAR(50) NOT NULL DEFAULT 'Activo'
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE pacientes_cosalud
            DROP COLUMN Estado
        `);
    }
}