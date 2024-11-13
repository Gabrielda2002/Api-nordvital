import { MigrationInterface, QueryRunner, TableForeignKey, TableColumn } from "typeorm";

export class AlterTableSeguimientoDispositivosRed1731515304103 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createForeignKey(
            "seguimiento_dispositivos_red",
            new TableForeignKey({
                columnNames: ["dispositivo_id"],
                referencedColumnNames: ["id"],
                referencedTableName: "dispositivos_red",
                onDelete: "CASCADE",
            })
        );

        await queryRunner.addColumns("dispositivos_red", [
            new TableColumn({
                name: "created_at",
                type: "timestamp",
                default: "CURRENT_TIMESTAMP",
            }),
            new TableColumn({
                name: "fecha_actualizacion",
                type: "timestamp",
                default: "CURRENT_TIMESTAMP",
                onUpdate: "CURRENT_TIMESTAMP",
            }),
        ]);

        await queryRunner.addColumns("equipos", [
            new TableColumn({
                name: "fecha_creacion",
                type: "timestamp",
                default: "CURRENT_TIMESTAMP",
            }),
            new TableColumn({
                name: "fecha_actualizacion",
                type: "timestamp",
                default: "CURRENT_TIMESTAMP",
                onUpdate: "CURRENT_TIMESTAMP",
            }),
        ]);

        await queryRunner.addColumn("seguimiento_dispositivos_red", new TableColumn({
            name: "fecha_evento",
            type: "date",
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey("seguimiento_dispositivos_red", "FK_dispositivo_red_id");

        await queryRunner.dropColumn("dispositivos_red", "created_at");
        await queryRunner.dropColumn("dispositivos_red", "updated_at");

        await queryRunner.dropColumn("equipos", "created_at");
        await queryRunner.dropColumn("equipos", "updated_at");

        await queryRunner.dropColumn("seguimiento_dispositivos_red", "fecha_evento");
    }
}