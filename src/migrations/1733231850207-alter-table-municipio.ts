import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterTableMunicipio1733231850207 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add new column codigo_municipio
        await queryRunner.query(
            `ALTER TABLE municipio ADD COLUMN codigo_municipio BIGINT NULL`
        );

        // Drop column NitMunicipio
        await queryRunner.query(
            `ALTER TABLE municipio DROP COLUMN NitMunicipio`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Revert changes: drop codigo_municipio and add back NitMunicipio
        await queryRunner.query(
            `ALTER TABLE municipio DROP COLUMN codigo_municipio`
        );

        await queryRunner.query(
            `ALTER TABLE municipio ADD COLUMN NitMunicipio VARCHAR(20)`
        );
    }
}