import { formatInTimeZone } from "date-fns-tz";
import { Tickets } from "../entities/tickets";

export type ReportTicketsFilters = {
  dateStart?: string;
  dateEnd?: string;
};

export type ReportTicketsRow = Record<
  string,
  string | number | Date | null | undefined
>;

export async function getReportTicketsRows(
  filters: ReportTicketsFilters,
  limit?: number
): Promise<ReportTicketsRow[]> {
  const { dateStart, dateEnd } = filters;

  const query = Tickets.createQueryBuilder("tickets")
    .leftJoinAndSelect("tickets.categoryRelation", "categoria")
    .leftJoinAndSelect("tickets.userRelation", "usuario")
    .leftJoinAndSelect("usuario.sedeRelation", "sede")
    .leftJoinAndSelect("tickets.statusRelation", "estado")
    .leftJoinAndSelect("tickets.priorityRelation", "prioridad")
    .leftJoinAndSelect("tickets.commentRelation", "comentarios")
    .leftJoinAndSelect("comentarios.userRelation", "usuario_responsdedor")
    .leftJoinAndSelect("tickets.surveyRelation", "encuesta")
    .orderBy("tickets.createdAt", "DESC");

  if (dateStart && dateEnd) {
    query.where("tickets.createdAt BETWEEN :dateStart AND :dateEnd", {
      dateStart,
      dateEnd,
    });
  }

  if (limit) {
    query.limit(limit);
  }

  const data = await query.getMany();
  const rows: ReportTicketsRow[] = [];

  data.forEach((t) => {
    rows.push({
      fecha_registro: t.createdAt
        ? formatInTimeZone(
            new Date(t.createdAt),
            "America/Bogota",
            "yyyy-MM-dd HH:mm:ss"
          )
        : "N/A",
      descripcion: t.description || "N/A",
      categoria: t.categoryRelation?.name || "N/A",
      titulo: t.title || "N/A",
      usuario_solicitante:
        `${t.userRelation?.name} ${t.userRelation.lastName}` || "N/A",
      sede_solicitante: t.userRelation?.sedeRelation?.name || "N/A",
      usuario_responsable:
        t.commentRelation?.length > 0
          ? `${t.commentRelation[0]?.userRelation?.name || ""} ${
              t.commentRelation[0]?.userRelation?.lastName || ""
            }`
          : "N/A",
      ultimo_estado: t.statusRelation?.name || "N/A",
      ultimo_comentario:
        t.commentRelation?.length > 0
          ? t.commentRelation[t.commentRelation.length - 1]?.comment || "N/A"
          : "N/A",
      fecha_ultimo_comentario:
        t.commentRelation?.length > 0
          ? formatInTimeZone(
              new Date(
                t.commentRelation[t.commentRelation.length - 1]?.createdAt
              ),
              "America/Bogota",
              "yyyy-MM-dd HH:mm:ss"
            )
          : "N/A",
    });
  });

  return rows;
}
