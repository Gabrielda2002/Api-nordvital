import { Celular } from "../entities/celular";

export type ReportPhonesFilters = {
  dateStart?: string;
  dateEnd?: string;
};

export type ReportPhonesRow = Record<
  string,
  string | number | Date | null | undefined | boolean
>;

export async function getReportPhonesRows(
  filters: ReportPhonesFilters,
  limit?: number
): Promise<ReportPhonesRow[]> {
  const { dateStart, dateEnd } = filters;

  const query = Celular.createQueryBuilder("phone")
    .leftJoinAndSelect("phone.sedeRelation", "headquarters")
    .leftJoinAndSelect("phone.usuarioRelation", "user")
    .orderBy("phone.createdAt", "DESC");

  if (dateStart && dateEnd) {
    query.andWhere("phone.createdAt BETWEEN :dateStart AND :dateEnd", {
      dateStart,
      dateEnd,
    });
  }

  if (limit) {
    query.limit(limit);
  }

  const data = await query.getMany();
  const rows: ReportPhonesRow[] = [];

  data.forEach((c) => {
    rows.push({
      createdAt: c.createdAt || "",
      name: c.name || "",
      brand: c.brand || "",
      model: c.model || "",
      serial: c.serial || "",
      imei: c.imei || "",
      operativeSystem: c.operativeSystem || "",
      version: c.versionSO || "",
      storage: c.storage || "",
      storageRam: c.storageRam || "",
      phoneNumber: c.phoneNumber || "",
      operator: c.operador || "",
      typePlan: c.typePlan || "",
      dueDataPlan: c.dueDatePlan || "",
      macWifi: c.macWifi || "",
      addressBluetooth: c.addressBluetooth || "",
      purchaseDate: c.purchaseDate || "",
      warrantyTime: c.warrantyTime || "",
      warranty: c.warranty ? "Si" : "No",
      deliveryDate: c.deliveryDate || "",
      inventoryNumber: c.inventoryNumber || "",
      responsable: c.responsable || "",
      caseProtector: c.caseProtector ? "Si" : "No",
      temperedGlass: c.temperedGlass ? "Si" : "No",
      observation: c.observation || "",
      status: c.status || "",
      headquarters: c.sedeRelation?.name || "",
      acquisitionValue: c.acquisitionValue || "",
      updatedAt: c.updatedAt || "",
    });
  });

  return rows;
}
