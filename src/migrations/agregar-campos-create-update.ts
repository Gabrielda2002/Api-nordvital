import { MigrationInterface, QueryRunner } from "typeorm";

export class AgregarCamposCreateUpdate1721656495538 implements MigrationInterface {
    name = 'AgregarCamposCreateUpdate1721656495538'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`autorizacion\` ADD \`fecha-creacion\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`autorizacion\` ADD \`fecha-actualizacion\` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`autorizacion\` DROP COLUMN \`fecha-actualizacion\``);
        await queryRunner.query(`ALTER TABLE \`autorizacion\` DROP COLUMN \`fecha-creacion\``);
    }
}
