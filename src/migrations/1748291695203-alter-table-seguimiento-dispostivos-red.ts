import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterTableSeguimientoDispositivosRed1748291695203 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE seguimiento_dispositivos_red MODIFY COLUMN descripcion TEXT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE seguimiento_dispositivos_red MODIFY COLUMN descripcion VARCHAR(255)`);
    }

}