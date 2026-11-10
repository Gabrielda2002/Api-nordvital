import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from "typeorm";

export class CreateTurnosModule1793892000000 implements MigrationInterface {
  name = "CreateTurnosModule1793892000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Limpieza preventiva si un intento previo falló a mitad de ejecución (DDL no transaccional en MySQL)
    await queryRunner.dropTable("turnos_encuestas", true, true, true);
    await queryRunner.dropTable("turno_tracking", true, true, true);
    await queryRunner.dropTable("turnos", true, true, true);
    await queryRunner.dropTable("turnos_sesiones_servicios", true, true, true);
    await queryRunner.dropTable("turnos_sesiones_atencion", true, true, true);
    await queryRunner.dropTable("turnos_modulos", true, true, true);
    await queryRunner.dropTable("turno_sedes_config", true, true, true);

    // 1. turno_sedes_config
    await queryRunner.createTable(
      new Table({
        name: "turno_sedes_config",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "headquarter_id",
            type: "int",
            isNullable: false,
          },
          {
            name: "slug",
            type: "varchar",
            length: "100",
            isUnique: true,
            isNullable: false,
          },
          {
            name: "latitude",
            type: "decimal",
            precision: 10,
            scale: 8,
            isNullable: false,
          },
          {
            name: "longitude",
            type: "decimal",
            precision: 11,
            scale: 8,
            isNullable: false,
          },
          {
            name: "geo_radius_meters",
            type: "int",
            default: 150,
            isNullable: false,
          },
          {
            name: "is_enabled",
            type: "tinyint",
            width: 1,
            default: 1,
            isNullable: false,
          },
          {
            name: "average_service_minutes",
            type: "int",
            default: 10,
            isNullable: false,
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
      true,
    );

    await queryRunner.createForeignKey(
      "turno_sedes_config",
      new TableForeignKey({
        name: "fk_turno_sedes_config_headquarter",
        columnNames: ["headquarter_id"],
        referencedTableName: "headquarters",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      }),
    );

    // 2. turnos_modulos
    await queryRunner.createTable(
      new Table({
        name: "turnos_modulos",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "headquarter_id",
            type: "int",
            isNullable: false,
          },
          {
            name: "code",
            type: "varchar",
            length: "20",
            isNullable: false,
          },
          {
            name: "name",
            type: "varchar",
            length: "100",
            isNullable: false,
          },
          {
            name: "is_active",
            type: "tinyint",
            width: 1,
            default: 1,
            isNullable: false,
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
      true,
    );

    await queryRunner.createForeignKey(
      "turnos_modulos",
      new TableForeignKey({
        name: "fk_turnos_modulos_headquarter",
        columnNames: ["headquarter_id"],
        referencedTableName: "headquarters",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      }),
    );

    // 3. turnos_sesiones_atencion
    await queryRunner.createTable(
      new Table({
        name: "turnos_sesiones_atencion",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "user_id",
            type: "int",
            isNullable: false,
          },
          {
            name: "modulo_id",
            type: "int",
            isNullable: false,
          },
          {
            name: "headquarter_id",
            type: "int",
            isNullable: false,
          },
          {
            name: "started_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
            isNullable: false,
          },
          {
            name: "ended_at",
            type: "timestamp",
            isNullable: true,
          },
          {
            name: "is_active",
            type: "tinyint",
            width: 1,
            default: 1,
            isNullable: false,
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
      true,
    );

    await queryRunner.createForeignKey(
      "turnos_sesiones_atencion",
      new TableForeignKey({
        name: "fk_turnos_sesiones_user",
        columnNames: ["user_id"],
        referencedTableName: "users",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      }),
    );

    await queryRunner.createForeignKey(
      "turnos_sesiones_atencion",
      new TableForeignKey({
        name: "fk_turnos_sesiones_modulo",
        columnNames: ["modulo_id"],
        referencedTableName: "turnos_modulos",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      }),
    );

    await queryRunner.createForeignKey(
      "turnos_sesiones_atencion",
      new TableForeignKey({
        name: "fk_turnos_sesiones_headquarter",
        columnNames: ["headquarter_id"],
        referencedTableName: "headquarters",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      }),
    );

    // 4. turnos_sesiones_servicios
    await queryRunner.createTable(
      new Table({
        name: "turnos_sesiones_servicios",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "sesion_id",
            type: "int",
            isNullable: false,
          },
          {
            name: "service_id",
            type: "int",
            isNullable: false,
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      "turnos_sesiones_servicios",
      new TableForeignKey({
        name: "fk_turnos_sesiones_servicios_sesion",
        columnNames: ["sesion_id"],
        referencedTableName: "turnos_sesiones_atencion",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      }),
    );

    await queryRunner.createForeignKey(
      "turnos_sesiones_servicios",
      new TableForeignKey({
        name: "fk_turnos_sesiones_servicios_service",
        columnNames: ["service_id"],
        referencedTableName: "attention_services",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      }),
    );

    // 5. turnos
    await queryRunner.createTable(
      new Table({
        name: "turnos",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "headquarter_id",
            type: "int",
            isNullable: false,
          },
          {
            name: "service_id",
            type: "int",
            isNullable: false,
          },
          {
            name: "patient_id",
            type: "int",
            isNullable: false,
          },
          {
            name: "ticket_token",
            type: "varchar",
            length: "64",
            isUnique: true,
            isNullable: false,
          },
          {
            name: "ticket_code",
            type: "varchar",
            length: "20",
            isNullable: false,
          },
          {
            name: "daily_number",
            type: "int",
            isNullable: false,
          },
          {
            name: "priority",
            type: "enum",
            enum: ["GENERAL", "PRIORITARIO"],
            default: "'GENERAL'",
            isNullable: false,
          },
          {
            name: "status",
            type: "enum",
            enum: [
              "PENDIENTE",
              "LLAMADO",
              "EN_ATENCION",
              "FINALIZADO",
              "NO_ASISTIO",
              "CANCELADO",
              "TRANSFERIDO",
            ],
            default: "'PENDIENTE'",
            isNullable: false,
          },
          {
            name: "current_modulo_id",
            type: "int",
            isNullable: true,
          },
          {
            name: "current_user_id",
            type: "int",
            isNullable: true,
          },
          {
            name: "call_count",
            type: "int",
            default: 0,
            isNullable: false,
          },
          {
            name: "called_at",
            type: "timestamp",
            isNullable: true,
          },
          {
            name: "started_at",
            type: "timestamp",
            isNullable: true,
          },
          {
            name: "finished_at",
            type: "timestamp",
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
      true,
    );

    await queryRunner.createForeignKey(
      "turnos",
      new TableForeignKey({
        name: "fk_turnos_headquarter",
        columnNames: ["headquarter_id"],
        referencedTableName: "headquarters",
        referencedColumnNames: ["id"],
        onDelete: "RESTRICT",
        onUpdate: "CASCADE",
      }),
    );

    await queryRunner.createForeignKey(
      "turnos",
      new TableForeignKey({
        name: "fk_turnos_service",
        columnNames: ["service_id"],
        referencedTableName: "attention_services",
        referencedColumnNames: ["id"],
        onDelete: "RESTRICT",
        onUpdate: "CASCADE",
      }),
    );

    await queryRunner.createForeignKey(
      "turnos",
      new TableForeignKey({
        name: "fk_turnos_patient",
        columnNames: ["patient_id"],
        referencedTableName: "patients",
        referencedColumnNames: ["id"],
        onDelete: "RESTRICT",
        onUpdate: "CASCADE",
      }),
    );

    await queryRunner.createForeignKey(
      "turnos",
      new TableForeignKey({
        name: "fk_turnos_modulo",
        columnNames: ["current_modulo_id"],
        referencedTableName: "turnos_modulos",
        referencedColumnNames: ["id"],
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
      }),
    );

    await queryRunner.createForeignKey(
      "turnos",
      new TableForeignKey({
        name: "fk_turnos_user",
        columnNames: ["current_user_id"],
        referencedTableName: "users",
        referencedColumnNames: ["id"],
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
      }),
    );

    await queryRunner.createIndex(
      "turnos",
      new TableIndex({
        name: "idx_turnos_status",
        columnNames: ["status"],
      }),
    );

    await queryRunner.createIndex(
      "turnos",
      new TableIndex({
        name: "idx_turnos_headquarter_status",
        columnNames: ["headquarter_id", "status"],
      }),
    );

    await queryRunner.createIndex(
      "turnos",
      new TableIndex({
        name: "idx_turnos_created_at",
        columnNames: ["created_at"],
      }),
    );

    // 6. turno_tracking
    await queryRunner.createTable(
      new Table({
        name: "turno_tracking",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "turno_id",
            type: "int",
            isNullable: false,
          },
          {
            name: "status",
            type: "varchar",
            length: "50",
            isNullable: false,
          },
          {
            name: "modulo_id",
            type: "int",
            isNullable: true,
          },
          {
            name: "user_id",
            type: "int",
            isNullable: true,
          },
          {
            name: "notes",
            type: "text",
            isNullable: true,
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      "turno_tracking",
      new TableForeignKey({
        name: "fk_turno_tracking_turno",
        columnNames: ["turno_id"],
        referencedTableName: "turnos",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      }),
    );

    await queryRunner.createIndex(
      "turno_tracking",
      new TableIndex({
        name: "idx_turno_tracking_turno_id",
        columnNames: ["turno_id"],
      }),
    );

    // 7. turnos_encuestas
    await queryRunner.createTable(
      new Table({
        name: "turnos_encuestas",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "turno_id",
            type: "int",
            isUnique: true,
            isNullable: false,
          },
          {
            name: "rating",
            type: "tinyint",
            isNullable: false,
          },
          {
            name: "comment",
            type: "text",
            isNullable: true,
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      "turnos_encuestas",
      new TableForeignKey({
        name: "fk_turnos_encuestas_turno",
        columnNames: ["turno_id"],
        referencedTableName: "turnos",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("turnos_encuestas", true);
    await queryRunner.dropTable("turno_tracking", true);
    await queryRunner.dropTable("turnos", true);
    await queryRunner.dropTable("turnos_sesiones_servicios", true);
    await queryRunner.dropTable("turnos_sesiones_atencion", true);
    await queryRunner.dropTable("turnos_modulos", true);
    await queryRunner.dropTable("turno_sedes_config", true);
  }
}
