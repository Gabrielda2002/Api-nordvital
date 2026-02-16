import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from "typeorm";

export class CreateMaintenanceChecklistTables1771264798053 implements MigrationInterface {
    name?: "CreateMaintenanceChecklistTables1771264798053";

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Crear tabla maintenance_checklist_items
        await queryRunner.createTable(
            new Table({
                name: "maintenance_checklist_items",
                columns: [
                    {
                        name: "id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment",
                    },
                    {
                        name: "item_key",
                        type: "varchar",
                        length: "100",
                        isUnique: true,
                        isNullable: false,
                    },
                    {
                        name: "label",
                        type: "varchar",
                        length: "255",
                        isNullable: false,
                    },
                    {
                        name: "display_order",
                        type: "int",
                        isNullable: false,
                    },
                    {
                        name: "is_active",
                        type: "boolean",
                        default: true,
                        isNullable: false,
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                        isNullable: false,
                    },
                    {
                        name: "updated_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                        onUpdate: "CURRENT_TIMESTAMP",
                        isNullable: false,
                    },
                ],
            }),
            true
        );

        // Crear tabla maintenance_checklist_results
        await queryRunner.createTable(
            new Table({
                name: "maintenance_checklist_results",
                columns: [
                    {
                        name: "id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment",
                    },
                    {
                        name: "seguimiento_equipo_id",
                        type: "int",
                        isNullable: false,
                    },
                    {
                        name: "checklist_item_id",
                        type: "int",
                        isNullable: false,
                    },
                    {
                        name: "is_checked",
                        type: "boolean",
                        default: false,
                        isNullable: false,
                    },
                    {
                        name: "checked_at",
                        type: "datetime",
                        isNullable: true,
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                        isNullable: false,
                    },
                    {
                        name: "updated_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                        onUpdate: "CURRENT_TIMESTAMP",
                        isNullable: false,
                    },
                ],
            }),
            true
        );

        // Crear índice único compuesto
        await queryRunner.createIndex(
            "maintenance_checklist_results",
            new TableIndex({
                name: "UQ_seguimiento_checklist_item",
                columnNames: ["seguimiento_equipo_id", "checklist_item_id"],
                isUnique: true,
            })
        );

        // Crear foreign key hacia seguimiento_equipos
        await queryRunner.createForeignKey(
            "maintenance_checklist_results",
            new TableForeignKey({
                name: "FK_checklist_result_seguimiento",
                columnNames: ["seguimiento_equipo_id"],
                referencedTableName: "seguimiento_equipos",
                referencedColumnNames: ["id"],
                onDelete: "CASCADE",
            })
        );

        // Crear foreign key hacia maintenance_checklist_items
        await queryRunner.createForeignKey(
            "maintenance_checklist_results",
            new TableForeignKey({
                name: "FK_checklist_result_item",
                columnNames: ["checklist_item_id"],
                referencedTableName: "maintenance_checklist_items",
                referencedColumnNames: ["id"],
                onDelete: "RESTRICT",
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Eliminar columnas de seguimiento_equipos
        await queryRunner.query(`
            ALTER TABLE seguimiento_equipos 
            DROP COLUMN updated_at,
            DROP COLUMN created_at
        `);

        // Eliminar foreign keys
        await queryRunner.dropForeignKey(
            "maintenance_checklist_results",
            "FK_checklist_result_item"
        );
        await queryRunner.dropForeignKey(
            "maintenance_checklist_results",
            "FK_checklist_result_seguimiento"
        );

        // Eliminar índice único
        await queryRunner.dropIndex(
            "maintenance_checklist_results",
            "UQ_seguimiento_checklist_item"
        );

        // Eliminar tablas en orden inverso
        await queryRunner.dropTable("maintenance_checklist_results", true);
        await queryRunner.dropTable("maintenance_checklist_items", true);
    }
}
