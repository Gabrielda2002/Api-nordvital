import { MigrationInterface, QueryRunner } from "typeorm";

export class InsertDataRoles1726259029216 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO \`rol\`(\`TipoRol\`) VALUES 
            ('Radicador'),
            ('Siau'),
            ('Contratacion'),
            ('Medico'),
            ('Jefe'),
            ('Cirugia'),
            ('Paramedico')
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DELETE FROM \`rol\` WHERE \`TipoRol\` IN ('RADICADOR', 'SIAU', 'CONTRATACION', 'MEDICO', 'JEFE', 'CIRUGIA', 'PARAMEDICO');
        `);
    }
}