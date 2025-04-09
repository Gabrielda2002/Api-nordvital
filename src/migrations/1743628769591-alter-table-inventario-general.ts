import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterTableInventarioGeneral1743628769591 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`inventario_general\`
            ADD COLUMN \`nombre\` TEXT NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE inventario_general
            DROP COLUMN nombre
        `);
    }
}