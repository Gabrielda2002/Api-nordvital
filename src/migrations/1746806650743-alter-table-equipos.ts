import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterTableEquiposClaveCandadoType1746806650743 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE equipos 
            MODIFY COLUMN clave_candado VARCHAR(4);
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE equipos 
            MODIFY COLUMN clave_candado INT;
        `);
    }
}