import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from "typeorm";

export class DropLegacyPermisos1758835001000 implements MigrationInterface {
  name = "DropLegacyPermisos1758835001000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasPermisos = await queryRunner.hasTable("permisos");
    if (hasPermisos) {
      await queryRunner.dropTable("permisos");
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Re-create legacy table 'permisos' as it originally existed (best-effort)
    await queryRunner.createTable(
      new Table({
        name: "permisos",
        columns: [
          { name: "id", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
          { name: "dias_solicitados", type: "decimal", precision: 5, scale: 2, isNullable: false },
          { name: "fecha_inicio", type: "date", isNullable: false },
          { name: "fecha_fin", type: "date", isNullable: false },
          { name: "hora_inicio", type: "time", isNullable: true },
          { name: "hora_fin", type: "time", isNullable: true },
          { name: "tiempo_compensacion", type: "varchar", length: "50", isNullable: false },
          { name: "no_remunerado", type: "tinyint", width: 1, isNullable: false, default: 0 },
          { name: "observaciones", type: "varchar", length: "1000", isNullable: true },
          { name: "solicitante_id", type: "int", isNullable: false },
          { name: "jefe_id", type: "int", isNullable: false },
          { name: "gerencia_id", type: "int", isNullable: false },
          { name: "estado_jefe", type: "enum", enum: ["PENDIENTE", "APROBADO", "RECHAZADO"], default: "'PENDIENTE'" },
          { name: "fecha_aprob_jefe", type: "datetime", isNullable: true },
          { name: "comentario_jefe", type: "varchar", length: "500", isNullable: true },
          { name: "estado_gerencia", type: "enum", enum: ["PENDIENTE", "APROBADO", "RECHAZADO"], default: "'PENDIENTE'" },
          { name: "fecha_aprob_gerencia", type: "datetime", isNullable: true },
          { name: "comentario_gerencia", type: "varchar", length: "500", isNullable: true },
          { name: "fecha-creacion", type: "timestamp", isNullable: false, default: "CURRENT_TIMESTAMP" },
          { name: "fecha-actualizacion", type: "timestamp", isNullable: true, default: "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" },
          { name: "id_soportes", type: "int", isNullable: true },
        ],
      })
    );

    await queryRunner.createForeignKeys("permisos", [
      new TableForeignKey({ columnNames: ["solicitante_id"], referencedTableName: "usuario", referencedColumnNames: ["id"], onDelete: "RESTRICT", onUpdate: "CASCADE" }),
      new TableForeignKey({ columnNames: ["jefe_id"], referencedTableName: "usuario", referencedColumnNames: ["id"], onDelete: "RESTRICT", onUpdate: "CASCADE" }),
      new TableForeignKey({ columnNames: ["gerencia_id"], referencedTableName: "usuario", referencedColumnNames: ["id"], onDelete: "RESTRICT", onUpdate: "CASCADE" }),
      new TableForeignKey({ columnNames: ["id_soportes"], referencedTableName: "soportes", referencedColumnNames: ["id"], onDelete: "SET NULL", onUpdate: "CASCADE" }),
    ]);

    await queryRunner.createIndices("permisos", [
      new TableIndex({ name: "IDX_permisos_solicitante", columnNames: ["solicitante_id"] }),
      new TableIndex({ name: "IDX_permisos_jefe", columnNames: ["jefe_id"] }),
      new TableIndex({ name: "IDX_permisos_gerencia", columnNames: ["gerencia_id"] }),
      new TableIndex({ name: "IDX_permisos_fechas", columnNames: ["fecha_inicio", "fecha_fin"] }),
      new TableIndex({ name: "IDX_permisos_id_soportes", columnNames: ["id_soportes"] }),
    ]);
  }
}
