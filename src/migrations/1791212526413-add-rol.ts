import { MigrationInterface, QueryRunner } from "typeorm";

export class AddInventoryAssistantRole1791212526413 implements MigrationInterface {
  name = "AddInventoryAssistantRole1791212526413";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO rol (\`name\`)
      SELECT 'Auxiliar de Inventario'p
      WHERE NOT EXISTS (
        SELECT 1 FROM rol WHERE \`name\` = 'Auxiliar de Inventario'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM rol
      WHERE \`name\` = 'Auxiliar de Inventario';
    `);
  }
}
