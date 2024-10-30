import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterTableCirugias1730316412770 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE cirugias DROP COLUMN fecha_ordenamiento`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE cirugias ADD COLUMN fecha_ordenamiento DATE`);
    }
}