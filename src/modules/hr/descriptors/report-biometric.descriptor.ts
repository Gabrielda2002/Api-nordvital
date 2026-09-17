import type { ReportDescriptor } from "@modules/reports/core/types";
import { ROLE_GROUPS } from "@core/constants/roles";
import {
  getReportBiometricRows,
  type ReportBiometricFilters,
} from "../services/report-biometric.service";

export const biometricReport: ReportDescriptor<ReportBiometricFilters> = {
  name: "biometric",
  roles: ROLE_GROUPS.APPROVAL_MANAGERS_FULL,
  sheet: "Repore Registros Biometricos",
  fileBase: "Reporte_Registros_Biometricos",
  columns: [
    { key: "numero_documento", label: "Numero Documento", width: 20 },
    { key: "nombre_usuario", label: "Nombre Usuario", width: 30 },
    { key: "apellidos", label: "Apellidos", width: 30 },
    { key: "fecha_registro", label: "Fecha Registro", width: 20 },
    { key: "hora_registro", label: "Hora Registro", width: 20 },
    { key: "sede", label: "Sede", width: 20 },
    { key: "area", label: "Area", width: 20 },
  ],
  header: { kind: "simple", style: "plain" },
  fetchRows: getReportBiometricRows,
  onEmpty: "none",
  previewNotFoundMessage: "Data Biometric Not Found.",
  swagger: {
    summary: "Descarga reporte de registros biométricos en Excel",
    previewSummary: "Vista previa JSON del reporte de registros biométricos",
    filters: {
      dateStart: { type: "string", format: "date", description: "Fecha de inicio del filtro" },
      dateEnd: { type: "string", format: "date", description: "Fecha de fin del filtro" },
    },
  },
};
