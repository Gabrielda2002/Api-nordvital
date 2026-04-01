import { Televisor } from "../entities/televisor";

export type ReportTVFilters = {
  dateStart?: string;
  dateEnd?: string;
};

export type ReportTVRow = Record<
  string,
  string | number | Date | null | undefined | boolean
>;

export async function getReportTVRows(
  filters: ReportTVFilters,
  limit?: number
): Promise<ReportTVRow[]> {
  const { dateStart, dateEnd } = filters;

  const query = Televisor.createQueryBuilder("tv")
    .leftJoinAndSelect("tv.sedeRelation", "headquarters")
    .leftJoinAndSelect("tv.responsableRelation", "responsible")
    .orderBy("tv.createdAt", "DESC");

  if (dateStart && dateEnd) {
    query.andWhere("tv.createdAt BETWEEN :dateStart AND :dateEnd", {
      dateStart,
      dateEnd,
    });
  }

  if (limit) {
    query.limit(limit);
  }

  const data = await query.getMany();
  const rows: ReportTVRow[] = [];

  data.forEach((d) => {
    rows.push({
      createdAt: d.createdAt || "",
      name: d.name || "",
      location: d.location || "",
      headquarters: d.sedeRelation?.name || "",
      responsible: d.responsableRelation?.name || "",
      brand: d.brand || "",
      model: d.model || "",
      serial: d.serial || "",
      screenSize: d.pulgadas || "",
      screenType: d.screenType || "",
      resolution: d.resolution || "",
      smartTv: d.smartTv ? "Si" : "No",
      operativeSystem: d.operativeSystem || "",
      addressIp: d.addressIp || "",
      mac: d.mac || "",
      numHdmi: d.numPuertosHdmi || "",
      numUSB: d.numPuertosUsb || "",
      connectivity: d.connectivity || "",
      purchaseDate: d.purchaseDate || "",
      warrantyTime: d.warrantyTime || "",
      warranty: d.warranty ? "Si" : "No",
      deliveryDate: d.deliveryDate || "",
      otherData: d.observation || "",
      status: d.status || "",
      inventoryNumber: d.inventoryNumber || "",
      acquisitionValue: d.acquisitionValue || "",
      controlRemote: d.controlRemote ? "Si" : "No",
      utility: d.utility || "",
      updatedAt: d.updatedAt || "",
    });
  });

  return rows;
}
