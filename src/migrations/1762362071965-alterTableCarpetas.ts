import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from "typeorm";

export class AlterTableCarpetas1762362071965 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Primero eliminar la clave foránea
    const table = await queryRunner.getTable("carpetas");
    const foreignKey = table?.foreignKeys.find(
      (fk) => fk.columnNames.indexOf("id_municipio") !== -1
    );

    if (foreignKey) {
      await queryRunner.dropForeignKey("carpetas", foreignKey);
    }

    // Luego eliminar la columna
    await queryRunner.dropColumn("carpetas", "id_municipio");
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revertir: primero agregar la columna
    await queryRunner.addColumn(
      "carpetas",
      new TableColumn({
        name: "id_municipio",
        type: "int",
        isNullable: true,
      })
    );

    // Luego recrear la clave foránea
    await queryRunner.createForeignKey(
      "carpetas",
      new TableForeignKey({
        columnNames: ["id_municipio"],
        referencedTableName: "municipio",
        referencedColumnNames: ["IdMunicipio"],
        onDelete: "CASCADE",
      })
    );
  }
}
