export interface EquipmentData {
  name: string;
  ubicacion: string;
  typeEquipment: string;
  brand: string;
  model: string;
  serial: string;
  operationalSystem: string;
  addressIp?: string;
  mac: string;
  purchaseDate?: Date;
  warrantyTime?: string;
  warranty?: boolean;
  deliveryDate?: Date;
  inventoryNumber?: string;
  dhcp?: boolean;
  lock?: boolean;
  lockKey?: string | null;
}

export interface ComponentData {
  name: string;
  brand: string;
  capacity: string;
  speed: string;
  otherData: string;
  model: string;
  serial: string;
}

export interface SoftwareData {
  name: string;
  versions: string;
  license: string;
  otherData: string;
  installDate?: Date;
  status: string;
}

export interface AccessoryData {
  name: string;
  brand: string;
  model: string;
  serial?: string;
  otherData: string;
  status: string;
  inventoryNumber?: string;
}

export interface InventoryPayload {
  equipment: EquipmentData;
  components: ComponentData[];
  software: SoftwareData[];
  // accessories: AccessoryData[];
}
