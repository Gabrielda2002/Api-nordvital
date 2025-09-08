import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterTableSede1757358293827 implements MigrationInterface {
    name = 'AlterTableSede1757358293827'

    public async up(queryRunner: QueryRunner): Promise<void> {

        const tableSedes = await queryRunner.getTable("sedes");
        const foreignKeyDepartamento = tableSedes?.foreignKeys.find(fk => fk.columnNames.includes("departamento"));

        if (foreignKeyDepartamento) {
            await queryRunner.dropForeignKey("sedes", foreignKeyDepartamento); 
        }

        await queryRunner.dropColumn("sedes", "departamento");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Agregar de vuelta la columna departamento
        await queryRunner.query(`ALTER TABLE \`sedes\` ADD \`departamento\` int NOT NULL`);
        // Recrear la foreign key constraint
        const tableSedes = await queryRunner.getTable("sedes");
        const foreignKeyDepartamento = tableSedes?.foreignKeys.find(fk => fk.columnNames.includes("departamento"));
        if (foreignKeyDepartamento) {
            await queryRunner.createForeignKey("sedes", foreignKeyDepartamento);
        }
    }
}