import { MigrationInterface, QueryRunner } from "typeorm";

export class AllowMinimalPatientRegistration1794927748837 implements MigrationInterface {
  name = "AllowMinimalPatientRegistration1794927748837";

  private readonly columns = ["email", "address", "agreement_id", "ips_primary_id"];

  private async changeNullability(queryRunner: QueryRunner, isNullable: boolean): Promise<void> {
    const table = await queryRunner.getTable("patients");
    if (!table) throw new Error("No se encontró la tabla patients");

    const changes = this.columns.map((name) => {
      const oldColumn = table.findColumnByName(name);
      if (!oldColumn) throw new Error(`No se encontró la columna patients.${name}`);
      const newColumn = oldColumn.clone();
      newColumn.isNullable = isNullable;
      return { oldColumn, newColumn };
    });
    await queryRunner.changeColumns(table, changes);
  }

  public async up(queryRunner: QueryRunner): Promise<void> {
    await this.changeNullability(queryRunner, true);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const [result] = await queryRunner.query(
      "SELECT COUNT(*) AS incompleteCount FROM `patients` WHERE `email` IS NULL OR `address` IS NULL OR `agreement_id` IS NULL OR `ips_primary_id` IS NULL",
    );
    if (Number(result.incompleteCount) > 0) {
      throw new Error("Completa los datos pendientes de los pacientes antes de revertir la migración");
    }
    await this.changeNullability(queryRunner, false);
  }
}
