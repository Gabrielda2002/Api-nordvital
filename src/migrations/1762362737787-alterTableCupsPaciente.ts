import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AlterTableCupsPaciente1762362737787 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Eliminar la columna CodigoCupsPacientes
    await queryRunner.dropColumn("cupspaciente", "CodigoCupsPacientes");

    // Eliminar la columna DescripcionCupsPacientes
    await queryRunner.dropColumn("cupspaciente", "DescripcionCupsPacientes");
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revertir: agregar la columna CodigoCupsPacientes
    await queryRunner.addColumn(
      "cupspaciente",
      new TableColumn({
        name: "CodigoCupsPacientes",
        type: "int",
        isNullable: false,
      })
    );

    // Revertir: agregar la columna DescripcionCupsPacientes
    await queryRunner.addColumn(
      "cupspaciente",
      new TableColumn({
        name: "DescripcionCupsPacientes",
        type: "varchar",
        length: "255",
        isNullable: false,
      })
    );
  }
}
