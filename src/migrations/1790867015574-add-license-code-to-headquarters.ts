import { MigrationInterface, QueryRunner, TableColumn, TableIndex } from "typeorm";

export class AddLicenseCodeToHeadquarters1790867015574 implements MigrationInterface {
    name = "AddLicenseCodeToHeadquarters1790867015574";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            "headquarters",
            new TableColumn({
                name: "license_code",
                type: "varchar",
                length: "20",
                isNullable: true,
                comment: "Código de habilitación de la sede (REPS). Sus primeros 5 dígitos son el código Divipola del municipio.",
            })
        );

        await queryRunner.createIndex(
            "headquarters",
            new TableIndex({
                name: "IDX_headquarters_license_code",
                columnNames: ["license_code"],
                isUnique: true,
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropIndex("headquarters", "IDX_headquarters_license_code");
        await queryRunner.dropColumn("headquarters", "license_code");
    }
}
