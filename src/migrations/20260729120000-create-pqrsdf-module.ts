import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreatePqrsdfModule20260729120000 implements MigrationInterface {
    name = "CreatePqrsdfModule20260729120000";

    public async up(queryRunner: QueryRunner): Promise<void> {
        // 1. pqrs_areas
        await queryRunner.createTable(
            new Table({
                name: "pqrs_areas",
                columns: [
                    {
                        name: "id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment",
                    },
                    {
                        name: "name",
                        type: "varchar",
                        length: "100",
                    },
                    {
                        name: "status",
                        type: "tinyint",
                        width: 1,
                        default: 1,
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
            }),
            true
        );

        // 2. pqrs_population_types
        await queryRunner.createTable(
            new Table({
                name: "pqrs_population_types",
                columns: [
                    {
                        name: "id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment",
                    },
                    {
                        name: "name",
                        type: "varchar",
                        length: "100",
                    },
                    {
                        name: "status",
                        type: "tinyint",
                        width: 1,
                        default: 1,
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
            }),
            true
        );

        // 3. pqrs_general_reasons
        await queryRunner.createTable(
            new Table({
                name: "pqrs_general_reasons",
                columns: [
                    {
                        name: "id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment",
                    },
                    {
                        name: "name",
                        type: "varchar",
                        length: "100",
                    },
                    {
                        name: "status",
                        type: "tinyint",
                        width: 1,
                        default: 1,
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
            }),
            true
        );

        // 4. pqrsdf
        await queryRunner.createTable(
            new Table({
                name: "pqrsdf",
                columns: [
                    {
                        name: "id",
                        type: "int",
                        unsigned: true,
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment",
                        comment: "Identificador único de la PQRSDF",
                    },
                    {
                        name: "patient_id",
                        type: "int",
                        comment: "Paciente afectado (nombre, documento, contacto y asegurador se derivan del paciente)",
                    },
                    {
                        name: "population_type_id",
                        type: "int",
                        comment: "TIPO DE POBLACION",
                    },
                    {
                        name: "presented_by",
                        type: "enum",
                        enum: ["USUARIO_AFECTADO", "FAMILIAR", "ASEGURADOR"],
                        comment: "PQRSDF presentada por",
                    },
                    {
                        name: "presenter_name",
                        type: "varchar",
                        length: "150",
                        isNullable: true,
                        comment: "Nombre de quien presenta la PQRSDF (obligatorio si no es el usuario afectado)",
                    },
                    {
                        name: "classification",
                        type: "enum",
                        enum: ["PETICION", "QUEJA", "RECLAMO", "DENUNCIA", "SUGERENCIA", "FELICITACION"],
                        comment: "CLASIFICACION DE PQRD",
                    },
                    {
                        name: "instance",
                        type: "enum",
                        enum: ["SUPERSALUD", "EPS", "SECRETARIA_SALUD", "IPS", "OTRO"],
                        comment: "INSTANCIA",
                    },
                    {
                        name: "reception_medium",
                        type: "enum",
                        enum: ["PAGINA_WEB", "WHATSAPP", "SALA", "BUZON"],
                        comment: "MEDIO DE RECEPCION DE PQRDSF",
                    },
                    {
                        name: "filing_number",
                        type: "int",
                        isUnique: true,
                        comment: "NUMERO DE RADICADO (secuencial autogenerado por el sistema)",
                    },
                    {
                        name: "origin_area_id",
                        type: "int",
                        comment: "AREA DONDE SE ORIGINO EL EVENTO",
                    },
                    {
                        name: "general_reason_id",
                        type: "int",
                        comment: "MOTIVO GENERAL",
                    },
                    {
                        name: "specific_reason",
                        type: "varchar",
                        length: "250",
                        isNullable: true,
                        comment: "MOTIVO ESPECIFICO",
                    },
                    {
                        name: "generation_area_id",
                        type: "int",
                        comment: "AREA DONDE SE GENERA PQRDSF",
                    },
                    {
                        name: "description",
                        type: "text",
                        comment: "DESCRIPCION DE PQRDSF",
                    },
                    {
                        name: "pqrs_date",
                        type: "date",
                        comment: "FECHA DE LA PQRDSF",
                    },
                    {
                        name: "received_date",
                        type: "date",
                        comment: "FECHA DE RECIBIDO PQRDSF",
                    },
                    {
                        name: "resolution_area_id",
                        type: "int",
                        isNullable: true,
                        comment: "AREA CON LA CUAL SE RESOLVIO EL EVENTO",
                    },
                    {
                        name: "response_date",
                        type: "date",
                        isNullable: true,
                        comment: "FECHA DE RESPUESTA PQRDSF",
                    },
                    {
                        name: "response_summary",
                        type: "text",
                        isNullable: true,
                        comment: "RESUMEN DE LA RESPUESTA",
                    },
                    {
                        name: "notification_medium",
                        type: "enum",
                        enum: ["CORREO_ELECTRONICO", "PERSONALMENTE", "WHATSAPP"],
                        isNullable: true,
                        comment: "MEDIO DE NOTIFICACION DE RESPUESTA",
                    },
                    {
                        name: "affected_attribute",
                        type: "enum",
                        enum: ["OPORTUNIDAD", "ACCESIBILIDAD", "CONTINUIDAD", "PERTINENCIA", "CALIDEZ", "OTRO"],
                        isNullable: true,
                        comment: "ATRIBUTO AFECTADO",
                    },
                    {
                        name: "improvement_action",
                        type: "tinyint",
                        width: 1,
                        isNullable: true,
                        comment: "ACCION DE MEJORA (1=SI, 0=NO)",
                    },
                    {
                        name: "status",
                        type: "enum",
                        enum: ["ABIERTO", "EN_GESTION", "CERRADO"],
                        default: "'ABIERTO'",
                        comment: "ESTADO",
                    },
                    {
                        name: "created_by",
                        type: "int",
                        comment: "Usuario que registra la PQRSDF",
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
                indices: [
                    { name: "IDX_pqrsdf_patient", columnNames: ["patient_id"] },
                    { name: "IDX_pqrsdf_population_type", columnNames: ["population_type_id"] },
                    { name: "IDX_pqrsdf_origin_area", columnNames: ["origin_area_id"] },
                    { name: "IDX_pqrsdf_general_reason", columnNames: ["general_reason_id"] },
                    { name: "IDX_pqrsdf_generation_area", columnNames: ["generation_area_id"] },
                    { name: "IDX_pqrsdf_resolution_area", columnNames: ["resolution_area_id"] },
                    { name: "IDX_pqrsdf_created_by", columnNames: ["created_by"] },
                    { name: "IDX_pqrsdf_filing_number", columnNames: ["filing_number"], isUnique: true },
                ],
            }),
            true
        );

        await queryRunner.createForeignKey(
            "pqrsdf",
            new TableForeignKey({
                name: "fk_pqrsdf_patient",
                columnNames: ["patient_id"],
                referencedTableName: "patients",
                referencedColumnNames: ["id"],
                onDelete: "CASCADE",
            })
        );

        await queryRunner.createForeignKey(
            "pqrsdf",
            new TableForeignKey({
                name: "fk_pqrsdf_population_type",
                columnNames: ["population_type_id"],
                referencedTableName: "pqrs_population_types",
                referencedColumnNames: ["id"],
                onDelete: "CASCADE",
            })
        );

        await queryRunner.createForeignKey(
            "pqrsdf",
            new TableForeignKey({
                name: "fk_pqrsdf_origin_area",
                columnNames: ["origin_area_id"],
                referencedTableName: "pqrs_areas",
                referencedColumnNames: ["id"],
                onDelete: "CASCADE",
            })
        );

        await queryRunner.createForeignKey(
            "pqrsdf",
            new TableForeignKey({
                name: "fk_pqrsdf_general_reason",
                columnNames: ["general_reason_id"],
                referencedTableName: "pqrs_general_reasons",
                referencedColumnNames: ["id"],
                onDelete: "CASCADE",
            })
        );

        await queryRunner.createForeignKey(
            "pqrsdf",
            new TableForeignKey({
                name: "fk_pqrsdf_generation_area",
                columnNames: ["generation_area_id"],
                referencedTableName: "pqrs_areas",
                referencedColumnNames: ["id"],
                onDelete: "CASCADE",
            })
        );

        await queryRunner.createForeignKey(
            "pqrsdf",
            new TableForeignKey({
                name: "fk_pqrsdf_resolution_area",
                columnNames: ["resolution_area_id"],
                referencedTableName: "pqrs_areas",
                referencedColumnNames: ["id"],
                onDelete: "CASCADE",
            })
        );

        await queryRunner.createForeignKey(
            "pqrsdf",
            new TableForeignKey({
                name: "fk_pqrsdf_created_by_user",
                columnNames: ["created_by"],
                referencedTableName: "users",
                referencedColumnNames: ["id"],
                onDelete: "CASCADE",
            })
        );

        // 5. Seed pqrs_areas
        await queryRunner.query(
            `INSERT INTO \`pqrs_areas\` (\`name\`, \`status\`) VALUES
            ('SERVICIO AL CLIENTE', 1),
            ('ENFERMERIA', 1),
            ('ODONTOLOGIA', 1),
            ('AGENDAMIENTO', 1),
            ('GESTION DOCUMENTAL', 1),
            ('AUTORIZACIONES', 1),
            ('OTRO', 1)`
        );

        // 6. Seed pqrs_population_types
        await queryRunner.query(
            `INSERT INTO \`pqrs_population_types\` (\`name\`, \`status\`) VALUES
            ('ADULTO MAYOR', 1),
            ('DISCAPACIDAD', 1),
            ('GESTANTE', 1),
            ('MENOR DE EDAD', 1),
            ('VICTIMA DEL CONFLICTO ARMADO', 1),
            ('POBLACION LGBTIQ+', 1),
            ('OTRO', 1),
            ('NINGUNO', 1)`
        );

        // 7. Seed pqrs_general_reasons
        await queryRunner.query(
            `INSERT INTO \`pqrs_general_reasons\` (\`name\`, \`status\`) VALUES
            ('CITA MEDICA', 1),
            ('APOYO DIAGNOSTICO', 1),
            ('APOYO TERAPEUTICO', 1),
            ('TRAMITE ADMINISTRATIVO', 1),
            ('PROCEDIMIENTO', 1)`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop pqrsdf FKs + table
        const pqrsdf = await queryRunner.getTable("pqrsdf");
        if (pqrsdf) {
            for (const fk of pqrsdf.foreignKeys) {
                await queryRunner.dropForeignKey("pqrsdf", fk);
            }
            await queryRunner.dropTable("pqrsdf");
        }

        // Drop pqrs_areas
        const pqrsAreas = await queryRunner.getTable("pqrs_areas");
        if (pqrsAreas) {
            await queryRunner.dropTable("pqrs_areas");
        }

        // Drop pqrs_population_types
        const pqrsPopulationTypes = await queryRunner.getTable("pqrs_population_types");
        if (pqrsPopulationTypes) {
            await queryRunner.dropTable("pqrs_population_types");
        }

        // Drop pqrs_general_reasons
        const pqrsGeneralReasons = await queryRunner.getTable("pqrs_general_reasons");
        if (pqrsGeneralReasons) {
            await queryRunner.dropTable("pqrs_general_reasons");
        }
    }
}
