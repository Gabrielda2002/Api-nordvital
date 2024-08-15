import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateTablesSsc1723755656508 implements MigrationInterface {
    name = 'CreateTablesSsc1723755656508'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // * Eliminar columna "Municipio" si existe en la tabla "archivo"
        const municipioColumnExists = await queryRunner.hasColumn("archivo", 'Municipio');
        if (municipioColumnExists) {
            const table = await queryRunner.getTable("archivo");
            const foreignKey = table?.foreignKeys.find(fk => fk.columnNames.indexOf("Municipio") !== -1);

            if (foreignKey) {
                await queryRunner.dropForeignKey("archivo", foreignKey);
            }
            
            await queryRunner.dropColumn("archivo", "Municipio");
        }

        // * Eliminar columna "Carpeta" si existe en la tabla "archivo"
        const carpetaColumnExists = await queryRunner.hasColumn("archivo", 'Carpeta');
        if (carpetaColumnExists) {
            const table = await queryRunner.getTable("archivo");
            const foreignKey = table?.foreignKeys.find(fk => fk.columnNames.indexOf("Carpeta") !== -1);

            if (foreignKey) {
                await queryRunner.dropForeignKey("archivo", foreignKey);
            }
            
            await queryRunner.dropColumn("archivo", "Carpeta");
        }

        // * eliminar campo municipios de protoformatos
        const columnExists3 = await queryRunner.hasColumn("protoformatos", "Municipio");

        if (columnExists3) {
            const table = await queryRunner.getTable("protoformatos");
            const foreignKey = table?.foreignKeys.find(fk => fk.columnNames.indexOf("Municipio") !== -1);

            if (foreignKey) {
                await queryRunner.dropForeignKey("protoformatos", foreignKey);
            }
            
            await queryRunner.dropColumn("protoformatos", "Municipio");
        }

        // * eliminar campo carpeta de protoformatos
        const columnExists4 = await queryRunner.hasColumn("protoformatos", "Carpeta");

        if (columnExists4) {
            const table = await queryRunner.getTable("protoformatos");
            const foreignKey = table?.foreignKeys.find(fk => fk.columnNames.indexOf("Carpeta") !== -1);

            if (foreignKey) {
                await queryRunner.dropForeignKey("protoformatos", foreignKey);
            }
            
            await queryRunner.dropColumn("protoformatos", "Carpeta");
        }

        // * eliminar  tabla "protoformatos" si existe

        const protoformatosTableExists = await queryRunner.hasTable("protoformatos");
        if (protoformatosTableExists) {
            await queryRunner.dropTable("protoformatos");
        }

        // * Eliminar tabla "archivo" si existe
        const archivoTableExists = await queryRunner.hasTable("archivo");
        if (archivoTableExists) {
            await queryRunner.dropTable("archivo");
        }
        // * Eliminar tabla "carpetas" si existe
        const carpetasTableExists = await queryRunner.hasTable("carpetas");
        if (carpetasTableExists) {
            await queryRunner.dropTable("carpetas");
        }

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // * Revertir los cambios, recreando las tablas eliminadas
        await queryRunner.createTable(new Table({
            name: "archivo",
            columns: [
                {
                    name: "id",
                    type: "int",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment"
                },
                {
                    name: "Municipio",
                    type: "varchar"
                },
                {
                    name: "Carpeta",
                    type: "varchar"
                }
            ]
        }), true);

        await queryRunner.createTable(new Table({
            name: "carpetas",
            columns: [
                {
                    name: "id",
                    type: "int",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment"
                },
                {
                    name: "Municipio",
                    type: "varchar"
                }
            ]
        }), true);

        // * Recrear llaves foráneas si es necesario
        await queryRunner.createForeignKey("archivo", new TableForeignKey({
            columnNames: ["Municipio"],
            referencedColumnNames: ["id"],
            referencedTableName: "municipios",
            onDelete: "CASCADE"
        }));

        await queryRunner.createForeignKey("archivo", new TableForeignKey({
            columnNames: ["Carpeta"],
            referencedColumnNames: ["id"],
            referencedTableName: "carpetas",
            onDelete: "CASCADE"
        }));
    }
}
