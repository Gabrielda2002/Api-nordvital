import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AlterTableDepartamentos1733230743379 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add new columns to departamentos table
        await queryRunner.addColumn("departamentos", new TableColumn({
            name: "codigo_departamento",
            type: "bigint",
            isNullable: true
        }));

        // eliminar campo codigoCups
        await queryRunner.dropColumn("seguimientoauxiliar", "CodigoCups");

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("departamentos", "codigo_departamento");

        // Add new columns to seguimientoauxiliar table
        await queryRunner.addColumn("seguimientoauxiliar", new TableColumn({
            name: "CodigoCups",
            type: "varchar",
            length: "100",
            isNullable: true
        }));

    }

}