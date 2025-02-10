import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateTableNotasTecnicas1739219858174 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            UPDATE notas_tecnicas
            SET id_tipo_servicio = 1, nombre_contrato = 'PGP'
            WHERE created_at < '2025-02-10'
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Revert changes if necessary
        await queryRunner.query(`
            UPDATE notas_tecnicas
            SET id_tipo_servicio = NULL, nombre_contrato = NULL
            WHERE created_at < '2025-02-10'
        `);
    }
}