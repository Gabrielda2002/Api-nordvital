import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from "typeorm";

export class AlterTableDemandaInducidaProgramaId1751557242187 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // 1. Eliminar la columna 'programa'
        await queryRunner.dropColumn("demanda_inducida", "programa");

        // 2. Agregar la columna 'programa_id' de tipo int, nullable
        await queryRunner.addColumn(
            "demanda_inducida",
            new TableColumn({
                name: "programa_id",
                type: "int",
                isNullable: true,
            })
        );

        // 3. Crear la relación foránea con la tabla 'programa'
        await queryRunner.createForeignKey(
            "demanda_inducida",
            new TableForeignKey({
                columnNames: ["programa_id"],
                referencedTableName: "programa",
                referencedColumnNames: ["id"],
                onDelete: "SET NULL",
            onUpdate: "CASCADE",
            })
        );

        await queryRunner.query(
            `DELETE FROM tipo_demanda_inducida WHERE id IN (3, 4)`
        );

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // 1. Eliminar la relación foránea
        const table = await queryRunner.getTable("demanda_inducida");
        const foreignKey = table?.foreignKeys.find(
            fk => fk.columnNames.indexOf("programa_id") !== -1
        );
        if (foreignKey) {
            await queryRunner.dropForeignKey("demanda_inducida", foreignKey);
        }

        // 2. Eliminar la columna 'programa_id'
        await queryRunner.dropColumn("demanda_inducida", "programa_id");

        // 3. Volver a crear la columna 'programa' de tipo varchar(60), nullable
        await queryRunner.addColumn(
            "demanda_inducida",
            new TableColumn({
                name: "programa",
                type: "varchar",
                length: "60",
                isNullable: true,
            })
        );
    }
}