import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AlterTableSoportesCupspacientes1726588929303 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.addColumn("soportes", new TableColumn({
            name: "name_saved",
            type: "varchar",
            isNullable: true
        }));

        // Eliminar las columnas FechaRegistro y UltimaModificacion de la tabla cupspaciente
        await queryRunner.dropColumn("cupspaciente", "FechaRegistro");
        await queryRunner.dropColumn("cupspaciente", "UltimaModificacion");

        // Crear las columnas FechaRegistro y UltimaModificacion en la tabla cupspaciente
        await queryRunner.addColumn("cupspaciente", new TableColumn({
            name: "FechaRegistro",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
            isNullable: false
        }));
        await queryRunner.addColumn("cupspaciente", new TableColumn({
            name: "UltimaModificacion",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
            isNullable: false
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Eliminar las columnas FechaRegistro y UltimaModificacion de la tabla cupspaciente
        await queryRunner.dropColumn("cupspaciente", "FechaRegistro");
        await queryRunner.dropColumn("cupspaciente", "UltimaModificacion");
    }
}