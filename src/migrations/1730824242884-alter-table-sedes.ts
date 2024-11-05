import { MigrationInterface, QueryRunner, TableForeignKey } from "typeorm";

export class AlterTableSedes1730824242884 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query(`ALTER TABLE sedes MODIFY COLUMN ciudad INT`);

        await queryRunner.createForeignKey("sedes", new TableForeignKey({
            columnNames: ["ciudad"],
            referencedColumnNames: ["IdMunicipio"],
            referencedTableName: "municipio",
            onDelete: "CASCADE"
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query(`ALTER TABLE sedes MODIFY COLUMN ciudad VARCHAR(255)`);

        await queryRunner.dropForeignKey("sedes", "FK_sedes_municipios");
    }
}