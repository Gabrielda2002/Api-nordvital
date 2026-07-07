import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from "typeorm";

export class AlterTableDemandaInducida1783012486625 implements MigrationInterface {
    name = "AlterTableDemandaInducida1783012486625";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn('demanda_inducida', new TableColumn({
            name: 'headquarters_id',
            type: 'int',
            isNullable: true,
        }));

        await queryRunner.query(`
            UPDATE demanda_inducida di
            JOIN users u ON u.id = di.persona_seguimiento_id
            SET di.headquarters_id = u.headquarter_id
        `);

        await queryRunner.query(`
            UPDATE demanda_inducida
            SET headquarters_id = (
                SELECT headquarter_id FROM users WHERE users.id = demanda_inducida.persona_seguimiento_id LIMIT 1
            )
            WHERE headquarters_id IS NULL
        `);

        await queryRunner.changeColumn('demanda_inducida', 'headquarters_id', new TableColumn({
            name: 'headquarters_id',
            type: 'int',
            isNullable: false,
        }));

        await queryRunner.createForeignKey('demanda_inducida', new TableForeignKey({
            columnNames: ['headquarters_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'headquarters',
            onDelete: 'RESTRICT',
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Obtener la clave foránea existente
        const table = await queryRunner.getTable('demanda_inducida');
        const foreignKey = table?.foreignKeys.find(fk => fk.columnNames.indexOf('headquarters_id') !== -1);
        if (foreignKey) {
            await queryRunner.dropForeignKey('demanda_inducida', foreignKey);
        }
        await queryRunner.dropColumn('demanda_inducida', 'headquarters_id');
    }
}