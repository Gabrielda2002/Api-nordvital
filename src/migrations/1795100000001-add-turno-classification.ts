import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddTurnoClassification1795100000001 implements MigrationInterface {
  name = "AddTurnoClassification1795100000001";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "turnos",
      new TableColumn({
        name: "classification",
        type: "enum",
        enum: [
          "ASIGNACION_CITAS",
          "CONFIRMACION_CITAS",
          "TRAMITES_ADMINISTRATIVOS",
        ],
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("turnos", "classification");
  }
}
