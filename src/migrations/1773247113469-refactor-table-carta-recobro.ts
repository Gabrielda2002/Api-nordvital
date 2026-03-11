import { MigrationInterface, QueryRunner } from "typeorm";

export class RefactorTableCartaRecobro1773247113469 implements MigrationInterface {
    name = 'RefactorTableCartaRecobro1773247113469';
    public async up(queryRunner: QueryRunner): Promise<void> {
        // renombrar tabla
        await queryRunner.query(`RENAME TABLE \`carta_recobro\` TO \`recovery_letters\``);

        // recovery_letters
        await queryRunner.query(`ALTER TABLE \`recovery_letters\` CHANGE \`id_radicado\` \`radicacion_id\` INT NOT NULL`)
        await queryRunner.query(`ALTER TABLE \`recovery_letters\` CHANGE \`id_usuario_solicita\` \`user_request_id\` INT NOT NULL`)
        await queryRunner.query(`ALTER TABLE \`recovery_letters\` CHANGE \`id_usuario_audita\` \`user_audit_id\` INT NULL`)
        await queryRunner.query(`ALTER TABLE \`recovery_letters\` CHANGE \`observacion\` \`observation\` TEXT NULL`)
        await queryRunner.query(`ALTER TABLE \`recovery_letters\` CHANGE \`justificacion\` \`justification\` TEXT NOT NULL`)
        await queryRunner.query(`ALTER TABLE \`recovery_letters\` CHANGE \`fecha_impresion\` \`print_date\` DATE NULL`)

        // cups_radicados (columnas que me faltaron refactorizar en la anterior migracion)
        await queryRunner.query(`ALTER TABLE \`cups_radicados\` CHANGE \`FechaRegistro\` \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`cups_radicados\` CHANGE \`UltimaModificacion\` \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
    }
    public async down(queryRunner: QueryRunner): Promise<void> {
        // renombrar tabla
        await queryRunner.query(`RENAME TABLE \`recovery_letters\` TO \`carta_recobro\``);

        // recovery_letters
        await queryRunner.query(`ALTER TABLE \`carta_recobro\` CHANGE \`radicacion_id\` \`id_radicado\` INT NOT NULL`)
        await queryRunner.query(`ALTER TABLE \`carta_recobro\` CHANGE \`user_request_id\` \`id_usuario_solicita\` INT NOT NULL`)
        await queryRunner.query(`ALTER TABLE \`carta_recobro\` CHANGE \`user_audit_id\` \`id_usuario_audita\` INT NULL`)
        await queryRunner.query(`ALTER TABLE \`carta_recobro\` CHANGE \`observation\` \`observacion\` TEXT NULL`)
        await queryRunner.query(`ALTER TABLE \`carta_recobro\` CHANGE \`justification\` \`justificacion\` TEXT NOT NULL`)
        await queryRunner.query(`ALTER TABLE \`carta_recobro\` CHANGE \`print_date\` \`fecha_impresion\` DATE NULL`);

        // cups_radicados (columnas que me faltaron refactorizar en la anterior migracion)
        await queryRunner.query(`ALTER TABLE \`cups_radicados\` CHANGE \`created_at\` \`FechaRegistro\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`cups_radicados\` CHANGE \`updated_at\` \`UltimaModificacion\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
    }
}