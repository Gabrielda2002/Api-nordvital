import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterTableEventos1733842017370 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE eventos 
            MODIFY COLUMN fecha_inicio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            MODIFY COLUMN fecha_fin TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE eventos 
            MODIFY COLUMN fecha_inicio DATE DEFAULT CURRENT_DATE,
            MODIFY COLUMN fecha_fin DATE DEFAULT CURRENT_DATE
        `);
    }
}
