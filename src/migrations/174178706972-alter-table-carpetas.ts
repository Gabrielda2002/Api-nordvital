import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterTableCarpetasAddSeccion1741787069720 implements MigrationInterface {
    
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE carpetas ADD COLUMN seccion TEXT DEFAULT 'sgc'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE carpetas DROP COLUMN seccion`);
    }
}