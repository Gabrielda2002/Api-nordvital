import type { ReportDescriptor } from "@modules/reports/core/types";
import { ROLE_IDS } from "@core/constants/roles";
import {
  getReportRedDeviceRows,
  type ReportRedDeviceFilters,
} from "../services/report-red-device.service";

export const deviceRedReport: ReportDescriptor<ReportRedDeviceFilters> = {
  name: "device-red",
  roles: [ROLE_IDS.ADMINISTRADOR],
  sheet: "Dispositivos de Red",
  fileBase: "report_dispositivos_red",
  columns: [
    { key: "createdAt", label: "Fecha de Creación", width: 20 },
    { key: "name", label: "Nombre", width: 30 },
    { key: "brand", label: "Marca", width: 20 },
    { key: "model", label: "Modelo", width: 20 },
    { key: "serial", label: "Serial", width: 20 },
    { key: "addressIp", label: "Dirección IP", width: 20 },
    { key: "mac", label: "MAC", width: 20 },
    { key: "otherData", label: "Otros Datos", width: 30 },
    { key: "status", label: "Estado", width: 15 },
    { key: "headquarters", label: "Sede", width: 20 },
    { key: "inventoryNumber", label: "Número de Inventario", width: 20 },
    { key: "updatedAt", label: "Fecha de Actualización", width: 20 },
  ],
  header: { kind: "simple", style: "primary"},
  fetchRows: getReportRedDeviceRows,
  onEmpty: "empty-sheet",
  previewNotFoundMessage: "Data Red Device Not Found.",
  swagger: {
    summary: "Descarga reporte de dispositivos de red en Excel",
    previewSummary: "Vista previa JSON del reporte de dispositivos de red",
    filters: {
      dateStart: { type: "string", format: "date", description: "Fecha de inicio del filtro" },
      dateEnd: { type: "string", format: "date", description: "Fecha de fin del filtro" },
    },
  },
};''