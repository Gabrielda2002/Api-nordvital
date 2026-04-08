import { formatInTimeZone } from "date-fns-tz";
import { PausasActivas } from "../modules/hr/entities/pausas-activas";

export type ReportBreakesActiveFilters = {
  dateStart?: string;
  dateEnd?: string;
};

export type ReportBreakesActiveRow = Record<
  string,
  string | number | Date | null | undefined
>;

export async function getReportBreakesActiveRows(
  filters: ReportBreakesActiveFilters,
  limit?: number
): Promise<ReportBreakesActiveRow[]> {
  const { dateStart, dateEnd } = filters;

  const query = PausasActivas.createQueryBuilder("pausas_activas")
    .leftJoinAndSelect("pausas_activas.userRelation", "usuario")
    .leftJoinAndSelect("usuario.sedeRelation", "sede")
    .orderBy("pausas_activas.createdAt", "DESC");

  if (dateStart && dateEnd) {
    query.andWhere(
      "pausas_activas.createdAt BETWEEN :dateStart AND :dateEnd",
      {
        dateStart,
        dateEnd,
      }
    );
  }

  if (limit) {
    query.limit(limit);
  }

  const data = await query.getMany();
  const rows: ReportBreakesActiveRow[] = [];

  data.forEach((pausa) => {
    const fechaCreacion = pausa.createdAt
      ? formatInTimeZone(
          new Date(pausa.createdAt),
          "America/Bogota",
          "yyyy-MM-dd HH:mm:ss"
        )
      : "N/A";

    rows.push({
      fecha_creacion: fechaCreacion,
      observacion: pausa.observation || "N/A",
      nombre_usuario: pausa.userRelation?.name || "N/A",
      apellidos_usuario: pausa.userRelation?.lastName || "N/A",
      area: pausa.userRelation?.area || "N/A",
      cargo: pausa.userRelation?.position || "N/A",
      sede: pausa.userRelation?.sedeRelation?.name || "N/A",
      numero_documento: pausa.userRelation?.dniNumber || "N/A",
    });
  });

  return rows;
}
