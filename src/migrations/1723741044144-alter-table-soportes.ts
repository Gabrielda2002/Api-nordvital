import { MigrationInterface, QueryRunner, TableForeignKey } from "typeorm";

export class AlterTableSoportes1723741044144 implements MigrationInterface {
    name = 'AlterTableSoportes1723741044144'

    public async up(queryRunner: QueryRunner): Promise<void> {

        // * Verificar si la columna "id_radicacion" existe en la tabla "soportes"
        const columnExists = await queryRunner.hasColumn("soportes", "id_radicacion");
        
        if (columnExists) {
            // * Verificar si la llave foránea existe en la tabla "soportes"
            const table = await queryRunner.getTable("soportes");
            const foreignKey = table?.foreignKeys.find(fk => fk.columnNames.indexOf("id_radicacion") !== -1);

            if (foreignKey) {
                // * Si la llave foránea existe, eliminarla
                await queryRunner.dropForeignKey("soportes", foreignKey);
            }

            // * Si la columna existe, eliminarla
            await queryRunner.dropColumn("soportes", "id_radicacion");
        }

        // * Crear la columna y la llave foránea en la tabla "radicacion"
        const soporteColumnExists = await queryRunner.hasColumn("radicacion", "id_soportes");
        if (!soporteColumnExists) {
            await queryRunner.query('ALTER TABLE `radicacion` ADD `id_soportes` int');
        }

        const soporteForeignKey = await queryRunner.getTable("radicacion").then(table =>
            table?.foreignKeys.find(fk => fk.columnNames.indexOf("id_soportes") !== -1)
        );

        if (!soporteForeignKey) {
            await queryRunner.query(`
                ALTER TABLE \`radicacion\` 
                ADD CONSTRAINT \`FK_562879cc83c074dc6dd614844b1\` 
                FOREIGN KEY (\`id_soportes\`) 
                REFERENCES \`soportes\`(\`id\`) 
                ON DELETE CASCADE
            `);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // * Revertir los cambios en la tabla radicacion
        const soporteForeignKey = await queryRunner.getTable("radicacion").then(table =>
            table?.foreignKeys.find(fk => fk.columnNames.indexOf("id_soportes") !== -1)
        );
        if (soporteForeignKey) {
            await queryRunner.query('ALTER TABLE `radicacion` DROP CONSTRAINT `FK_562879cc83c074dc6dd614844b1`');
        }

        const soporteColumnExists = await queryRunner.hasColumn("radicacion", "id_soportes");
        if (soporteColumnExists) {
            await queryRunner.query('ALTER TABLE `radicacion` DROP COLUMN `id_soportes`');
        }

        // * Revertir la eliminación de la columna y la llave foránea en la tabla "soportes"
        const columnExists = await queryRunner.hasColumn("soportes", "id_radicacion");
        if (!columnExists) {
            await queryRunner.query('ALTER TABLE `soportes` ADD `id_radicacion` int');
        }

        const table = await queryRunner.getTable("soportes");
        const foreignKey = table?.foreignKeys.find(fk => fk.columnNames.indexOf("id_radicacion") !== -1);

        if (!foreignKey) {
            await queryRunner.query(`
                ALTER TABLE \`soportes\` 
                ADD CONSTRAINT \`FK_562879cc83c074dc6dd614844b1\` 
                FOREIGN KEY (\`id_radicacion\`) 
                REFERENCES \`radicacion\`(\`id\`) 
                ON DELETE CASCADE
            `);
        }
    }
}
