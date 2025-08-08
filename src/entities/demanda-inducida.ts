import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { IsBoolean, IsEnum, IsOptional, IsString } from "class-validator";
import { ElementoDemandaInducida } from "./elemento-demanda-inducida";
import { TipoDemandaInducida } from "./tipo-demanda-inducida";
import { ObjetivoDemandaInducida } from "./objetivo-demanda-inducida";
import { RelacionUsuario } from "./relacion-usuario";
import { AreaEps } from "./area-eps";
import { ResumenSeguimientoActividad } from "./resumen-seguimiento-actividad";
import { ResultadoLlamada } from "./resultado-llamada";
import { MotivoVisita } from "./motivo-visita";
import { AreaPersonaSeguimiento } from "./area-persona-seguimiento";
import { Pacientes } from "./pacientes";
import { Usuarios } from "./usuarios";
import { Programa } from "./programa";

enum AreaDificultad {
  IPS = "IPS",
  EPS = "EPS",
}

@Entity({ name: "demanda_inducida" })
export class DemandaInducida extends BaseEntity {
  @PrimaryGeneratedColumn({ name: "id" })
  id: number;

  @Column({ name: "paciente_id" })
  pacienteId: number;

  @Column({ name: "elemento_demanda_inducida_id" })
  elementoDemandaInducidaId: number;

  @Column({ name: "tipo_demanda_inducida_id", nullable: true })
  tipoDemandaInducidaId: number | null;

  @Column({ name: "objetivo_demanda_inducida_id", nullable: true })
  objetivoDemandaInducidaId: number | null;

  @Column({ name: "relacion_usuario_id", nullable: true })
  relacionUsuarioId: number | null;

  @Column({ name: "area_eps_id", nullable: true })
  areaEpsId: number | null;

  @Column({ name: "resumen_seguimiento_actividad_id", nullable: true })
  resumenSeguimientoActividadId: number | null;

  @Column({ name: "resultado_llamada_id", nullable: true })
  @IsOptional()
  resultadoLlamadaId: number | null;

  @Column({ name: "motivo_visita_id", nullable: true })
  @IsOptional()
  motivoVisitaId: number | null;

  @Column({ name: "area_persona_seguimiento_id", nullable: true })
  @IsOptional()
  areaPersonaSeguimientoId: number | null;

  @Column({
    name: "clasificacion",
    type: "tinyint",
    default: 0,
    nullable: true,
  })
  @IsBoolean()
  @IsOptional()
  clasificacion: boolean | null;

  @Column({
    name: "persona_recibe",
    type: "varchar",
    length: 60,
    nullable: true,
  })
  @IsString()
  @IsOptional()
  personaRecibe: string | null;

  @Column({ name: "texto_llamada", type: "text", nullable: true })
  @IsString()
  @IsOptional()
  textoLlamada: string | null;

  @Column({
    name: "dificultad_acceso",
    type: "tinyint",
    default: 0,
    nullable: true,
  })
  @IsBoolean()
  @IsOptional()
  dificultadAcceso: boolean;

  @Column({
    name: "area_dificultad",
    type: "enum",
    enum: AreaDificultad,
    nullable: true,
  })
  @IsOptional()
  areaDificultad: AreaDificultad;

  @Column({
    name: "condiocion_paciente",
    type: "tinyint",
    default: 0,
    nullable: true,
  })
  @IsBoolean()
  @IsOptional()
  condicionPaciente: boolean;

  @Column({
    name: "soporte_recuperados",
    type: "varchar",
    length: 200,
    nullable: true,
  })
  @IsString()
  @IsOptional()
  soporteRecuperados: string;

  @Column({ name: "fecha_envio", type: "date", nullable: true })
  @IsOptional()
  fechaEnvio: Date;

  @Column({ name: "hora_envio", type: "time", nullable: true })
  @IsString()
  @IsOptional()
  horaEnvio: string;

  @Column({ name: "text_envio", type: "text", nullable: true })
  @IsString()
  @IsOptional()
  textEnvio: string;

  @Column({ name: "fecha_visita", type: "date", nullable: true })
  @IsOptional()
  fechaVisita: Date;

  @Column({ name: "resumen_visita", type: "text", nullable: true })
  @IsString()
  @IsOptional()
  resumenVisita: string;

  @Column({ name: "persona_seguimiento_id", nullable: true })
  personaSeguimientoId: number;

  @Column({ name: "programa_id", type: "int", nullable: true })
  programaId: number;

  @Column({ name: "fecha_cita", type: "date", nullable: true })
  @IsOptional()
  fechaCita: Date;

  @Column({ name: "fecha_llamada", type: "date", nullable: true })
  @IsOptional()
  fechaLlamada: Date;

  @Column({ name: "hora_llamada", type: "time", nullable: true })
  @IsString()
  @IsOptional()
  horaLlamada: string;

  @Column({
    name: "profesional",
    type: "enum",
    enum: [
      "Medicina General",
      "Enfermería",
      "Nutrición",
      "Ginecobstetricia",
      "Psicología",
    ],
    default: "Medicina General",
  })
  @IsEnum(["Medicina General", "Enfermería", "Nutrición", "Ginecobstetricia", "Psicología"])
  profesional: "Medicina General" | "Enfermería" | "Nutrición" | "Ginecobstetricia" | "Psicología";

  @Column({ name: "numeros_contacto", type: "text", nullable: true })
  @IsString()
  contactNumbers: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  // * Relaciones

  @ManyToOne(() => Pacientes, (paciente) => paciente.demandaInducidaRelation)
  @JoinColumn({ name: "paciente_id" })
  pacienteRelation: Pacientes;

  @ManyToOne(
    () => ElementoDemandaInducida,
    (elemento) => elemento.demandaInducidaRelation
  )
  @JoinColumn({ name: "elemento_demanda_inducida_id" })
  elementoRelation: ElementoDemandaInducida;

  @ManyToOne(() => TipoDemandaInducida, (tipo) => tipo.demandaInducidaRelation)
  @JoinColumn({ name: "tipo_demanda_inducida_id" })
  tipoRelation: TipoDemandaInducida;

  @ManyToOne(
    () => ObjetivoDemandaInducida,
    (objetivo) => objetivo.demandaInducidaRelation
  )
  @JoinColumn({ name: "objetivo_demanda_inducida_id" })
  objetivoRelation: ObjetivoDemandaInducida;

  @ManyToOne(
    () => RelacionUsuario,
    (relacion) => relacion.demandaInducidaRelation
  )
  @JoinColumn({ name: "relacion_usuario_id" })
  relacionRelation: RelacionUsuario;

  @ManyToOne(() => AreaEps, (areaEps) => areaEps.demandaInducidaRelation)
  @JoinColumn({ name: "area_eps_id" })
  areaEpsRelation: AreaEps;

  @ManyToOne(
    () => ResumenSeguimientoActividad,
    (resumen) => resumen.demandaInducidaRelation
  )
  @JoinColumn({ name: "resumen_seguimiento_actividad_id" })
  resumenRelation: ResumenSeguimientoActividad;

  @ManyToOne(
    () => ResultadoLlamada,
    (resultado) => resultado.demandaInducidaRelation
  )
  @JoinColumn({ name: "resultado_llamada_id" })
  resultadoRelation: ResultadoLlamada;

  @ManyToOne(() => MotivoVisita, (motivo) => motivo.demandaInducidaRelation)
  @JoinColumn({ name: "motivo_visita_id" })
  motivoRelation: MotivoVisita;

  @ManyToOne(
    () => AreaPersonaSeguimiento,
    (areaPerson) => areaPerson.demandaInducidaRelation
  )
  @JoinColumn({ name: "area_persona_seguimiento_id" })
  areaPersonaRelation: AreaPersonaSeguimiento;

  @ManyToOne(
    () => Usuarios,
    (usuario) => usuario.demandaInducidaSeguimientoRelation
  )
  @JoinColumn({ name: "persona_seguimiento_id" })
  personaSeguimientoRelation: Usuarios;

  @ManyToOne(() => Programa, (programa) => programa.demandaInducidaRelation)
  @JoinColumn({ name: "programa_id" })
  programaRelation: Programa;
}
