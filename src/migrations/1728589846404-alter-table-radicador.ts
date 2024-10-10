import { MigrationInterface, QueryRunner, TableForeignKey } from "typeorm";

export class AlterTableRadicador1728589846404 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Verificar si la columna 'QuienRadica' existe y eliminar la llave foránea si es necesario
    const unidadFuncionalExist = await queryRunner.hasColumn(
      "radicacion",
      "QuienRadica"
    );
    if (unidadFuncionalExist) {
      const table = await queryRunner.getTable("radicacion");
      const foreignKey = table?.foreignKeys.find(
        (fk) => fk.columnNames.indexOf("QuienRadica") !== -1
      );

      if (foreignKey) {
        await queryRunner.dropForeignKey("radicacion", foreignKey);
      }
    }

    // Crear nueva llave foránea que apunta a la tabla 'usuario'
    await queryRunner.createForeignKey(
      "radicacion",
      new TableForeignKey({
        columnNames: ["QuienRadica"],
        referencedTableName: "usuario",
        referencedColumnNames: ["IdUsuario"],
        onDelete: "CASCADE",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Crear la relación de 'radicacion' con 'radicador'
    await queryRunner.createForeignKey(
      "radicacion",
      new TableForeignKey({
        columnNames: ["QuienRadica"],
        referencedTableName: "radicador",
        referencedColumnNames: ["IdRadicador"],
        onDelete: "CASCADE",
      })
    );

    // Verificar si la columna 'QuienRadica' existe y eliminar la llave foránea si es necesario
    const unidadFuncionalExist = await queryRunner.hasColumn(
      "radicacion",
      "QuienRadica"
    );
    if (unidadFuncionalExist) {
      const table = await queryRunner.getTable("radicacion");
      const foreignKey = table?.foreignKeys.find(
        (fk) => fk.columnNames.indexOf("QuienRadica") !== -1
      );

      if (foreignKey) {
        await queryRunner.dropForeignKey("radicacion", foreignKey);
      }
    }
  }
}
