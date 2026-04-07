import { MigrationInterface, QueryRunner } from "typeorm";

export class QueryRadicacionUserAudit1775591810528 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Actualizar audit_user_id basándose en coincidencias de nombres
    // Condición 1: Comparar audit_notes con nombre completo (nombre + apellido)
    await queryRunner.query(`
      UPDATE radicaciones r
      INNER JOIN usuario u ON CONCAT(u.nombre, ' ', u.apellido) = r.audit_notes
      SET r.audit_user_id = u.id
      WHERE r.audit_user_id IS NULL
        AND r.audit_notes IS NOT NULL
        AND r.audit_notes != ''
        AND r.audit_notes != 'SIAU NEPS'
    `);

    // Condición 2: Casos especiales donde audit_notes = "SIAU NEPS"
    // Buscar usuario con cédula 63396825
    await queryRunner.query(`
      UPDATE radicaciones r
      INNER JOIN usuario u ON u.cedula = 63396825
      SET r.audit_user_id = u.id
      WHERE r.audit_user_id IS NULL
        AND r.audit_notes = 'SIAU NEPS'
    `);

    // Los registros que no cumplan ninguna condición quedarán con audit_user_id = NULL
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revertir la migración: limpiar audit_user_id
    await queryRunner.query(`
      UPDATE radicaciones
      SET audit_user_id = NULL
      WHERE audit_user_id IS NOT NULL
    `);
  }
}
