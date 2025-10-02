import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatePathColumnsToText1759418737784 implements MigrationInterface {
    name = 'UpdatePathColumnsToText1759418737784'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Modificar columna 'ruta' en tabla 'carpetas' a TEXT
        await queryRunner.query(`
            ALTER TABLE \`carpetas\` 
            MODIFY COLUMN \`ruta\` TEXT NOT NULL
        `);

        // Modificar columna 'ruta' en tabla 'archivos' a TEXT
        await queryRunner.query(`
            ALTER TABLE \`archivos\` 
            MODIFY COLUMN \`ruta\` TEXT NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Revertir columna 'ruta' en tabla 'carpetas' a VARCHAR(255)
        await queryRunner.query(`
            ALTER TABLE \`carpetas\` 
            MODIFY COLUMN \`ruta\` VARCHAR(255) NOT NULL
        `);

        // Revertir columna 'ruta' en tabla 'archivos' a VARCHAR(255)
        await queryRunner.query(`
            ALTER TABLE \`archivos\` 
            MODIFY COLUMN \`ruta\` VARCHAR(255) NOT NULL
        `);
    }
}
