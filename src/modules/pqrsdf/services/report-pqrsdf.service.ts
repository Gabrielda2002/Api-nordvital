import { formatInTimeZone } from "date-fns-tz";
import { Pqrsdf } from "../entities/pqrsdf";
import { PqrsdfStatusHistory } from "../entities/pqrsdf-status-history";

export type ReportPqrsdfFilters = {
  startDate?: string;
  endDate?: string;
  status?: string;
  classification?: string;
  instance?: string;
  patientDocument?: string;
  originAreaId?: string;
};

export type ReportPqrsdfRow = Record<
  string,
  string | number | Date | null | undefined
>;

export async function getReportPqrsdfRows(
  filters: ReportPqrsdfFilters,
  limit?: number
): Promise<ReportPqrsdfRow[]> {
  
  const {
    startDate,
    endDate,
    status,
    classification,
    instance,
    patientDocument,
    originAreaId,
  } = filters;

  const query = Pqrsdf.createQueryBuilder("pqrsdf")
    .leftJoinAndSelect("pqrsdf.patientRelation", "patient")
    .leftJoinAndSelect("patient.convenioRelation", "agreement")
    .leftJoinAndSelect("pqrsdf.resolutionAreaRelation", "resolutionArea")
    .orderBy("pqrsdf.createdAt", "DESC");

  if (startDate && endDate) {
    query.andWhere("pqrsdf.pqrsDate BETWEEN :startDate AND :endDate", {
      startDate,
      endDate,
    });
  } else if (startDate) {
    query.andWhere("pqrsdf.pqrsDate >= :startDate", { startDate });
  } else if (endDate) {
    query.andWhere("pqrsdf.pqrsDate <= :endDate", { endDate });
  }

  if (status) {
    query.andWhere("pqrsdf.status = :status", { status });
  }

  if (classification) {
    query.andWhere("pqrsdf.classification = :classification", {
      classification,
    });
  }

  if (instance) {
    query.andWhere("pqrsdf.instance = :instance", { instance });
  }

  if (patientDocument) {
    query.andWhere("patient.documentNumber = :patientDocument", {
      patientDocument,
    });
  }

  if (originAreaId) {
    query.andWhere("pqrsdf.originAreaId = :originAreaId", {
      originAreaId: parseInt(originAreaId, 10),
    });
  }

  if (limit) {
    query.limit(limit);
  }

  const data = await query.getMany();

  const ids = data.map((p) => p.id);
  const lastNotes = new Map<number, string>();

  if (ids.length > 0) {
    const history = await PqrsdfStatusHistory.createQueryBuilder("h")
      .where("h.pqrsdfId IN (:...ids)", { ids })
      .orderBy("h.id", "ASC")
      .getMany();

    for (const entry of history) {
      lastNotes.set(entry.pqrsdfId, entry.note ?? "");
    }
  }

  const rows: ReportPqrsdfRow[] = data.map((p) => ({
    Nombre_del_paciente: p.patientRelation?.name || "N/A",
    Documento: p.patientRelation?.documentNumber || "N/A",
    Asegurador_EPS: p.patientRelation?.convenioRelation?.name || "N/A",
    Ente: "N/A",
    Regimen: "N/A",
    Novedad_presentada_por: p.presentedBy || "N/A",
    Notifica_EPS: "N/A",
    PQRS: p.classification || "N/A",
    Medio: p.receptionMedium || "N/A",
    Numero_de_radicado: p.filingNumber ?? "N/A",
    Fecha_de_radicacion: p.pqrsDate
      ? formatInTimeZone(
          new Date(p.pqrsDate),
          "America/Bogota",
          "yyyy-MM-dd"
        )
      : "N/A",
    Fecha_de_hallazgo: "N/A",
    Fecha_de_respuesta: p.responseDate
      ? formatInTimeZone(
          new Date(p.responseDate),
          "America/Bogota",
          "yyyy-MM-dd"
        )
      : "N/A",
    Oportunidad_desde_radicacion: "N/A",
    Oportunidad_desde_hallazgo: "N/A",
    Via_utilizada_para_la_respuesta: p.notificationMedium || "N/A",
    Servicio: "N/A",
    Respuesta: lastNotes.get(p.id) || "N/A",
    Area_con_la_cual_se_resolvio_el_evento:
      p.resolutionAreaRelation?.name || "N/A",
    Clasificacion_final: "N/A",
    Accion_de_mejora:
      p.improvementAction == null
        ? "N/A"
        : p.improvementAction
          ? "SI"
          : "NO",
    Plan_de_mejoramiento: p.improvementActionDetails || "N/A",
    Fecha_del_seguimiento: "N/A",
    Seguimiento: "N/A",
    Estado: p.status || "N/A",
    Indicador: "N/A",
  }));

  return rows;
}