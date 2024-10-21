import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterTableUsuarios1729528863832 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            UPDATE usuario
            SET Tipo_rol  = 10
            WHERE Tipo_rol  = 5;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            UPDATE usuario
            SET Tipo_rol  = 5
            WHERE Tipo_rol  = 10;
        `);
    }
}