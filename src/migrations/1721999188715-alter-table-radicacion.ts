
import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from "typeorm";

export class alterTalePacientes1721999188715 implements MigrationInterface {
    name = 'alterTalePacientes1721999188715'

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.addColumn('radicacion', new TableColumn({
            name: 'Paciente_id',
            type: 'int',
            isNullable: true
        }));

        await queryRunner.createForeignKey('radicacion', new TableForeignKey({
            columnNames: ['Paciente_id'],
            referencedColumnNames: ['IdUsuarios'],
            referencedTableName: 'pacientes',
            onDelete: 'SET NULL'
        }));

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Obtener la clave foránea existente
        const table = await queryRunner.getTable('radicacion');
        const foreignKey = table?.foreignKeys.find(fk => fk.columnNames.indexOf('Paciente_id') !== -1);

        // Eliminar la clave foránea
        if (foreignKey) {
            await queryRunner.dropForeignKey('radicacion', foreignKey);
        }

        // Eliminar la columna
        await queryRunner.dropColumn('radicacion', 'Paciente_id');
    }

}
