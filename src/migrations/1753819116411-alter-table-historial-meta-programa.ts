import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey, TableIndex } from "typeorm";

export class AlterTableHistorialMetaPrograma1753819116411 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // 1. Insertar el nuevo rol "Líder Enfermería" en la tabla rol
        // await queryRunner.query(`
        //     INSERT INTO rol (TipoRol)
        //     VALUES ('Líder Enfermería')
        // `);

        // 2. Agregar la columna sede_id a la tabla programa_meta_historico
        await queryRunner.addColumn(
            "programa_meta_historico",
            new TableColumn({
                name: "sede_id",
                type: "int",
                isNullable: false,
                default: 1,
            })
        );

        // 3. Obtener información sobre las claves foráneas existentes
        const table = await queryRunner.getTable("programa_meta_historico");
        const programaForeignKey = table?.foreignKeys.find(fk => 
            fk.columnNames.includes("programa_id")
        );

        // 4. Si existe la clave foránea del programa, eliminarla temporalmente
        if (programaForeignKey) {
            await queryRunner.dropForeignKey("programa_meta_historico", programaForeignKey);
        }

        // 5. Eliminar el índice único actual
        await queryRunner.dropIndex("programa_meta_historico", "IDX_programa_meta_año_mes_profesional");

        // 6. Crear la nueva clave foránea para sede_id
        await queryRunner.createForeignKey(
            "programa_meta_historico",
            new TableForeignKey({
                columnNames: ["sede_id"],
                referencedTableName: "sedes",
                referencedColumnNames: ["IdLugar"],
                onDelete: "CASCADE",
                onUpdate: "CASCADE",
            })
        );

        // 7. Crear el nuevo índice único que incluye sede_id
        await queryRunner.createIndex(
            "programa_meta_historico",
            new TableIndex({
                name: "IDX_programa_meta_año_mes_profesional_sede",
                columnNames: ["programa_id", "año", "mes", "profesional", "sede_id"],
                isUnique: true, // Un programa solo puede tener una meta por mes por profesional por sede
            })
        );

        // 8. Restaurar la clave foránea del programa
        if (programaForeignKey) {
            await queryRunner.createForeignKey("programa_meta_historico", programaForeignKey);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // 1. Obtener información sobre las claves foráneas
        const table = await queryRunner.getTable("programa_meta_historico");
        const programaForeignKey = table?.foreignKeys.find(fk => 
            fk.columnNames.includes("programa_id")
        );
        const sedeForeignKey = table?.foreignKeys.find(fk => 
            fk.columnNames.includes("sede_id")
        );

        // 2. Eliminar claves foráneas temporalmente
        if (programaForeignKey) {
            await queryRunner.dropForeignKey("programa_meta_historico", programaForeignKey);
        }
        if (sedeForeignKey) {
            await queryRunner.dropForeignKey("programa_meta_historico", sedeForeignKey);
        }

        // 3. Eliminar el nuevo índice
        await queryRunner.dropIndex("programa_meta_historico", "IDX_programa_meta_año_mes_profesional_sede");

        // 4. Restaurar el índice anterior (sin sede_id)
        await queryRunner.createIndex(
            "programa_meta_historico",
            new TableIndex({
                name: "IDX_programa_meta_año_mes_profesional",
                columnNames: ["programa_id", "año", "mes", "profesional"],
                isUnique: true,
            })
        );

        // 5. Restaurar la clave foránea del programa
        if (programaForeignKey) {
            await queryRunner.createForeignKey("programa_meta_historico", programaForeignKey);
        }

        // 6. Eliminar la columna sede_id
        await queryRunner.dropColumn("programa_meta_historico", "sede_id");

        // 7. Eliminar el rol "Líder Enfermería"
        await queryRunner.query(`
            DELETE FROM rol WHERE TipoRol = 'Líder Enfermería'
        `);
    }
}
