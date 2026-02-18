import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from "typeorm";

export class CreateMaintenanceAccessoryObservations1771434116253 implements MigrationInterface {
  name = "CreateMaintenanceAccessoryObservations1771434116253";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "maintenance_accessory_observations",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "monitoring_equipment_id",
            type: "int",
            isNullable: false,
          },
          {
            name: "accessory_id",
            type: "int",
            isNullable: false,
          },
          {
            name: "observation",
            type: "text",
            isNullable: true,
          },
          {
            name: "status_at_maintenance",
            type: "varchar",
            length: "255",
            isNullable: true,
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
          },
          {
            name: "updated_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
            onUpdate: "CURRENT_TIMESTAMP",
          },
        ],
      }),
      true
    );

    await queryRunner.createIndex(
      "maintenance_accessory_observations",
      new TableIndex({
        name: "UQ_seguimiento_accessory",
        columnNames: ["seguimiento_equipo_id", "accessory_id"],
        isUnique: true,
      })
    );

    await queryRunner.createForeignKey(
      "maintenance_accessory_observations",
      new TableForeignKey({
        name: "FK_maintenance_obs_seguimiento",
        columnNames: ["seguimiento_equipo_id"],
        referencedTableName: "seguimiento_equipos",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
      })
    );

    await queryRunner.createForeignKey(
      "maintenance_accessory_observations",
      new TableForeignKey({
        name: "FK_maintenance_obs_accessory",
        columnNames: ["accessory_id"],
        referencedTableName: "accesorios_equipos",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey("maintenance_accessory_observations", "FK_maintenance_obs_accessory");
    await queryRunner.dropForeignKey("maintenance_accessory_observations", "FK_maintenance_obs_seguimiento");
    await queryRunner.dropIndex("maintenance_accessory_observations", "UQ_seguimiento_accessory");
    await queryRunner.dropTable("maintenance_accessory_observations", true);
  }
}