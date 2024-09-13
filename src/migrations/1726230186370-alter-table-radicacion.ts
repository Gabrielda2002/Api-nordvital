import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AlterTableRadicacion1726230186370 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('radicacion', 'CodDiagnostico');
        await queryRunner.dropColumn('radicacion', 'DescripcionDiagnostico');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn('radicacion', new TableColumn({
            name: 'CodDiagnostico',
            type: 'varchar',
            isNullable: true
        }));
        await queryRunner.addColumn('radicacion', new TableColumn({
            name: 'DescripcionDiagnostico',
            type: 'varchar',
            isNullable: true
        }));
    }
}