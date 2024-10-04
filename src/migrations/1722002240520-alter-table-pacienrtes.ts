import { MigrationInterface, QueryRunner } from "typeorm";

export class fillPacienteIdInRadicacion1721999188716 implements MigrationInterface {
    name = 'fillPacienteIdInRadicacion1721999188716'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Ejecutar una consulta para actualizar la tabla 'radicacion' con el 'Paciente_id' correcto
        await queryRunner.query(`
            UPDATE radicacion r
            SET Paciente_id = (
                SELECT p.IdUsuarios
                FROM pacientes p
                WHERE p.NombreCompleto = r.NombreCompleto
                LIMIT 1
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Revertir los cambios: puedes elegir dejar el campo como está o ponerlo en NULL
        await queryRunner.query(`
            UPDATE radicacion
            SET Paciente_id = NULL
        `);
    }
}
