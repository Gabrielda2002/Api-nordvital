import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterTableSeguimientoAuxiliar1722289200118 implements MigrationInterface {
    name = 'AlterTableSeguimientoAuxiliar1722289200118'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("seguimientoauxiliar", "FechaSeguimiento");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "seguimientoauxiliar" ADD "FechaSeguimiento" datetime NOT NULL`);
    }

}
