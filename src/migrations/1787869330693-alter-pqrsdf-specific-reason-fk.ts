import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey, TableIndex } from "typeorm";

export class AlterPqrsdfSpecificReasonFk1787869330693 implements MigrationInterface {
    name = "AlterPqrsdfSpecificReasonFk1787869330693";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            "pqrsdf",
            new TableColumn({
                name: "specific_reason_id",
                type: "int",
                isNullable: true    ,
                comment: "MOTIVO ESPECIFICO (FK a requested_services)",
            })
        );

        await queryRunner.createIndex(
            "pqrsdf",
            new TableIndex({
                name: "IDX_pqrsdf_specific_reason",
                columnNames: ["specific_reason_id"],
            })
        );

        await queryRunner.createForeignKey(
            "pqrsdf",
            new TableForeignKey({
                name: "fk_pqrsdf_specific_reason",
                columnNames: ["specific_reason_id"],
                referencedTableName: "requested_services",
                referencedColumnNames: ["id"],
                onDelete: "SET NULL",
            })
        );

        await queryRunner.dropColumn("pqrsdf", "specific_reason");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // 1. Restaurar specific_reason (varchar nullable)
        await queryRunner.addColumn(
            "pqrsdf",
            new TableColumn({
                name: "specific_reason",
                type: "varchar",
                length: "250",
                isNullable: true,
                comment: "MOTIVO ESPECIFICO",
            })
        );

        // 2. Reversa del backfill: restaura el texto desde el name del servicio referenciado
        await queryRunner.query(
            `UPDATE \`pqrsdf\` p
             LEFT JOIN \`requested_services\` rs ON p.\`specific_reason_id\` = rs.\`id\`
             SET p.\`specific_reason\` = rs.\`name\`
             WHERE p.\`specific_reason_id\` IS NOT NULL`
        );

        // 3. Drop FK
        await queryRunner.dropForeignKey("pqrsdf", "fk_pqrsdf_specific_reason");

        // 4. Drop index
        await queryRunner.dropIndex("pqrsdf", "IDX_pqrsdf_specific_reason");

        // 5. Drop specific_reason_id
        await queryRunner.dropColumn("pqrsdf", "specific_reason_id");
    }
}