import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateTablesRegistroEntrada1742905336658 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "registro_entrada",
                columns: [
                    {
                        name: "id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment",
                    },
                    {
                        name: "user_id",
                        type: "int",
                    },
                    {
                        name: "sede_id",
                        type: "int",
                    },
                    {
                        name: "fecha_registro",
                        type: "date",
                    },
                    {
                        name: "hora_registro",
                        type: "time",
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
                    },
                ],
            }),
            true
        );

        // Create foreign key for user_id
        await queryRunner.createForeignKey(
            "registro_entrada",
            new TableForeignKey({
                columnNames: ["user_id"],
                referencedColumnNames: ["IdUsuario"],
                referencedTableName: "usuario",
                onDelete: "CASCADE",
            })
        );

        // Create foreign key for sede_id
        await queryRunner.createForeignKey(
            "registro_entrada",
            new TableForeignKey({
                columnNames: ["sede_id"],
                referencedColumnNames: ["IdLugar"],
                referencedTableName: "sedes",
                onDelete: "CASCADE",
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // First drop foreign keys
        const table = await queryRunner.getTable("registro_entrada");
        const userForeignKey = table?.foreignKeys.find(
            (fk) => fk.columnNames.indexOf("user_id") !== -1
        );
        const sedeForeignKey = table?.foreignKeys.find(
            (fk) => fk.columnNames.indexOf("sede_id") !== -1
        );

        if (!userForeignKey || !sedeForeignKey) {
            throw new Error("Foreign keys not found");
        }

        await queryRunner.dropForeignKey("registro_entrada", userForeignKey);
        await queryRunner.dropForeignKey("registro_entrada", sedeForeignKey);
        
        // Then drop the table
        await queryRunner.dropTable("registro_entrada");
    }
}