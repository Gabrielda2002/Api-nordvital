import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AlterTableCertificados1728073479191 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn("certificados", new TableColumn({
            name: "nombre_guardado",
            type: "varchar(150)",
            isNullable: false
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("certificados", "nombre");
    }

}