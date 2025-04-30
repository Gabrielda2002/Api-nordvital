import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AlterTableNotaTecnica1746018747327 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn("notas_tecnicas", new TableColumn({
            name: "estado",
            type: "tinyint",
            isNullable: false,
            default: 1,
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("notas_tecnicas", "estado");
    }
}