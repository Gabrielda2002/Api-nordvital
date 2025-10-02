import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from "typeorm";

export class CreatePermissionModule1758835000000 implements MigrationInterface {
  name = "CreatePermissionModule1758835000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1) solicitudes_permisos (tabla base)
    await queryRunner.createTable(
      new Table({
        name: "solicitudes_permisos",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "categoria",
            type: "enum",
            enum: ["PERMISO", "INCAPACIDAD", "CALAMIDAD", "VACACIONES"],
            isNullable: false,
          },
          {
            name: "granularidad",
            type: "enum",
            enum: ["HOURLY", "DAILY", "MULTI_DAY"],
            isNullable: false,
          },
          {
            name: "solicitante_id",
            type: "int",
            isNullable: false,
          },
          {
            name: "fecha_inicio",
            type: "date",
            isNullable: false,
          },
          {
            name: "fecha_fin",
            type: "date",
            isNullable: false,
          },
          {
            name: "hora_inicio",
            type: "time",
            isNullable: true,
          },
          {
            name: "hora_fin",
            type: "time",
            isNullable: true,
          },
          {
            name: "dias_solicitados",
            type: "decimal",
            precision: 5,
            scale: 2,
            isNullable: true,
          },
          {
            name: "no_remunerado",
            type: "tinyint",
            width: 1,
            isNullable: false,
            default: 0,
          },
          {
            name: "tiempo_compensacion",
            type: "varchar",
            length: "50",
            isNullable: true,
          },
          {
            name: "observaciones",
            type: "varchar",
            length: "1000",
            isNullable: true,
          },
          {
            name: "estado_global",
            type: "enum",
            enum: ["PENDIENTE", "EN_REVISION", "APROBADO", "RECHAZADO", "CANCELADO"],
            default: "'PENDIENTE'",
          },
          {
            name: "fecha_creacion",
            type: "timestamp",
            isNullable: false,
            default: "CURRENT_TIMESTAMP",
          },
          {
            name: "fecha_actualizacion",
            type: "timestamp",
            isNullable: false,
            default: "CURRENT_TIMESTAMP",
            onUpdate: "CURRENT_TIMESTAMP",
          },
        ],
      })
    );

    await queryRunner.createForeignKey(
      "solicitudes_permisos",
      new TableForeignKey({
        columnNames: ["solicitante_id"],
        referencedTableName: "usuario",
        referencedColumnNames: ["id"],
        onDelete: "RESTRICT",
        onUpdate: "CASCADE",
      })
    );

    await queryRunner.createIndices("solicitudes_permisos", [
      new TableIndex({ name: "IDX_sp_solicitante", columnNames: ["solicitante_id"] }),
      new TableIndex({ name: "IDX_sp_categoria", columnNames: ["categoria"] }),
      new TableIndex({ name: "IDX_sp_estado_global", columnNames: ["estado_global"] }),
      new TableIndex({ name: "IDX_sp_fechas", columnNames: ["fecha_inicio", "fecha_fin"] }),
    ]);

    // 2) solicitudes_permisos_pasos (motor de aprobaciones)
    await queryRunner.createTable(
      new Table({
        name: "solicitudes_permisos_pasos",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "solicitud_id",
            type: "int",
            isNullable: false,
          },
          {
            name: "orden",
            type: "int",
            isNullable: false,
          },
          {
            name: "tipo_paso",
            type: "enum",
            enum: ["JEFE", "RRHH"],
            isNullable: false,
          },
          {
            name: "aprobador_rol",
            type: "varchar",
            length: "50",
            isNullable: true,
          },
          {
            name: "aprobador_usuario_id",
            type: "int",
            isNullable: true,
          },
          {
            name: "estado",
            type: "enum",
            enum: ["PENDIENTE", "APROBADO", "RECHAZADO", "VISTO"],
            default: "'PENDIENTE'",
          },
          {
            name: "comentario",
            type: "varchar",
            length: "500",
            isNullable: true,
          },
          {
            name: "fecha_accion",
            type: "datetime",
            isNullable: true,
          },
          {
            name: "fecha_creacion",
            type: "timestamp",
            isNullable: false,
            default: "CURRENT_TIMESTAMP",
          },
        ],
      })
    );

    await queryRunner.createForeignKeys("solicitudes_permisos_pasos", [
      new TableForeignKey({
        columnNames: ["solicitud_id"],
        referencedTableName: "solicitudes_permisos",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      }),
      new TableForeignKey({
        columnNames: ["aprobador_usuario_id"],
        referencedTableName: "usuario",
        referencedColumnNames: ["id"],
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
      }),
    ]);

    await queryRunner.createIndices("solicitudes_permisos_pasos", [
      new TableIndex({ name: "IDX_spp_solicitud", columnNames: ["solicitud_id"] }),
      new TableIndex({ name: "IDX_spp_estado", columnNames: ["estado"] }),
      new TableIndex({ name: "IDX_spp_aprobador_usuario", columnNames: ["aprobador_usuario_id"] }),
      new TableIndex({ name: "IDX_spp_tipo_orden", columnNames: ["tipo_paso", "orden"] }),
    ]);

    // 3) solicitudes_permisos_adjuntos (archivos)
    await queryRunner.createTable(
      new Table({
        name: "solicitudes_permisos_adjuntos",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "solicitud_id",
            type: "int",
            isNullable: false,
          },
          {
            name: "soporte_id",
            type: "int",
            isNullable: false,
          },
          {
            name: "etiqueta",
            type: "varchar",
            length: "50",
            isNullable: false,
          },
          {
            name: "subido_por",
            type: "int",
            isNullable: false,
          },
          {
            name: "fecha_creacion",
            type: "timestamp",
            isNullable: false,
            default: "CURRENT_TIMESTAMP",
          },
        ],
      })
    );

    await queryRunner.createForeignKeys("solicitudes_permisos_adjuntos", [
      new TableForeignKey({
        columnNames: ["solicitud_id"],
        referencedTableName: "solicitudes_permisos",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      }),
      new TableForeignKey({
        columnNames: ["soporte_id"],
        referencedTableName: "soportes",
        referencedColumnNames: ["id"],
        onDelete: "RESTRICT",
        onUpdate: "CASCADE",
      }),
      new TableForeignKey({
        columnNames: ["subido_por"],
        referencedTableName: "usuario",
        referencedColumnNames: ["id"],
        onDelete: "RESTRICT",
        onUpdate: "CASCADE",
      }),
    ]);

    await queryRunner.createIndex(
      "solicitudes_permisos_adjuntos",
      new TableIndex({ name: "IDX_spa_solicitud", columnNames: ["solicitud_id"] })
    );

    // 4) politicas_permisos (configurable por tipo)
    await queryRunner.createTable(
      new Table({
        name: "politicas_permisos",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "categoria",
            type: "enum",
            enum: ["PERMISO", "INCAPACIDAD", "CALAMIDAD", "VACACIONES"],
            isNullable: false,
            isUnique: true,
          },
          {
            name: "requiere_documento",
            type: "tinyint",
            width: 1,
            isNullable: false,
            default: 0,
          },
          {
            name: "requiere_jefe",
            type: "tinyint",
            width: 1,
            isNullable: false,
            default: 0,
          },
          {
            name: "requiere_rrhh",
            type: "tinyint",
            width: 1,
            isNullable: false,
            default: 0,
          },
          {
            name: "requiere_visto_rrhh",
            type: "tinyint",
            width: 1,
            isNullable: false,
            default: 0,
          },
          {
            name: "antiguedad_minima_dias",
            type: "int",
            isNullable: false,
            default: 0,
          },
          {
            name: "max_dias_por_solicitud",
            type: "decimal",
            precision: 5,
            scale: 2,
            isNullable: true,
          },
          {
            name: "max_dias_por_anio",
            type: "decimal",
            precision: 5,
            scale: 2,
            isNullable: true,
          },
          {
            name: "permitir_solapamiento",
            type: "tinyint",
            width: 1,
            isNullable: false,
            default: 0,
          },
          {
            name: "fecha_creacion",
            type: "timestamp",
            isNullable: false,
            default: "CURRENT_TIMESTAMP",
          },
          {
            name: "fecha_actualizacion",
            type: "timestamp",
            isNullable: false,
            default: "CURRENT_TIMESTAMP",
            onUpdate: "CURRENT_TIMESTAMP",
          },
        ],
      })
    );

    // Seed inicial de políticas según lo acordado
    await queryRunner.query(
      "INSERT INTO politicas_permisos (categoria, requiere_documento, requiere_jefe, requiere_rrhh, requiere_visto_rrhh, antiguedad_minima_dias, max_dias_por_solicitud, max_dias_por_anio, permitir_solapamiento) VALUES " +
        "('PERMISO', 0, 1, 0, 1, 0, NULL, NULL, 0)," +
        "('INCAPACIDAD', 1, 0, 0, 1, 0, NULL, NULL, 0)," +
        "('VACACIONES', 1, 0, 1, 0, 365, NULL, NULL, 0)," +
        "('CALAMIDAD', 0, 1, 0, 1, 0, NULL, NULL, 0)"
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Eliminar en orden inverso de dependencias
    await queryRunner.dropTable("politicas_permisos");

    const adjTable = await queryRunner.getTable("solicitudes_permisos_adjuntos");
    if (adjTable) {
      for (const fk of adjTable.foreignKeys) {
        await queryRunner.dropForeignKey("solicitudes_permisos_adjuntos", fk);
      }
    }
    await queryRunner.dropTable("solicitudes_permisos_adjuntos");

    const pasosTable = await queryRunner.getTable("solicitudes_permisos_pasos");
    if (pasosTable) {
      for (const fk of pasosTable.foreignKeys) {
        await queryRunner.dropForeignKey("solicitudes_permisos_pasos", fk);
      }
    }
    await queryRunner.dropTable("solicitudes_permisos_pasos");

    const solTable = await queryRunner.getTable("solicitudes_permisos");
    if (solTable) {
      for (const idx of solTable.indices) {
        await queryRunner.dropIndex("solicitudes_permisos", idx.name!);
      }
      for (const fk of solTable.foreignKeys) {
        await queryRunner.dropForeignKey("solicitudes_permisos", fk);
      }
    }
    await queryRunner.dropTable("solicitudes_permisos");
  }
}
