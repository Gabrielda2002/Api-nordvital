import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateTableNotificaciones1740768972191 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "notifications",
            columns: [
                {
                    name: "id",
                    type: "int",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment"
                },
                {
                    name: "user_id",
                    type: "int",
                    isNullable: false
                },
                {
                    name: "title",
                    type: "varchar",
                    length: "100",
                    isNullable: false
                },
                {
                    name: "message",
                    type: "text",
                    isNullable: false
                },
                {
                    name: "reference_id",
                    type: "int",
                    isNullable: true
                },
                {
                    name: "reference_type",
                    type: "varchar",
                    length: "50",
                    isNullable: true
                },
                {
                    name: "is_read",
                    type: "boolean",
                    default: false
                },
                {
                    name: "created_at",
                    type: "timestamp",
                    default: "CURRENT_TIMESTAMP"
                }
            ]
        }), true);

        await queryRunner.createForeignKey("notifications", new TableForeignKey({
            columnNames: ["user_id"],
            referencedColumnNames: ["IdUsuario"],
            referencedTableName: "usuario",
            onDelete: "CASCADE"
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable("notifications");
        const foreignKey = table?.foreignKeys.find(fk => fk.columnNames.indexOf("user_id") !== -1);
        if (foreignKey) {
            await queryRunner.dropForeignKey("notifications", foreignKey);
            await queryRunner.dropTable("notifications");
        }
    }
}