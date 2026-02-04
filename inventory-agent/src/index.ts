import { collectEquipmentData } from './collectors/equipment';
import { collectComponentsData } from './collectors/components';
import { collectSoftwareData } from './collectors/software';
import { collectAccessoriesData } from './collectors/accessories';
import { apiClient } from './api-client';
import { EquipmentData, InventoryPayload } from './types/inventory.types';
import * as readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
}

async function askAdministrativeData(equipment: EquipmentData): Promise<EquipmentData> {
  console.log('\n📝 Información Administrativa Requerida');
  console.log('=========================================\n');

  // Ubicación
  const ubicacion = await question('Ubicación física del equipo (ej: Oficina 301): ');
  if (ubicacion.trim()) {
    equipment.ubicacion = ubicacion.trim();
  }

  // Número de inventario
  const inventoryNumber = await question('Número de inventario (ej: INV-2024-001): ');
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

async function main() {
  console.log('🚀 NordVital - Agente de Inventario Automático');
  console.log('================================================\n');

  try {
    console.log('🔍 Paso 1/3: Recopilando información del equipo...');
    let equipment = await collectEquipmentData();
    console.log(`   ✅ Equipo: ${equipment.brand} ${equipment.model}`);
    console.log(`   ✅ Serial: ${equipment.serial}`);
    console.log(`   ✅ MAC: ${equipment.mac}\n`);

    console.log('🔍 Paso 2/3: Detectando componentes de hardware...');
    const components = await collectComponentsData();
    console.log(`   ✅ Componentes detectados: ${components.length}`);
    components.forEach(c => console.log(`      - ${c.name}: ${c.brand} ${c.model}`));
    console.log('');

    console.log('🔍 Paso 3/3: Escaneando software instalado...');
    const software = await collectSoftwareData();
    console.log(`   ✅ Software detectado: ${software.length}`);
    software.forEach(s => console.log(`      - ${s.name} v${s.versions}`));
    console.log('');

    // Preguntar datos administrativos
    equipment = await askAdministrativeData(equipment);

    const payload: InventoryPayload = {
      equipment,
      components,
      software,
    };

    console.log('📤 Enviando información a la API...');
    await apiClient.sendInventory(payload);

    console.log('\n✅ ¡Inventario completado exitosamente!');
    console.log('================================================\n');
    
    rl.close();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error durante el proceso de inventario:');
    console.error(error);
    console.log('\n================================================\n');
    rl.close();
    process.exit(1);
  }
}

// Manejar cierre inesperado
process.on('SIGINT', () => {
  console.log('\n\n⚠️  Proceso interrumpido por el usuario');
  rl.close();
  process.exit(130);
});

process.on('SIGTERM', () => {
  console.log('\n\n⚠️  Proceso terminado');
  rl.close();
  process.exit(143);
});

// Ejecutar
main();
