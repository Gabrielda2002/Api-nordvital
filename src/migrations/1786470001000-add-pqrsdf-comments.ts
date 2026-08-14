import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class AddPqrsdfComments1786470001000 implements MigrationInterface {
    name = "AddPqrsdfComments1786470001000";

    public async up(queryRunner: QueryRunner): Promise<void> {
        // 1. Create pqrsdf_comments table
        await queryRunner.createTable(
            new Table({
                name: "pqrsdf_comments",
                columns: [
                    {
                        name: "id",
                        type: "int",
                        unsigned: true,
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment",
                        comment: "Identificador único del comentario",
                    },
                    {
                        name: "pqrsdf_id",
                        type: "int",
                        unsigned: true,
                        comment: "FK a pqrsdf — PQRSDF a la que pertenece el comentario",
                    },
                    {
                        name: "author_id",
                        type: "int",
                        comment: "FK a users — usuario que realizó el comentario",
                    },
                    {
                        name: "comment",
                        type: "text",
                        comment: "Contenido del comentario",
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                    },
                ],
                indices: [
                    {
                        name: "IDX_pqrsdf_comments_pqrsdf_id",
                        columnNames: ["pqrsdf_id", "id"],
                    },
                    {
                        name: "IDX_pqrsdf_comments_author_id",
                        columnNames: ["author_id"],
                    },
                ],
            }),
            true
        );

        // 2. FK pqrsdf_id -> pqrsdf.id
        await queryRunner.createForeignKey(
            "pqrsdf_comments",
            new TableForeignKey({
                name: "fk_pqrsdf_comments_pqrsdf",
                columnNames: ["pqrsdf_id"],
                referencedTableName: "pqrsdf",
                referencedColumnNames: ["id"],
                onDelete: "CASCADE",
            })
        );

        // 3. FK author_id -> users.id
        await queryRunner.createForeignKey(
            "pqrsdf_comments",
            new TableForeignKey({
                name: "fk_pqrsdf_comments_author",
                columnNames: ["author_id"],
                referencedTableName: "users",
                referencedColumnNames: ["id"],
                onDelete: "RESTRICT",
            })
        );

        // 4. Create pqrsdf_comment_attachments table
        await queryRunner.createTable(
            new Table({
                name: "pqrsdf_comment_attachments",
                columns: [
                    {
                        name: "id",
                        type: "int",
                        unsigned: true,
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment",
                        comment: "Identificador único del adjunto",
                    },
                    {
                        name: "comment_id",
                        type: "int",
                        unsigned: true,
                        comment: "FK a pqrsdf_comments — comentario al que pertenece el adjunto",
                    },
                    {
                        name: "file_name",
                        type: "varchar",
                        length: "255",
                        comment: "Nombre original del archivo",
                    },
                    {
                        name: "file_name_saved",
                        type: "varchar",
                        length: "255",
                        comment: "Nombre interno con el que se almacenó el archivo",
                    },
                    {
                        name: "file_path",
                        type: "varchar",
                        length: "300",
                        comment: "Ruta relativa del archivo dentro de uploads",
                    },
                    {
                        name: "mime_type",
                        type: "varchar",
                        length: "100",
                        comment: "Tipo MIME del archivo",
                    },
                    {
                        name: "file_size",
                        type: "int",
                        comment: "Tamaño del archivo en bytes",
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                    },
                ],
                indices: [
                    {
                        name: "IDX_pqrsdf_comment_attachments_comment_id",
                        columnNames: ["comment_id"],
                    },
                ],
            }),
            true
        );

        // 5. FK comment_id -> pqrsdf_comments.id
        await queryRunner.createForeignKey(
            "pqrsdf_comment_attachments",
            new TableForeignKey({
                name: "fk_pqrsdf_comment_attachments_comment",
                columnNames: ["comment_id"],
                referencedTableName: "pqrsdf_comments",
                referencedColumnNames: ["id"],
                onDelete: "CASCADE",
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Reverse 5: drop FK comment_id
        await queryRunner.dropForeignKey("pqrsdf_comment_attachments", "fk_pqrsdf_comment_attachments_comment");

        // Reverse 4: drop attachments table
        await queryRunner.dropIndex("pqrsdf_comment_attachments", "IDX_pqrsdf_comment_attachments_comment_id");
        await queryRunner.dropTable("pqrsdf_comment_attachments");

        // Reverse 3 & 2: drop FKs
        await queryRunner.dropForeignKey("pqrsdf_comments", "fk_pqrsdf_comments_author");
        await queryRunner.dropForeignKey("pqrsdf_comments", "fk_pqrsdf_comments_pqrsdf");

        // Reverse 1: drop comments table
        await queryRunner.dropIndex("pqrsdf_comments", "IDX_pqrsdf_comments_pqrsdf_id");
        await queryRunner.dropIndex("pqrsdf_comments", "IDX_pqrsdf_comments_author_id");
        await queryRunner.dropTable("pqrsdf_comments");
    }
}
