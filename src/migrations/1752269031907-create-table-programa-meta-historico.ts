import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from "typeorm";

export class CreateTableProgramaMetaHistorico1752269031907 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "programa_meta_historico",
                columns: [
                    {
                        name: "id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment",
                    },
                    {
                        name: "programa_id",
                        type: "int",
                        isNullable: false,
                    },
                    {
                        name: "meta",
                        type: "int",
                        isNullable: false,
                    },
                    {
                        name: "año",
                        type: "int",
                        isNullable: false,
                    },
                    {
                        name: "mes",
                        type: "int",
                        isNullable: false,
                    },
                    {
                        name: "activo",
                        type: "boolean",
                        default: true,
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

        // Crear la relación foránea
        await queryRunner.createForeignKey(
            "programa_meta_historico",
            new TableForeignKey({
                columnNames: ["programa_id"],
                referencedTableName: "programa",
                referencedColumnNames: ["id"],
                onDelete: "CASCADE",
                onUpdate: "CASCADE",
            })
        );

        // Crear índices para optimizar consultas
        await queryRunner.createIndex(
            "programa_meta_historico",
            new TableIndex({
                name: "IDX_programa_meta_año_mes",
                columnNames: ["programa_id", "año", "mes"],
                isUnique: true, // Un programa solo puede tener una meta por mes
            })
        );

        await queryRunner.createIndex(
            "programa_meta_historico",
            new TableIndex({
                name: "IDX_meta_fecha",
                columnNames: ["año", "mes"],
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable("programa_meta_historico");
        if (table) {
            const foreignKeys = table.foreignKeys;
            for (const foreignKey of foreignKeys) {
                await queryRunner.dropForeignKey("programa_meta_historico", foreignKey);
            }
        }
        
        await queryRunner.dropIndex("programa_meta_historico", "IDX_programa_meta_año_mes");
        await queryRunner.dropIndex("programa_meta_historico", "IDX_meta_fecha");
        await queryRunner.dropTable("programa_meta_historico");
    }
}