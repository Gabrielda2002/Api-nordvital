import { MigrationInterface, QueryRunner } from "typeorm";

export class InsertTablesDeskHelp1740497448857 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query(`
            INSERT INTO estados_tickets (nombre)
            VALUES 
            ('Abierto' ),
            ('Cerrado' ),
            ('Pendiente' )
        `);

        await queryRunner.query(`
            INSERT INTO prioridades (nombre)
            VALUES 
            ('Baja' ),
            ('Media' ),
            ('Alta' )
        `);

        await queryRunner.query(`
            INSERT INTO categorias (nombre)
            VALUES 
            ('Software' ),
            ('Hardware' ),
            ('Redes' )
        `);

        
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DELETE FROM estados_tickets WHERE nombre IN ('abierto', 'cerrado');
        `);
    }
}