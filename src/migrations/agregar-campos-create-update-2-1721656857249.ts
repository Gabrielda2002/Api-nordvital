import { MigrationInterface, QueryRunner } from "typeorm";

const tables = [
  'convenio',
  'diagnostico',
  'documento',
  'especialidad',
  'estadoseguimiento',
  'gruposervicio',
  'ipsprimaria',
  'ipsremite',
  'lugarradicacion',
  'municipio',
  'autorizacion',
  'rol',
  'seguimientoauxiliar',
  'servicio',
  'serviciosolicitado',
  'unidadfuncional',
  'usuario'
];

export class AgregarCamposCreateUpdate1721656857249 implements MigrationInterface {
    name = 'AgregarCamposCreateUpdate1721656857249';

    private async addTimestamps(queryRunner: QueryRunner, table: string): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`${table}\` ADD \`fecha-creacion\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`${table}\` ADD \`fecha-actualizacion\` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`);
    }

    public async up(queryRunner: QueryRunner): Promise<void> {
        for (const table of tables) {
            try {
                await this.addTimestamps(queryRunner, table);
            } catch (error) {
                console.error(`Error adding timestamps to table ${table}:`, error);
            }
        }
    }

    private async dropTimestamps(queryRunner: QueryRunner, table: string): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`${table}\` DROP COLUMN \`fecha-actualizacion\``);
        await queryRunner.query(`ALTER TABLE \`${table}\` DROP COLUMN \`fecha-creacion\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        for (const table of tables) {
            try {
                await this.dropTimestamps(queryRunner, table);
            } catch (error) {
                console.error(`Error dropping timestamps from table ${table}:`, error);
            }
        }
    }
}
