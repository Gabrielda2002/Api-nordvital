import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateTableEventos1733755375012 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "eventos",
                columns: [
                    {
                        name: "id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment",
                    },
                    {
                        name: "titulo",
                        type: "varchar",
                    },
                    {
                        name: "fecha_inicio",
                        type: "date",
                    },
                    {
                        name: "fecha_fin",
                        type: "date",
                    },
                    {
                        name: "descripcion",
                        type: "text",
                    },
                    {
                        name: "color",
                        type: "varchar",
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
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("eventos");
    }
}