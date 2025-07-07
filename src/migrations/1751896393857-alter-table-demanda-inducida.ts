import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AlterTableDemandaInducidaAddNumerosContacto1751896393857 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn("demanda_inducida", new TableColumn({
            name: "numeros_contacto",
            type: "text",
            isNullable: false,
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("demanda_inducida", "numeros_contacto");
    }
}