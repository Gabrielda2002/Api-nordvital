import { MigrationInterface, QueryRunner, TableForeignKey } from "typeorm";

export class AlterTableCupspaciente1737391079113 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        
        const columnExists = await queryRunner.hasColumn('seguimientoauxiliar', 'Radicacion')

        if (columnExists) {
            const table = await queryRunner.getTable('seguimientoauxiliar');

            const foreignKey = table?.foreignKeys.find(fk => fk.columnNames.indexOf('Radicacion') !== -1);

            if (foreignKey) {
                await queryRunner.dropForeignKey('seguimientoauxiliar', foreignKey);
            }

            await queryRunner.query('ALTER TABLE \`seguimientoauxiliar\` CHANGE COLUMN \`Radicacion\` \`id_cups_radicados\` INT NOT NULL');

        }

        await queryRunner.createForeignKey('seguimientoauxiliar', new TableForeignKey({
            columnNames: ['id_cups_radicados'],
            referencedColumnNames: ['IdCups'],
            referencedTableName: 'cupspaciente',
            onDelete: 'CASCADE'
        }))

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE seguimientoauxiliar RENAME COLUMN id_radicacion TO Radicacion`);
    }
}