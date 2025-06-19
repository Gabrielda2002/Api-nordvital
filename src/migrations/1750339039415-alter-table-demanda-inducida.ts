import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AlterTableDemandaInducidaAddFechaHoraLlamada1750339039415 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumns("demanda_inducida", [
            new TableColumn({
                name: "fecha_llamada",
                type: "date",
                isNullable: true,
            }),
            new TableColumn({
                name: "hora_llamada",
                type: "time",
                isNullable: true,
            }),
        ]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("demanda_inducida", "hora_llamada");
        await queryRunner.dropColumn("demanda_inducida", "fecha_llamada");
    }
}