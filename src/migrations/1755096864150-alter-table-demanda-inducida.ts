import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterTableDemandaInducida1755096864150
  implements MigrationInterface
{
  name = "AlterTableDemandaInducida1755096864150";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Modificar el enum del campo profesional en la tabla demanda_inducida
    await queryRunner.query(`
            ALTER TABLE \`demanda_inducida\` 
            MODIFY COLUMN \`profesional\` 
            ENUM('Medicina General', 'Enfermería', 'Nutrición', 'Ginecobstetricia', 'Psicología', 'Odontología', 'Toma de muestras de laboratorio', 'Trabajo social', 'Pediatría', 'Otras especialidades') 
            DEFAULT 'Medicina General'
        `);

    // Modificar el enum del campo profesional en la tabla programa_meta_historico
    await queryRunner.query(`
            ALTER TABLE \`programa_meta_historico\` 
            MODIFY COLUMN \`profesional\` 
            ENUM('Medicina General', 'Enfermería', 'Nutrición', 'Ginecobstetricia', 'Psicología', 'Odontología', 'Toma de muestras de laboratorio', 'Trabajo social', 'Pediatría', 'Otras especialidades') 
            DEFAULT 'Medicina General'
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revertir el enum del campo profesional en la tabla demanda_inducida
    await queryRunner.query(`
            ALTER TABLE \`demanda_inducida\` 
            MODIFY COLUMN \`profesional\` 
            ENUM('Medicina General', 'Enfermería', 'Nutrición', 'Ginecobstetricia', 'Psicología') 
            DEFAULT 'Medicina General'
        `);

    // Revertir el enum del campo profesional en la tabla programa_meta_historico
    await queryRunner.query(`
            ALTER TABLE \`programa_meta_historico\` 
            MODIFY COLUMN \`profesional\` 
            ENUM('Medicina General', 'Enfermería', 'Nutrición', 'Ginecobstetricia', 'Psicología') 
            DEFAULT 'Medicina General'
        `);
  }
}
