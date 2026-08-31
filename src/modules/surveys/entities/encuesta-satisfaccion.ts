import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { IsEnum, IsInt, IsNotEmpty } from "class-validator";
import { Pacientes } from "../../patients/entities/pacientes";
import { Municipio } from "../../catalog/entities/municipio";
import { PoblacionEspecial } from "../../catalog/entities/poblacion-especial";
import { ServicioAtencion } from "../../catalog/entities/servicio-atencion";
import { Usuarios } from "../../auth/entities/usuarios";

export enum RespuestaSiNoNa {
    SI = "SI",
    NO = "NO",
    NO_APLICA = "NA",
}

export enum CalificacionAtencion {
    MUY_BUENO = "MUY_BUENO",
    BUENO = "BUENO",
    REGULAR = "REGULAR",
    MALO = "MALO",
    MUY_MALO = "MUY_MALO",
}

export enum ExperienciaGlobal {
    MUY_BUENO = "MUY_BUENO",
    BUENO = "BUENO",
    REGULAR = "REGULAR",
    MALO = "MALO",
    MUY_MALO = "MUY_MALO",
    NO_RESPONDE = "NO_RESPONDE",
}

export enum Recomendacion {
    DEFINITIVAMENTE_SI = "DEFINITIVAMENTE_SI",
    PROBABLEMENTE_SI = "PROBABLEMENTE_SI",
    PROBABLEMENTE_NO = "PROBABLEMENTE_NO",
    DEFINITIVAMENTE_NO = "DEFINITIVAMENTE_NO",
    NO_RESPONDE = "NO_RESPONDE",
}

@Entity("satisfaction_surveys")
export class EncuestaSatisfaccion extends BaseEntity {

    @PrimaryGeneratedColumn({ name: "id", type: "int", unsigned: true, comment: "Identificador único de la encuesta" })
    id: number;

    @Column({ name: "patient_id", type: "int" })
    @IsInt()
    @IsNotEmpty({ message: "El paciente no puede estar vacío" })
    patientId: number;

    @Column({ name: "municipality_id", type: "int" })
    @IsInt()
    @IsNotEmpty({ message: "El municipio no puede estar vacío" })
    municipalityId: number;

    @Column({ name: "special_population_id", type: "int" })
    @IsInt()
    @IsNotEmpty({ message: "La población especial no puede estar vacía" })
    specialPopulationId: number;

    @Column({ name: "attention_service_id", type: "int" })
    @IsInt()
    @IsNotEmpty({ message: "El servicio de atención no puede estar vacío" })
    attentionServiceId: number;

    @Column({ name: "timely_appointment", type: "enum", enum: RespuestaSiNoNa, comment: "¿Su cita médica fue asignada de manera oportuna?" })
    @IsEnum(RespuestaSiNoNa, { message: "La respuesta sobre la oportunidad de la cita debe ser SI, NO o NA" })
    timelyAppointment: RespuestaSiNoNa;

    @Column({ name: "punctual_care", type: "enum", enum: RespuestaSiNoNa, comment: "¿Fue atendido(a) con puntualidad?" })
    @IsEnum(RespuestaSiNoNa, { message: "La respuesta sobre la puntualidad de la atención debe ser SI, NO o NA" })
    punctualCare: RespuestaSiNoNa;

    @Column({ name: "professional_interest", type: "enum", enum: RespuestaSiNoNa, comment: "¿El profesional mostró interés en conocer su historia clínica y motivo de consulta?" })
    @IsEnum(RespuestaSiNoNa, { message: "La respuesta sobre el interés del profesional debe ser SI, NO o NA" })
    professionalInterest: RespuestaSiNoNa;

    @Column({ name: "clear_recommendations", type: "enum", enum: RespuestaSiNoNa, comment: "¿Las recomendaciones brindadas por el profesional fueron claras y comprensibles?" })
    @IsEnum(RespuestaSiNoNa, { message: "La respuesta sobre la claridad de las recomendaciones debe ser SI, NO o NA" })
    clearRecommendations: RespuestaSiNoNa;

    @Column({ name: "signage_helped", type: "enum", enum: RespuestaSiNoNa, comment: "¿La señalización dentro de la sede facilitó su ubicación?" })
    @IsEnum(RespuestaSiNoNa, { message: "La respuesta sobre la señalización de la sede debe ser SI, NO o NA" })
    signageHelped: RespuestaSiNoNa;

    @Column({ name: "adequate_facilities", type: "enum", enum: RespuestaSiNoNa, comment: "¿Considera que las instalaciones son adecuadas y cómodas?" })
    @IsEnum(RespuestaSiNoNa, { message: "La respuesta sobre la adecuación de las instalaciones debe ser SI, NO o NA" })
    adequateFacilities: RespuestaSiNoNa;

    @Column({ name: "clean_facilities", type: "enum", enum: RespuestaSiNoNa, comment: "¿Considera que las instalaciones se encuentran limpias y en buen orden?" })
    @IsEnum(RespuestaSiNoNa, { message: "La respuesta sobre la limpieza de las instalaciones debe ser SI, NO o NA" })
    cleanFacilities: RespuestaSiNoNa;

    @Column({ name: "professional_care_rating", type: "enum", enum: CalificacionAtencion, comment: "¿Cómo calificaría la atención brindada por el profesional de salud que lo(a) atendió?" })
    @IsEnum(CalificacionAtencion, { message: "La calificación de la atención del profesional de salud no es válida" })
    professionalCareRating: CalificacionAtencion;

    @Column({ name: "customer_service_rating", type: "enum", enum: CalificacionAtencion, comment: "¿Cómo calificaría la atención brindada por parte del personal de servicio al cliente?" })
    @IsEnum(CalificacionAtencion, { message: "La calificación de la atención del personal de servicio al cliente no es válida" })
    customerServiceRating: CalificacionAtencion;

    @Column({ name: "global_experience", type: "enum", enum: ExperienciaGlobal, comment: "¿Cómo calificaría su experiencia global respecto a los servicios de salud que ha recibido a través de la IPS?" })
    @IsEnum(ExperienciaGlobal, { message: "La calificación de la experiencia global no es válida" })
    globalExperience: ExperienciaGlobal;

    @Column({ name: "would_recommend", type: "enum", enum: Recomendacion, comment: "¿Recomendaría a sus familiares y amigos a Nordvital IPS?" })
    @IsEnum(Recomendacion, { message: "La respuesta sobre la recomendación de la IPS no es válida" })
    wouldRecommend: Recomendacion;

    @Column({ name: "created_by", type: "int" })
    @IsInt()
    @IsNotEmpty({ message: "El usuario que registra la encuesta no puede estar vacío" })
    createdBy: number;

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date;

    // * relaciones

    // ? relacion con paciente
    @ManyToOne(() => Pacientes)
    @JoinColumn({ name: "patient_id" })
    patientRelation: Pacientes;

    // ? relacion con municipio
    @ManyToOne(() => Municipio)
    @JoinColumn({ name: "municipality_id" })
    municipioRelation: Municipio;

    // ? relacion con poblacion especial
    @ManyToOne(() => PoblacionEspecial)
    @JoinColumn({ name: "special_population_id" })
    specialPopulationRelation: PoblacionEspecial;

    // ? relacion con servicio de atencion
    @ManyToOne(() => ServicioAtencion)
    @JoinColumn({ name: "attention_service_id" })
    attentionServiceRelation: ServicioAtencion;

    // ? relacion con el usuario que registra la encuesta
    @ManyToOne(() => Usuarios)
    @JoinColumn({ name: "created_by" })
    userRelation: Usuarios;

}
