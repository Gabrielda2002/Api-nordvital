import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { IsBoolean, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Length, ValidateIf } from "class-validator";
import { Pacientes } from "../../patients/entities/pacientes";
import { Usuarios } from "../../auth/entities/usuarios";
import { AreaPqrs } from "../../catalog/entities/area-pqrs";
import { TipoPoblacionPqrs } from "../../catalog/entities/tipo-poblacion-pqrs";
import { MotivoGeneralPqrs } from "../../catalog/entities/motivo-general-pqrs";
import { PqrsdfRiskPolicy } from "../../catalog/entities/pqrsdf-risk-policy";
import { ServiciosSolicitados } from "../../catalog/entities/servicios-solicitados";
import { PqrsdfStatusHistory } from "./pqrsdf-status-history";
import { PqrsdfComment } from "./pqrsdf-comment";

export enum PresentadoPor {
    USUARIO_AFECTADO = "USUARIO_AFECTADO",
    FAMILIAR = "FAMILIAR",
    ASEGURADOR = "ASEGURADOR",
}

export enum ClasificacionPqrs {
    PETICION = "PETICION",
    QUEJA = "QUEJA",
    RECLAMO = "RECLAMO",
    DENUNCIA = "DENUNCIA",
    SUGERENCIA = "SUGERENCIA",
    FELICITACION = "FELICITACION",
}

export enum Instancia {
    SUPERSALUD = "SUPERSALUD",
    EPS = "EPS",
    SECRETARIA_SALUD = "SECRETARIA_SALUD",
    IPS = "IPS",
    OTRO = "OTRO",
}

export enum MedioRecepcion {
    PAGINA_WEB = "PAGINA_WEB",
    WHATSAPP = "WHATSAPP",
    SALA = "SALA",
    BUZON = "BUZON",
}

export enum MedioNotificacion {
    CORREO_ELECTRONICO = "CORREO_ELECTRONICO",
    PERSONALMENTE = "PERSONALMENTE",
    WHATSAPP = "WHATSAPP",
}

export enum EstadoPqrs {
    ABIERTO = "ABIERTO",
    EN_GESTION = "EN_GESTION",
    CERRADO = "CERRADO",
}

export enum AtributoAfectado {
    OPORTUNIDAD = "OPORTUNIDAD",
    ACCESIBILIDAD = "ACCESIBILIDAD",
    CONTINUIDAD = "CONTINUIDAD",
    PERTINENCIA = "PERTINENCIA",
    CALIDEZ = "CALIDEZ",
    OTRO = "OTRO",
}

@Entity("pqrsdf")
export class Pqrsdf extends BaseEntity {

    @PrimaryGeneratedColumn({ name: "id", type: "int", unsigned: true, comment: "Identificador único de la PQRSDF" })
    id: number;

    @Column({ name: "patient_id", type: "int", comment: "Paciente afectado (nombre, documento, contacto y asegurador se derivan del paciente)" })
    @IsInt()
    @IsNotEmpty({ message: "El paciente no puede estar vacío" })
    patientId: number;

    @Column({ name: "population_type_id", type: "int", comment: "TIPO DE POBLACION" })
    @IsInt()
    @IsNotEmpty({ message: "El tipo de población no puede estar vacío" })
    populationTypeId: number;

    @Column({ name: "presented_by", type: "enum", enum: PresentadoPor, comment: "PQRSDF presentada por" })
    @IsEnum(PresentadoPor, { message: "El valor de 'presentado por' no es válido" })
    presentedBy: PresentadoPor;

    @Column({ name: "presenter_name", nullable: true, type: "varchar", length: 150, comment: "Nombre de quien presenta la PQRSDF (obligatorio si no es el usuario afectado)" })
    @ValidateIf((o) => o.presentedBy !== null && o.presentedBy !== undefined && o.presentedBy !== PresentadoPor.USUARIO_AFECTADO)
    @IsString()
    @IsNotEmpty({ message: "El nombre de quien presenta la PQRSDF es obligatorio cuando no es el usuario afectado" })
    @Length(3, 150, { message: "El nombre de quien presenta la PQRSDF debe tener entre $constraint1 y $constraint2 caracteres" })
    presenterName?: string;

    @Column({ name: "classification", type: "enum", enum: ClasificacionPqrs, comment: "CLASIFICACION DE PQRD" })
    @IsEnum(ClasificacionPqrs, { message: "La clasificación de la PQRSDF no es válida" })
    classification: ClasificacionPqrs;

    @Column({ name: "instance", type: "enum", enum: Instancia, comment: "INSTANCIA" })
    @IsEnum(Instancia, { message: "La instancia de la PQRSDF no es válida" })
    instance: Instancia;

    @Column({ name: "reception_medium", type: "enum", enum: MedioRecepcion, comment: "MEDIO DE RECEPCION DE PQRDSF" })
    @IsEnum(MedioRecepcion, { message: "El medio de recepción de la PQRSDF no es válido" })
    receptionMedium: MedioRecepcion;

    @Column({ name: "filing_number", type: "int", comment: "NUMERO DE RADICADO (secuencial autogenerado por el sistema)" })
    @IsInt()
    @IsNotEmpty({ message: "El número de radicado no puede estar vacío" })
    filingNumber: number;

    @Column({ name: "origin_area_id", type: "int", comment: "AREA DONDE SE ORIGINO EL EVENTO" })
    @IsInt()
    @IsNotEmpty({ message: "El área de origen no puede estar vacía" })
    originAreaId: number;

    @Column({ name: "general_reason_id", type: "int", comment: "MOTIVO GENERAL" })
    @IsInt()
    @IsNotEmpty({ message: "El motivo general no puede estar vacío" })
    generalReasonId: number;

    @Column({ name: "specific_reason_id", nullable: true, type: "int", comment: "MOTIVO ESPECIFICO (FK a requested_services)" })
    @IsOptional()
    @IsInt()
    specificReasonId?: number;

    @Column({ name: "generation_area_id", type: "int", comment: "AREA DONDE SE GENERA PQRDSF" })
    @IsInt()
    @IsNotEmpty({ message: "El área de generación no puede estar vacía" })
    generationAreaId: number;

    @Column({ name: "description", type: "text", comment: "DESCRIPCION DE PQRDSF" })
    @IsNotEmpty({ message: "La descripción de la PQRSDF no puede estar vacía" })
    @IsString()
    description: string;

    @Column({ name: "pqrs_date", type: "date", comment: "FECHA DE LA PQRDSF" })
    @IsNotEmpty({ message: "La fecha de la PQRSDF no puede estar vacía" })
    pqrsDate: Date;

    @Column({ name: "received_date", type: "date", comment: "FECHA DE RECIBIDO PQRDSF" })
    @IsNotEmpty({ message: "La fecha de recibido no puede estar vacía" })
    receivedDate: Date;

    @Column({ name: "resolution_area_id", nullable: true, type: "int", comment: "AREA CON LA CUAL SE RESOLVIO EL EVENTO" })
    @IsOptional()
    @IsInt()
    resolutionAreaId?: number;

    @Column({ name: "response_date", nullable: true, type: "date", comment: "FECHA DE RESPUESTA PQRDSF" })
    @IsOptional()
    responseDate?: Date;

    @Column({ name: "notification_medium", nullable: true, type: "enum", enum: MedioNotificacion, comment: "MEDIO DE NOTIFICACION DE RESPUESTA" })
    @ValidateIf((o) => o.status === EstadoPqrs.CERRADO)
    @IsOptional()
    @IsEnum(MedioNotificacion, { message: "El medio de notificación no es válido" })
    notificationMedium?: MedioNotificacion;

    @Column({ name: "affected_attribute", nullable: true, type: "enum", enum: AtributoAfectado, comment: "ATRIBUTO AFECTADO" })
    @ValidateIf((o) => o.status === EstadoPqrs.CERRADO)
    @IsOptional()
    @IsEnum(AtributoAfectado, { message: "El atributo afectado no es válido" })
    affectedAttribute?: AtributoAfectado;

    @Column({ name: "improvement_action", nullable: true, type: "tinyint", width: 1, comment: "ACCION DE MEJORA (1=SI, 0=NO)" })
    @IsOptional()
    @IsBoolean({ message: "La acción de mejora debe ser un valor booleano" })
    improvementAction?: boolean;

    @Column({ name: "improvement_action_details", nullable: true, type: "text", comment: "DETALLE DE LA ACCION DE MEJORA (obligatorio cuando improvement_action=1)" })
    @ValidateIf((o) => o.improvementAction === true)
    @IsString()
    improvementActionDetails?: string;

    @Column({ name: "risk_id", type: "int", comment: "FK a pqrsdf_risk_policies — política de riesgo con SLA", default: 1 })
    @IsInt()
    @IsNotEmpty({ message: "El riesgo no puede estar vacío" })
    riskId: number;

    @Column({ name: "status", type: "enum", enum: EstadoPqrs, default: EstadoPqrs.ABIERTO, comment: "ESTADO" })
    @IsEnum(EstadoPqrs, { message: "El estado de la PQRSDF no es válido" })
    status: EstadoPqrs;

    @Column({ name: "sla_duration_value", type: "int", nullable: true, comment: "Snapshot del valor de duración SLA aplicado al crear la PQRSDF" })
    slaDurationValue: number | null;

    @Column({ name: "sla_duration_unit", type: "enum", enum: ["HOURS", "DAYS"], nullable: true, comment: "Snapshot de la unidad de duración SLA aplicada" })
    slaDurationUnit: "HOURS" | "DAYS" | null;

    @Column({ name: "sla_business_days", type: "tinyint", width: 1, nullable: true, comment: "Snapshot del flag business_days de la política al crear la PQRSDF" })
    slaBusinessDays: boolean | null;

    @Column({ name: "sla_deadline_at", type: "datetime", nullable: true, comment: "Fecha y hora límite calculada para cumplir el SLA según el riesgo" })
    slaDeadlineAt: Date | null;

    @Column({ name: "sla_closed_at", type: "datetime", nullable: true, comment: "Fecha y hora en que se cerró la PQRSDF respecto al SLA" })
    slaClosedAt: Date | null;

    @Column({ name: "sla_overdue", type: "boolean", default: false, comment: "Indica si la PQRSDF está vencida (true) o a tiempo (false). Se actualiza en lecturas y escrituras." })
    slaOverdue: boolean;

    @Column({ name: "sla_overdue_seconds", type: "int", nullable: true, comment: "Segundos transcurridos desde que venció el SLA. NULL si no ha vencido. Se preserva al cerrar." })
    slaOverdueSeconds: number | null;

    @Column({ name: "created_by", type: "int", comment: "Usuario que registra la PQRSDF" })
    @IsInt()
    @IsNotEmpty({ message: "El usuario que registra la PQRSDF no puede estar vacío" })
    createdBy: number;

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date;

    // ? relacion con paciente
    @ManyToOne(() => Pacientes)
    @JoinColumn({ name: "patient_id" })
    patientRelation: Pacientes;

    // ? relacion con tipo de poblacion
    @ManyToOne(() => TipoPoblacionPqrs)
    @JoinColumn({ name: "population_type_id" })
    populationTypeRelation: TipoPoblacionPqrs;

    // ? relacion con area de origen
    @ManyToOne(() => AreaPqrs)
    @JoinColumn({ name: "origin_area_id" })
    originAreaRelation: AreaPqrs;

    // ? relacion con motivo general
    @ManyToOne(() => MotivoGeneralPqrs)
    @JoinColumn({ name: "general_reason_id" })
    generalReasonRelation: MotivoGeneralPqrs;

    // ? relacion con el servicio solicitado (motivo especifico)
    @ManyToOne(() => ServiciosSolicitados)
    @JoinColumn({ name: "specific_reason_id" })
    specificReasonRelation: ServiciosSolicitados;

    // ? relacion con area de generacion
    @ManyToOne(() => AreaPqrs)
    @JoinColumn({ name: "generation_area_id" })
    generationAreaRelation: AreaPqrs;

    // ? relacion con area de resolucion
    @ManyToOne(() => AreaPqrs)
    @JoinColumn({ name: "resolution_area_id" })
    resolutionAreaRelation: AreaPqrs;

    // ? relacion con el usuario que registra
    @ManyToOne(() => Usuarios)
    @JoinColumn({ name: "created_by" })
    userRelation: Usuarios;

    // ? relacion con politica de riesgo (catalogo)
    @ManyToOne(() => PqrsdfRiskPolicy)
    @JoinColumn({ name: "risk_id" })
    riskRelation: PqrsdfRiskPolicy;

    // ? relacion con el historial de estados (append-only)
    @OneToMany(() => PqrsdfStatusHistory, (history) => history.pqrsdfRelation)
    statusHistoryRelation: PqrsdfStatusHistory[];

    // ? relacion con los comentarios de la PQRSDF (append-only)
    @OneToMany(() => PqrsdfComment, (comment) => comment.pqrsdfRelation)
    commentsRelation: PqrsdfComment[];
}
