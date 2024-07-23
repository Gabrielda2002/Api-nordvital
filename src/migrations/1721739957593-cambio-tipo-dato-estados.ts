import { MigrationInterface, QueryRunner } from "typeorm";

const tables = [
    'convenio',
    'documento',
    'especialidad',
    'estadoseguimiento',
    'gruposervicio',
    'ipsprimaria',
    'ipsremite',
    'lugarradicacion',
    'municipio',
    'servicio',
    'serviciosolicitado',
    'unidadfuncional',
    'usuario',
    'pacientes',
    'radicador'  
];

const columns = [
    "EstadoConvenio",
    "EstadoDocumento",
    "EstadoEspecialidad",
    "Estado",
    "EstadoGrupoServicio",
    "EstadoIpsPrimaria",
    "EstadoIpsRemite",
    "EstadoLugar",
    "EstadoMunicipio",
    "EstadoServicio",
    "EstadoCup",
    "EstadoUnidad",
    "EstadoUsuario",
    "EstadoPaciente",
    "EstadoRadicador"
];

export class CambioTipoDatoEstados1721739957593 implements MigrationInterface {
    name = "CambioTipoDatoEstados1721739957593";

    private async changeType(queryRunner: QueryRunner, table: string, column: string): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`${table}\` CHANGE COLUMN \`${column}\` Estado VARCHAR(255) NOT NULL`);
        await queryRunner.query(`UPDATE \`${table}\` SET \`Estado\` = 1 WHERE \`Estado\` = 'Activo'`);
        await queryRunner.query(`UPDATE \`${table}\` SET \`Estado\` = 0 WHERE \`Estado\` = 'Inactivo'`);
        await queryRunner.query(`ALTER TABLE \`${table}\` MODIFY COLUMN \`Estado\` TINYINT(1) NOT NULL`);
    }

    public async up(queryRunner: QueryRunner): Promise<void> {
        for (let i = 0; i < tables.length; i++) {
            try {
                await this.changeType(queryRunner, tables[i], columns[i]);
            } catch (error) {
                console.error(`Error cambiando el tipo de dato de la columna ${columns[i]} en la tabla ${tables[i]}:`, error);
            }
        }
    }

    private async revertType(queryRunner: QueryRunner, table: string, column: string): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`${table}\` CHANGE COLUMN \`Estado\` \`${column}\` VARCHAR(255) NOT NULL`);
        await queryRunner.query(`UPDATE \`${table}\` SET \`${column}\` = 'Activo' WHERE \`Estado\` = 1`);
        await queryRunner.query(`UPDATE \`${table}\` SET \`${column}\` = 'Inactivo' WHERE \`Estado\` = 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        for (let i = 0; i < tables.length; i++) {
            try {
                await this.revertType(queryRunner, tables[i], columns[i]);
            } catch (error) {
                console.error(`Error revirtiendo el tipo de dato de la columna ${columns[i]} en la tabla ${tables[i]}:`, error);
            }
        }
    }
}
