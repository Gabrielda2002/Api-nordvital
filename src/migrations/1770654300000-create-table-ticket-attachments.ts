import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateTableTicketAttachments1770654300000 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "ticket_attachments",
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
                        isNullable: false,
                    },
                    {
                        name: "file_name",
                        type: "varchar",
                        length: "150",
                        isNullable: false,
                    },
                    {
                        name: "file_url",
                        type: "varchar",
                        length: "200",
                        isNullable: false,
                    },
                    {
                        name: "file_size",
                        type: "int",
                        isNullable: false,
                    },
                    {
                        name: "mime_type",
                        type: "varchar",
                        length: "100",
                        isNullable: false,
                    },
                    {
                        name: "file_name_saved",
                        type: "varchar",
                        length: "200",
                        isNullable: false,
                    },
                    {
                        name: "uploaded_by_user_id",
                        type: "int",
                        isNullable: false,
                    },
                    {
                        name: "attachment_type",
                        type: "enum",
                        enum: ["screenshot", "log", "document", "pdf", "video", "other"],
                        default: "'other'",
                        isNullable: false,
                    },
                    {
                        name: "is_internal",
                        type: "tinyint",
                        width: 1,
                        default: 0,
                        isNullable: false,
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                        isNullable: false,
                    },
                ],
                foreignKeys: [
                    {
                        columnNames: ["ticket_id"],
                        referencedColumnNames: ["id"],
                        referencedTableName: "tickets",
                        onDelete: "CASCADE",
                    },
                    {
                        columnNames: ["uploaded_by_user_id"],
                        referencedColumnNames: ["id"],
                        referencedTableName: "usuario",
                        onDelete: "CASCADE",
                    },
                ],
                indices: [
                    {
                        name: "IDX_TICKET_ATTACHMENTS_TICKET_ID",
                        columnNames: ["ticket_id"],
                    },
                    {
                        name: "IDX_TICKET_ATTACHMENTS_USER_ID",
                        columnNames: ["uploaded_by_user_id"],
                    },
                ],
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("ticket_attachments");
    }
}
