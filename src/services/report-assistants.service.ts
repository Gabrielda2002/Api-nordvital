import { Radicacion } from "../entities/radicacion";

export type ReportAssistantsFilters = {
  dateStart?: string;
  dateEnd?: string;
};

export type ReportAssistantsRow = Record<
  string,
  string | number | Date | null | undefined
>;

export async function getReportAssistantsRows(
  filters: ReportAssistantsFilters,
  limit?: number
): Promise<ReportAssistantsRow[]> {
  const { dateStart, dateEnd } = filters;

  const query = Radicacion.createQueryBuilder("radicacion")
    .leftJoinAndSelect("radicacion.patientRelation", "pacientes")
    .leftJoinAndSelect("radicacion.cupsRadicadosRelation", "cups")
    .leftJoinAndSelect(
      "cups.seguimientoAuxiliarRelation",
      "seguimiento_auxiliar"
    )
    .leftJoinAndSelect("cups.servicioRelation", "services")
    .leftJoinAndSelect(
      "seguimiento_auxiliar.estadoSeguimientoRelation",
      "estado_seguimiento"
    )
    .leftJoinAndSelect("seguimiento_auxiliar.usuarioRelation", "usuario")
    .orderBy("radicacion.createdAt", "DESC");

  if (dateStart && dateEnd) {
    query.andWhere("radicacion.createdAt BETWEEN :dateStart AND :dateEnd", {
      dateStart,
      dateEnd,
    });
  }

  if (limit) {
    query.limit(limit);
  }

  const data = await query.getMany();
  const rows: ReportAssistantsRow[] = [];

  data.forEach((radicado) => {
    if (radicado.cupsRadicadosRelation.length > 0) {
      radicado.cupsRadicadosRelation.forEach((cups) => {
        if (cups.seguimientoAuxiliarRelation?.length > 0) {
          cups.seguimientoAuxiliarRelation.forEach((seguimiento) => {
            rows.push({
              id_radicado: radicado.id,
              radicadoDate: radicado.createdAt || "N/A",
              numero_documento:
                radicado.patientRelation?.documentNumber || "N/A",
              nombre_paciente: radicado.patientRelation?.name || "N/A",
              codigo_cups: cups.servicioRelation?.code || "N/A",
              descripcion_cups: cups.servicioRelation?.name || "N/A",
              estado_gestion:
                seguimiento.estadoSeguimientoRelation?.name || "N/A",
              observacion: seguimiento.observation || "N/A",
              fecha_registro: seguimiento.createdAt || "N/A",
              usuario_registro: seguimiento.usuarioRelation?.name || "N/A",
            });
          });
        }
      });
    }
  });

  return rows;
}
