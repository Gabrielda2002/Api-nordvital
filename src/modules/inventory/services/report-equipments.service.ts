import { Equipos } from "../entities/equipos";

export type ReportEquipmentsFilters = {
  dateStart?: string;
  dateEnd?: string;
};

export type ReportEquipmentsRow = Record<
  string,
  string | number | Date | null | undefined | boolean
>;

export async function getReportEquipmentsRows(
  filters: ReportEquipmentsFilters,
  limit?: number
): Promise<ReportEquipmentsRow[]> {
  const { dateStart, dateEnd } = filters;

  const query = Equipos.createQueryBuilder("equipment")
    .leftJoinAndSelect("equipment.accessoriesRelation", "accessories")
    .leftJoinAndSelect("equipment.seguimientoEquipos", "monitoring")
    .leftJoinAndSelect("equipment.componentRelation", "component")
    .leftJoinAndSelect("equipment.softwareRelation", "software")
    .leftJoinAndSelect("equipment.userRelation", "user")
    .leftJoinAndSelect("equipment.soportRelacion", "support")
    .leftJoinAndSelect("equipment.placeRelation", "place");

  if (dateStart && dateEnd) {
    query.andWhere("equipment.createAt BETWEEN :dateStart AND :dateEnd", {
      dateStart,
      dateEnd,
    });
  }

  if (limit) {
    query.limit(limit);
  }

  const data = await query.getMany();
  const rows: ReportEquipmentsRow[] = [];

  data.forEach((d) => {
    const baseEquipment = {
      headquarters: d.placeRelation?.name || "",
      name: d.name || "",
      typeEquipment: d.typeEquipment || "",
      brand: d.brand || "",
      model: d.model || "",
      serial: d.serial || "",
      systemOperating: d.operationalSystem || "",
      mac: d.mac || "",
      purchaseDate: d.purchaseDate || "",
      warrantyTime: d.warrantyTime || "",
      warranty: d.warranty || "",
      deliveryDate: d.deliveryDate || "",
      inventoryNumber: d.inventoryNumber || "",
      dateCreated: d.createAt || "",
      dateUpdate: d.updateAt || "",
      dhcp: d.dhcp ? "Si" : "No",
      ipAddress: d.addressIp || "",
      userResponsable: d.userRelation?.name || "",
      lock: d.lock ? "Si" : "No",
      lockPassword: d.lockKey || "",
    };

    if (
      (!d.accessoriesRelation || d.accessoriesRelation.length === 0) &&
      (!d.softwareRelation || d.softwareRelation.length === 0) &&
      (!d.componentRelation || d.componentRelation.length === 0)
    ) {
      rows.push({
        ...baseEquipment,
        peripheralsName: "",
        peripheralsBrand: "",
        peripheralsModel: "",
        peripheralsSerial: "",
        peripheralsOtherData: "",
        peripheralsStatus: "",
        peripheralsInventoryNumber: "",
        peripheralsDateCreated: "",
        peripheralsDateUpdate: "",
        softwareName: "",
        softwareVersion: "",
        softwareLicense: "",
        softwareOtherData: "",
        softwareInstallationDate: "",
        softwareStatus: "",
        softwareDateCreated: "",
        softwareDateUpdated: "",
        componentName: "",
        componentBrand: "",
        componentCapacity: "",
        componentSpeed: "",
        componentOtherData: "",
        componentModel: "",
        componentDateCreated: "",
        componentDateUpdated: "",
      });
      return;
    }

    const maxLength = Math.max(
      d.accessoriesRelation?.length || 0,
      d.softwareRelation?.length || 0,
      d.componentRelation?.length || 0
    );

    for (let i = 0; i < maxLength; i++) {
      const peripheral = d.accessoriesRelation?.[i];
      const software = d.softwareRelation?.[i];
      const component = d.componentRelation?.[i];

      rows.push({
        ...baseEquipment,
        peripheralsName: peripheral?.name || "",
        peripheralsBrand: peripheral?.brand || "",
        peripheralsModel: peripheral?.model || "",
        peripheralsSerial: peripheral?.serial || "",
        peripheralsOtherData: peripheral?.otherData || "",
        peripheralsStatus: peripheral?.status || "",
        peripheralsInventoryNumber: peripheral?.inventoryNumber || "",
        peripheralsDateCreated: peripheral?.createdAt || "",
        peripheralsDateUpdate: peripheral?.updatedAt || "",
        softwareName: software?.name || "",
        softwareVersion: software?.versions || "",
        softwareLicense: software?.license || "",
        softwareOtherData: software?.otherData || "",
        softwareInstallationDate: software?.installDate || "",
        softwareStatus: software?.status || "",
        softwareDateCreated: software?.createdAt || "",
        softwareDateUpdated: software?.updatedAt || "",
        componentName: component?.name || "",
        componentBrand: component?.brand || "",
        componentCapacity: component?.capacity || "",
        componentSpeed: component?.speed || "",
        componentOtherData: component?.otherData || "",
        componentModel: component?.model || "",
        componentDateCreated: component?.createdAt || "",
        componentDateUpdated: component?.updatedAt || "",
      });
    }
  });

  return rows;
}
