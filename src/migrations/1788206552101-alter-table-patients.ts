import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AlterTablePatients1788206552101 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn("patients", new TableColumn({
            name: "regime",
            type: "enum",
            enum: ["Subsidiado ", "Contributivo"],
            isNullable: true
        }
        ))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`patients\` DROP COLUMN \`regime\`
        `);
    }

}
