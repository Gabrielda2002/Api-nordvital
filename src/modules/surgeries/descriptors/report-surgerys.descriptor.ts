import type { ReportDescriptor } from "@modules/reports/core/types";
import { ROLE_GROUPS } from "@core/constants/roles";
import { BadRequestError } from "@core/utils/custom-errors";
import {
  getReportSurgerysRows,
  type ReportSurgerysFilters,
} from "../services/report-surgerys.service";

export const surgerysReport: ReportDescriptor<ReportSurgerysFilters> = {
  name: "surgeries",
  roles: ROLE_GROUPS.REPORT_MANAGERS,
  sheet: "Reporte Cirugias",
  fileBase: "Reporte_Cirugias",
  columns: [
    { key: "Fecha_ordenamiento", label: "Fecha de Ordenamiento", width: 20 },
    { key: "Fecha_cirugia", label: "Fecha de Cirugia", width: 20 },
    { key: "Hora_programada", label: "Hora Programada", width: 20 },
    { key: "IPS_Remitente", label: "IPS Remitente", width: 30 },
    { key: "Observaciones", label: "Observacion", width: 30 },
    { key: "diagnostico_code", label: "Codigo Diagnostico", width: 30 },
    { key: "diagnostico_name", label: "Diagnostico", width: 30 },
    { key: "especialista", label: "Especialista", width: 30 },
    { key: "fecha_anesteciologia", label: "Fecha anesteciologia", width: 30 },
    { key: "fecha_paraclinico", label: "Fecha paraclinico", width: 30 },
    { key: "Codigo_cups", label: "Codigo CUPS", width: 30 },
    { key: "Descripcion_cups", label: "Descripcion CUPS", width: 30 },
    { key: "Observacionesgestion", label: "Observacion Gestion", width: 30 },
    { key: "Estado", label: "Estado", width: 20 },
    { key: "Fecha_registro", label: "Fecha de Registro", width: 20 },
  ],
  header: { kind: "simple", style: "plain" },
  fetchRows: getReportSurgerysRows,
  parseFilters: (body) => {
    const dateStart = body.dateStart as string | undefined;
    const dateEnd = body.dateEnd as string | undefined;
    if (!dateStart || !dateEnd) {
      throw new BadRequestError("Debe enviar la fecha de ordenamiento");
    }
    return { dateStart, dateEnd };
  },
  onEmpty: "none",
  previewNotFoundMessage: "Data Surgerys Not Found.",
  swagger: {
    summary: "Descarga reporte de cirugías filtrado en Excel",
    previewSummary: "Vista previa JSON del reporte de cirugías (mismos filtros que el Excel)",
    filters: {
      dateStart: { type: "string", format: "date", description: "Fecha de inicio del filtro (fecha de ordenamiento)" },
      dateEnd: { type: "string", format: "date", description: "Fecha de fin del filtro (fecha de ordenamiento)" },
    },
  },
};
