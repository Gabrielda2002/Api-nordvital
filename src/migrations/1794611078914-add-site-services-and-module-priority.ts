import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
  TableIndex,
} from "typeorm";

export class AddSiteServicesAndModulePriority1794611078914 implements MigrationInterface {
  name = "AddSiteServicesAndModulePriority1794611078914";

  public async up(queryRunner: QueryRunner): Promise<void> {
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

    await queryRunner.createTable(
      new Table({
        name: "site_services",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          { name: "headquarter_id", type: "int", isNullable: false },
          { name: "service_id", type: "int", isNullable: false },
          {
            name: "created_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
            isNullable: false,
          },
        ],
        indices: [
          new TableIndex({
            name: "uq_site_services_pair",
            columnNames: ["headquarter_id", "service_id"],
            isUnique: true,
          }),
          new TableIndex({
            name: "idx_site_services_service",
            columnNames: ["service_id"],
          }),
        ],
      }),
    );

    await queryRunner.createForeignKeys("site_services", [
      new TableForeignKey({
        name: "fk_site_services_headquarter",
        columnNames: ["headquarter_id"],
        referencedTableName: "headquarters",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      }),
      new TableForeignKey({
        name: "fk_site_services_service",
        columnNames: ["service_id"],
        referencedTableName: "attention_services",
        referencedColumnNames: ["id"],
        onDelete: "RESTRICT",
        onUpdate: "CASCADE",
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("site_services", true);
    await queryRunner.dropColumn("turnos_modulos", "is_priority");
  }
}
