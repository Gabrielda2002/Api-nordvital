import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterTablePrioridad1771001952627 implements MigrationInterface {
    name?: "AlterTablePrioridad1771001952627";
    public async up(queryRunner: QueryRunner): Promise<void> {
        // insertar registros en la tabla Prioridades con los siguientes valores: "Pendiente", "Urgente"
        await queryRunner.query(`
            INSERT INTO prioridades (nombre) VALUES ('Urgente'), ('Pendiente')
        `);

        // actualizar valor por defecto de la columna prioridad_id en la tabla Tickets a 4 (Pendiente)
        await queryRunner.query(`
            ALTER TABLE tickets ALTER COLUMN prioridad_id SET DEFAULT 1
        `);
    }
    public async down(queryRunner: QueryRunner): Promise<void> {
        // eliminar los registros de la tabla Prioridad con los siguientes valores: "Pendiente", "Urgente"
        await queryRunner.query(`
            DELETE FROM prioridades WHERE nombre IN ('Urgente', 'Pendiente')
        `);
    }
}