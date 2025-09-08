import { MigrationInterface, QueryRunner } from "typeorm";

export class DeleteTableRadicador1757364775663 implements MigrationInterface {
    name = 'DeleteTableRadicador1757364775663'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Eliminar la tabla radicador completamente
        await queryRunner.dropTable("radicador");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Recrear la tabla radicador en caso de rollback
        await queryRunner.query(`
            CREATE TABLE \`radicador\` (
                \`IdRadicador\` int NOT NULL AUTO_INCREMENT,
                \`NombreRadicador\` varchar(255) NOT NULL,
                \`Estado\` tinyint NOT NULL,
                \`fecha-actualizacion\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`fecha-creacion\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                PRIMARY KEY (\`IdRadicador\`)
            ) ENGINE=InnoDB
        `);
    }
}