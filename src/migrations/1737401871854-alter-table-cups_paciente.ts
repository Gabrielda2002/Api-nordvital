import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AlterTableCupsPaciente1737401871854 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            "ALTER TABLE `cupspaciente` CHANGE `observacionCups` `observacionCups` VARCHAR(500) NOT NULL"
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.changeColumn("cupspaciente", "observacionCups", new TableColumn({
            name: "observacionCups",
            type: "varchar",
            length: "255", // Assuming the original length was 255, adjust if different
        }));
    }
}