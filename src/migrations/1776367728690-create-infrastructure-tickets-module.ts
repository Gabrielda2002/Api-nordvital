import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateInfrastructureTicketsModule1776367728690 implements MigrationInterface {
    name = "CreateInfrastructureTicketsModule1776367728690";

    public async up(queryRunner: QueryRunner): Promise<void> {

        // ─── INFRASTRUCTURE CATEGORIES ────────────────────────────────────────────────
        await queryRunner.createTable(new Table({
            name: "infrastructure_categories",
            columns: [
                { name: "id", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
                { name: "name", type: "varchar", length: "255", isUnique: true },
                { name: "description", type: "text", isNullable: true },
                { name: "priority_id", type: "int", isNullable: true },
            ],
        }), true);

        await queryRunner.createForeignKey("infrastructure_categories", new TableForeignKey({
            name: "fk_infra_cat_priority",
            columnNames: ["priority_id"],
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
                { name: "title", type: "varchar", length: "255" },
                { name: "description", type: "text" },
                { name: "user_id", type: "int" },
                { name: "category_id", type: "int" },
                { name: "status_id", type: "int" },
                { name: "priority_id", type: "int", default: 4 },
                { name: "headquarters_id", type: "int" },
                { name: "location_description", type: "varchar", length: "255", isNullable: true },
                { name: "quotation_amount", type: "decimal", precision: 12, scale: 2, isNullable: true },
                { name: "created_at", type: "timestamp", precision: 6, default: "CURRENT_TIMESTAMP(6)" },
                { name: "updated_at", type: "timestamp", precision: 6, default: "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" },
            ],
        }), true);

        await queryRunner.createForeignKey("infrastructure_tickets", new TableForeignKey({
            name: "fk_infra_ticket_usuario",
            columnNames: ["user_id"],
            referencedTableName: "usuario",
            referencedColumnNames: ["id"],
            onDelete: "RESTRICT",
            onUpdate: "CASCADE",
        }));

        await queryRunner.createForeignKey("infrastructure_tickets", new TableForeignKey({
            name: "fk_infra_ticket_categoria",
            columnNames: ["category_id"],
            referencedTableName: "infrastructure_categories",
            referencedColumnNames: ["id"],
            onDelete: "RESTRICT",
            onUpdate: "CASCADE",
        }));

        await queryRunner.createForeignKey("infrastructure_tickets", new TableForeignKey({
            name: "fk_infra_ticket_estado",
            columnNames: ["status_id"],
            referencedTableName: "estados_tickets",
            referencedColumnNames: ["id"],
            onDelete: "RESTRICT",
            onUpdate: "CASCADE",
        }));

        await queryRunner.createForeignKey("infrastructure_tickets", new TableForeignKey({
            name: "fk_infra_ticket_prioridad",
            columnNames: ["priority_id"],
            referencedTableName: "prioridades",
            referencedColumnNames: ["id"],
            onDelete: "RESTRICT",
            onUpdate: "CASCADE",
        }));

        await queryRunner.createForeignKey("infrastructure_tickets", new TableForeignKey({
            name: "fk_infra_ticket_sede",
            columnNames: ["headquarters_id"],
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
                { name: "user_id", type: "int" },
                { name: "comment", type: "text" },
                { name: "created_at", type: "timestamp", precision: 6, default: "CURRENT_TIMESTAMP(6)" },
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
            columnNames: ["user_id"],
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
        await queryRunner.query(`
            INSERT INTO \`infrastructure_categories\` (\`name\`, \`description\`, \`priority_id\`) VALUES
            ('Mantenimiento eléctrico', 'Problemas relacionados con la electricidad, como fallas en el sistema eléctrico, cortocircuitos, problemas de iluminación, etc.', 3),
            ('Plomería', 'Problemas relacionados con el suministro de agua, como fugas, obstrucciones, problemas de presión, etc.', 3),
            ('Pintura / Acabados', 'Problemas relacionados con la pintura y acabados, como reparaciones, retoques, mantenimiento de superficies, etc.', 2),
            ('Techos / Cubiertas', 'Problemas relacionados con techos y cubiertas, como filtraciones, reparaciones, mantenimiento, etc.', 4),
            ('Aire acondicionado / HVAC', 'Problemas relacionados con sistemas de aire acondicionado y HVAC, como fallas, mantenimiento, reparaciones, etc.', 3),
            ('Mobiliario', 'Problemas relacionados con el mobiliario, como reparaciones, mantenimiento, reemplazo, etc.', 3),
            ('Señalización', 'Problemas relacionados con la señalización, como mantenimiento, reparaciones, actualizaciones, etc.', 3),
            ('Otro', 'Categoría general para problemas que no encajan en las categorías anteriores.', 2)
        `);
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
