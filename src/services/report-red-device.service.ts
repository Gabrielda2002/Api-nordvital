import { dispositivosRed } from "../entities/dispositivos-red";

export type ReportRedDeviceFilters = {
  dateStart?: string;
  dateEnd?: string;
};

export type ReportRedDeviceRow = Record<
  string,
  string | number | Date | null | undefined
>;

export async function getReportRedDeviceRows(
  filters: ReportRedDeviceFilters,
  limit?: number
): Promise<ReportRedDeviceRow[]> {
  const { dateStart, dateEnd } = filters;

  const query = dispositivosRed
    .createQueryBuilder("red_devices")
    .leftJoinAndSelect("red_devices.placeRelation", "place")
    .orderBy("red_devices.createAt", "DESC");

  if (dateStart && dateEnd) {
    query.andWhere("red_devices.createAt BETWEEN :dateStart AND :dateEnd", {
      dateStart,
      dateEnd,
    });
  }

  if (limit) {
    query.limit(limit);
  }

  const data = await query.getMany();
  const rows: ReportRedDeviceRow[] = [];

  data.forEach((d) => {
    rows.push({
      name: d.name,
      brand: d.brand,
      model: d.model,
      addressIp: d.addressIp,
      mac: d.mac,
      serial: d.serial,
      otherData: d.otherData,
      status: d.status,
      headquarters: d.placeRelation?.name || "",
      inventoryNumber: d.inventoryNumber,
      createdAt: d.createAt,
      updatedAt: d.updateAt,
    });
  });

  return rows;
}
