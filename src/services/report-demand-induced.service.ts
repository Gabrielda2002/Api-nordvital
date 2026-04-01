import { formatInTimeZone } from "date-fns-tz";
import { DemandaInducida } from "../entities/demanda-inducida";

export type ReportDemandInducedFilters = {
  dateStart?: string;
  dateEnd?: string;
  headquarter?: string;
  convenio?: string;
  rolUser?: string | number;
  userId?: number;
};

export type ReportDemandInducedRow = Record<
  string,
  string | number | Date | null | undefined
>;

export async function getReportDemandInducedRows(
  filters: ReportDemandInducedFilters,
  limit?: number
): Promise<ReportDemandInducedRow[]> {
  const { dateStart, dateEnd, headquarter, convenio, rolUser, userId } =
    filters;

  const query = DemandaInducida.createQueryBuilder("demandas_inducidas")
    .leftJoinAndSelect("demandas_inducidas.pacienteRelation", "paciente")
    .leftJoinAndSelect("paciente.documentRelation", "tipo_documento")
    .leftJoinAndSelect("paciente.convenioRelation", "convenio")
    .leftJoinAndSelect("demandas_inducidas.elementoRelation", "elemento")
    .leftJoinAndSelect("demandas_inducidas.tipoRelation", "tipo_elemento")
    .leftJoinAndSelect("demandas_inducidas.objetivoRelation", "objetivo")
    .leftJoinAndSelect(
      "demandas_inducidas.relacionRelation",
      "relacion_usuario"
    )
    .leftJoinAndSelect("demandas_inducidas.areaEpsRelation", "area_eps")
    .leftJoinAndSelect(
      "demandas_inducidas.resumenRelation",
      "resumen_seguimiento"
    )
    .leftJoinAndSelect(
      "demandas_inducidas.resultadoRelation",
      "resultado_llamada"
    )
    .leftJoinAndSelect("demandas_inducidas.motivoRelation", "motivo")
    .leftJoinAndSelect(
      "demandas_inducidas.areaPersonaRelation",
      "area_persona"
    )
    .leftJoinAndSelect(
      "demandas_inducidas.personaSeguimientoRelation",
      "usuario_seguimiento"
    )
    .leftJoinAndSelect("demandas_inducidas.programaRelation", "programa")
    .orderBy("demandas_inducidas.createdAt", "ASC");

  if (convenio) {
    query.andWhere("paciente.agreementId = :convenio", { convenio });
  }

  if (rolUser == 19 && userId) {
    query.andWhere(
      "demandas_inducidas.personaSeguimientoRelation = :userId",
      {
        userId,
      }
    );
  }

  if (dateStart && dateEnd) {
    query.andWhere("demandas_inducidas.createdAt BETWEEN :start AND :end", {
      start: dateStart,
      end: dateEnd,
    });
  }

  if (headquarter) {
    query.andWhere("usuario_seguimiento.headquarters = :headquarter", {
      headquarter,
    });
  }

  if (limit) {
    query.limit(limit);
  }

  const data = await query.getMany();
  const rows: ReportDemandInducedRow[] = [];

  data.forEach((d) => {
    rows.push({
      tipo_documento: d.pacienteRelation?.documentRelation?.name || "",
      numero_identificacion: d.pacienteRelation?.documentNumber || "",
      fecha_actividad: d.createdAt
        ? formatInTimeZone(
            new Date(d.createdAt),
            "America/Bogota",
            "dd/MM/yyyy HH:mm:ss"
          )
        : "",
      elemento_demanda: d.elementoRelation?.name || "",
      tipo_elemento: d.tipoRelation?.name || "",
      objetivo: d.objetivoRelation?.name || "",
      numero_telefono_contacto: d.contactNumbers || "",
      clasificacion_seguimiento: d.clasificacion ? "Efectivo" : "No Efectivo",
      persona_recibe_llamada: d.personaRecibe || "",
      relacion_usuario: d.relacionRelation?.name || "",
      fecha_llamada: d.fechaLlamada
        ? formatInTimeZone(
            new Date(d.fechaLlamada),
            "America/Bogota",
            "dd/MM/yyyy"
          )
        : "",
      hora_llamada: d.horaLlamada ? d.horaLlamada.slice(0, 5) : "",
      texto_llamada: d.textoLlamada || "",
      barreras_acceso: d.dificultadAcceso ? "Si" : "No",
      area_dificultad: d.areaDificultad || "",
      area_eps: d.areaEpsRelation?.name || "",
      resumen_actividades: d.resumenRelation?.name || "",
      soportes_recuperados: d.soporteRecuperados || "",
      departamento: "",
      municipio: "",
      barrio_vereda: "",
      numero_telefono: "",
      correo_electronico: "",
      resultado_llamada: d.resultadoRelation?.name || "",
      fecha_envio: d.fechaEnvio
        ? formatInTimeZone(
            new Date(d.fechaEnvio),
            "America/Bogota",
            "dd/MM/yyyy"
          )
        : "",
      hora_envio: d.horaEnvio ? d.horaEnvio.slice(0, 5) : "",
      texto_mensaje: d.textEnvio || "",
      fecha_visita: d.fechaVisita
        ? formatInTimeZone(
            new Date(d.fechaVisita),
            "America/Bogota",
            "dd/MM/yyyy"
          )
        : "",
      resumen_visita: d.resumenRelation?.name || "",
      motivo_visita_no_efectiva: d?.motivoRelation?.name || "",
      persona_seguimiento: d.personaSeguimientoRelation?.name || "",
      area_persona: d.areaPersonaRelation?.name || "",
      programa: d.programaRelation?.name || "",
      fecha_asignacion_cita: d.fechaCita
        ? formatInTimeZone(
            new Date(d.fechaCita),
            "America/Bogota",
            "dd/MM/yyyy"
          )
        : "",
      Profesional: d.profesional || "",
    });
  });

  return rows;
}
