import { MigrationInterface, QueryRunner } from "typeorm";

export class RadicacionModuleSchemaRefactor20260305135039 implements MigrationInterface {
    name = "RadicacionModuleSchemaRefactor20260305135039";

    public async up(queryRunner: QueryRunner): Promise<void> {

        // ─── RENAME TABLES ───────────────────────────────────────────────────────────
        await queryRunner.query(`RENAME TABLE \`radicacion\` TO \`radicaciones\``);
        await queryRunner.query(`RENAME TABLE \`cupspaciente\` TO \`cups_radicados\``);
        await queryRunner.query(`RENAME TABLE \`seguimientoauxiliar\` TO \`tracking_records\``);
        await queryRunner.query(`RENAME TABLE \`gestion_auxiliar_cirugias\` TO \`surgery_tracking_records\``);
        await queryRunner.query(`RENAME TABLE \`pacientes\` TO \`patients\``);
        await queryRunner.query(`RENAME TABLE \`especialidad\` TO \`specialties\``);
        await queryRunner.query(`RENAME TABLE \`ipsremite\` TO \`ips_remite\``);
        await queryRunner.query(`RENAME TABLE \`gruposervicio\` TO \`service_groups\``);
        await queryRunner.query(`RENAME TABLE \`servicio\` TO \`services\``);
        await queryRunner.query(`RENAME TABLE \`autorizacion\` TO \`authorization_statuses\``);
        await queryRunner.query(`RENAME TABLE \`estadoseguimiento\` TO \`tracking_statuses\``);
        await queryRunner.query(`RENAME TABLE \`unidadfuncional\` TO \`functional_units\``);
        await queryRunner.query(`RENAME TABLE \`serviciosolicitado\` TO \`requested_services\``);
        await queryRunner.query(`RENAME TABLE \`convenio\` TO \`agreements\``);
        await queryRunner.query(`RENAME TABLE \`ipsprimaria\` TO \`ips_primaria\``);
        await queryRunner.query(`RENAME TABLE \`documento\` TO \`document_types\``);
        await queryRunner.query(`RENAME TABLE \`diagnostico\` TO \`diagnoses\``);
        await queryRunner.query(`RENAME TABLE \`cirugias\` TO \`surgeries\``);
        await queryRunner.query(`RENAME TABLE \`municipio\` TO \`municipalities\``);
        await queryRunner.query(`RENAME TABLE \`sedes\` TO \`headquarters\``);
        await queryRunner.query(`RENAME TABLE \`profesionales\` TO \`professionals\``);
        await queryRunner.query(`RENAME TABLE \`soportes\` TO \`support_documents_radicaciones\``);


        // ─── RADICACIONES ────────────────────────────────────────────────────────────
        await queryRunner.query(`ALTER TABLE \`radicaciones\` CHANGE \`IdRadicacion\` \`id\` INT NOT NULL AUTO_INCREMENT`);
        await queryRunner.query(`ALTER TABLE \`radicaciones\` CHANGE \`FechaOrden\` \`order_date\` DATE NULL`);
        await queryRunner.query(`ALTER TABLE \`radicaciones\` CHANGE \`FechaAuditoria\` \`audit_date\` DATE NULL`);
        await queryRunner.query(`ALTER TABLE \`radicaciones\` CHANGE \`LugarRadicacion\` \`place_id\` INT NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`radicaciones\` CHANGE \`IpsRemite\` \`ips_remite_id\` INT NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`radicaciones\` CHANGE \`Especialidad\` \`specialty_id\` INT NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`radicaciones\` CHANGE \`GrupoServicios\` \`service_group_id\` INT NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`radicaciones\` CHANGE \`TipoServicio\` \`service_type_id\` INT NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`radicaciones\` CHANGE \`QuienRadica\` \`filed_by_user_id\` INT NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`radicaciones\` CHANGE \`Auditora\` \`audit_notes\` VARCHAR(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`radicaciones\` CHANGE \`JustificacionAuditoria\` \`audit_justification\` TEXT NULL`);
        await queryRunner.query(`ALTER TABLE \`radicaciones\` CHANGE \`ConceptoAuditoria\` \`audit_status_id\` INT NULL`);
        await queryRunner.query(`ALTER TABLE \`radicaciones\` CHANGE \`Paciente_id\` \`patient_id\` INT NULL`);
        await queryRunner.query(`ALTER TABLE \`radicaciones\` CHANGE \`id_soportes\` \`support_id\` INT NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`radicaciones\` CHANGE \`id_diagnostico\` \`diagnosis_id\` INT NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`radicaciones\` CHANGE \`id_profesional\` \`professional_id\` INT NULL`);
        await queryRunner.query(`ALTER TABLE \`radicaciones\` CHANGE \`profesional\` \`professional_name\` VARCHAR(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`radicaciones\` CHANGE \`FechaRadicado\` \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        
        // ─── support_documents_radicaciones ──────────────────────────────────────────────────────────
        await queryRunner.query(`ALTER TABLE \`support_documents_radicaciones\` CHANGE \`nombre\` \`name\` VARCHAR(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`support_documents_radicaciones\` CHANGE \`tipo\` \`type\` VARCHAR(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`support_documents_radicaciones\` CHANGE \`fechaCreacion\` \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`support_documents_radicaciones\` CHANGE \`fechaActualizacion\` \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);

        // ─── professionals ──────────────────────────────────────────────────────────
        await queryRunner.query(`ALTER TABLE \`professionals\` CHANGE \`nombre\` \`name\` VARCHAR(255) NOT NULL`);

        // ─── CUPS_RADICADOS ──────────────────────────────────────────────────────────

        await queryRunner.query(`ALTER TABLE \`cups_radicados\` CHANGE \`IdCups\` \`id\` INT NOT NULL AUTO_INCREMENT`);
        await queryRunner.query(`ALTER TABLE \`cups_radicados\` CHANGE \`Estado\` \`status_id\` INT NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`cups_radicados\` CHANGE \`observacionCups\` \`observation\` VARCHAR(500) NULL`);
        await queryRunner.query(`ALTER TABLE \`cups_radicados\` CHANGE \`UnidadFuncional\` \`functional_unit_id\` INT NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`cups_radicados\` CHANGE \`IDRADICADO\` \`radicacion_id\` INT NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`cups_radicados\` CHANGE \`estado_carta_recobro\` \`status_recovery_latter\` VARCHAR(50) NULL`);
        await queryRunner.query(`ALTER TABLE \`cups_radicados\` CHANGE \`fecha_audita_carta_recobro\` \`date_audit_recovery_latter\` DATE NULL`);
        await queryRunner.query(`ALTER TABLE \`cups_radicados\` CHANGE \`cantidad\` \`quantity\` INT NOT NULL DEFAULT 1`);
        await queryRunner.query(`ALTER TABLE \`cups_radicados\` CHANGE \`servicio_id\` \`requested_service_id\` INT NULL`);

        // ─── TRACKING_RECORDS (seguimientoauxiliar) ──────────────────────────────────
        await queryRunner.query(`ALTER TABLE \`tracking_records\` CHANGE \`IdSeguimiento\` \`id\` INT NOT NULL AUTO_INCREMENT`);
        await queryRunner.query(`ALTER TABLE \`tracking_records\` CHANGE \`fecha-creacion\` \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`tracking_records\` CHANGE \`fecha-actualizacion\` \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`tracking_records\` CHANGE \`ObservacionSeguimiento\` \`observation\` VARCHAR(500) NULL`);
        await queryRunner.query(`ALTER TABLE \`tracking_records\` CHANGE \`EstadoSeguimiento\` \`status_id\` INT NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`tracking_records\` CHANGE \`id_cups_radicados\` \`cups_radicado_id\` INT NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`tracking_records\` CHANGE \`usuario_id\` \`user_id\` INT NULL`);

        // ─── surgeries ────────────────────────────────────────────────
        await queryRunner.query(`ALTER TABLE \`surgeries\` CHANGE \`estado\` \`status_id\` INT NULL`);
        await queryRunner.query(`ALTER TABLE \`surgeries\` CHANGE \`fecha_cirugia\` \`surgery_date\` DATE NOT NULL`);
    await queryRunner.query(`ALTER TABLE \`surgeries\` CHANGE \`hora_programada\` \`scheduled_time\` TIME NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`surgeries\` CHANGE \`ips_remitente\` \`ips_remite_id\` INT NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`surgeries\` CHANGE \`observaciones\` \`observation\` VARCHAR(500) NULL`);
        await queryRunner.query(`ALTER TABLE \`surgeries\` CHANGE \`radicado_id\` \`radicacion_id\` INT NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`surgeries\` CHANGE \`fecha_paraclinico\` \`paraclinical_date\` DATE NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`surgeries\` CHANGE \`fecha_anesteciologia\` \`anesthesiology_date\` DATE NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`surgeries\` CHANGE \`especialista\` \`specialist\` VARCHAR(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`surgeries\` CHANGE \`createdAt\` \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`surgeries\` CHANGE \`updatedAt\` \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);


        // ─── PATIENTS ────────────────────────────────────────────────────────────────
        await queryRunner.query(`ALTER TABLE \`patients\` CHANGE \`Documento\` \`document_type_id\` INT NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`patients\` CHANGE \`Identificacion\` \`document_number\` BIGINT NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`patients\` CHANGE \`NombreCompleto\` \`name\` VARCHAR(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`patients\` CHANGE \`NumeroCelular\` \`phone_number\` VARCHAR(20) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`patients\` CHANGE \`numeroCelular2\` \`phone_number_2\` VARCHAR(20) NULL`);
        await queryRunner.query(`ALTER TABLE \`patients\` CHANGE \`TelefonoFijo\` \`landline\` VARCHAR(20) NULL`);
        await queryRunner.query(`ALTER TABLE \`patients\` CHANGE \`Email\` \`email\` VARCHAR(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`patients\` CHANGE \`Direccion\` \`address\` VARCHAR(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`patients\` CHANGE \`Convenio\` \`agreement_id\` INT NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`patients\` CHANGE \`ipsPrimaria\` \`ips_primary_id\` INT NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`patients\` CHANGE \`Estado\` \`status\` TINYINT NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`patients\` CHANGE \`fecha-creacion\` \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`patients\` CHANGE \`fecha-actualizacion\` \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);

        // ─── SPECIALTIES ─────────────────────────────────────────────────────────────
        await queryRunner.query(`ALTER TABLE \`specialties\` CHANGE \`IdEspecialidad\` \`id\` INT NOT NULL AUTO_INCREMENT`);
        await queryRunner.query(`ALTER TABLE \`specialties\` CHANGE \`NombreEspecialidad\` \`name\` VARCHAR(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`specialties\` CHANGE \`Estado\` \`status\` TINYINT NOT NULL DEFAULT 1`);
        await queryRunner.query(`ALTER TABLE \`specialties\` CHANGE \`fecha-creacion\` \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`specialties\` CHANGE \`fecha-actualizacion\` \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);

        // ─── IPS_REMITE ──────────────────────────────────────────────────────────────
        await queryRunner.query(`ALTER TABLE \`ips_remite\` CHANGE \`IdIpsRemite\` \`id\` INT NOT NULL AUTO_INCREMENT`);
        await queryRunner.query(`ALTER TABLE \`ips_remite\` CHANGE \`NombreIpsRemite\` \`name\` VARCHAR(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`ips_remite\` CHANGE \`Estado\` \`status\` TINYINT NOT NULL DEFAULT 1`);
        await queryRunner.query(`ALTER TABLE \`ips_remite\` CHANGE \`fecha-creacion\` \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`ips_remite\` CHANGE \`fecha-actualizacion\` \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);

        // ─── SERVICE_GROUPS ──────────────────────────────────────────────────────────
        await queryRunner.query(`ALTER TABLE \`service_groups\` CHANGE \`IdGrupo\` \`id\` INT NOT NULL AUTO_INCREMENT`);
        await queryRunner.query(`ALTER TABLE \`service_groups\` CHANGE \`NombreGrupo\` \`name\` VARCHAR(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`service_groups\` CHANGE \`Estado\` \`status\` TINYINT NOT NULL DEFAULT 1`);
        await queryRunner.query(`ALTER TABLE \`service_groups\` CHANGE \`fecha-creacion\` \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`service_groups\` CHANGE \`fecha-actualizacion\` \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);

        // ─── SERVICES ────────────────────────────────────────────────────────────────
        await queryRunner.query(`ALTER TABLE \`services\` CHANGE \`IdServicio\` \`id\` INT NOT NULL AUTO_INCREMENT`);
        await queryRunner.query(`ALTER TABLE \`services\` CHANGE \`NombreServicio\` \`name\` VARCHAR(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`services\` CHANGE \`Estado\` \`status\` TINYINT NOT NULL DEFAULT 1`);
        await queryRunner.query(`ALTER TABLE \`services\` CHANGE \`fecha-creacion\` \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`services\` CHANGE \`fecha-actualizacion\` \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);

        // ─── AUTHORIZATION_STATUSES ──────────────────────────────────────────────────
        await queryRunner.query(`ALTER TABLE \`authorization_statuses\` CHANGE \`IdAutorizacion\` \`id\` INT NOT NULL AUTO_INCREMENT`);
        await queryRunner.query(`ALTER TABLE \`authorization_statuses\` CHANGE \`OpcionAutorizacion\` \`name\` VARCHAR(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`authorization_statuses\` CHANGE \`fecha-creacion\` \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`authorization_statuses\` CHANGE \`fecha-actualizacion\` \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);

        // ─── TRACKING_STATUSES ───────────────────────────────────────────────────────
        await queryRunner.query(`ALTER TABLE \`tracking_statuses\` CHANGE \`NombreEstadoSeguimiento\` \`name\` VARCHAR(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`tracking_statuses\` CHANGE \`Estado\` \`status\` TINYINT NOT NULL DEFAULT 1`);
        await queryRunner.query(`ALTER TABLE \`tracking_statuses\` CHANGE \`fecha-creacion\` \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`tracking_statuses\` CHANGE \`fecha-actualizacion\` \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);

        // ─── FUNCTIONAL_UNITS ────────────────────────────────────────────────────────
        await queryRunner.query(`ALTER TABLE \`functional_units\` CHANGE \`IdUnidad\` \`id\` INT NOT NULL AUTO_INCREMENT`);
        await queryRunner.query(`ALTER TABLE \`functional_units\` CHANGE \`NombreUnidad\` \`name\` VARCHAR(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`functional_units\` CHANGE \`Estado\` \`status\` TINYINT NOT NULL DEFAULT 1`);
        await queryRunner.query(`ALTER TABLE \`functional_units\` CHANGE \`fecha-creacion\` \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`functional_units\` CHANGE \`fecha-actualizacion\` \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);

        // ─── REQUESTED_SERVICES ──────────────────────────────────────────────────────
        await queryRunner.query(`ALTER TABLE \`requested_services\` CHANGE \`IdServicioSolicitado\` \`id\` INT NOT NULL AUTO_INCREMENT`);
        await queryRunner.query(`ALTER TABLE \`requested_services\` CHANGE \`Codigo\` \`code\` VARCHAR(20) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`requested_services\` CHANGE \`NombreSolicitado\` \`name\` VARCHAR(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`requested_services\` CHANGE \`Estado\` \`status\` TINYINT NOT NULL DEFAULT 1`);
        await queryRunner.query(`ALTER TABLE \`requested_services\` CHANGE \`fecha-creacion\` \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`requested_services\` CHANGE \`fecha-actualizacion\` \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);

        // ─── AGREEMENTS ──────────────────────────────────────────────────────────────
        await queryRunner.query(`ALTER TABLE \`agreements\` CHANGE \`IdConvenio\` \`id\` INT NOT NULL AUTO_INCREMENT`);
        await queryRunner.query(`ALTER TABLE \`agreements\` CHANGE \`NombreConvenio\` \`name\` VARCHAR(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`agreements\` CHANGE \`Estado\` \`status\` TINYINT NOT NULL DEFAULT 1`);
        await queryRunner.query(`ALTER TABLE \`agreements\` CHANGE \`fecha-creacion\` \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`agreements\` CHANGE \`fecha-actualizacion\` \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);

        // ─── IPS_PRIMARIA ────────────────────────────────────────────────────────────
        await queryRunner.query(`ALTER TABLE \`ips_primaria\` CHANGE \`IdIpsPrimaria\` \`id\` INT NOT NULL AUTO_INCREMENT`);
        await queryRunner.query(`ALTER TABLE \`ips_primaria\` CHANGE \`NombreIpsPrimaria\` \`name\` VARCHAR(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`ips_primaria\` CHANGE \`Estado\` \`status\` TINYINT NOT NULL DEFAULT 1`);
        await queryRunner.query(`ALTER TABLE \`ips_primaria\` CHANGE \`fecha-creacion\` \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`ips_primaria\` CHANGE \`fecha-actualizacion\` \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);

        // ─── DOCUMENT_TYPES ──────────────────────────────────────────────────────────
        await queryRunner.query(`ALTER TABLE \`document_types\` CHANGE \`IdDocumento\` \`id\` INT NOT NULL AUTO_INCREMENT`);
        await queryRunner.query(`ALTER TABLE \`document_types\` CHANGE \`TipoDocumento\` \`name\` VARCHAR(10) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`document_types\` CHANGE \`Estado\` \`status\` TINYINT NOT NULL DEFAULT 1`);
        await queryRunner.query(`ALTER TABLE \`document_types\` CHANGE \`fecha-creacion\` \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`document_types\` CHANGE \`fecha-actualizacion\` \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);

        // ─── DIAGNOSES ───────────────────────────────────────────────────────────────
        await queryRunner.query(`ALTER TABLE \`diagnoses\` CHANGE \`codigo\` \`code\` VARCHAR(10) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`diagnoses\` CHANGE \`descripcion\` \`description\` VARCHAR(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`diagnoses\` CHANGE \`fecha-creacion\` \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`diagnoses\` CHANGE \`fecha-actualizacion\` \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);

        // ─── SEDES: city → municipality_id ──────────────────────────────────────────
        await queryRunner.query(`ALTER TABLE \`headquarters\` CHANGE \`IdLugar\` \`id\` INT NOT NULL AUTO_INCREMENT`);
        await queryRunner.query(`ALTER TABLE \`headquarters\` CHANGE \`NombreLugar\` \`name\` VARCHAR(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`headquarters\` CHANGE \`Estado\` \`status\` TINYINT NOT NULL DEFAULT 1`);
        await queryRunner.query(`ALTER TABLE \`headquarters\` CHANGE \`direccion\` \`address\` VARCHAR(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`headquarters\` CHANGE \`ciudad\` \`municipality_id\` INT NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`headquarters\` CHANGE \`numero_sede\` \`headquarter_number\` INT NULL`);
        await queryRunner.query(`ALTER TABLE \`headquarters\` CHANGE \`fecha-creacion\` \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`headquarters\` CHANGE \`fecha-actualizacion\` \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`); // ! modificar la entidad de acuerdo a los cambios porque copilot no lo hizo
        

        // ─── MUNICIPIO ───────────────────────────────────────────────────────────────
        await queryRunner.query(`ALTER TABLE \`municipalities\` CHANGE \`IdMunicipio\` \`id\` INT NOT NULL AUTO_INCREMENT`);
        await queryRunner.query(`ALTER TABLE \`municipalities\` CHANGE \`NombreMunicipio\` \`name\` VARCHAR(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`municipalities\` CHANGE \`Estado\` \`status\` TINYINT NOT NULL DEFAULT 1`);
        await queryRunner.query(`ALTER TABLE \`municipalities\` CHANGE \`id_departamento\` \`department_id\` INT NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`municipalities\` CHANGE \`codigo_municipio\` \`municipality_code\` VARCHAR(10) NULL`);
        await queryRunner.query(`ALTER TABLE \`municipalities\` CHANGE \`fecha-creacion\` \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`municipalities\` CHANGE \`fecha-actualizacion\` \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);

        // ─── surgery_tracking_records ────────────────────────────────────────────────────────────────
        await queryRunner.query(`ALTER TABLE \`surgery_tracking_records\` CHANGE \`observacion\` \`observation\` TEXT NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`surgery_tracking_records\` CHANGE \`estado\` \`status_id\` INT NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`surgery_tracking_records\` CHANGE \`cirugia_id\` \`surgery_id\` INT NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`surgery_tracking_records\` CHANGE \`cup_id\` \`requested_service_id\` INT NOT NULL`); // ! confirmaar que si se llame asi la columna en la tabla
        await queryRunner.query(`ALTER TABLE \`surgery_tracking_records\` CHANGE \`usuario_id\` \`user_id\` INT NULL`);
        await queryRunner.query(`ALTER TABLE \`surgery_tracking_records\` CHANGE \`createdAt\` \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`surgery_tracking_records\` CHANGE \`updatedAt\` \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);

    }

    public async down(queryRunner: QueryRunner): Promise<void> {

        // ─── SUPPORT_DOCUMENTS_RADICACIONES ──────────────────────────────────────────
        await queryRunner.query(`ALTER TABLE \`support_documents_radicaciones\` CHANGE \`updated_at\` \`fechaActualizacion\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`support_documents_radicaciones\` CHANGE \`created_at\` \`fechaCreacion\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`support_documents_radicaciones\` CHANGE \`type\` \`tipo\` VARCHAR(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`support_documents_radicaciones\` CHANGE \`name\` \`nombre\` VARCHAR(255) NOT NULL`);

        // ─── PROFESSIONALS ───────────────────────────────────────────────────────────
        await queryRunner.query(`ALTER TABLE \`professionals\` CHANGE \`name\` \`nombre\` VARCHAR(255) NOT NULL`);

        // ─── SURGERY_TRACKING_RECORDS ────────────────────────────────────────────────
        await queryRunner.query(`ALTER TABLE \`surgery_tracking_records\` CHANGE \`updated_at\` \`updatedAt\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`surgery_tracking_records\` CHANGE \`created_at\` \`createdAt\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`surgery_tracking_records\` CHANGE \`user_id\` \`usuario_id\` INT NULL`);
        await queryRunner.query(`ALTER TABLE \`surgery_tracking_records\` CHANGE \`requested_service_id\` \`cup_id\` INT NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`surgery_tracking_records\` CHANGE \`surgery_id\` \`cirugia_id\` INT NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`surgery_tracking_records\` CHANGE \`status_id\` \`estado\` INT NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`surgery_tracking_records\` CHANGE \`observation\` \`observaciones\` TEXT NOT NULL`);

        // ─── MUNICIPIO ───────────────────────────────────────────────────────────────
        await queryRunner.query(`ALTER TABLE \`municipalities\` CHANGE \`updated_at\` \`fecha-actualizacion\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`municipalities\` CHANGE \`created_at\` \`fecha-creacion\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`municipalities\` CHANGE \`municipality_code\` \`codigo_municipio\` VARCHAR(10) NULL`);
        await queryRunner.query(`ALTER TABLE \`municipalities\` CHANGE \`department_id\` \`id_departamento\` INT NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`municipalities\` CHANGE \`status\` \`Estado\` TINYINT NOT NULL DEFAULT 1`);
        await queryRunner.query(`ALTER TABLE \`municipalities\` CHANGE \`name\` \`NombreMunicipio\` VARCHAR(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`municipalities\` CHANGE \`id\` \`IdMunicipio\` INT NOT NULL AUTO_INCREMENT`);

        // ─── SEDES ───────────────────────────────────────────────────────────────────
        await queryRunner.query(`ALTER TABLE \`headquarters\` CHANGE \`updated_at\` \`fecha-actualizacion\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`headquarters\` CHANGE \`created_at\` \`fecha-creacion\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`headquarters\` CHANGE \`headquarter_number\` \`numero_sede\` INT NULL`);
        await queryRunner.query(`ALTER TABLE \`headquarters\` CHANGE \`municipality_id\` \`ciudad\` INT NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`headquarters\` CHANGE \`address\` \`direccion\` VARCHAR(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`headquarters\` CHANGE \`status\` \`Estado\` TINYINT NOT NULL DEFAULT 1`);
        await queryRunner.query(`ALTER TABLE \`headquarters\` CHANGE \`name\` \`NombreLugar\` VARCHAR(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`headquarters\` CHANGE \`id\` \`IdLugar\` INT NOT NULL AUTO_INCREMENT`);

        // ─── DIAGNOSES ───────────────────────────────────────────────────────────────
        await queryRunner.query(`ALTER TABLE \`diagnoses\` CHANGE \`updated_at\` \`fecha-actualizacion\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`diagnoses\` CHANGE \`created_at\` \`fecha-creacion\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`diagnoses\` CHANGE \`description\` \`descripcion\` VARCHAR(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`diagnoses\` CHANGE \`code\` \`codigo\` VARCHAR(10) NOT NULL`);

        // ─── DOCUMENT_TYPES ──────────────────────────────────────────────────────────
        await queryRunner.query(`ALTER TABLE \`document_types\` CHANGE \`updated_at\` \`fecha-actualizacion\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`document_types\` CHANGE \`created_at\` \`fecha-creacion\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`document_types\` CHANGE \`status\` \`Estado\` TINYINT NOT NULL DEFAULT 1`);
        await queryRunner.query(`ALTER TABLE \`document_types\` CHANGE \`name\` \`TipoDocumento\` VARCHAR(10) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`document_types\` CHANGE \`id\` \`IdDocumento\` INT NOT NULL AUTO_INCREMENT`);

        // ─── IPS_PRIMARIA ────────────────────────────────────────────────────────────
        await queryRunner.query(`ALTER TABLE \`ips_primaria\` CHANGE \`updated_at\` \`fecha-actualizacion\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`ips_primaria\` CHANGE \`created_at\` \`fecha-creacion\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`ips_primaria\` CHANGE \`status\` \`Estado\` TINYINT NOT NULL DEFAULT 1`);
        await queryRunner.query(`ALTER TABLE \`ips_primaria\` CHANGE \`name\` \`NombreIpsPrimaria\` VARCHAR(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`ips_primaria\` CHANGE \`id\` \`IdIpsPrimaria\` INT NOT NULL AUTO_INCREMENT`);

        // ─── AGREEMENTS ──────────────────────────────────────────────────────────────
        await queryRunner.query(`ALTER TABLE \`agreements\` CHANGE \`updated_at\` \`fecha-actualizacion\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`agreements\` CHANGE \`created_at\` \`fecha-creacion\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`agreements\` CHANGE \`status\` \`Estado\` TINYINT NOT NULL DEFAULT 1`);
        await queryRunner.query(`ALTER TABLE \`agreements\` CHANGE \`name\` \`NombreConvenio\` VARCHAR(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`agreements\` CHANGE \`id\` \`IdConvenio\` INT NOT NULL AUTO_INCREMENT`);

        // ─── REQUESTED_SERVICES ──────────────────────────────────────────────────────
        await queryRunner.query(`ALTER TABLE \`requested_services\` CHANGE \`updated_at\` \`fecha-actualizacion\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`requested_services\` CHANGE \`created_at\` \`fecha-creacion\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`requested_services\` CHANGE \`status\` \`Estado\` TINYINT NOT NULL DEFAULT 1`);
        await queryRunner.query(`ALTER TABLE \`requested_services\` CHANGE \`name\` \`NombreSolicitado\` VARCHAR(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`requested_services\` CHANGE \`code\` \`Codigo\` VARCHAR(20) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`requested_services\` CHANGE \`id\` \`IdServicioSolicitado\` INT NOT NULL AUTO_INCREMENT`);

        // ─── FUNCTIONAL_UNITS ────────────────────────────────────────────────────────
        await queryRunner.query(`ALTER TABLE \`functional_units\` CHANGE \`updated_at\` \`fecha-actualizacion\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`functional_units\` CHANGE \`created_at\` \`fecha-creacion\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`functional_units\` CHANGE \`status\` \`Estado\` TINYINT NOT NULL DEFAULT 1`);
        await queryRunner.query(`ALTER TABLE \`functional_units\` CHANGE \`name\` \`NombreUnidad\` VARCHAR(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`functional_units\` CHANGE \`id\` \`IdUnidad\` INT NOT NULL AUTO_INCREMENT`);

        // ─── TRACKING_STATUSES ───────────────────────────────────────────────────────
        await queryRunner.query(`ALTER TABLE \`tracking_statuses\` CHANGE \`updated_at\` \`fecha-actualizacion\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`tracking_statuses\` CHANGE \`created_at\` \`fecha-creacion\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`tracking_statuses\` CHANGE \`status\` \`Estado\` TINYINT NOT NULL DEFAULT 1`);
        await queryRunner.query(`ALTER TABLE \`tracking_statuses\` CHANGE \`name\` \`NombreEstadoSeguimiento\` VARCHAR(255) NOT NULL`);

        // ─── AUTHORIZATION_STATUSES ──────────────────────────────────────────────────
        await queryRunner.query(`ALTER TABLE \`authorization_statuses\` CHANGE \`updated_at\` \`fecha-actualizacion\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`authorization_statuses\` CHANGE \`created_at\` \`fecha-creacion\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`authorization_statuses\` CHANGE \`name\` \`OpcionAutorizacion\` VARCHAR(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`authorization_statuses\` CHANGE \`id\` \`IdAutorizacion\` INT NOT NULL AUTO_INCREMENT`);

        // ─── SERVICES ────────────────────────────────────────────────────────────────
        await queryRunner.query(`ALTER TABLE \`services\` CHANGE \`updated_at\` \`fecha-actualizacion\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`services\` CHANGE \`created_at\` \`fecha-creacion\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`services\` CHANGE \`status\` \`Estado\` TINYINT NOT NULL DEFAULT 1`);
        await queryRunner.query(`ALTER TABLE \`services\` CHANGE \`name\` \`NombreServicio\` VARCHAR(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`services\` CHANGE \`id\` \`IdServicio\` INT NOT NULL AUTO_INCREMENT`);

        // ─── SERVICE_GROUPS ──────────────────────────────────────────────────────────
        await queryRunner.query(`ALTER TABLE \`service_groups\` CHANGE \`updated_at\` \`fecha-actualizacion\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`service_groups\` CHANGE \`created_at\` \`fecha-creacion\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`service_groups\` CHANGE \`status\` \`Estado\` TINYINT NOT NULL DEFAULT 1`);
        await queryRunner.query(`ALTER TABLE \`service_groups\` CHANGE \`name\` \`NombreGrupo\` VARCHAR(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`service_groups\` CHANGE \`id\` \`IdGrupo\` INT NOT NULL AUTO_INCREMENT`);

        // ─── IPS_REMITE ──────────────────────────────────────────────────────────────
        await queryRunner.query(`ALTER TABLE \`ips_remite\` CHANGE \`updated_at\` \`fecha-actualizacion\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`ips_remite\` CHANGE \`created_at\` \`fecha-creacion\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`ips_remite\` CHANGE \`status\` \`Estado\` TINYINT NOT NULL DEFAULT 1`);
        await queryRunner.query(`ALTER TABLE \`ips_remite\` CHANGE \`name\` \`NombreIpsRemite\` VARCHAR(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`ips_remite\` CHANGE \`id\` \`IdIpsRemite\` INT NOT NULL AUTO_INCREMENT`);

        // ─── SPECIALTIES ─────────────────────────────────────────────────────────────
        await queryRunner.query(`ALTER TABLE \`specialties\` CHANGE \`updated_at\` \`fecha-actualizacion\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`specialties\` CHANGE \`created_at\` \`fecha-creacion\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`specialties\` CHANGE \`status\` \`Estado\` TINYINT NOT NULL DEFAULT 1`);
        await queryRunner.query(`ALTER TABLE \`specialties\` CHANGE \`name\` \`NombreEspecialidad\` VARCHAR(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`specialties\` CHANGE \`id\` \`IdEspecialidad\` INT NOT NULL AUTO_INCREMENT`);

        // ─── PATIENTS ────────────────────────────────────────────────────────────────
        await queryRunner.query(`ALTER TABLE \`patients\` CHANGE \`updated_at\` \`fecha-actualizacion\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`patients\` CHANGE \`created_at\` \`fecha-creacion\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`patients\` CHANGE \`status\` \`Estado\` TINYINT NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`patients\` CHANGE \`ips_primary_id\` \`ipsPrimaria\` INT NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`patients\` CHANGE \`agreement_id\` \`Convenio\` INT NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`patients\` CHANGE \`address\` \`Direccion\` VARCHAR(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`patients\` CHANGE \`email\` \`Email\` VARCHAR(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`patients\` CHANGE \`landline\` \`TelefonoFijo\` VARCHAR(20) NULL`);
        await queryRunner.query(`ALTER TABLE \`patients\` CHANGE \`phone_number_2\` \`numeroCelular2\` VARCHAR(20) NULL`);
        await queryRunner.query(`ALTER TABLE \`patients\` CHANGE \`phone_number\` \`NumeroCelular\` VARCHAR(20) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`patients\` CHANGE \`name\` \`NombreCompleto\` VARCHAR(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`patients\` CHANGE \`document_number\` \`Identificacion\` BIGINT NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`patients\` CHANGE \`document_type_id\` \`Documento\` INT NOT NULL`);

        // ─── SURGERIES ───────────────────────────────────────────────────────────────
        await queryRunner.query(`ALTER TABLE \`surgeries\` CHANGE \`updated_at\` \`updatedAt\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`surgeries\` CHANGE \`created_at\` \`createdAt\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`surgeries\` CHANGE \`specialist\` \`especialista\` VARCHAR(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`surgeries\` CHANGE \`anesthesiology_date\` \`fecha_anesteciologia\` DATE NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`surgeries\` CHANGE \`paraclinical_date\` \`fecha_paraclinico\` DATE NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`surgeries\` CHANGE \`radicacion_id\` \`radicado_id\` INT NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`surgeries\` CHANGE \`observation\` \`observaciones\` VARCHAR(500) NULL`);
        await queryRunner.query(`ALTER TABLE \`surgeries\` CHANGE \`ips_remite_id\` \`ips_remitente\` INT NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`surgeries\` CHANGE \`scheduled_time\` \`hora_programada\` TIME NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`surgeries\` CHANGE \`surgery_date\` \`fecha_cirugia\` DATE NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`surgeries\` CHANGE \`status_id\` \`estado\` INT NULL`);

        // ─── TRACKING_RECORDS ────────────────────────────────────────────────────────
        await queryRunner.query(`ALTER TABLE \`tracking_records\` CHANGE \`user_id\` \`usuario_id\` INT NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`tracking_records\` CHANGE \`cups_radicado_id\` \`id_cups_radicados\` INT NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`tracking_records\` CHANGE \`status_id\` \`EstadoSeguimiento\` INT NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`tracking_records\` CHANGE \`observation\` \`ObservacionSeguimiento\` VARCHAR(500) NULL`);
        await queryRunner.query(`ALTER TABLE \`tracking_records\` CHANGE \`updated_at\` \`fecha-actualizacion\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`tracking_records\` CHANGE \`created_at\` \`fecha-creacion\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`tracking_records\` CHANGE \`id\` \`IdSeguimiento\` INT NOT NULL AUTO_INCREMENT`);

        // ─── CUPS_RADICADOS ──────────────────────────────────────────────────────────
        await queryRunner.query(`ALTER TABLE \`cups_radicados\` CHANGE \`requested_service_id\` \`servicio_id\` INT NULL`);
        await queryRunner.query(`ALTER TABLE \`cups_radicados\` CHANGE \`quantity\` \`cantidad\` INT NOT NULL DEFAULT 1`);
        await queryRunner.query(`ALTER TABLE \`cups_radicados\` CHANGE \`date_audit_recovery_latter\` \`fecha_audita_carta_recobro\` DATE NULL`);
        await queryRunner.query(`ALTER TABLE \`cups_radicados\` CHANGE \`status_recovery_latter\` \`estado_carta_recobro\` VARCHAR(50) NULL`);
        await queryRunner.query(`ALTER TABLE \`cups_radicados\` CHANGE \`radicacion_id\` \`IDRADICADO\` INT NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`cups_radicados\` CHANGE \`functional_unit_id\` \`UnidadFuncional\` INT NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`cups_radicados\` CHANGE \`observation\` \`observacionCups\` VARCHAR(500) NULL`);
        await queryRunner.query(`ALTER TABLE \`cups_radicados\` CHANGE \`status_id\` \`Estado\` INT NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`cups_radicados\` CHANGE \`id\` \`IdCups\` INT NOT NULL AUTO_INCREMENT`);

        // ─── RADICACIONES ────────────────────────────────────────────────────────────
        await queryRunner.query(`ALTER TABLE \`radicaciones\` CHANGE \`created_at\` \`FechaRadicado\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`radicaciones\` CHANGE \`professional_name\` \`profesional\` VARCHAR(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`radicaciones\` CHANGE \`professional_id\` \`id_profesional\` INT NULL`);
        await queryRunner.query(`ALTER TABLE \`radicaciones\` CHANGE \`diagnosis_id\` \`id_diagnostico\` INT NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`radicaciones\` CHANGE \`support_id\` \`id_soportes\` INT NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`radicaciones\` CHANGE \`patient_id\` \`Paciente_id\` INT NULL`);
        await queryRunner.query(`ALTER TABLE \`radicaciones\` CHANGE \`audit_status_id\` \`ConceptoAuditoria\` INT NULL`);
        await queryRunner.query(`ALTER TABLE \`radicaciones\` CHANGE \`audit_justification\` \`JustificacionAuditoria\` TEXT NULL`);
        await queryRunner.query(`ALTER TABLE \`radicaciones\` CHANGE \`audit_notes\` \`Auditora\` VARCHAR(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`radicaciones\` CHANGE \`filed_by_user_id\` \`QuienRadica\` INT NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`radicaciones\` CHANGE \`service_type_id\` \`TipoServicio\` INT NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`radicaciones\` CHANGE \`service_group_id\` \`GrupoServicios\` INT NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`radicaciones\` CHANGE \`specialty_id\` \`Especialidad\` INT NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`radicaciones\` CHANGE \`ips_remite_id\` \`IpsRemite\` INT NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`radicaciones\` CHANGE \`place_id\` \`LugarRadicacion\` INT NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`radicaciones\` CHANGE \`audit_date\` \`FechaAuditoria\` DATE NULL`);
        await queryRunner.query(`ALTER TABLE \`radicaciones\` CHANGE \`order_date\` \`FechaOrden\` DATE NULL`);
        await queryRunner.query(`ALTER TABLE \`radicaciones\` CHANGE \`id\` \`IdRadicacion\` INT NOT NULL AUTO_INCREMENT`);

        // ─── RENAME TABLES BACK ──────────────────────────────────────────────────────
        await queryRunner.query(`RENAME TABLE \`surgeries\` TO \`cirugias\``);
        await queryRunner.query(`RENAME TABLE \`diagnoses\` TO \`diagnostico\``);
        await queryRunner.query(`RENAME TABLE \`document_types\` TO \`documento\``);
        await queryRunner.query(`RENAME TABLE \`ips_primaria\` TO \`ipsprimaria\``);
        await queryRunner.query(`RENAME TABLE \`agreements\` TO \`convenio\``);
        await queryRunner.query(`RENAME TABLE \`requested_services\` TO \`serviciosolicitado\``);
        await queryRunner.query(`RENAME TABLE \`functional_units\` TO \`unidadfuncional\``);
        await queryRunner.query(`RENAME TABLE \`tracking_statuses\` TO \`estadoseguimiento\``);
        await queryRunner.query(`RENAME TABLE \`authorization_statuses\` TO \`autorizacion\``);
        await queryRunner.query(`RENAME TABLE \`services\` TO \`servicio\``);
        await queryRunner.query(`RENAME TABLE \`service_groups\` TO \`gruposervicio\``);
        await queryRunner.query(`RENAME TABLE \`ips_remite\` TO \`ipsremite\``);
        await queryRunner.query(`RENAME TABLE \`specialties\` TO \`especialidad\``);
        await queryRunner.query(`RENAME TABLE \`patients\` TO \`pacientes\``);
        await queryRunner.query(`RENAME TABLE \`surgery_tracking_records\` TO \`gestion_auxiliar_cirugias\``);
        await queryRunner.query(`RENAME TABLE \`tracking_records\` TO \`seguimientoauxiliar\``);
        await queryRunner.query(`RENAME TABLE \`cups_radicados\` TO \`cupspaciente\``);
        await queryRunner.query(`RENAME TABLE \`radicaciones\` TO \`radicacion\``);
        await queryRunner.query(`RENAME TABLE \`support_documents_radicaciones\` TO \`soportes\``);
        await queryRunner.query(`RENAME TABLE \`professionals\` TO \`profesionales\``);
        await queryRunner.query(`RENAME TABLE \`headquarters\` TO \`sedes\``);
        await queryRunner.query(`RENAME TABLE \`municipalities\` TO \`municipio\``);

    }
}
