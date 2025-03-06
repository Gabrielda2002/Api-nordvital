import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from "typeorm";

export class AlterTable0Municipios1741268039410 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add id_departamento column
        await queryRunner.addColumn(
            "municipio",
            new TableColumn({
                name: "id_departamento",
                type: "int",
                isNullable: false,
                default: 1
            })
        );

        // Create foreign key
        await queryRunner.createForeignKey(
            "municipio",
            new TableForeignKey({
                columnNames: ["id_departamento"],
                referencedTableName: "departamentos",
                referencedColumnNames: ["id"],
                onUpdate: "CASCADE"
            })
        );

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop the foreign key first
        const table = await queryRunner.getTable("municipios");
        const foreignKey = table?.foreignKeys.find(
            fk => fk.columnNames.indexOf("id_departamento") !== -1
        );

        if (foreignKey) {
            await queryRunner.dropForeignKey("municipios", foreignKey);
    
            // Then drop the column
            await queryRunner.dropColumn("municipios", "id_departamento");
        }
    }
}