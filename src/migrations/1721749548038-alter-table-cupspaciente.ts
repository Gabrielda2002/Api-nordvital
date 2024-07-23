import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterTableCupspaciente1721749548038 implements MigrationInterface {
    name = 'AlterTableCupspaciente1721749548038';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`cupspaciente\` CHANGE COLUMN \`EstadoCupsRadicacion\` \`Estado\` VARCHAR(255) NOT NULL`);
        await queryRunner.query(`INSERT INTO \`autorizacion\` (\`OpcionAutorizacion\`) VALUES ('EN TRAMITE')`);
        await queryRunner.query(`INSERT INTO \`autorizacion\` (\`OpcionAutorizacion\`) VALUES ('YA AUTORIZADO')`);
        
        await queryRunner.query(`
            UPDATE \`cupspaciente\`
            SET \`Estado\` = CASE
                WHEN \`Estado\` IS null OR \`Estado\` = ' ' THEN 6   
                WHEN \`Estado\` = 'AUTORIZADO' THEN 1
                WHEN \`Estado\` = 'REDIRECCIONADO' THEN 2
                WHEN \`Estado\` = 'NO AUTORIZADO' THEN 3
                WHEN \`Estado\` = 'YA AUDITADO' THEN 4
                WHEN \`Estado\` = 'OTRO' THEN 5
                WHEN \`Estado\` = 'PENDIENTE' THEN 6
                WHEN \`Estado\` = 'EN TRAMITE' THEN 7
                WHEN \`Estado\` = 'YA AUTORIZADO' THEN 8
            END
        `);

        await queryRunner.query(`ALTER TABLE \`cupspaciente\` MODIFY COLUMN \`Estado\` INT NOT NULL`);
        
        await queryRunner.query(`ALTER TABLE \`cupspaciente\` ADD CONSTRAINT \`FK_autorizacion\`
                                FOREIGN KEY (\`Estado\`) REFERENCES \`autorizacion\`(\`IdAutorizacion\`)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`cupspaciente\` DROP CONSTRAINT \`FK_autorizacion\``);
        await queryRunner.query(`ALTER TABLE \`cupspaciente\` CHANGE COLUMN \`Estado\` \`EstadoCupsRadicacion\` VARCHAR(255) NOT NULL`);
        
        
        await queryRunner.query(`
            UPDATE \`cupspaciente\`
            SET \`Estado\` = CASE
                WHEN \`Estado\` = 1 THEN 'AUTORIZADO'
                WHEN \`Estado\` = 2 THEN 'REDIRECCIONADO'
                WHEN \`Estado\` = 3 THEN 'NO AUTORIZADO'
                WHEN \`Estado\` = 4 THEN 'YA AUDITADO'
                WHEN \`Estado\` = 5 THEN 'OTRO'
                WHEN \`Estado\` = 6 THEN 'PENDIENTE'
                WHEN \`Estado\` = 7 THEN 'EN TRAMITE'
                WHEN \`Estado\` = 8 THEN 'YA AUTORIZADO'
            END
        `);

        await queryRunner.query(`ALTER TABLE \`cupspaciente\` MODIFY COLUMN \`Estado\` VARCHAR(255) NOT NULL`);
        
        await queryRunner.query(`ALTER TABLE \`cupspaciente\` CHANGE COLUMN \`Estado\` \`EstadoCupsRadicacion\` VARCHAR(255) NOT NULL`);
    }
}
