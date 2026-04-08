import { formatInTimeZone } from "date-fns-tz";
import { RegistroEntrada } from "../entities/registro-entrada";

export type ReportBiometricFilters = {
  dateStart?: string;
  dateEnd?: string;
};

export type ReportBiometricRow = Record<
  string,
  string | number | Date | null | undefined
>;

export async function getReportBiometricRows(
  filters: ReportBiometricFilters,
  limit?: number
): Promise<ReportBiometricRow[]> {
  const { dateStart, dateEnd } = filters;

  const query = RegistroEntrada.createQueryBuilder("registro_entrada")
    .leftJoinAndSelect("registro_entrada.userRelation", "usuario")
    .leftJoinAndSelect("registro_entrada.sedeRelation", "sede")
    .orderBy("registro_entrada.registerDate", "DESC");

  if (dateStart && dateEnd) {
    query.andWhere(
      "registro_entrada.registerDate BETWEEN :dateStart AND :dateEnd",
      { dateStart, dateEnd }
    );
  }

  if (limit) {
    query.limit(limit);
  }

  const data = await query.getMany();
  const rows: ReportBiometricRow[] = [];

  data.forEach((r) => {
    const fechaRegistro = r.registerDate
      ? formatInTimeZone(
          new Date(r.registerDate),
          "America/Bogota",
          "yyyy-MM-dd"
        )
      : "N/A";

    rows.push({
      numero_documento: r.userRelation?.dniNumber || "N/A",
      nombre_usuario: r.userRelation?.name || "N/A",
      apellidos: r.userRelation?.lastName || "N/A",
      fecha_registro: fechaRegistro,
      hora_registro: r.hourRegister || "N/A",
      sede: r.sedeRelation?.name || "N/A",
      area: r.userRelation?.area || "N/A",
    });
  });

  return rows;
}
