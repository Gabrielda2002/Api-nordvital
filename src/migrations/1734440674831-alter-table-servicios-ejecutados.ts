import { MigrationInterface, QueryRunner, TableForeignKey } from "typeorm";

export class AlterTableServiciosEjecutados1734440674831 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        
        // cambiar el nombre de la columna convenio a id_convenio
        await queryRunner.query(`
            ALTER TABLE \`servicios_ejecutados\`
            CHANGE COLUMN \`convenio\` \`id_convenio\` INT NOT NULL
        `);

        //crear la llave foranea de la tabla servicios_ejecutados con convenios
        await queryRunner.createForeignKey('servicios_ejecutados', new TableForeignKey({
            columnNames: ['id_convenio'],
            referencedColumnNames: ['IdConvenio'],
            referencedTableName: 'convenio',
            onDelete: 'CASCADE'
        }))

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // cambiar el nombre de la columna id_convenio a convenio
        await queryRunner.query(`
            ALTER TABLE servicios_ejecutados 
            ADD COLUMN sede_atenc INT,
            CHANGE id_convenio convenio INT,
        `);

        //eliminar la llave foranea de la tabla servicios_ejecutados con convenios

        const columnExists = await queryRunner.hasColumn("servicios_ejecutados", "id_convenio");
        if (columnExists) {
            // Obtener la clave foránea asociada a 'id_diagnostico'
            const table = await queryRunner.getTable("servicios_ejecutados");
            const foreignKey = table?.foreignKeys.find(
                (fk) => fk.columnNames.indexOf("id_convenio") !== -1
            );

            // Eliminar la clave foránea
            if (foreignKey) {
                await queryRunner.dropForeignKey("id_convenio", foreignKey);
            }
        }

    }
}