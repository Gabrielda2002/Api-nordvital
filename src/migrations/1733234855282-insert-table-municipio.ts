import { MigrationInterface, QueryRunner } from "typeorm";

export class InsertTableMunicipio1733234855282 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO municipio (NombreMunicipio, Estado, codigo_municipio) VALUES
            ('La Mesa', 1, '25386'),
            ('Ubate', 1, '25843'),
            ('Cajica', 1, '25126'),
            ('La Calera', 1, '25377')
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Revert the insertions
        await queryRunner.query(`
            DELETE FROM municipio 
            WHERE codigo_municipio IN ('25386', '25843', '25126', '25377')
        `);
    }
}