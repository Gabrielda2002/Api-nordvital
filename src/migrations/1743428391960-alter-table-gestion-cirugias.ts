import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from "typeorm";

export class AlterTableGestionCirugias1743428391960 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add usuario_id column
        await queryRunner.addColumn(
            "gestion_auxiliar_cirugias",
            new TableColumn({
                name: "usuario_id",
                type: "int",
                isNullable: true,
            })
        );

        // Create foreign key
        await queryRunner.createForeignKey(
            "gestion_auxiliar_cirugias",
            new TableForeignKey({
                columnNames: ["usuario_id"],
                referencedColumnNames: ["IdUsuario"],
                referencedTableName: "usuario",
                onDelete: "SET NULL",
                onUpdate: "CASCADE"
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop foreign key
        const table = await queryRunner.getTable("gestion_auxiliar_cirugias");
        const foreignKey = table?.foreignKeys.find(fk => fk.columnNames.indexOf("usuario_id") !== -1);
        if (foreignKey) {
            await queryRunner.dropForeignKey("gestion_auxiliar_cirugias", foreignKey);
        }

        // Drop column
        await queryRunner.dropColumn("gestion_auxiliar_cirugias", "usuario_id");
    }
}