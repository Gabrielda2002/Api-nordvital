import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterTablePrograma1752850939045 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE programa_meta_historico 
            ADD COLUMN profesional ENUM('Medicina General', 'Enfermería') NOT NULL DEFAULT 'Medicina General'
        `);
    await queryRunner.query(`
            DELETE FROM programa
            WHERE nombre IN ('Cancer de mama y cuello uterino', 'Odontologia', 'DT por Citología')
               OR nombre LIKE '%por enfermeria%'
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE programa_meta_historico 
            DROP COLUMN profesional
        `);
  }
}
