import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateInfrastructureTicketsModule20260415100000 implements MigrationInterface {
    name = "CreateInfrastructureTicketsModule20260415100000";

    public async up(queryRunner: QueryRunner): Promise<void> {

        // ─── INFRASTRUCTURE CATEGORIES ────────────────────────────────────────────────
        await queryRunner.createTable(new Table({
            name: "infrastructure_categories",
            columns: [
                { name: "id", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
                { name: "nombre", type: "varchar", length: "255", isUnique: true },
                { name: "descripcion", type: "text", isNullable: true },
                { name: "prioridad_id", type: "int", isNullable: true },
            ],
        }), true);

        await queryRunner.createForeignKey("infrastructure_categories", new TableForeignKey({
            name: "fk_infra_cat_prioridad",
            columnNames: ["prioridad_id"],
            referencedTableName: "prioridades",
            referencedColumnNames: ["id"],
            onDelete: "SET NULL",
            onUpdate: "CASCADE",
        }));

        // ─── INFRASTRUCTURE TICKETS ────────────────────────────────────────────────────
        await queryRunner.createTable(new Table({
            name: "infrastructure_tickets",
            columns: [
                { name: "id", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
                { name: "titulo", type: "varchar", length: "255" },
                { name: "descripcion", type: "text" },
                { name: "usuario_id", type: "int" },
                { name: "categoria_id", type: "int" },
                { name: "estado_id", type: "int" },
                { name: "prioridad_id", type: "int", default: 4 },
                { name: "sede_id", type: "int" },
                { name: "ubicacion_descripcion", type: "varchar", length: "255", isNullable: true },
                { name: "monto_cotizacion", type: "decimal", precision: 12, scale: 2, isNullable: true },
                { name: "fecha_creacion", type: "timestamp", precision: 6, default: "CURRENT_TIMESTAMP(6)" },
                { name: "fecha_actualizacion", type: "timestamp", precision: 6, default: "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" },
            ],
        }), true);

        await queryRunner.createForeignKey("infrastructure_tickets", new TableForeignKey({
            name: "fk_infra_ticket_usuario",
            columnNames: ["usuario_id"],
            referencedTableName: "usuario",
            referencedColumnNames: ["id"],
            onDelete: "RESTRICT",
            onUpdate: "CASCADE",
        }));

        await queryRunner.createForeignKey("infrastructure_tickets", new TableForeignKey({
            name: "fk_infra_ticket_categoria",
            columnNames: ["categoria_id"],
            referencedTableName: "infrastructure_categories",
            referencedColumnNames: ["id"],
            onDelete: "RESTRICT",
            onUpdate: "CASCADE",
        }));

        await queryRunner.createForeignKey("infrastructure_tickets", new TableForeignKey({
            name: "fk_infra_ticket_estado",
            columnNames: ["estado_id"],
            referencedTableName: "estados_tickets",
            referencedColumnNames: ["id"],
            onDelete: "RESTRICT",
            onUpdate: "CASCADE",
        }));

        await queryRunner.createForeignKey("infrastructure_tickets", new TableForeignKey({
            name: "fk_infra_ticket_prioridad",
            columnNames: ["prioridad_id"],
            referencedTableName: "prioridades",
            referencedColumnNames: ["id"],
            onDelete: "RESTRICT",
            onUpdate: "CASCADE",
        }));

        await queryRunner.createForeignKey("infrastructure_tickets", new TableForeignKey({
            name: "fk_infra_ticket_sede",
            columnNames: ["sede_id"],
            referencedTableName: "headquarters",
            referencedColumnNames: ["id"],
            onDelete: "RESTRICT",
            onUpdate: "CASCADE",
        }));

        // ─── INFRASTRUCTURE COMMENTS ──────────────────────────────────────────────────
        await queryRunner.createTable(new Table({
            name: "infrastructure_comments",
            columns: [
                { name: "id", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
                { name: "ticket_id", type: "int" },
                { name: "usuario_id", type: "int" },
                { name: "comentario", type: "text" },
                { name: "fecha_creacion", type: "timestamp", precision: 6, default: "CURRENT_TIMESTAMP(6)" },
            ],
        }), true);

        await queryRunner.createForeignKey("infrastructure_comments", new TableForeignKey({
            name: "fk_infra_comment_ticket",
            columnNames: ["ticket_id"],
            referencedTableName: "infrastructure_tickets",
            referencedColumnNames: ["id"],
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        }));

        await queryRunner.createForeignKey("infrastructure_comments", new TableForeignKey({
            name: "fk_infra_comment_usuario",
            columnNames: ["usuario_id"],
            referencedTableName: "usuario",
            referencedColumnNames: ["id"],
            onDelete: "RESTRICT",
            onUpdate: "CASCADE",
        }));

        // ─── INFRASTRUCTURE ATTACHMENTS ───────────────────────────────────────────────
        await queryRunner.createTable(new Table({
            name: "infrastructure_attachments",
            columns: [
                { name: "id", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
                { name: "ticket_id", type: "int" },
                { name: "file_name", type: "varchar", length: "150" },
                { name: "file_url", type: "varchar", length: "200" },
                { name: "file_size", type: "int" },
                { name: "mime_type", type: "varchar", length: "100" },
                { name: "file_name_saved", type: "varchar", length: "200" },
                { name: "uploaded_by_user_id", type: "int" },
                { name: "attachment_type", type: "enum", enum: ["photo", "document", "pdf", "video", "other"], default: "'other'" },
                { name: "is_internal", type: "tinyint", width: 1, default: 0 },
                { name: "created_at", type: "timestamp", precision: 6, default: "CURRENT_TIMESTAMP(6)" },
            ],
        }), true);

        await queryRunner.createForeignKey("infrastructure_attachments", new TableForeignKey({
            name: "fk_infra_attach_ticket",
            columnNames: ["ticket_id"],
            referencedTableName: "infrastructure_tickets",
            referencedColumnNames: ["id"],
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        }));

        await queryRunner.createForeignKey("infrastructure_attachments", new TableForeignKey({
            name: "fk_infra_attach_usuario",
            columnNames: ["uploaded_by_user_id"],
            referencedTableName: "usuario",
            referencedColumnNames: ["id"],
            onDelete: "RESTRICT",
            onUpdate: "CASCADE",
        }));

        // ─── NEW ROLES (IDs 22 and 23) ────────────────────────────────────────────────
        await queryRunner.query(`INSERT INTO \`rol\` (\`TipoRol\`) VALUES ('Coordinador Infraestructura'), ('Auxiliar Infraestructura')`);

        // ─── SEED: INFRASTRUCTURE CATEGORIES ─────────────────────────────────────────
        await queryRunner.manager.insert("infrastructure_categories", [
            { nombre: "Mantenimiento eléctrico" },
            { nombre: "Plomería" },
            { nombre: "Pintura / Acabados" },
            { nombre: "Techos / Cubiertas" },
            { nombre: "Aire acondicionado / HVAC" },
            { nombre: "Mobiliario" },
            { nombre: "Señalización" },
            { nombre: "Otro" },
        ]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop FKs before dropping tables (reverse dependency order)
        const attachmentsTable = await queryRunner.getTable("infrastructure_attachments");
        if (attachmentsTable) {
            for (const fk of attachmentsTable.foreignKeys) {
                await queryRunner.dropForeignKey("infrastructure_attachments", fk);
            }
            await queryRunner.dropTable("infrastructure_attachments");
        }

        const commentsTable = await queryRunner.getTable("infrastructure_comments");
        if (commentsTable) {
            for (const fk of commentsTable.foreignKeys) {
                await queryRunner.dropForeignKey("infrastructure_comments", fk);
            }
            await queryRunner.dropTable("infrastructure_comments");
        }

        const ticketsTable = await queryRunner.getTable("infrastructure_tickets");
        if (ticketsTable) {
            for (const fk of ticketsTable.foreignKeys) {
                await queryRunner.dropForeignKey("infrastructure_tickets", fk);
            }
            await queryRunner.dropTable("infrastructure_tickets");
        }

        const categoriesTable = await queryRunner.getTable("infrastructure_categories");
        if (categoriesTable) {
            for (const fk of categoriesTable.foreignKeys) {
                await queryRunner.dropForeignKey("infrastructure_categories", fk);
            }
            await queryRunner.dropTable("infrastructure_categories");
        }

        await queryRunner.query(`DELETE FROM \`rol\` WHERE \`TipoRol\` IN ('Coordinador Infraestructura', 'Auxiliar Infraestructura')`);
    }
}
