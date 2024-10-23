import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterTablePacientes1729701085603 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE pacientes
            MODIFY COLUMN telefonoFijo VARCHAR(10);
        `);

        await queryRunner.query(`
            ALTER TABLE pacientes
            MODIFY COLUMN NumeroCelular VARCHAR(11);
        `);

        await queryRunner.query(`
            ALTER TABLE pacientes
            ADD COLUMN numeroCelular2 VARCHAR(10) NULL;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE pacientes
            ALTER COLUMN TelefonoFijo VARCHAR(255);
        `);
        await queryRunner.query(`
            ALTER TABLE pacientes
            ALTER COLUMN NumeroCelular VARCHAR(255);
        `);

        await queryRunner.query(`
            ALTER TABLE pacientes
            DROP COLUMN numeroCelular2;
        `);
    }
}