import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterTableDemandaInducidaAddProfesionalValues1754680812752 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE demanda_inducida 
            MODIFY COLUMN profesional ENUM(
                'Medicina General', 
                'Enfermería', 
                'Nutrición', 
                'Ginecobstetricia', 
                'Psicología'
            ) DEFAULT 'Medicina General'
        `);

        await queryRunner.query(`
            ALTER TABLE programa_meta_historico 
            MODIFY COLUMN profesional ENUM(
                'Medicina General', 
                'Enfermería', 
                'Nutrición', 
                'Ginecobstetricia', 
                'Psicología'
            ) DEFAULT 'Medicina General'
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE demanda_inducida 
            MODIFY COLUMN profesional ENUM(
                'Medicina General', 
                'Enfermería'
            ) DEFAULT 'Medicina General'
        `);
    }
}