import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AlterTableComponentes1771002859287 implements MigrationInterface {
    name?: "AlterTableComponentes1771002859287";
    public async up(queryRunner: QueryRunner): Promise<void> {
        // agregar la columna "Estado" a la tabla "componentes" tipo varchar(200) puede ser nulo agregarla antes de la columna created_at
        await queryRunner.addColumn("componentes", new TableColumn({
            name: "estado",
            type: "varchar",
            length: "200",
            isNullable: true,
            default: "'Activo'",
        })) 
    }
    public async down(queryRunner: QueryRunner): Promise<void> {
        // eliminar la columna "Estado" de la tabla "componentes"
        await queryRunner.dropColumn("componentes", "estado");
    }
}