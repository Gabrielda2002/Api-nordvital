import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateTableDepartamentos1730835815294 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query(`ALTER TABLE sedes MODIFY COLUMN departamento int DEFAULT 1`);

        await queryRunner.createTable(new Table({
            name: "departamentos",
            columns: [
                {
                    name: "id",
                    type: "int",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment"
                },
                {
                    name: "nombre",
                    type: "varchar",
                    isNullable: false
                },
                {
                    name: "created_at",
                    type: "timestamp",
                    default: "CURRENT_TIMESTAMP"
                },
                {
                    name: "updated_at",
                    type: "timestamp",
                    default: "CURRENT_TIMESTAMP"
                }
            ]
        }), true);

        await queryRunner.query(`INSERT INTO departamentos (nombre) VALUES ('Norte de Santander'), ('Cundinamarca'), ('Amazonas')`);

        await queryRunner.createForeignKey("sedes", new TableForeignKey({
            columnNames: ["departamento"],
            referencedColumnNames: ["id"],
            referencedTableName: "departamentos",
            onDelete: "CASCADE"
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("departamentos");
    }
}