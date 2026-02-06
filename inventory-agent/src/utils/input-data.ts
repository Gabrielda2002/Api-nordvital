import { EquipmentData } from "../types/inventory.types";
import { question } from "./shell-interactive";

export async function askAdministrativeData(equipment: EquipmentData): Promise<EquipmentData> {
  console.log('\n📝 Información Administrativa Requerida');
  console.log('=========================================\n');

  // Ubicación
  const ubicacion = await question('Ubicación física del equipo (ej: Consultorio 301): ');
  if (ubicacion.trim()) {
    equipment.ubicacion = ubicacion.trim();
  }

  // Número de inventario
  const inventoryNumber = await question('Número de inventario (ej: 00001): ');
  if (inventoryNumber.trim()) {
    equipment.inventoryNumber = inventoryNumber.trim();
  }

  // Fecha de compra (opcional)
  const purchaseDateStr = await question('Fecha de compra YYYY-MM-DD [Enter para omitir]: ');
  if (purchaseDateStr.trim()) {
    try {
      equipment.purchaseDate = new Date(purchaseDateStr.trim());
    } catch {
      console.log('   ⚠️  Fecha inválida, se omitirá');
    }
  }

  // Garantía
  const warrantyStr = await question('¿Tiene garantía activa? (si/no): ');
  equipment.warranty = warrantyStr.toLowerCase().trim() === 'si';

  if (equipment.warranty) {
    const warrantyTime = await question('Tiempo de garantía (ej: 12 meses, 2 años): ');
    if (warrantyTime.trim()) {
      equipment.warrantyTime = warrantyTime.trim();
    }
  }

  // Candado físico
  const lockStr = await question('¿Tiene candado físico? (si/no): ');
  equipment.lock = lockStr.toLowerCase().trim() === 'si';

  if (equipment.lock) {
    const lockKey = await question('Clave del candado (opcional): ');
    if (lockKey.trim()) {
      equipment.lockKey = lockKey.trim();
    }
  }

  console.log('\n✅ Información administrativa capturada\n');
  return equipment;
}