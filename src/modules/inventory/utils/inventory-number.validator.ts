import { ConflictError } from "@core/utils/custom-errors";
import { Equipos } from "../entities/equipos";
import { Celular } from "../entities/celular";
import { InventarioGeneral } from "../entities/inventario-general";
import { dispositivosRed } from "../entities/dispositivos-red";
import { Televisor } from "../entities/televisor";
import { AccesoriosEquipos } from "../entities/accesorios-equipos";

export type InventoryAssetType =
  | "equipos"
  | "celulares"
  | "dispositivos_red"
  | "televisores"
  | "inventario_general"
  | "accesorios_equipos";

interface ExcludeItem {
  assetType: InventoryAssetType;
  id: number;
}

// ? validar si un numero de inventario ya existe en cualquiera de las tablas 
export async function assertUniqueInventoryNumber(
  inventoryNumber: string,
  exclude?: ExcludeItem
): Promise<void> {

  if (!inventoryNumber || inventoryNumber.trim() === "") {
    return;
  }

  const num = inventoryNumber.trim();

  const queries = [

    (async () => {
      const qb = Equipos.createQueryBuilder("e")
        .select(["e.id"])
        .where("e.inventoryNumber = :num", { num });
      if (exclude?.assetType === "equipos") qb.andWhere("e.id != :id", { id: exclude.id });
      const found = await qb.getOne();
      return found ? "equipos" : null;
    })(),

    (async () => {
      const qb = Celular.createQueryBuilder("c")
        .select(["c.id"])
        .where("c.inventoryNumber = :num", { num });
      if (exclude?.assetType === "celulares") qb.andWhere("c.id != :id", { id: exclude.id });
      const found = await qb.getOne();
      return found ? "celulares" : null;
    })(),

    (async () => {
      const qb = InventarioGeneral.createQueryBuilder("ig")
        .select(["ig.id"])
        .where("ig.inventoryNumber = :num", { num });
      if (exclude?.assetType === "inventario_general") qb.andWhere("ig.id != :id", { id: exclude.id });
      const found = await qb.getOne();
      return found ? "inventario_general" : null;
    })(),

    (async () => {
      const qb = dispositivosRed.createQueryBuilder("dr")
        .select(["dr.id"])
        .where("dr.inventoryNumber = :num", { num });
      if (exclude?.assetType === "dispositivos_red") qb.andWhere("dr.id != :id", { id: exclude.id });
      const found = await qb.getOne();
      return found ? "dispositivos_red" : null;
    })(),

    (async () => {
      const qb = Televisor.createQueryBuilder("t")
        .select(["t.id"])
        .where("t.inventoryNumber = :num", { num });
      if (exclude?.assetType === "televisores") qb.andWhere("t.id != :id", { id: exclude.id });
      const found = await qb.getOne();
      return found ? "televisores" : null;
    })(),

    (async () => {
      const qb = AccesoriosEquipos.createQueryBuilder("ae")
        .select(["ae.id"])
        .where("ae.inventoryNumber = :num", { num });
      if (exclude?.assetType === "accesorios_equipos") qb.andWhere("ae.id != :id", { id: exclude.id });
      const found = await qb.getOne();
      return found ? "accesorios_equipos" : null;
    })(),
  ];

  const results = await Promise.all(queries);
  const conflictSource = results.find((source) => source !== null);

  if (conflictSource) {
    throw new ConflictError(
      `El número de inventario "${num}" ya se encuentra asignado en ${conflictSource}`
    );
  }
}

interface DuplicateItem {
  source_table: string;
  id: number;
  name: string;
  inventory_number: string;
}

export async function getDuplicateInventoryNumbers() {
  const [equipos, celulares, invGeneral, dispRed, televisores, accesorios] =
    await Promise.all([
      Equipos.createQueryBuilder("e")
        .select(["e.id", "e.name", "e.inventoryNumber"])
        .where("e.inventoryNumber IS NOT NULL AND e.inventoryNumber != ''")
        .getMany(),

      Celular.createQueryBuilder("c")
        .select(["c.id", "c.name", "c.inventoryNumber"])
        .where("c.inventoryNumber IS NOT NULL AND c.inventoryNumber != ''")
        .getMany(),

      InventarioGeneral.createQueryBuilder("ig")
        .select(["ig.id", "ig.brand", "ig.model", "ig.inventoryNumber"])
        .where("ig.inventoryNumber IS NOT NULL AND ig.inventoryNumber != ''")
        .getMany(),

      dispositivosRed.createQueryBuilder("dr")
        .select(["dr.id", "dr.name", "dr.inventoryNumber"])
        .where("dr.inventoryNumber IS NOT NULL AND dr.inventoryNumber != ''")
        .getMany(),

      Televisor.createQueryBuilder("t")
        .select(["t.id", "t.name", "t.inventoryNumber"])
        .where("t.inventoryNumber IS NOT NULL AND t.inventoryNumber != ''")
        .getMany(),

      AccesoriosEquipos.createQueryBuilder("ae")
        .select(["ae.id", "ae.name", "ae.inventoryNumber"])
        .where("ae.inventoryNumber IS NOT NULL AND ae.inventoryNumber != ''")
        .getMany(),
    ]);

  const allItems: DuplicateItem[] = [
    ...equipos.map((e) => ({
      source_table: "equipos",
      id: e.id,
      name: e.name,
      inventory_number: e.inventoryNumber,
    })),
    ...celulares.map((c) => ({
      source_table: "celulares",
      id: c.id,
      name: c.name,
      inventory_number: c.inventoryNumber,
    })),
    ...invGeneral.map((ig) => ({
      source_table: "inventario_general",
      id: ig.id,
      name: `${ig.brand || ""} ${ig.model || ""}`.trim() || "Sin nombre",
      inventory_number: ig.inventoryNumber,
    })),
    ...dispRed.map((dr) => ({
      source_table: "dispositivos_red",
      id: dr.id,
      name: dr.name,
      inventory_number: dr.inventoryNumber,
    })),
    ...televisores.map((t) => ({
      source_table: "televisores",
      id: t.id,
      name: t.name,
      inventory_number: t.inventoryNumber,
    })),
    ...accesorios.map((ae) => ({
      source_table: "accesorios_equipos",
      id: ae.id,
      name: ae.name,
      inventory_number: ae.inventoryNumber,
    })),
  ];

  const countMap: Record<string, number> = {};
  for (const item of allItems) {
    countMap[item.inventory_number] = (countMap[item.inventory_number] || 0) + 1;
  }

  const grouped: Record<
    string,
    { inventoryNumber: string; occurrences: number; items: DuplicateItem[] }
  > = {};

  for (const item of allItems) {
    if (countMap[item.inventory_number] > 1) {
      if (!grouped[item.inventory_number]) {
        grouped[item.inventory_number] = {
          inventoryNumber: item.inventory_number,
          occurrences: countMap[item.inventory_number],
          items: [],
        };
      }
      grouped[item.inventory_number].items.push(item);
    }
  }

  return Object.values(grouped);
}
