import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from "typeorm";

export class AlterTableSedes1733176106124 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add new columns to usuario table
    // await queryRunner.addColumns("usuario", [
    //     new TableColumn({
    //         name: "area",
    //         type: "varchar",
    //         length: "100",
    //         isNullable: true
    //     }),
    //     new TableColumn({
    //         name: "cargo",
    //         type: "varchar",
    //         length: "200",
    //         isNullable: true
    //     }),
    //     new TableColumn({
    //         name: "sede_id",
    //         type: "int",
    //         isNullable: true
    //     }),
    //     new TableColumn({
    //         name: "celular",
    //         type: "bigint",
    //         isNullable: true
    //     })
    // ]);

    //eliminar campo fecha de la tabla usuario
    await queryRunner.dropColumn("usuario", "fecha");

    // Create foreign key for sede_id in usuario table
    await queryRunner.createForeignKey(
      "usuario",
      new TableForeignKey({
        columnNames: ["sede_id"],
        referencedColumnNames: ["IdLugar"],
        referencedTableName: "sedes",
        onDelete: "CASCADE",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign key for sede_id in usuario table
    const table = await queryRunner.getTable("usuario");
    const foreignKey = table?.foreignKeys.find(
      (fk) => fk.columnNames.indexOf("sede_id") !== -1
    );

    if (foreignKey) {
      await queryRunner.dropForeignKey("usuario", foreignKey);
    }

    // Drop new columns from usuario table
    await queryRunner.dropColumn("usuario", "celular");
    await queryRunner.dropColumn("usuario", "sede_id");
    await queryRunner.dropColumn("usuario", "cargo");
    await queryRunner.dropColumn("usuario", "area");

    // Drop numero_sede column from municipios table
    await queryRunner.dropColumn("municipios", "numero_sede");
  }
}
