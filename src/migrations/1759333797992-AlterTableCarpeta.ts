import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey, TableIndex } from "typeorm";

export class AlterTableCarpeta1759333797992 implements MigrationInterface {
    name = 'AlterTableCarpeta1759333797992'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Paso 1: Agregar columna id_departamento con valor por defecto 1 y NOT NULL
        await queryRunner.addColumn(
            "carpetas",
            new TableColumn({
                name: "id_departamento",
                type: "int",
                isNullable: false,
                default: 1
            })
        );

        // Paso 2: Poblar id_departamento usando la relación municipio -> departamento
        // Solo actualiza las carpetas que tienen id_municipio asociado
        await queryRunner.query(`
            UPDATE carpetas c
            INNER JOIN municipio m ON c.id_municipio = m.IdMunicipio
            SET c.id_departamento = m.id_departamento
            WHERE c.id_municipio IS NOT NULL
        `);

        // Paso 3: Crear la foreign key para la relación con departamentos
        await queryRunner.createForeignKey(
            "carpetas",
            new TableForeignKey({
                columnNames: ["id_departamento"],
                referencedTableName: "departamentos",
                referencedColumnNames: ["id"],
                onDelete: "CASCADE",
                onUpdate: "CASCADE"
            })
        );

        // Paso 4: Crear índice en id_departamento para mejorar rendimiento de consultas
        await queryRunner.createIndex(
            "carpetas",
            new TableIndex({
                name: "IDX_carpetas_departamento",
                columnNames: ["id_departamento"]
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Eliminar el índice
        const indexExists = await queryRunner.getTable("carpetas");
        const hasIndex = indexExists?.indices.some(idx => idx.name === "IDX_carpetas_departamento");
        
        if (hasIndex) {
            await queryRunner.dropIndex("carpetas", "IDX_carpetas_departamento");
        }

        // Eliminar la foreign key
        const table = await queryRunner.getTable("carpetas");
        const foreignKey = table?.foreignKeys.find(
            fk => fk.columnNames.indexOf("id_departamento") !== -1
        );

        if (foreignKey) {
            await queryRunner.dropForeignKey("carpetas", foreignKey);
        }

        // Eliminar la columna id_departamento
        const columnExists = await queryRunner.hasColumn("carpetas", "id_departamento");
        if (columnExists) {
            await queryRunner.dropColumn("carpetas", "id_departamento");
        }
    }
}
