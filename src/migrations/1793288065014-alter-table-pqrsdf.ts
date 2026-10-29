import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterTablePqrsdf1793288065014 implements MigrationInterface {
    name = "AlterTablePqrsdf1793288065014";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            "ALTER TABLE `pqrsdf` MODIFY COLUMN `filing_number` VARCHAR(50) NOT NULL COMMENT 'NUMERO DE RADICADO (secuencial autogenerado por el sistema o radicado alfanumérico)'"
        );
        await queryRunner.query(
            "ALTER TABLE `pqrsdf` MODIFY COLUMN `reception_medium` ENUM('PAGINA_WEB', 'WHATSAPP', 'SALA', 'BUZON', 'CORREO_ELECTRONICO') NOT NULL COMMENT 'MEDIO DE RECEPCION DE PQRDSF'"
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            "ALTER TABLE `pqrsdf` MODIFY COLUMN `reception_medium` ENUM('PAGINA_WEB', 'WHATSAPP', 'SALA', 'BUZON') NOT NULL COMMENT 'MEDIO DE RECEPCION DE PQRDSF'"
        );
        await queryRunner.query(
            "ALTER TABLE `pqrsdf` MODIFY COLUMN `filing_number` INT NOT NULL COMMENT 'NUMERO DE RADICADO (secuencial autogenerado por el sistema)'"
        );
    }
}
