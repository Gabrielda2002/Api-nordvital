import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";


export class AlterTableTickets1770658928202 implements MigrationInterface {
    name: 'AlterTableTickets1770658928202';
    public async up(queryRunner: QueryRunner): Promise<void> {
        // ? agregar columna en la tabla tickets tipo de tipo enum con los valores "Solicitud" ,"Incidente"
        await queryRunner.addColumn("tickets", new TableColumn({
            name: "tipo",
            type: "enum",
            enum: ["Solicitud", "Incidente"],
            default: "'Solicitud'",
        }));
    }
    public async down(queryRunner: QueryRunner): Promise<void> {
        // ? eliminar la columna tipo_ticket de la tabla tickets
        await queryRunner.dropColumn("tickets", "tipo");
    }
}