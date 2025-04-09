import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateTableSeguimientoInventarioGeneral1744033189104 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "seguimiento_inventario_general",
            columns: [
                {
                    name: "id",
                    type: "int",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment"
                },
                {
                    name: "item_id",
                    type: "int",
                },
                {
                    name: "fecha_evento",
                    type: "date",
                    isNullable: false
                },
                {
                    name: "tipo_evento",
                    type: "varchar",
                    length: "200"
                },
                {
                    name: "descripcion",
                    type: "text",
                    isNullable: false
                },
                {
                    name: "responsable",
                    type: "int"
                },
                {
                    name: "created_at",
                    type: "timestamp",
                    default: "CURRENT_TIMESTAMP",
                },
                {
                    name: "updated_at",
                    type: "timestamp",
                    default: "CURRENT_TIMESTAMP",
                    onUpdate: "CURRENT_TIMESTAMP",
                }
            ]
        }), true);

        // Foreign key to inventario_general
        await queryRunner.createForeignKey("seguimiento_inventario_general", new TableForeignKey({
            columnNames: ["item_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "inventario_general",
            onDelete: "CASCADE"
        }));

        // Foreign key to usuario
        await queryRunner.createForeignKey("seguimiento_inventario_general", new TableForeignKey({
            columnNames: ["responsable"],
            referencedColumnNames: ["IdUsuario"],
            referencedTableName: "usuario",
            onDelete: "CASCADE"
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable("seguimiento_inventario_general");
        
        // Drop foreign keys first
        const foreignKeyItem = table?.foreignKeys.find(fk => fk.columnNames.indexOf("item_id") !== -1);
        if (foreignKeyItem) {
            await queryRunner.dropForeignKey("seguimiento_inventario_general", foreignKeyItem);
        }
        
        const foreignKeyResponsable = table?.foreignKeys.find(fk => fk.columnNames.indexOf("responsable") !== -1);
        if (foreignKeyResponsable) {
            await queryRunner.dropForeignKey("seguimiento_inventario_general", foreignKeyResponsable);
        }
        
        // Then drop the table
        await queryRunner.dropTable("seguimiento_inventario_general");
    }
}