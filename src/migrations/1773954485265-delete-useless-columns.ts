import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from "typeorm";

export class DeleteUselessColumns1773954485265 implements MigrationInterface {
    name = "DeleteUselessColumns1773954485265";

    public async up(queryRunner: QueryRunner): Promise<void> {
        // delete audit_status_id from radicaciones
        const tableRadicaciones = await queryRunner.getTable("radicaciones");

        const statusForeignKey = tableRadicaciones?.foreignKeys.find(
            (fk) => fk.columnNames.indexOf("audit_status_id") !== -1
        )

        if (statusForeignKey) {
            await queryRunner.dropForeignKey("radicaciones", statusForeignKey);
        }

        await queryRunner.dropColumn("radicaciones", "audit_status_id");

        // drop column professional_name
        await queryRunner.dropColumn("radicaciones", "professional_name");

        // agregar columna updated_at a radicaciones
        await queryRunner.addColumn(
            "radicaciones",
            new TableColumn({ 
                name: "updated_at",
                type: "datetime",
                isNullable: true,
                comment: "Fecha y hora de actualización de la radicación",
                default: "CURRENT_TIMESTAMP",
                onUpdate: "CURRENT_TIMESTAMP"
            })
        );

        // agregar la columna audit_user_id a radicaciones
        await queryRunner.addColumn(
            "radicaciones",
            new TableColumn({
                name: "audit_user_id",
                type: "int",
                isNullable: true,
                comment: "Usuario que realizó la auditoria"
            })
        )

        // agregar la columna audit_status_id a usuario
        await queryRunner.createForeignKey(
            "radicaciones",
            new TableForeignKey({
                columnNames: ["audit_user_id"],
                referencedColumnNames: ["id"],
                referencedTableName: "usuario",
                onDelete: "SET NULL"
            })
        )

        // eliminar columna status_id de surgeries
        await queryRunner.dropColumn("surgeries", "status_id");

        // eliminar requested_service_id de surgery_tracking_records
        const tableSeguimiento = await queryRunner.getTable("surgery_tracking_records");

        const serviceForeignKey = tableSeguimiento?.foreignKeys.find(
            (fk) => fk.columnNames.indexOf("requested_service_id") !== -1
        )

        if (serviceForeignKey) {
            await queryRunner.dropForeignKey("surgery_tracking_records", serviceForeignKey);
        }

        await queryRunner.dropColumn("surgery_tracking_records", "requested_service_id");

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const tableRadicaciones = await queryRunner.getTable("radicaciones");

        const auditUserForeignKey = tableRadicaciones?.foreignKeys.find(
            (fk) => fk.columnNames.indexOf("audit_user_id") !== -1
        );

        if (auditUserForeignKey) {
            await queryRunner.dropForeignKey("radicaciones", auditUserForeignKey);
        }

        const hasAuditUserId = await queryRunner.hasColumn("radicaciones", "audit_user_id");
        if (hasAuditUserId) {
            await queryRunner.dropColumn("radicaciones", "audit_user_id");
        }

        const hasUpdatedAt = await queryRunner.hasColumn("radicaciones", "updated_at");
        if (hasUpdatedAt) {
            await queryRunner.dropColumn("radicaciones", "updated_at");
        }

        const hasProfessionalName = await queryRunner.hasColumn("radicaciones", "professional_name");
        if (!hasProfessionalName) {
            await queryRunner.addColumn(
                "radicaciones",
                new TableColumn({
                    name: "professional_name",
                    type: "varchar",
                    length: "255",
                    isNullable: true,
                })
            );
        }

        const hasAuditStatusId = await queryRunner.hasColumn("radicaciones", "audit_status_id");
        if (!hasAuditStatusId) {
            await queryRunner.addColumn(
                "radicaciones",
                new TableColumn({
                    name: "audit_status_id",
                    type: "int",
                    isNullable: true,
                })
            );
        }

        const refreshedRadicacionesTable = await queryRunner.getTable("radicaciones");
        const hasAuditStatusForeignKey = refreshedRadicacionesTable?.foreignKeys.some(
            (fk) => fk.columnNames.indexOf("audit_status_id") !== -1
        );

        if (!hasAuditStatusForeignKey) {
            await queryRunner.createForeignKey(
                "radicaciones",
                new TableForeignKey({
                    columnNames: ["audit_status_id"],
                    referencedColumnNames: ["id"],
                    referencedTableName: "estados",
                })
            );
        }

        const hasSurgeryStatusId = await queryRunner.hasColumn("surgeries", "status_id");
        if (!hasSurgeryStatusId) {
            await queryRunner.addColumn(
                "surgeries",
                new TableColumn({
                    name: "status_id",
                    type: "int",
                    isNullable: true,
                })
            );
        }

        const hasRequestedServiceId = await queryRunner.hasColumn("surgery_tracking_records", "requested_service_id");
        if (!hasRequestedServiceId) {
            await queryRunner.addColumn(
                "surgery_tracking_records",
                new TableColumn({
                    name: "requested_service_id",
                    type: "int",
                    isNullable: true,
                })
            );
        }

        const surgeryTrackingTable = await queryRunner.getTable("surgery_tracking_records");
        const hasRequestedServiceForeignKey = surgeryTrackingTable?.foreignKeys.some(
            (fk) => fk.columnNames.indexOf("requested_service_id") !== -1
        );

        if (!hasRequestedServiceForeignKey) {
            await queryRunner.createForeignKey(
                "surgery_tracking_records",
                new TableForeignKey({
                    columnNames: ["requested_service_id"],
                    referencedColumnNames: ["id"],
                    referencedTableName: "requested_services",
                })
            );
        }
    }
}