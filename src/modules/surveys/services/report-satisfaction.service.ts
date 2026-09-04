import { EncuestaSatisfaccion } from "../entities/encuesta-satisfaccion";

export type ReportSatisfactionFilters = {
  dateStart?: string;
  dateEnd?: string;
};

export type ReportSatisfactionRow = Record<
  string,
  string | number | Date | null | undefined
>;

export async function getReportSatisfactionRows(
  filters: ReportSatisfactionFilters,
  limit?: number
): Promise<ReportSatisfactionRow[]> {
  const { dateStart, dateEnd } = filters;

  const query = EncuestaSatisfaccion.createQueryBuilder("survey")
    .leftJoinAndSelect("survey.patientRelation", "patient")
    .leftJoinAndSelect("patient.convenioRelation", "agreement")
    .leftJoinAndSelect("survey.municipioRelation", "municipio")
    .leftJoinAndSelect("survey.specialPopulationRelation", "specialPopulation")
    .leftJoinAndSelect("survey.attentionServiceRelation", "attentionService")
    .orderBy("survey.createdAt", "DESC");

  if (dateStart && dateEnd) {
    query.andWhere("survey.createdAt BETWEEN :dateStart AND :dateEnd", {
      dateStart,
      dateEnd,
    });
  } else if (dateStart) {
    query.andWhere("survey.createdAt >= :dateStart", { dateStart });
  } else if (dateEnd) {
    query.andWhere("survey.createdAt <= :dateEnd", { dateEnd });
  }

  if (limit) {
    query.limit(limit);
  }

  const data = await query.getMany();

  const rows: ReportSatisfactionRow[] = data.map((s) => ({
    Marca_temporal: s.createdAt,
    Sede_atencion: s.municipioRelation?.name || "N/A",
    Convenio_paciente: s.patientRelation?.convenioRelation?.name || "N/A",
    Numero_identificacion: s.patientRelation?.documentNumber || "N/A",
    Nombre_completo: s.patientRelation?.name || "N/A",
    Poblacion_especial: s.specialPopulationRelation?.name || "N/A",
    Servicio_atencion: s.attentionServiceRelation?.name || "N/A",
    Cita_oportuna: s.timelyAppointment,
    Atencion_puntual: s.punctualCare,
    Interes_profesional: s.professionalInterest,
    Recomendaciones_claras: s.clearRecommendations,
    Senalizacion_ayudo: s.signageHelped,
    Instalaciones_adecuadas: s.adequateFacilities,
    Instalaciones_limpias: s.cleanFacilities,
    Calificacion_profesional: s.professionalCareRating,
    Calificacion_servicio_cliente: s.customerServiceRating,
    Experiencia_global: s.globalExperience,
    Recomendaria_ips: s.wouldRecommend,
  }));

  return rows;
}
