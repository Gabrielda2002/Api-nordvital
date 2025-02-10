import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from "typeorm";

export class AlterTableNotaTecnica1739214554465 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn("notas_tecnicas", new TableColumn({
            name: "id_tipo_servicio",
            type: "int",
            isNullable: true
        }));

        await queryRunner.addColumn("notas_tecnicas", new TableColumn({
            name: "nombre_contrato",
            type: "varchar",
            length: '150', 
            isNullable: true
        }));

        await queryRunner.createForeignKey("notas_tecnicas", new TableForeignKey({
            columnNames: ["id_tipo_servicio"],
            referencedColumnNames: ["IdServicio"],
            referencedTableName: "servicio",
            onDelete: "SET NULL"
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable("notas_tecnicas");
        const foreignKey = table?.foreignKeys.find(fk => fk.columnNames.indexOf("id_servicio") !== -1);
        if(foreignKey){
            await queryRunner.dropForeignKey("notas_tecnicas", foreignKey);
        }
        await queryRunner.dropColumn("notas_tecnicas", "id_servicio");
        await queryRunner.dropColumn("notas_tecnicas", "nombre_contrato");
    }
}