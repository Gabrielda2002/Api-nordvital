import { MigrationInterface, QueryRunner } from "typeorm";

export class InsertTableRol1752671299901 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            INSERT INTO rol (\`TipoRol\`)
            VALUES 
                ('Enfermeria'),
                ('Coordinadora Enfermeria');
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DELETE FROM rol 
            WHERE \`TipoRol\` IN ('Enfermeria', 'Coordinadora Enfermeria');
        `);
  }
}