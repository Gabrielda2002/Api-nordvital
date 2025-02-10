import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateTablePacientesCosalud1739190499498 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "pacientes_cosalud",
            columns: [
                {
                    name: "id",
                    type: "int",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment"
                },
                {
                    name: 'TPS_IDN_ID',
                    type: 'varchar',
                    length: '50',
                },
                {
                    name: 'HST_IDN_NUMERO_IDENTIFICACION',
                    type: 'varchar',
                },
                {
                    name: 'AFL_PRIMER_APELLIDO',
                    type: 'varchar',
                },
                {
                    name: 'AFL_SEGUNDO_APELLIDO',
                    type: 'varchar',
                    isNullable: true
                },
                {
                    name: 'AFL_PRIMER_NOMBRE',
                    type: 'varchar',
                },
                {
                    name: 'AFL_SEGUNDO_NOMBRE',
                    type: 'varchar',
                    isNullable: true
                },
                {
                    name: 'AFL_FECHA_NACIMIENTO',
                    type: 'varchar',
                    length: '50',
                },
                {
                    name: 'TPS_GNR_ID',
                    type: 'varchar'
                },
                {
                    name: 'TPS_RGM_ID',
                    type: 'varchar'
                },
                {
                    name: 'ENT_ID',
                    type: 'varchar'
                },
                {
                    name: 'TPS_AFL_ID',
                    type: 'varchar'
                },
                {
                    name: 'ZNS_ID',
                    type: 'varchar'
                },
                {
                    name: 'TPS_EST_AFL_ID',
                    type: 'varchar'
                },
                {
                    name: 'TPS_CND_BNF_ID',
                    type: 'varchar',
                    isNullable: true
                },
                {
                    name: 'DPR_ID',
                    type: 'int'
                },
                {
                    name: 'MNC_ID',
                    type: 'int'
                },
                {
                    name: 'Divipola',
                    type: 'varchar'
                },
                {
                    name: 'tps_mdl_sbs_id',
                    type: 'varchar',
                    isNullable: true
                },
                {
                    name: 'tps_nvl_ssb_id',
                    type: 'varchar',
                    isNullable: true
                },
                {
                    name: 'tps_grp_pbl_id',
                    type: 'varchar',
                },
                {
                    name: 'IPS_PRIMARIA',
                    type: 'varchar',
                    length: '150',
                },
                {
                    name: 'ENT_REGIMEN',
                    type: 'varchar',
                },
                {
                    name: 'DIRECCION',
                    type: 'varchar',
                    length: '255',
                    isNullable: true
                },
                {
                    name: 'TELEFONO',
                    type: 'varchar',
                    length: '50',
                    isNullable: true
                },
                {
                    name: 'ENT_ID_ASIGNADA',
                    type: 'varchar',
                },
                {
                    name: 'direccionsisben',
                    type: 'varchar',
                    isNullable: true
                },
                {
                    name: 'telefonosisben',
                    type: 'varchar',
                    isNullable: true
                },
                {
                    name: 'CORREO',
                    type: 'varchar',
                    length: '255',
                    isNullable: true
                },
                {
                    name: 'REGIMEN',
                    type: 'varchar',
                    length: '50'
                },
                {
                    name: 'DIVIPOLA2',
                    type: 'varchar',
                    isNullable: true
                },
                {
                    name: 'SUCURSAL',
                    type: 'varchar',
                    length: '255',
                },
                {
                    name: 'DEPARTAMENTO',
                    type: 'varchar',
                    length: '255'
                },
                {
                    name: 'MUNICIPIO',
                    type: 'varchar',
                    length: '100'
                }
            ]
        }), true);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("pacientes_cosalud");
    }

}