import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateSstTicketsModule1777320927390 implements MigrationInterface {
    name = "CreateSstTicketsModule1777320927390"; 

    public async up(queryRunner: QueryRunner): Promise<void> {
        // 1. Roles
        // await queryRunner.query(
        //     `INSERT INTO \`rol\` (\`TipoRol\`) VALUES ('Coordinador SST'), ('Auxiliar SST')`
        // );

        // 2. sst_categories
        // await queryRunner.createTable(
        //     new Table({
        //         name: "sst_categories",
        //         columns: [
        //             {
        //                 name: "id",
        //                 type: "int",
        //                 isPrimary: true,
        //                 isGenerated: true,
        //                 generationStrategy: "increment",
        //             },
        //             {
        //                 name: "name",
        //                 type: "varchar",
        //                 length: "255",
        //                 isUnique: true,
        //             },
        //             {
        //                 name: "description",
        //                 type: "text",
        //                 isNullable: true,
        //             },
        //             {
        //                 name: "priority_id",
        //                 type: "int",
        //                 isNullable: true,
        //             },
        //         ],
        //     }),
        //     true
        // );

        await queryRunner.createForeignKey(
            "sst_categories",
            new TableForeignKey({
                name: "fk_sst_cat_priority",
                columnNames: ["priority_id"],
                referencedTableName: "prioridades",
                referencedColumnNames: ["id"],
                onDelete: "SET NULL",
            })
        );

        // 3. sst_tickets
        await queryRunner.createTable(
            new Table({
                name: "sst_tickets",
                columns: [
                    {
                        name: "id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment",
                    },
                    {
                        name: "title",
                        type: "varchar",
                        length: "255",
                    },
                    {
                        name: "description",
                        type: "text",
                    },
                    {
                        name: "user_id",
                        type: "int",
                    },
                    {
                        name: "category_id",
                        type: "int",
                    },
                    {
                        name: "status_id",
                        type: "int",
                    },
                    {
                        name: "priority_id",
                        type: "int",
                        default: 4,
                    },
                    {
                        name: "headquarters_id",
                        type: "int",
                    },
                    {
                        name: "location_description",
                        type: "varchar",
                        length: "255",
                        isNullable: true,
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

        await queryRunner.createForeignKey(
            "sst_tickets",
            new TableForeignKey({
                name: "fk_sst_ticket_usuario",
                columnNames: ["user_id"],
                referencedTableName: "usuario",
                referencedColumnNames: ["id"],
                onDelete: "CASCADE",
            })
        );

        await queryRunner.createForeignKey(
            "sst_tickets",
            new TableForeignKey({
                name: "fk_sst_ticket_categoria",
                columnNames: ["category_id"],
                referencedTableName: "sst_categories",
                referencedColumnNames: ["id"],
                onDelete: "CASCADE",
            })
        );

        await queryRunner.createForeignKey(
            "sst_tickets",
            new TableForeignKey({
                name: "fk_sst_ticket_estado",
                columnNames: ["status_id"],
                referencedTableName: "estados_tickets",
                referencedColumnNames: ["id"],
                onDelete: "CASCADE",
            })
        );

        await queryRunner.createForeignKey(
            "sst_tickets",
            new TableForeignKey({
                name: "fk_sst_ticket_prioridad",
                columnNames: ["priority_id"],
                referencedTableName: "prioridades",
                referencedColumnNames: ["id"],
                onDelete: "CASCADE",
            })
        );

        await queryRunner.createForeignKey(
            "sst_tickets",
            new TableForeignKey({
                name: "fk_sst_ticket_headquarters",
                columnNames: ["headquarters_id"],
                referencedTableName: "headquarters",
                referencedColumnNames: ["id"],
                onDelete: "CASCADE",
            })
        );

        // 4. sst_comments
        await queryRunner.createTable(
            new Table({
                name: "sst_comments",
                columns: [
                    {
                        name: "id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment",
                    },
                    {
                        name: "ticket_id",
                        type: "int",
                    },
                    {
                        name: "user_id",
                        type: "int",
                    },
                    {
                        name: "comment",
                        type: "text",
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                    },
                ],
            }),
            true
        );

        await queryRunner.createForeignKey(
            "sst_comments",
            new TableForeignKey({
                name: "fk_sst_comment_ticket",
                columnNames: ["ticket_id"],
                referencedTableName: "sst_tickets",
                referencedColumnNames: ["id"],
                onDelete: "CASCADE",
            })
        );

        await queryRunner.createForeignKey(
            "sst_comments",
            new TableForeignKey({
                name: "fk_sst_comment_usuario",
                columnNames: ["user_id"],
                referencedTableName: "usuario",
                referencedColumnNames: ["id"],
                onDelete: "CASCADE",
            })
        );

        // 5. sst_attachments
        await queryRunner.createTable(
            new Table({
                name: "sst_attachments",
                columns: [
                    {
                        name: "id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment",
                    },
                    {
                        name: "ticket_id",
                        type: "int",
                    },
                    {
                        name: "file_name",
                        type: "varchar",
                        length: "150",
                    },
                    {
                        name: "file_url",
                        type: "varchar",
                        length: "200",
                    },
                    {
                        name: "file_size",
                        type: "int",
                    },
                    {
                        name: "mime_type",
                        type: "varchar",
                        length: "100",
                    },
                    {
                        name: "file_name_saved",
                        type: "varchar",
                        length: "200",
                    },
                    {
                        name: "uploaded_by_user_id",
                        type: "int",
                    },
                    {
                        name: "attachment_type",
                        type: "enum",
                        enum: ["photo", "document", "pdf", "video", "other"],
                        default: "'other'",
                    },
                    {
                        name: "is_internal",
                        type: "tinyint",
                        width: 1,
                        default: 0,
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                    },
                ],
            }),
            true
        );

        await queryRunner.createForeignKey(
            "sst_attachments",
            new TableForeignKey({
                name: "fk_sst_attach_ticket",
                columnNames: ["ticket_id"],
                referencedTableName: "sst_tickets",
                referencedColumnNames: ["id"],
                onDelete: "CASCADE",
            })
        );

        await queryRunner.createForeignKey(
            "sst_attachments",
            new TableForeignKey({
                name: "fk_sst_attach_usuario",
                columnNames: ["uploaded_by_user_id"],
                referencedTableName: "usuario",
                referencedColumnNames: ["id"],
                onDelete: "CASCADE",
            })
        );

        // 6. Seed categories
        await queryRunner.query(
            `INSERT INTO \`sst_categories\` (\`name\`, \`priority_id\`) VALUES
            ('Accidente de trabajo', 2),
            ('Incidente de trabajo', 3),
            ('Enfermedad laboral', 2),
            ('EPP (Equipos de Protección Personal)', 3),
            ('Inspección de seguridad', 3),
            ('Capacitación / Formación', 4),
            ('Condición insegura', 2),
            ('Otro', 4)`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop sst_attachments FKs + table
        const sstAttachments = await queryRunner.getTable("sst_attachments");
        if (sstAttachments) {
            for (const fk of sstAttachments.foreignKeys) {
                await queryRunner.dropForeignKey("sst_attachments", fk);
            }
            await queryRunner.dropTable("sst_attachments");
        }

        // Drop sst_comments FKs + table
        const sstComments = await queryRunner.getTable("sst_comments");
        if (sstComments) {
            for (const fk of sstComments.foreignKeys) {
                await queryRunner.dropForeignKey("sst_comments", fk);
            }
            await queryRunner.dropTable("sst_comments");
        }

        // Drop sst_tickets FKs + table
        const sstTickets = await queryRunner.getTable("sst_tickets");
        if (sstTickets) {
            for (const fk of sstTickets.foreignKeys) {
                await queryRunner.dropForeignKey("sst_tickets", fk);
            }
            await queryRunner.dropTable("sst_tickets");
        }

        // Drop sst_categories FKs + table
        const sstCategories = await queryRunner.getTable("sst_categories");
        if (sstCategories) {
            for (const fk of sstCategories.foreignKeys) {
                await queryRunner.dropForeignKey("sst_categories", fk);
            }
            await queryRunner.dropTable("sst_categories");
        }

        // Remove roles
        await queryRunner.query(
            `DELETE FROM \`rol\` WHERE \`TipoRol\` IN ('Coordinador SST', 'Auxiliar SST')`
        );
    }
}
