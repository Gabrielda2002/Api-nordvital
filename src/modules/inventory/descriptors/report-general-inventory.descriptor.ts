import type { ReportDescriptor } from "@modules/reports/core/types";
import { ROLE_IDS } from "@core/constants/roles";
import {
  getReportGeneralInventoryRows,
  type ReportGeneralInventoryFilters,
} from "../services/report-general-inventory.service";

export const generalInventoryReport: ReportDescriptor<ReportGeneralInventoryFilters> = {
  name: "general-inventory",
  roles: [ROLE_IDS.ADMINISTRADOR],
  sheet: "Inventario General",
  fileBase: "report_inventario_general",
  columns: [
    { key: "createdAt", label: "Fecha de creación", width: 20 },
    { key: "name", label: "Clasificación", width: 30 },
    { key: "classification", label: "Activo", width: 30 },
    { key: "asset", label: "Material", width: 30 },
    { key: "material", label: "Estado", width: 30 },
    { key: "status", label: "Responsable", width: 20 },
    { key: "responsible", label: "Tipo de área", width: 30 },
    { key: "areaType", label: "Área de dependencia", width: 30 },
    { key: "dependencyArea", label: "Tipo de activo", width: 30 },
    { key: "assetType", label: "Sede", width: 30 },
    { key: "headquarters", label: "Nombre", width: 30 },
    { key: "brand", label: "Marca", width: 20 },
    { key: "model", label: "Modelo", width: 20 },
    { key: "serial", label: "Número de serie", width: 30 },
    { key: "location", label: "Ubicación", width: 30 },
    { key: "inventoryNumber", label: "Número de inventario", width: 30 },
    { key: "quantity", label: "Cantidad", width: 30 },
    { key: "otherData", label: "Otros datos", width: 50 },
    { key: "acquisitionDate", label: "Fecha de adquisición", width: 50 },
    { key: "purchaseValue", label: "Valor de compra", width: 50 },
    { key: "warranty", label: "Garantía", width: 50 },
    { key: "warrantyPeriod", label: "Período de garantía", width: 50 },
    { key: "dateUpdate", label: "Fecha de actualización", width: 20 },
  ],
  header: { kind: "simple", style: "primary" },
  fetchRows: getReportGeneralInventoryRows,
  onEmpty: "empty-sheet",
  previewNotFoundMessage: "Data General Inventory Not Found.",
  swagger: {
    summary: "Descarga reporte de inventario general en Excel",
    previewSummary: "Vista previa JSON del reporte de inventario general",
    filters: {
      dateStart: { type: "string", format: "date", description: "Fecha de inicio del filtro" },
      dateEnd: { type: "string", format: "date", description: "Fecha de fin del filtro" },
    },
  },
};
