import { MigrationInterface, QueryRunner, TableForeignKey } from "typeorm";

export class AlterTableSedes1730824242884 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {

        // se actualiza la columna ciudad de la tabla sedes a 1 antes de cambiarle el tipo de dato
        await queryRunner.query(`UPDATE sedes SET ciudad = 1 WHERE ciudad = ''`);
        // se cambia el tipo de dato de la columna ciudad de la tabla sede
        await queryRunner.query(`ALTER TABLE sedes MODIFY COLUMN ciudad INT DEFAULT 1`);

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