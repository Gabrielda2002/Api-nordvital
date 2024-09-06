import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from "typeorm";

export class AlterTableCarpetas1725651867417 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Agregar la columna id_municipio a la tabla carpetas
    await queryRunner.addColumn(
      "carpetas",
      new TableColumn({
        name: "id_municipio",
        type: "int",
        isNullable: true,
      })
    );;
    // Crear la clave foránea para la relación con la tabla municipios
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

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Eliminar la clave foránea
    const municipioExist = await queryRunner.hasColumn(
      "carpetas",
      "id_municipio"
    );
    if (municipioExist) {
      const table = await queryRunner.getTable("carpetas");
      const foreignKey = table?.foreignKeys.find(
        (fk) => fk.columnNames.indexOf("id_municipio") !== -1
      );

      if (foreignKey) {
        await queryRunner.dropForeignKey("carpetas", foreignKey);
      }

      await queryRunner.dropColumn("carpetas", "id_municipio");
    }
  }
}
