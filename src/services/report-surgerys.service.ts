import { formatInTimeZone } from "date-fns-tz";
import { Cirugias } from "../entities/cirugias";

export type ReportSurgerysFilters = {
  dateStart?: string;
  dateEnd?: string;
};

export type ReportSurgerysRow = Record<
  string,
  string | number | Date | null | undefined
>;

export async function getReportSurgerysRows(
  filters: ReportSurgerysFilters,
  limit?: number
): Promise<ReportSurgerysRow[]> {
  const { dateStart, dateEnd } = filters;

  const query = Cirugias.createQueryBuilder("cirugias")
    .leftJoinAndSelect("cirugias.ipsRemiteRelation", "ipsRemite")
    .leftJoinAndSelect("cirugias.radicacionRelation", "radicacion")
    .leftJoinAndSelect("cirugias.gestionCirugiasRelation", "gestionCirugias")
    .leftJoinAndSelect(
      "gestionCirugias.estadoSeguimientoRelation",
      "estadoSeguimiento"
    )
    .leftJoinAndSelect("radicacion.cupsRadicadosRelation", "cups")
    .leftJoinAndSelect("cups.servicioRelation", "services")
    .leftJoinAndSelect("radicacion.diagnosticoRelation", "diagnostico")
    .orderBy("cirugias.createdAt", "DESC");

  if (dateStart && dateEnd) {
    query.andWhere("cirugias.createdAt BETWEEN :dateStart AND :dateEnd", {
      dateStart,
      dateEnd,
    });
  }

  if (limit) {
    query.limit(limit);
  }

  const dataCirugias = await query.getMany();
  const rows: ReportSurgerysRow[] = [];

  dataCirugias.forEach((data) => {
    const fechaCirugia = data.surgeryDate
      ? formatInTimeZone(
          new Date(data.surgeryDate),
          "America/Bogota",
          "yyyy-MM-dd HH:mm:ss"
        )
      : "N/A";
    const fechaOrdenamiento = data.radicacionRelation.orderDate
      ? formatInTimeZone(
          new Date(data.radicacionRelation.orderDate),
          "America/Bogota",
          "yyyy-MM-dd HH:mm:ss"
        )
      : "N/A";
    const fechaParaclinico = data.paraclinicalDate
      ? formatInTimeZone(
          new Date(data.paraclinicalDate),
          "America/Bogota",
          "yyyy-MM-dd HH:mm:ss"
        )
      : "N/A";
    const fechaAnesteciologia = data.anesthesiologyDate
      ? formatInTimeZone(
          new Date(data.anesthesiologyDate),
          "America/Bogota",
          "yyyy-MM-dd HH:mm:ss"
        )
      : "N/A";
    const fechaRegistro = data.createdAt
      ? formatInTimeZone(
          new Date(data.createdAt),
          "America/Bogota",
          "yyyy-MM-dd HH:mm:ss"
        )
      : "N/A";

    const row = {
      Fecha_ordenamiento: fechaOrdenamiento,
      Fecha_cirugia: fechaCirugia,
      Hora_programada: data.scheduledTime || "N/A",
      IPS_Remitente: data.ipsRemiteRelation?.name || "N/A",
      Observaciones: data.observation || "N/A",
      diagnostico_name:
        data.radicacionRelation?.diagnosticoRelation.description || "N/A",
      diagnostico_code:
        data.radicacionRelation?.diagnosticoRelation.code || "N/A",
      especialista: data.specialist || "N/A",
      fecha_paraclinico: fechaParaclinico,
      fecha_anesteciologia: fechaAnesteciologia,
      Fecha_registro: fechaRegistro,
    };

    if (data.radicacionRelation?.cupsRadicadosRelation?.length > 0) {
      data.radicacionRelation?.cupsRadicadosRelation.forEach((cups) => {
        rows.push({
          ...row,
          Codigo_cups: cups.servicioRelation?.code || "N/A",
          Descripcion_cups: cups.servicioRelation?.name || "N/A",
          Observacionesgestion: cups.observation || "N/A",
          Estado: cups.statusRelation?.name || "N/A",
        });
      });
    } else {
      rows.push(row);
    }

    if (data.gestionCirugiasRelation.length > 0) {
      data.gestionCirugiasRelation.forEach((gestion) => {
        rows.push({
          ...row,
          Estado: gestion.estadoSeguimientoRelation?.name || "N/A",
          Observacionesgestion: gestion.observation || "N/A",
          Fecha_registro: gestion.createdAt || "N/A",
        });
      });
    }
  });

  return rows;
}
