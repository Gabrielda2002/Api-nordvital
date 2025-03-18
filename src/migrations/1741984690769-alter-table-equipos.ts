import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from "typeorm";

export class AlterTableEquipos1741984690769 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add acta_id column to equipos table
        await queryRunner.addColumn(
            "equipos",
            new TableColumn({
                name: "acta_id",
                type: "int",
                isNullable: true, // Set to false if the column shouldn't allow null values
            })
        );

        // Create foreign key relationship with soportes table
        await queryRunner.createForeignKey(
            "equipos",
            new TableForeignKey({
                columnNames: ["acta_id"],
                referencedTableName: "soportes",
                referencedColumnNames: ["id"],
                onDelete: "SET NULL", // Options: CASCADE, SET NULL, NO ACTION, etc.
                onUpdate: "CASCADE"
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop the foreign key
        const table = await queryRunner.getTable("equipos");
        const foreignKey = table?.foreignKeys.find(
            (fk) => fk.columnNames.indexOf("acta_id") !== -1
        );
        if (foreignKey) {
            await queryRunner.dropForeignKey("equipos", foreignKey);
    
            // Drop the column
            await queryRunner.dropColumn("equipos", "acta_id");
        }
    }
}