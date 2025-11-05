import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterTablePoliticasPermisos1762358506743 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Actualizar política de PERMISO
    // await queryRunner.query(`
    //   UPDATE politicas_permisos 
    //   SET 
    //     requiere_documento = 0,
    //     requiere_jefe = 1,
    //     requiere_rrhh = 0,
    //     requiere_visto_rrhh = 1,
    //     antiguedad_minima_dias = 0,
    //     max_dias_por_solicitud = NULL,
    //     max_dias_por_anio = NULL,
    //     permitir_solapamiento = 0
    //   WHERE categoria = 'PERMISO'
    // `);

    // Actualizar política de INCAPACIDAD
    await queryRunner.query(`
      UPDATE politicas_permisos 
      SET 
        requiere_documento = 1,
        requiere_jefe = 1,
        requiere_rrhh = 0,
        requiere_visto_rrhh = 1,
        antiguedad_minima_dias = 0,
        max_dias_por_solicitud = NULL,
        max_dias_por_anio = NULL,
        permitir_solapamiento = 0
      WHERE categoria = 'INCAPACIDAD'
    `);

    // Actualizar política de VACACIONES
    await queryRunner.query(`
      UPDATE politicas_permisos 
      SET 
        requiere_documento = 1,
        requiere_jefe = 1,
        requiere_rrhh = 0,
        requiere_visto_rrhh = 1,
        antiguedad_minima_dias = 365,
        max_dias_por_solicitud = NULL,
        max_dias_por_anio = NULL,
        permitir_solapamiento = 0
      WHERE categoria = 'VACACIONES'
    `);

    // Actualizar política de CALAMIDAD
    // await queryRunner.query(`
    //   UPDATE politicas_permisos 
    //   SET 
    //     requiere_documento = 0,
    //     requiere_jefe = 1,
    //     requiere_rrhh = 0,
    //     requiere_visto_rrhh = 1,
    //     antiguedad_minima_dias = 0,
    //     max_dias_por_solicitud = NULL,
    //     max_dias_por_anio = NULL,
    //     permitir_solapamiento = 0
    //   WHERE categoria = 'CALAMIDAD'
    // `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revertir a los valores originales
    await queryRunner.query(`
      UPDATE politicas_permisos 
      SET 
        requiere_documento = 0,
        requiere_jefe = 1,
        requiere_rrhh = 0,
        requiere_visto_rrhh = 1,
        antiguedad_minima_dias = 0,
        max_dias_por_solicitud = NULL,
        max_dias_por_anio = NULL,
        permitir_solapamiento = 0
      WHERE categoria = 'PERMISO'
    `);

    await queryRunner.query(`
      UPDATE politicas_permisos 
      SET 
        requiere_documento = 1,
        requiere_jefe = 0,
        requiere_rrhh = 0,
        requiere_visto_rrhh = 1,
        antiguedad_minima_dias = 0,
        max_dias_por_solicitud = NULL,
        max_dias_por_anio = NULL,
        permitir_solapamiento = 0
      WHERE categoria = 'INCAPACIDAD'
    `);

    await queryRunner.query(`
      UPDATE politicas_permisos 
      SET 
        requiere_documento = 1,
        requiere_jefe = 0,
        requiere_rrhh = 1,
        requiere_visto_rrhh = 0,
        antiguedad_minima_dias = 365,
        max_dias_por_solicitud = NULL,
        max_dias_por_anio = NULL,
        permitir_solapamiento = 0
      WHERE categoria = 'VACACIONES'
    `);

    await queryRunner.query(`
      UPDATE politicas_permisos 
      SET 
        requiere_documento = 0,
        requiere_jefe = 1,
        requiere_rrhh = 0,
        requiere_visto_rrhh = 1,
        antiguedad_minima_dias = 0,
        max_dias_por_solicitud = NULL,
        max_dias_por_anio = NULL,
        permitir_solapamiento = 0
      WHERE categoria = 'CALAMIDAD'
    `);
  }
}
