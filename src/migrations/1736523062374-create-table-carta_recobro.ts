import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableColumn } from "typeorm";

export class CreateTableCartaRecobro1736523062374 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "carta_recobro",
                columns: [
                    {
                        name: "id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment",
                    },
                    {
                        name: "id_radicado",
                        type: "int",
                    },
                    {
                        name: "id_usuario_solicita",
                        type: "int",
                    },
                    {
                        name: "id_usuario_audita",
                        type: "int",
                        isNullable: true,
                    },
                    {
                        name: "observacion",
                        type: "text",
                        isNullable: true,
                    },
                    {
                        name: "justificacion",
                        type: "text",
                    },
                    {
                        name: "fecha_impresion",
                        type: "date",
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
                    }
                ],
            }),
            true
        );

        await queryRunner.createForeignKey(
            "carta_recobro",
            new TableForeignKey({
                columnNames: ["id_radicado"],
                referencedColumnNames: ["IdRadicacion"],
                referencedTableName: "radicacion",
                onDelete: "CASCADE",
            })
        );

        await queryRunner.createForeignKey(
            "carta_recobro",
            new TableForeignKey({
                columnNames: ["id_usuario_solicita"],
                referencedColumnNames: ["IdUsuario"],
                referencedTableName: "usuario",
                onDelete: "CASCADE",
            })
        );

        await queryRunner.createForeignKey(
            "carta_recobro",
            new TableForeignKey({
                columnNames: ["id_usuario_audita"],
                referencedColumnNames: ["IdUsuario"],
                referencedTableName: "usuario",
                onDelete: "CASCADE",
            })
        );

        // Añadir nuevas columnas a la tabla cupspaciente
        await queryRunner.addColumns("cupspaciente", [
            new TableColumn({
                name: "estado_carta_recobro",
                type: "varchar",
                length: "50",
                isNullable: true
            }),
            new TableColumn({
                name: "fecha_audita_carta_recobro",
                type: "date",
                isNullable: true
            })
        ]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Eliminar columnas de cupspaciente
        await queryRunner.dropColumns("cupspaciente", ["estado_carta_recobro", "fecha_chequeo"]);

        const columnExists = await queryRunner.hasColumn("carta_recobro", "id_radicado");
        if (columnExists) {
            // Obtener la clave foránea asociada a 'id_diagnostico'
            const table = await queryRunner.getTable("carta_recobro");
            const foreignKey = table?.foreignKeys.find(
                (fk) => fk.columnNames.indexOf("id_radicado") !== -1
            );

            // Eliminar la clave foránea
            if (foreignKey) {
                await queryRunner.dropForeignKey("id_radicado", foreignKey);
            }
        }

        const columnExists2 = await queryRunner.hasColumn("carta_recobro", "id_usuario_solicita");
        if (columnExists2) {
            // Obtener la clave foránea asociada a 'id_diagnostico'
            const table = await queryRunner.getTable("carta_recobro");
            const foreignKey = table?.foreignKeys.find(
                (fk) => fk.columnNames.indexOf("id_usuario_solicita") !== -1
            );

            // Eliminar la clave foránea
            if (foreignKey) {
                await queryRunner.dropForeignKey("id_usuario_solicita", foreignKey);
            }
        }

        const columnExists3 = await queryRunner.hasColumn("carta_recobro", "id_usuario_audita");
        if (columnExists3) {
            // Obtener la clave foránea asociada a 'id_diagnostico'
            const table = await queryRunner.getTable("carta_recobro");
            const foreignKey = table?.foreignKeys.find(
                (fk) => fk.columnNames.indexOf("id_usuario_audita") !== -1
            );

            // Eliminar la clave foránea
            if (foreignKey) {
                await queryRunner.dropForeignKey("id_usuario_audita", foreignKey);
            }
        }

        await queryRunner.dropTable("carta_recobro");
    }
}