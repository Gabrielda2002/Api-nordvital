import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AlterTableTicketsAddRemoto1747751698247 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn("tickets", new TableColumn({
            name: "remoto",
            type: "tinyint",
            width: 1,
            isNullable: false,
            default: 0, // 0 = false, 1 = true
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("tickets", "remoto");
    }
}