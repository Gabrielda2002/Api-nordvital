import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from "typeorm";

export class AlterTableSeguimientoAuxiliar1732806548976 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            'seguimientoauxiliar',
            new TableColumn({
                name: 'usuario_id',
                type: 'int',
                isNullable: true,
            })
        );

        await queryRunner.createForeignKey(
            'seguimientoauxiliar',
            new TableForeignKey({
                columnNames: ['usuario_id'],
                referencedColumnNames: ['IdUsuario'],
                referencedTableName: 'usuario',
                onDelete: 'CASCADE',
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey('seguimientoauxiliar', 'FK_seguimientoauxiliar_usuario');
        await queryRunner.dropColumn('seguimientoauxiliar', 'usuario_id');
    }
}
