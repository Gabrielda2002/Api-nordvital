import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateTableServicio1734358935327 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "servicios",
                columns: [
                    {
                        name: "id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment",
                    },
                    {
                        name: "codigo_servicio",
                        type: "varchar",
                        isNullable: false,
                    },
                    {
                        name: "descripcion",
                        type: "varchar",
                        isNullable: false,
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                    },
                    {
                        name: "updated_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                        onUpdate: "CURRENT_TIMESTAMP",
                    },
                ],
            })
        );

        await queryRunner.createTable(
            new Table({
                name: "notas_tecnicas",
                columns: [
                    {
                        name: "id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment",
                    },
                    {
                        name: "id_eps",
                        type: "int",
                    },
                    {
                        name: "id_servicio",
                        type: "int",
                    },
                    {
                        name: "frecuencia_uso",
                        type: "varchar",
                        isNullable: false,
                    },
                    {
                        name: "cantidad",
                        type: "bigint",
                        isNullable: false,
                    },
                    {
                        name: "subgrupo_servicio",
                        type: "varchar",
                        isNullable: false,
                    },
                    {
                        name: "grupo_servicio",
                        type: "varchar",
                        isNullable: false,
                    },
                    {
                        name: "id_sede",
                        type: "int",
                    },
                    {
                        name: "tarifa",
                        type: "bigint",
                        isNullable: false,
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                    },
                    {
                        name: "updated_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                        onUpdate: "CURRENT_TIMESTAMP",
                    },
                ],
            })
        );

        await queryRunner.createTable(
            new Table({
                name: "servicios_ejecutados",
                columns: [
                    {
                        name: "id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment",
                    },
                    {
                        name: "id_sede",
                        type: "int",
                    },
                    {
                        name: "id_servicio",
                        type: "int",
                    },
                    {
                        name: "cantidad",
                        type: "bigint",
                        isNullable: false,
                    },
                    {
                        name: "tarifa",
                        type: "bigint",
                        isNullable: false,
                    },
                    {
                        name: "estado_servicio",
                        type: "varchar",
                        isNullable: false,
                    },
                    {
                        name: "grupo_servicio",
                        type: "varchar",
                        isNullable: false,
                    },
                    {
                        name: "subgrupo_servicio",
                        type: "varchar",
                        isNullable: false,
                    },
                    {
                        name: "tipo_documento",
                        type: "int",
                    },
                    {
                        name: "identificacion",
                        type: "bigint",
                        isNullable: false,
                    },
                    {
                        name: "nombre_paciente",
                        type: "varchar",
                        isNullable: false,
                    },
                    {
                        name: "sexo_pac",
                        type: "varchar",
                        isNullable: false,
                    },
                    {
                        name: "fecha_nac",
                        type: "date",
                        isNullable: false,
                    },
                    {
                        name: "grupo_rias",
                        type: "varchar",
                        isNullable: false,
                    },
                    {
                        name: "dx_principal",
                        type: "varchar",
                        isNullable: false,
                    },
                    {
                        name: "cod_medico_remisor",
                        type: "varchar",
                        isNullable: false,
                    },
                    {
                        name: "nombre_medico_remisor",
                        type: "varchar",
                        isNullable: false,
                    },
                    {
                        name: "spc_medico_remisor",
                        type: "varchar",
                        isNullable: false,
                    },
                    {
                        name: "sede_atenc",
                        type: "varchar",
                        isNullable: false,
                    },
                    {
                        name: "nombre_contrato",
                        type: "varchar",
                        isNullable: false,
                    },
                    {
                        name: "regimen_usuario",
                        type: "varchar",
                        isNullable: false,
                    },
                    {
                        name: "num_autorizacion",
                        type: "varchar",
                        isNullable: false,
                    },
                    {
                        name: "fecha_asign",
                        type: "date",
                        isNullable: false,
                    },
                    {
                        name: "fecha_orden",
                        type: "date",
                        isNullable: false,
                    },
                    {
                        name: "fecha_prest",
                        type: "date",
                        isNullable: false,
                    },
                    {
                        name: "estado_cita",
                        type: "varchar",
                        isNullable: false,
                    },
                    {
                        name: "tipo_servicio",
                        type: "varchar",
                        isNullable: false,
                    },
                    {
                        name: "tipo_cita",
                        type: "varchar",
                        isNullable: false,
                    },
                    {
                        name: "usuario_genera",
                        type: "varchar",
                        isNullable: false,
                    },
                    {
                        name: "convenio",
                        type: "varchar",
                        isNullable: false,
                    },
                    {
                        name: "servicio_pgp",
                        type: "varchar",
                        isNullable: false,
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                    },
                    {
                        name: "updated_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                        onUpdate: "CURRENT_TIMESTAMP",
                    },
                ],
            })
        );

        await queryRunner.createForeignKey(
            "notas_tecnicas",
            new TableForeignKey({
                columnNames: ["id_eps"],
                referencedColumnNames: ["IdConvenio"],
                referencedTableName: "convenio",
                onDelete: "CASCADE",
            })
        );

        await queryRunner.createForeignKey(
            "notas_tecnicas",
            new TableForeignKey({
                columnNames: ["id_servicio"],
                referencedColumnNames: ["id"],
                referencedTableName: "servicios",
                onDelete: "CASCADE",
            })
        );

        await queryRunner.createForeignKey(
            "notas_tecnicas",
            new TableForeignKey({
                columnNames: ["id_sede"],
                referencedColumnNames: ["IdLugar"],
                referencedTableName: "sedes",
                onDelete: "CASCADE",
            })
        );

        await queryRunner.createForeignKey(
            "servicios_ejecutados",
            new TableForeignKey({
                columnNames: ["id_sede"],
                referencedColumnNames: ["IdLugar"],
                referencedTableName: "sedes",
                onDelete: "CASCADE",
            })
        );

        await queryRunner.createForeignKey(
            "servicios_ejecutados",
            new TableForeignKey({
                columnNames: ["id_servicio"],
                referencedColumnNames: ["id"],
                referencedTableName: "servicios",
                onDelete: "CASCADE",
            })
        );

        await queryRunner.createForeignKey(
            "servicios_ejecutados",
            new TableForeignKey({
                columnNames: ["tipo_documento"],
                referencedColumnNames: ["IdDocumento"],
                referencedTableName: "documento",
                onDelete: "CASCADE",
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("servicios_ejecutados");
        await queryRunner.dropTable("notas_tecnicas");
        await queryRunner.dropTable("servicio");
    }
}