import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateSatisfactionSurveysModule20260729100000 implements MigrationInterface {
    name = "CreateSatisfactionSurveysModule20260729100000";

    public async up(queryRunner: QueryRunner): Promise<void> {
        // 1. special_populations
        await queryRunner.createTable(
            new Table({
                name: "special_populations",
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

        // 2. attention_services
        await queryRunner.createTable(
            new Table({
                name: "attention_services",
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
                        length: "150",
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

        // 3. satisfaction_surveys
        await queryRunner.createTable(
            new Table({
                name: "satisfaction_surveys",
                columns: [
                    {
                        name: "id",
                        type: "int",
                        unsigned: true,
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment",
                        comment: "Identificador único de la encuesta",
                    },
                    {
                        name: "patient_id",
                        type: "int",
                    },
                    {
                        name: "municipality_id",
                        type: "int",
                    },
                    {
                        name: "special_population_id",
                        type: "int",
                    },
                    {
                        name: "attention_service_id",
                        type: "int",
                    },
                    {
                        name: "timely_appointment",
                        type: "enum",
                        enum: ["SI", "NO", "NA"],
                        comment: "¿Su cita médica fue asignada de manera oportuna?",
                    },
                    {
                        name: "punctual_care",
                        type: "enum",
                        enum: ["SI", "NO", "NA"],
                        comment: "¿Fue atendido(a) con puntualidad?",
                    },
                    {
                        name: "professional_interest",
                        type: "enum",
                        enum: ["SI", "NO", "NA"],
                        comment: "¿El profesional mostró interés en conocer su historia clínica y motivo de consulta?",
                    },
                    {
                        name: "clear_recommendations",
                        type: "enum",
                        enum: ["SI", "NO", "NA"],
                        comment: "¿Las recomendaciones brindadas por el profesional fueron claras y comprensibles?",
                    },
                    {
                        name: "signage_helped",
                        type: "enum",
                        enum: ["SI", "NO", "NA"],
                        comment: "¿La señalización dentro de la sede facilitó su ubicación?",
                    },
                    {
                        name: "adequate_facilities",
                        type: "enum",
                        enum: ["SI", "NO", "NA"],
                        comment: "¿Considera que las instalaciones son adecuadas y cómodas?",
                    },
                    {
                        name: "clean_facilities",
                        type: "enum",
                        enum: ["SI", "NO", "NA"],
                        comment: "¿Considera que las instalaciones se encuentran limpias y en buen orden?",
                    },
                    {
                        name: "professional_care_rating",
                        type: "enum",
                        enum: ["MUY_BUENO", "BUENO", "REGULAR", "MALO", "MUY_MALO"],
                        comment: "¿Cómo calificaría la atención brindada por el profesional de salud que lo(a) atendió?",
                    },
                    {
                        name: "customer_service_rating",
                        type: "enum",
                        enum: ["MUY_BUENO", "BUENO", "REGULAR", "MALO", "MUY_MALO"],
                        comment: "¿Cómo calificaría la atención brindada por parte del personal de servicio al cliente?",
                    },
                    {
                        name: "global_experience",
                        type: "enum",
                        enum: ["MUY_BUENO", "BUENO", "REGULAR", "MALO", "MUY_MALO", "NO_RESPONDE"],
                        comment: "¿Cómo calificaría su experiencia global respecto a los servicios de salud que ha recibido a través de la IPS?",
                    },
                    {
                        name: "would_recommend",
                        type: "enum",
                        enum: ["DEFINITIVAMENTE_SI", "PROBABLEMENTE_SI", "PROBABLEMENTE_NO", "DEFINITIVAMENTE_NO", "NO_RESPONDE"],
                        comment: "¿Recomendaría a sus familiares y amigos a Nordvital IPS?",
                    },
                    {
                        name: "created_by",
                        type: "int",
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
                    { name: "IDX_ss_patient", columnNames: ["patient_id"] },
                    { name: "IDX_ss_municipality", columnNames: ["municipality_id"] },
                    { name: "IDX_ss_special_population", columnNames: ["special_population_id"] },
                    { name: "IDX_ss_attention_service", columnNames: ["attention_service_id"] },
                    { name: "IDX_ss_created_by", columnNames: ["created_by"] },
                ],
            }),
            true
        );

        await queryRunner.createForeignKey(
            "satisfaction_surveys",
            new TableForeignKey({
                name: "fk_ss_patient",
                columnNames: ["patient_id"],
                referencedTableName: "patients",
                referencedColumnNames: ["id"],
                onDelete: "CASCADE",
            })
        );

        await queryRunner.createForeignKey(
            "satisfaction_surveys",
            new TableForeignKey({
                name: "fk_ss_municipality",
                columnNames: ["municipality_id"],
                referencedTableName: "municipalities",
                referencedColumnNames: ["id"],
                onDelete: "CASCADE",
            })
        );

        await queryRunner.createForeignKey(
            "satisfaction_surveys",
            new TableForeignKey({
                name: "fk_ss_special_population",
                columnNames: ["special_population_id"],
                referencedTableName: "special_populations",
                referencedColumnNames: ["id"],
                onDelete: "CASCADE",
            })
        );

        await queryRunner.createForeignKey(
            "satisfaction_surveys",
            new TableForeignKey({
                name: "fk_ss_attention_service",
                columnNames: ["attention_service_id"],
                referencedTableName: "attention_services",
                referencedColumnNames: ["id"],
                onDelete: "CASCADE",
            })
        );

        await queryRunner.createForeignKey(
            "satisfaction_surveys",
            new TableForeignKey({
                name: "fk_ss_created_by_user",
                columnNames: ["created_by"],
                referencedTableName: "users",
                referencedColumnNames: ["id"],
                onDelete: "CASCADE",
            })
        );

        // 4. Seed special_populations
        await queryRunner.query(
            `INSERT INTO \`special_populations\` (\`name\`, \`status\`) VALUES
            ('PERSONA EN SITUACION DE DISCAPACIDAD', 1),
            ('PERSONA MAYOR (60 AÑOS O MAS)', 1),
            ('JOVEN (ENTRE 14 Y 28 AÑOS)', 1),
            ('MUJER CABEZA DE HOGAR', 1),
            ('PERTENECIENTE A COMUNIDAD INDIGENA', 1),
            ('PERTENECIENTE A COMUNIDAD AFRODESCENDIENTE', 1),
            ('POBLACION LGBTIQ+', 1),
            ('MIGRANTE O DESPLAZADO', 1),
            ('PERSONA VICTIMA DEL CONFLICTO ARMADO', 1),
            ('POBLACION RURAL O CAMPESINA', 1),
            ('NINGUNO DE LOS ANTERIORES', 1),
            ('PREFIERO NO CONTESTAR', 1)`
        );

        // 5. Seed attention_services
        await queryRunner.query(
            `INSERT INTO \`attention_services\` (\`name\`, \`status\`) VALUES
            ('ODONTOLOGIA GENERAL Y/O ESPECIALIZADA', 1),
            ('MEDICINA GENERAL Y/O ESPECIALIDADES MEDICAS', 1),
            ('ENFERMERIA, NUTRICION, PSICOLOGIA, TERAPIAS', 1),
            ('IMAGENES DIAGNOSTICAS IONIZANTES, NO IONIZANTES, RADIOLOGIA ODONTOLOGICA Y/O DIAGNOSTICO VASCULAR', 1),
            ('TOMA DE MUESTRAS Y LABORATORIO CLINICO', 1),
            ('VACUNACION', 1),
            ('SALUD VISUAL', 1),
            ('SERVICIO AL CLIENTE', 1)`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop satisfaction_surveys FKs + table
        const satisfactionSurveys = await queryRunner.getTable("satisfaction_surveys");
        if (satisfactionSurveys) {
            for (const fk of satisfactionSurveys.foreignKeys) {
                await queryRunner.dropForeignKey("satisfaction_surveys", fk);
            }
            await queryRunner.dropTable("satisfaction_surveys");
        }

        // Drop attention_services
        const attentionServices = await queryRunner.getTable("attention_services");
        if (attentionServices) {
            await queryRunner.dropTable("attention_services");
        }

        // Drop special_populations
        const specialPopulations = await queryRunner.getTable("special_populations");
        if (specialPopulations) {
            await queryRunner.dropTable("special_populations");
        }
    }
}
