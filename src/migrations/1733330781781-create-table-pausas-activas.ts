import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateTablePausasActivas1733330781781 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "pausas_activas",
                columns: [
                    {
                        name: "id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment",
                    },
                    {
                        name: "observacion",
                        type: "text",
                        isNullable: true,
                    },
                    {
                        name: "usuario_id",
                        type: "int",
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
            "pausas_activas",
            new TableForeignKey({
                columnNames: ["usuario_id"],
                referencedColumnNames: ["IdUsuario"],
                referencedTableName: "usuario",
                onDelete: "CASCADE",
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable("pausas_activas");
        const foreignKey = table?.foreignKeys.find(
            (fk) => fk.columnNames.indexOf("usuario_id") !== -1
        );
        if (foreignKey) {
            await queryRunner.dropForeignKey("pausas_activas", foreignKey);
        }
        
        await queryRunner.dropTable("pausas_activas");
    }
}