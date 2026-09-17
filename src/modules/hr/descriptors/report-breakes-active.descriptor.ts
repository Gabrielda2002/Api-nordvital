import type { ReportDescriptor } from "@modules/reports/core/types";
import { ROLE_GROUPS, ROLE_IDS } from "@core/constants/roles";
import {
  getReportBreakesActiveRows,
  type ReportBreakesActiveFilters,
} from "../services/report-breakes-active.service";

export const breakesActiveReport: ReportDescriptor<ReportBreakesActiveFilters> = {
  name: "breakes",
  roles: [...ROLE_GROUPS.COORDINADORES, ROLE_IDS.GERENTE],
  sheet: "Reporte Pausas Activas",
  fileBase: "Reporte_Pausas_Activas",
  columns: [
    { key: "fecha_creacion", label: "Fecha Registro", width: 20 },
    { key: "numero_documento", label: "Número Documento", width: 20 },
    { key: "nombre_usuario", label: "Nombre del Usuario", width: 30 },
    { key: "apellidos_usuario", label: "Apellidos", width: 30 },
    { key: "area", label: "Área", width: 20 },
    { key: "cargo", label: "Cargo", width: 20 },
    { key: "sede", label: "Sede", width: 20 },
    { key: "observacion", label: "Observación", width: 30 },
  ],
  header: { kind: "simple", style: "plain" },
  fetchRows: getReportBreakesActiveRows,
  onEmpty: "none",
  previewNotFoundMessage: "Data Breaks Active Not Found.",
  swagger: {
    summary: "Descarga reporte de pausas activas en Excel",
    previewSummary: "Vista previa JSON del reporte de pausas activas",
    filters: {
      dateStart: { type: "string", format: "date", description: "Fecha de inicio del filtro" },
      dateEnd: { type: "string", format: "date", description: "Fecha de fin del filtro" },
    },
  },
};
