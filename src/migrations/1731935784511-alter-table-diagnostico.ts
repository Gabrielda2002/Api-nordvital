import { MigrationInterface, QueryRunner, TableForeignKey } from "typeorm";

export class AlterTableDiagnostico1731935784511 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Verificar si existe la columna 'id_diagnostico' y su clave foránea
        const columnExists = await queryRunner.hasColumn("radicacion", "id_diagnostico");
        if (columnExists) {
            // Obtener la clave foránea asociada a 'id_diagnostico'
            const table = await queryRunner.getTable("radicacion");
            const foreignKey = table?.foreignKeys.find(
                (fk) => fk.columnNames.indexOf("id_diagnostico") !== -1
            );

            // Eliminar la clave foránea
            if (foreignKey) {
                await queryRunner.dropForeignKey("radicacion", foreignKey);
            }
        }

        // Modificar la columna 'id' en la tabla 'diagnostico'
        await queryRunner.query(`
            ALTER TABLE diagnostico
            MODIFY COLUMN id INT AUTO_INCREMENT
        `);

        // Volver a agregar la clave foránea en 'radicacion'
        await queryRunner.createForeignKey(
            "radicacion",
            new TableForeignKey({
                columnNames: ["id_diagnostico"],
                referencedTableName: "diagnostico",
                referencedColumnNames: ["id"],
                onDelete: "CASCADE", // Ajusta según tu lógica de negocio
                onUpdate: "CASCADE",
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Verificar si existe la columna 'id_diagnostico' y su clave foránea
        const columnExists = await queryRunner.hasColumn("radicacion", "id_diagnostico");
        if (columnExists) {
            // Obtener la clave foránea asociada a 'id_diagnostico'
            const table = await queryRunner.getTable("radicacion");
            const foreignKey = table?.foreignKeys.find(
                (fk) => fk.columnNames.indexOf("id_diagnostico") !== -1
            );

            // Eliminar la clave foránea
            if (foreignKey) {
                await queryRunner.dropForeignKey("radicacion", foreignKey);
            }
        }

        // Revertir el cambio en la columna 'id'
        await queryRunner.query(`
            ALTER TABLE diagnostico
            MODIFY COLUMN id INT NOT NULL
        `);

        // Volver a agregar la clave foránea en 'radicacion'
        await queryRunner.createForeignKey(
            "radicacion",
            new TableForeignKey({
                columnNames: ["id_diagnostico"],
                referencedTableName: "diagnostico",
                referencedColumnNames: ["id"],
                onDelete: "CASCADE", // Ajusta según tu lógica de negocio
                onUpdate: "CASCADE",
            })
        );
    }
}
