import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from "typeorm";

export class AlterTableRadicacion1726177365541 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn("radicacion", new TableColumn({
            name: "id_diagnostico",
            type: "int",
            isNullable: true
        }));

        await queryRunner.query(`
            UPDATE radicacion r
            SET id_diagnostico = (
                SELECT d.id
                FROM diagnostico d
                WHERE d.codigo = r.CodDiagnostico
            )
        `);

        // llave de radicacion a diagnostico
        await queryRunner.createForeignKey('radicacion', new TableForeignKey({
            columnNames: ['id_diagnostico'],
            referencedColumnNames: ['id'],
            referencedTableName: 'diagnostico',
            onDelete: 'CASCADE'
        }));


    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("radicacion", "id_diagnostico");

        await queryRunner.query(`
            UPDATE radicacion
            SET id_diagnostico = NULL
        `);

    }

}