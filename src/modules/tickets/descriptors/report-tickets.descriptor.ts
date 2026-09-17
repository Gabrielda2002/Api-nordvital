import type { ReportDescriptor } from "@modules/reports/core/types";
import { ROLE_IDS } from "@core/constants/roles";
import {
  getReportTicketsRows,
  type ReportTicketsFilters,
} from "../services/report-tickets.service";

export const ticketsReport: ReportDescriptor<ReportTicketsFilters> = {
  name: "tickets",
  roles: [ROLE_IDS.ADMINISTRADOR],
  sheet: "Reporte Tickets Mesa de Ayuda",
  fileBase: "Reporte_Tickets_Mesa_Ayuda",
  columns: [
    { key: "fecha_registro", label: "Fecha Registro", width: 20 },
    { key: "descripcion", label: "Descripcion", width: 30 },
    { key: "categoria", label: "Categoria", width: 20 },
    { key: "titulo", label: "Titulo", width: 30 },
    { key: "usuario_solicitante", label: "Usuario Solicitante", width: 30 },
    { key: "sede_solicitante", label: "Sede Solicitante", width: 20 },
    { key: "usuario_responsable", label: "Usuario Respondedor", width: 30 },
    { key: "ultimo_estado", label: "Ultimo Estado", width: 20 },
    { key: "ultimo_comentario", label: "Ultimo Comentario", width: 30 },
    { key: "fecha_ultimo_comentario", label: "Fecha Ultimo Comentario", width: 20 },
  ],
  header: { kind: "simple", style: "plain" },
  fetchRows: getReportTicketsRows,
  onEmpty: "throw-404",
  notFoundMessage: "No se encontraron tickets en el rango de fechas especificado",
  previewNotFoundMessage: "Data Tickets Not Found.",
  swagger: {
    summary: "Descarga reporte de tickets de mesa de ayuda en Excel",
    previewSummary: "Vista previa JSON del reporte de tickets de mesa de ayuda",
    filters: {
      dateStart: { type: "string", format: "date", description: "Fecha de inicio del filtro" },
      dateEnd: { type: "string", format: "date", description: "Fecha de fin del filtro" },
    },
  },
};
