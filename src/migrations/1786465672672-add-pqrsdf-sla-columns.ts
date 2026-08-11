import { MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey, TableIndex } from "typeorm";

export class AddPqrsdfSlaColumns1786465672672 implements MigrationInterface {
    name = "AddPqrsdfSlaColumns1786465672672";

    public async up(queryRunner: QueryRunner): Promise<void> {
        // 1. Create pqrsdf_risk_policies catalog table
        await queryRunner.createTable(
            new Table({
                name: "pqrsdf_risk_policies",
                columns: [
                    {
                        name: "id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment",
                    },
                    {
                        name: "code",
                        type: "varchar",
                        length: "50",
                        isUnique: true,
                        comment: "Codigo estable de la politica de riesgo (e.g. VITAL, PRIORIZADO)",
                    },
                    {
                        name: "name",
                        type: "varchar",
                        length: "100",
                        comment: "Nombre descriptivo de la politica de riesgo",
                    },
                    {
                        name: "sla_duration_value",
                        type: "int",
                        comment: "Valor numerico de la duracion SLA",
                    },
                    {
                        name: "sla_duration_unit",
                        type: "enum",
                        enum: ["HOURS", "DAYS"],
                        comment: "Unidad de la duracion SLA",
                    },
                    {
                        name: "business_days",
                        type: "tinyint",
                        width: 1,
                        default: 0,
                        comment: "Si el SLA se mide en dias habiles (0=NO, 1=SI). Deshabilitado por ahora.",
                    },
                    {
                        name: "active",
                        type: "tinyint",
                        width: 1,
                        default: 1,
                        comment: "Si la politica esta activa (1) o inactiva (0)",
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
                    },
                ],
            }),
            true
        );

        // 2. Seed risk policies
        await queryRunner.query(
            `INSERT INTO \`pqrsdf_risk_policies\` (\`code\`, \`name\`, \`sla_duration_value\`, \`sla_duration_unit\`, \`business_days\`, \`active\`) VALUES
            ('VITAL', 'VITAL', 24, 'HOURS', 0, 1),
            ('PRIORIZADO', 'PRIORIZADO', 48, 'HOURS', 0, 1),
            ('SIMPLE', 'SIMPLE', 72, 'HOURS', 0, 1),
            ('GENERAL', 'GENERAL', 15, 'DAYS', 0, 1)`
        );

        // 3. Add risk_id column to pqrsdf
        await queryRunner.addColumn(
            "pqrsdf",
            new TableColumn({
                name: "risk_id",
                type: "int",
                comment: "FK a pqrsdf_risk_policies — politica de riesgo con SLA",
                default: 1,
            })
        );

        // 4. Create FK for risk_id
        await queryRunner.createForeignKey(
            "pqrsdf",
            new TableForeignKey({
                name: "fk_pqrsdf_risk",
                columnNames: ["risk_id"],
                referencedTableName: "pqrsdf_risk_policies",
                referencedColumnNames: ["id"],
                onDelete: "RESTRICT",
            })
        );

        // 5. Create index for risk_id
        await queryRunner.createIndex(
            "pqrsdf",
            new TableIndex({ name: "IDX_pqrsdf_risk", columnNames: ["risk_id"] })
        );

        // 6. Add SLA snapshot / tracking columns
        await queryRunner.addColumn(
            "pqrsdf",
            new TableColumn({
                name: "sla_duration_value",
                type: "int",
                isNullable: true,
                comment: "Snapshot del valor de duracion SLA aplicado al crear la PQRSDF",
            })
        );

        await queryRunner.addColumn(
            "pqrsdf",
            new TableColumn({
                name: "sla_duration_unit",
                type: "enum",
                enum: ["HOURS", "DAYS"],
                isNullable: true,
                comment: "Snapshot de la unidad de duracion SLA aplicada",
            })
        );

        await queryRunner.addColumn(
            "pqrsdf",
            new TableColumn({
                name: "sla_business_days",
                type: "tinyint",
                width: 1,
                isNullable: true,
                comment: "Snapshot del flag business_days de la politica al crear la PQRSDF",
            })
        );

        await queryRunner.addColumn(
            "pqrsdf",
            new TableColumn({
                name: "sla_deadline_at",
                type: "datetime",
                isNullable: true,
                comment: "Fecha y hora limite calculada para cumplir el SLA segun el riesgo",
            })
        );

        await queryRunner.addColumn(
            "pqrsdf",
            new TableColumn({
                name: "sla_closed_at",
                type: "datetime",
                isNullable: true,
                comment: "Fecha y hora en que se cerro la PQRSDF respecto al SLA",
            })
        );

        await queryRunner.addColumn(
            "pqrsdf",
            new TableColumn({
                name: "sla_overdue",
                type: "tinyint",
                width: 1,
                default: 0,
                comment: "Indica si la PQRSDF esta vencida (1) o a tiempo (0). Se actualiza en lecturas y escrituras.",
            })
        );

        await queryRunner.addColumn(
            "pqrsdf",
            new TableColumn({
                name: "sla_overdue_seconds",
                type: "int",
                isNullable: true,
                comment: "Segundos transcurridos desde que vencio el SLA. NULL si no ha vencido. Se preserva al cerrar.",
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey("pqrsdf", "fk_pqrsdf_risk");
        await queryRunner.dropIndex("pqrsdf", "IDX_pqrsdf_risk");
        await queryRunner.dropColumn("pqrsdf", "risk_id");
        await queryRunner.dropColumn("pqrsdf", "sla_duration_value");
        await queryRunner.dropColumn("pqrsdf", "sla_duration_unit");
        await queryRunner.dropColumn("pqrsdf", "sla_business_days");
        await queryRunner.dropColumn("pqrsdf", "sla_deadline_at");
        await queryRunner.dropColumn("pqrsdf", "sla_closed_at");
        await queryRunner.dropColumn("pqrsdf", "sla_overdue");
        await queryRunner.dropColumn("pqrsdf", "sla_overdue_seconds");
        await queryRunner.dropTable("pqrsdf_risk_policies");
    }
}
