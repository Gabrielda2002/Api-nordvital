import { MigrationInterface, QueryRunner } from "typeorm";

export class alterTableSoportes1722266464859 implements MigrationInterface {
    name = 'alterTableSoportes1722266464859'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Añadir columna para el tamaño del archivo
        await queryRunner.query(`ALTER TABLE \`soportes\` ADD \`size\` BIGINT NOT NULL DEFAULT 0`);

        // Añadir columna para el tipo de archivo
        await queryRunner.query(`ALTER TABLE \`soportes\` ADD \`tipo\` VARCHAR(100)`);

        // Añadir columna para la fecha de creación
        await queryRunner.query(`ALTER TABLE \`soportes\` ADD \`fechaCreacion\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP`);
        
        // Añadir columna para la fecha de actualización
        await queryRunner.query(`ALTER TABLE \`soportes\` ADD \`fechaActualizacion\` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Eliminar columna de tamaño
        await queryRunner.query(`ALTER TABLE \`soportes\` DROP COLUMN \`size\``);

        // Eliminar columna de tipo
        await queryRunner.query(`ALTER TABLE \`soportes\` DROP COLUMN \`tipo\``);

        // Eliminar columna de fecha de creación
        await queryRunner.query(`ALTER TABLE \`soportes\` DROP COLUMN \`fechaCreacion\``);

        // Eliminar columna de fecha de actualización
        await queryRunner.query(`ALTER TABLE \`soportes\` DROP COLUMN \`fechaActualizacion\``);
    }
}
