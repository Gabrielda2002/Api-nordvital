import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AlterTableCirugias1730129592749 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumns("cirugias", [
            new TableColumn({
                name: "fecha_paraclinico",
                type: "date",
                isNullable: false,
            }),
            new TableColumn({
                name: "fecha_anesteciologia",
                type: "date",
                isNullable: false,
            }),
            new TableColumn({
                name: "especialista",
                type: "varchar",
                length: "255",
                isNullable: false,
            }),
        ]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("cirugias", "fecha_paraclinico");
        await queryRunner.dropColumn("cirugias", "fecha_anesteciologia");
        await queryRunner.dropColumn("cirugias", "especialista");
    }
}