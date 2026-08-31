import { MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey } from "typeorm";

export class AddPqrsdfStatusHistory1786470000000 implements MigrationInterface {
    name = "AddPqrsdfStatusHistory1786470000000";

    public async up(queryRunner: QueryRunner): Promise<void> {
        // 1. Create append-only pqrsdf_status_history table
        await queryRunner.createTable(
            new Table({
                name: "pqrsdf_status_history",
                columns: [
                    {
                        name: "id",
                        type: "int",
                        unsigned: true,
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment",
                        comment: "Identificador único del registro de historial",
                    },
                    {
                        name: "pqrsdf_id",
                        type: "int",
                        unsigned: true,
                        comment: "FK a pqrsdf — PQRSDF a la que pertenece el historial",
                    },
                    {
                        name: "status",
                        type: "enum",
                        enum: ["ABIERTO", "EN_GESTION", "CERRADO"],
                        comment: "Estado alcanzado en esta transición",
                    },
                    {
                        name: "note",
                        type: "text",
                        isNullable: true,
                        comment: "Nota de la transición (obligatoria en cambios de estado, opcional en la creación)",
                    },
                    {
                        name: "actor_id",
                        type: "int",
                        isNullable: true,
                        comment: "FK a users — usuario que realizó la transición",
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                    },
                ],
                indices: [
                    {
                        name: "IDX_pqrsdf_status_history_pqrsdf_id",
                        columnNames: ["pqrsdf_id", "id"],
                    },
                ],
            }),
            true
        );

        // 2. FK pqrsdf_id -> pqrsdf.id
        await queryRunner.createForeignKey(
            "pqrsdf_status_history",
            new TableForeignKey({
                name: "fk_pqrsdf_status_history_pqrsdf",
                columnNames: ["pqrsdf_id"],
                referencedTableName: "pqrsdf",
                referencedColumnNames: ["id"],
                onDelete: "RESTRICT",
            })
        );

        // 3. FK actor_id -> users.id
        await queryRunner.createForeignKey(
            "pqrsdf_status_history",
            new TableForeignKey({
                name: "fk_pqrsdf_status_history_actor",
                columnNames: ["actor_id"],
                referencedTableName: "users",
                referencedColumnNames: ["id"],
                onDelete: "SET NULL",
            })
        );

        // 4. Drop response_summary from pqrsdf (no backfill; existing test data may lose it)
        await queryRunner.dropColumn("pqrsdf", "response_summary");

        // 5. Add improvement_action_details (text nullable)
        await queryRunner.addColumn(
            "pqrsdf",
            new TableColumn({
                name: "improvement_action_details",
                type: "text",
                isNullable: true,
                comment: "Detalle de la acción de mejora (obligatorio cuando improvement_action=1)",
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Reverse 5: drop improvement_action_details
        await queryRunner.dropColumn("pqrsdf", "improvement_action_details");

        // Reverse 4: restore response_summary (empty, no data)
        await queryRunner.addColumn(
            "pqrsdf",
            new TableColumn({
                name: "response_summary",
                type: "text",
                isNullable: true,
                comment: "RESUMEN DE LA RESPUESTA",
            })
        );

        // Reverse 3 & 2: drop FKs
        await queryRunner.dropForeignKey("pqrsdf_status_history", "fk_pqrsdf_status_history_actor");
        await queryRunner.dropForeignKey("pqrsdf_status_history", "fk_pqrsdf_status_history_pqrsdf");

        // Reverse index + table
        await queryRunner.dropIndex("pqrsdf_status_history", "IDX_pqrsdf_status_history_pqrsdf_id");
        await queryRunner.dropTable("pqrsdf_status_history");
    }
}
