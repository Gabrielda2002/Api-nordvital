import { MigrationInterface, QueryRunner } from "typeorm";

export class insertTableSedes1733326521580 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO sedes (NombreLugar, Estado, departamento, ciudad, numero_sede)
            VALUES 
            ('La Mesa', 1, 2, 4, 1),
            ('Cajica', 1, 2, 6, 4),
            ('Ubate', 1, 2, 5, 3)
        `);

            await queryRunner.query(`
                UPDATE sedes 
                SET ciudad = 7 
                WHERE NombreLugar = 'La Calera'
            `);

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DELETE FROM sedes WHERE NombreLugar IN ('La Mesa', 'Cajica', 'Ubate', 'La Calera');
        `);
    }
}