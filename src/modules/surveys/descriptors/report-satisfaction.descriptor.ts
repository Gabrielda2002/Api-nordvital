import type { ReportDescriptor } from "@modules/reports/core/types";
import { ROLE_GROUPS } from "@core/constants/roles";
import {
  getReportSatisfactionRows,
  type ReportSatisfactionFilters,
} from "../services/report-satisfaction.service";

export const satisfactionReport: ReportDescriptor<ReportSatisfactionFilters> = {
  name: "satisfaction",
  basePath: "/surveys/satisfaction/report",
  roles: ROLE_GROUPS.SIAU,
  sheet: "Reporte Encuestas Satisfaccion",
  fileBase: "Reporte_Encuestas_Satisfaccion",
  columns: [
    { key: "Marca_temporal", label: "MARCA TEMPORAL", width: 22 },
    { key: "Sede_atencion", label: "SEDE DE ATENCIÓN", width: 20 },
    { key: "Convenio_paciente", label: "CONVENIO DEL PACIENTE", width: 22 },
    { key: "Numero_identificacion", label: "NÚMERO DE IDENTIFICACIÓN", width: 22 },
    { key: "Nombre_completo", label: "NOMBRE COMPLETO", width: 35 },
    { key: "Poblacion_especial", label: "POBLACIÓN ESPECIAL", width: 28 },
    { key: "Servicio_atencion", label: "SERVICIO EN EL CUAL RECIBIÓ ATENCIÓN", width: 40 },
    { key: "Cita_oportuna", label: "¿SU CITA MÉDICA FUE ASIGNADA DE MANERA OPORTUNA?", width: 22 },
    { key: "Atencion_puntual", label: "¿FUE ATENDIDO(A) CON PUNTUALIDAD?", width: 22 },
    { key: "Interes_profesional", label: "¿EL PROFESIONAL MOSTRÓ INTERÉS EN CONOCER SU HISTORIA CLÍNICA Y MOTIVO DE CONSULTA?", width: 26 },
    { key: "Recomendaciones_claras", label: "¿LAS RECOMENDACIONES BRINDADAS POR EL PROFESIONAL FUERON CLARAS Y COMPRENSIBLES?", width: 26 },
    { key: "Senalizacion_ayudo", label: "¿LA SEÑALIZACIÓN DENTRO DE LA SEDE FACILITÓ SU UBICACIÓN?", width: 22 },
    { key: "Instalaciones_adecuadas", label: "¿CONSIDERA QUE LAS INSTALACIONES SON ADECUADAS Y CÓMODAS?", width: 22 },
    { key: "Instalaciones_limpias", label: "¿CONSIDERA QUE LAS INSTALACIONES SE ENCUENTRAN LIMPIAS Y EN BUEN ORDEN?", width: 22 },
    { key: "Calificacion_profesional", label: "CALIFICACIÓN ATENCIÓN DEL PROFESIONAL DE SALUD", width: 24 },
    { key: "Calificacion_servicio_cliente", label: "CALIFICACIÓN ATENCIÓN DEL PERSONAL DE SERVICIO AL CLIENTE", width: 24 },
    { key: "Experiencia_global", label: "EXPERIENCIA GLOBAL CON LOS SERVICIOS DE SALUD DE LA IPS", width: 24 },
    { key: "Recomendaria_ips", label: "¿RECOMENDARÍA A SUS FAMILIARES Y AMIGOS A NORDVITAL IPS?", width: 24 },
  ],
  header: { kind: "simple", style: "success", fontSize: 10, rowHeight: 45 },
  fetchRows: getReportSatisfactionRows,
  onEmpty: "throw-404",
  notFoundMessage: "No se encontraron encuestas de satisfacción en el rango especificado",
  previewNotFoundMessage: "No se encontraron encuestas de satisfacción",
  swaggerTag: "EncuestasSatisfaccionPacientes",
  swagger: {
    summary: "Descarga reporte de encuestas de satisfacción en Excel",
    previewSummary: "Vista previa JSON del reporte de encuestas de satisfacción (mismos filtros que el Excel)",
    filters: {
      dateStart: { type: "string", format: "date", description: "Fecha de inicio del filtro" },
      dateEnd: { type: "string", format: "date", description: "Fecha de fin del filtro" },
    },
  },
};
