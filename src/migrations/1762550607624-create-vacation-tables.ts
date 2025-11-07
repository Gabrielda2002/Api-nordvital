import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateVacationTables1731000000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Tabla: balances_vacaciones
    await queryRunner.createTable(
      new Table({
        name: "balances_vacaciones",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "usuario_id",
            type: "int",
            isNullable: false,
          },
          {
            name: "numero_periodo",
            type: "int",
            isNullable: false,
          },
          {
            name: "periodo_inicio",
            type: "date",
            isNullable: false,
          },
          {
            name: "periodo_fin",
            type: "date",
            isNullable: false,
          },
          {
            name: "dias_asignados",
            type: "decimal",
            precision: 5,
            scale: 2,
            default: 15,
            isNullable: false,
          },
          {
            name: "dias_tomados",
            type: "decimal",
            precision: 5,
            scale: 2,
            default: 0,
            isNullable: false,
          },
          {
            name: "dias_disponibles",
            type: "decimal",
            precision: 5,
            scale: 2,
            default: 15,
            isNullable: false,
          },
          {
            name: "fecha_vencimiento",
            type: "date",
            isNullable: false,
          },
          {
            name: "vencido",
            type: "boolean",
            default: false,
            isNullable: false,
          },
          {
            name: "configurado_manualmente",
            type: "boolean",
            default: false,
            isNullable: false,
          },
          {
            name: "notas",
            type: "varchar",
            length: "500",
            isNullable: true,
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
            isNullable: false,
          },
          {
            name: "updated_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
            onUpdate: "CURRENT_TIMESTAMP",
            isNullable: false,
          },
        ],
      }),
      true
    );

    // FK: balances_vacaciones -> usuario
    await queryRunner.createForeignKey(
      "balances_vacaciones",
      new TableForeignKey({
        columnNames: ["usuario_id"],
        referencedTableName: "usuario",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      })
    );

    // Tabla: configuracion_inicial_vacaciones
    await queryRunner.createTable(
      new Table({
        name: "configuracion_inicial_vacaciones",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "usuario_id",
            type: "int",
            isNullable: false,
            isUnique: true,
          },
          {
            name: "fecha_corte",
            type: "date",
            isNullable: false,
          },
          {
            name: "periodos_generados_hasta_corte",
            type: "int",
            isNullable: false,
          },
          {
            name: "periodos_configurados",
            type: "int",
            default: 0,
            isNullable: false,
          },
          {
            name: "dias_totales_disponibles",
            type: "decimal",
            precision: 6,
            scale: 2,
            default: 0,
            isNullable: false,
          },
          {
            name: "requiere_revision_rrhh",
            type: "boolean",
            default: true,
            isNullable: false,
          },
          {
            name: "observaciones",
            type: "text",
            isNullable: true,
          },
          {
            name: "configuracion_completa",
            type: "boolean",
            default: false,
            isNullable: false,
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
            isNullable: false,
          },
        ],
      }),
      true
    );

    // FK: configuracion_inicial_vacaciones -> usuario
    await queryRunner.createForeignKey(
      "configuracion_inicial_vacaciones",
      new TableForeignKey({
        columnNames: ["usuario_id"],
        referencedTableName: "usuario",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      })
    );

    // Índices para mejorar performance
    await queryRunner.query(`
      CREATE INDEX idx_balances_usuario ON balances_vacaciones(usuario_id);
    `);

    await queryRunner.query(`
      CREATE INDEX idx_balances_vencido ON balances_vacaciones(vencido);
    `);

    await queryRunner.query(`
      CREATE INDEX idx_config_completa ON configuracion_inicial_vacaciones(configuracion_completa);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Eliminar índices
    await queryRunner.query(`DROP INDEX idx_config_completa ON configuracion_inicial_vacaciones`);
    await queryRunner.query(`DROP INDEX idx_balances_vencido ON balances_vacaciones`);
    await queryRunner.query(`DROP INDEX idx_balances_usuario ON balances_vacaciones`);

    // Eliminar tablas (en orden inverso por dependencias)
    await queryRunner.dropTable("configuracion_inicial_vacaciones", true);
    await queryRunner.dropTable("balances_vacaciones", true);
  }
}
