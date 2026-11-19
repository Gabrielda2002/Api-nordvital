import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class RemoveModulePriority1795100000000 implements MigrationInterface {
  name = "RemoveModulePriority1795100000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("turnos_modulos", "is_priority");
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "turnos_modulos",
      new TableColumn({
        name: "is_priority",
        type: "tinyint",
        width: 1,
        default: 0,
        isNullable: false,
      }),
    );
  }
}
