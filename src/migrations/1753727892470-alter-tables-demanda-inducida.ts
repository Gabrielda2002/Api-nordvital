import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterTablesDemandaInducida1753727892470
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DELETE FROM area_persona_seguimiento
            WHERE nombre IN ('Operador Web Help', 'Operador Ápex');
        `);

    await queryRunner.query(`
            DELETE FROM resultado_llamada 
            WHERE nombre IN ('Usuario hospitalizado', 'Usuario fallecido', 'Usuario retirado', 'Usuario no geo en la unidad');
            `);

    await queryRunner.query(`
                DELETE FROM objetivo_demanda_inducida
                WHERE nombre IN ('Reprogramación y confirmación');
                `);

    await queryRunner.query(`
                DELETE FROM tipo_demanda_inducida
                WHERE nombre IN ('Carnet de la mujer', 'Folleto carpeta gestante', 'Carnet del niño', 'Carnet AEIPI', 'Plegable de PYMS', 'Plegable de vacuanción', 'Material educativo', 'Sala de espera');
                `);

    await queryRunner.query(`
                DELETE FROM elemento_demanda_inducida
                WHERE nombre IN ('Email', 'Audiobot', 'Sala de espera');
        `);

    await queryRunner.query(`
        INSERT INTO documento (tipoDocumento, Estado)
        VALUES ('AS', 1), ('CD', 1), ('NV', 1);
        `);

    await queryRunner.query(`
        UPDATE area_eps
        SET nombre = 'Atención IPS con personal o profesional de salud'
        WHERE id = 14;
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // No se puede restaurar los registros eliminados sin información adicional
  }
}
