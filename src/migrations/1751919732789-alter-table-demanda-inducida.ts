import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AlterTableDemandaInducida1751919732789 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Asegura que los campos permitan null
        await queryRunner.changeColumn(
            "demanda_inducida",
            "relacion_usuario_id",
            new TableColumn({
                name: "relacion_usuario_id",
                type: "int",
                isNullable: true,
            })
        );

        await queryRunner.changeColumn(
            "demanda_inducida",
            "area_eps_id",
            new TableColumn({
                name: "area_eps_id",
                type: "int",
                isNullable: true,
            })
        );
        await queryRunner.changeColumn(
            "demanda_inducida",
            "resumen_seguimiento_actividad_id",
            new TableColumn({
                name: "resumen_seguimiento_actividad_id",
                type: "int",
                isNullable: true,
            })
        );
        await queryRunner.changeColumn(
            "demanda_inducida",
            "persona_recibe",
            new TableColumn({
                name: "persona_recibe",
                type: "varchar",
                length: "60",
                isNullable: true,
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Revertir a NOT NULL si era el estado anterior
        await queryRunner.changeColumn(
            "demanda_inducida",
            "relacion_usuario_id",
            new TableColumn({
                name: "relacion_usuario_id",
                type: "int",
                isNullable: false,
            })
        );

        await queryRunner.changeColumn(
            "demanda_inducida",
            "area_eps_id",
            new TableColumn({
                name: "area_eps_id",
                type: "int",
                isNullable: false,
            })
        );

        await queryRunner.changeColumn(
            "demanda_inducida",
            "resumen_seguimiento_actividad_id",
            new TableColumn({
                name: "resumen_seguimiento_actividad_id",
                type: "int",
                isNullable: false,
            })
        );

        await queryRunner.changeColumn(
            "demanda_inducida",
            "persona_recibe",
            new TableColumn({
                name: "persona_recibe",
                type: "varchar",
                length: "60",
                isNullable: false,
            })
        );

    }
}