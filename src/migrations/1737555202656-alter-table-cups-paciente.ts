import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AlterTableCupsPaciente1737555202656 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn("cupspaciente", new TableColumn({
            name: "cantidad",
            type: "int",
            isNullable: false,
            default: 1
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("cupspaciente", "cantidad");
    }

}