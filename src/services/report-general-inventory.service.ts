import { InventarioGeneral } from "../entities/inventario-general";

export type ReportGeneralInventoryFilters = {
  dateStart?: string;
  dateEnd?: string;
};

export type ReportGeneralInventoryRow = Record<
  string,
  string | number | Date | null | undefined
>;

export async function getReportGeneralInventoryRows(
  filters: ReportGeneralInventoryFilters,
  limit?: number
): Promise<ReportGeneralInventoryRow[]> {
  const { dateStart, dateEnd } = filters;

  const query = InventarioGeneral.createQueryBuilder("inventory")
    .leftJoinAndSelect("inventory.classificationRelation", "classification")
    .leftJoinAndSelect("inventory.assetRelation", "asset")
    .leftJoinAndSelect("inventory.materialRelation", "material")
    .leftJoinAndSelect("inventory.statusRelation", "status")
    .leftJoinAndSelect("inventory.responsibleRelation", "responsible")
    .leftJoinAndSelect("inventory.areaTypeRelation", "areaType")
    .leftJoinAndSelect("inventory.dependencyAreaRelation", "dependencyArea")
    .leftJoinAndSelect("inventory.assetTypeRelation", "assetType")
    .leftJoinAndSelect("inventory.headquartersRelation", "headquarters")
    .orderBy("inventory.createdAt", "DESC");

  if (dateStart && dateEnd) {
    query.andWhere("inventory.createdAt BETWEEN :dateStart AND :dateEnd", {
      dateStart,
      dateEnd,
    });
  }

  if (limit) {
    query.limit(limit);
  }

  const data = await query.getMany();
  const rows: ReportGeneralInventoryRow[] = [];

  data.forEach((d) => {
    rows.push({
      createdAt: d.createdAt,
      classification: d.classificationRelation?.name || "",
      asset: d.assetRelation?.name || "",
      material: d.materialRelation?.name || "",
      status: d.statusRelation?.name || "",
      responsible: d.responsibleRelation?.name || "",
      areaType: d.areaTypeRelation?.name || "",
      dependencyArea: d.dependencyAreaRelation?.name || "",
      assetType: d.assetTypeRelation?.name || "",
      headquarters: d.headquartersRelation?.name || "",
      name: d.name || "",
      brand: d.brand || "",
      model: d.model || "",
      serial: d.serialNumber || "",
      location: d.location || "",
      inventoryNumber: d.inventoryNumber || "",
      quantity: d.quantity || "",
      otherData: d.otherDetails || "",
      acquisitionDate: d.acquisitionDate || "",
      purchaseValue: d.purchaseValue || "",
      warranty: d.warranty ? "Si" : "No",
      warrantyPeriod: d.warrantyPeriod || "",
      dateUpdate: d.updatedAt || "",
    });
  });

  return rows;
}
