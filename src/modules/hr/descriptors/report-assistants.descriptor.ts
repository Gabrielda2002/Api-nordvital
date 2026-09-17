import type { ReportDescriptor } from "@modules/reports/core/types";
import { ROLE_GROUPS } from "@core/constants/roles";
import {
  getReportAssistantsRows,
  type ReportAssistantsFilters,
} from "../services/report-assistants.service";

export const assistantsReport: ReportDescriptor<ReportAssistantsFilters> = {
  name: "assistants",
  roles: ROLE_GROUPS.REPORT_MANAGERS,
  sheet: "Reporte Gestion Auxiliar",
  fileBase: "Reporte_Gestion_Auxiliar",
  columns: [
    { key: "id_radicado", label: "ID Radicado", width: 15 },
    { key: "radicadoDate", label: "Fecha-hora", width: 20 },
    { key: "numero_documento", label: "Número Documento", width: 20 },
    { key: "nombre_paciente", label: "Nombre Paciente", width: 30 },
    { key: "codigo_cups", label: "Código CUPS", width: 15 },
    { key: "descripcion_cups", label: "Descripción CUPS", width: 40 },
    { key: "estado_gestion", label: "Estado Gestión", width: 20 },
    { key: "observacion", label: "Observación", width: 30 },
    { key: "fecha_registro", label: "Fecha Registro", width: 20 },
    { key: "usuario_registro", label: "Usuario Registro", width: 20 },
  ],
  header: { kind: "simple", style: "plain" },
  fetchRows: getReportAssistantsRows,
  onEmpty: "throw-404",
  previewNotFoundMessage: "Data Assistants Not Found.",
  swagger: {
    summary: "Descarga reporte de gestión auxiliar en Excel",
    previewSummary: "Vista previa JSON del reporte de gestión auxiliar",
    filters: {
      dateStart: { type: "string", format: "date", description: "Fecha de inicio del filtro" },
      dateEnd: { type: "string", format: "date", description: "Fecha de fin del filtro" },
    },
  },
};
