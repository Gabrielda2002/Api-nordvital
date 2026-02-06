import { collectEquipmentData } from './collectors/collector-equipment';
import { collectComponentsData } from './collectors/collector-components';
import { collectSoftwareData } from './collectors/collector-software';
import { collectAccessoriesData } from './collectors/collector-accessories';
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

async function selectHeadquarters(): Promise<number> {
  console.log('\n🏢 Selección de Sede');  
  console.log('=========================================\n');
  
  try {
    console.log('📡 Obteniendo lista de sedes...');
    const headquarters = await apiClient.getHeadquartersList();
    
    if (!headquarters || headquarters.length === 0) {
      console.error('❌ No se encontraron sedes disponibles');
      throw new Error('No hay sedes disponibles');
    }
    
    console.log('\n📋 Sedes disponibles:\n');
    headquarters.forEach((hq, index) => {
      console.log(`   ${index + 1}. ${hq.name}`);
    });
    
    let selectedId: number | null = null;
    
    while (selectedId === null) {
      const selection = await question(`\nSeleccione el número de la sede (1-${headquarters.length}): `);
      const index = parseInt(selection.trim()) - 1;
      
      if (isNaN(index) || index < 0 || index >= headquarters.length) {
        console.log('\n⚠️  Selección inválida. Por favor ingrese un número válido.');
        continue;
      }
      
      selectedId = headquarters[index].id;
      console.log(`\n✅ Sede seleccionada: ${headquarters[index].name}\n`);
    }
    
    return selectedId;
  } catch (error: any) {
    console.error('\n❌ Error al obtener las sedes:', error.message);
    throw error;
  }
}

async function askAdministrativeData(equipment: EquipmentData): Promise<EquipmentData> {
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

async function main() {
  console.log('🚀 NordVital - Agente de Inventario Automático');
  console.log('================================================\n');

  try {
    console.log('🔍 Paso 1/3: Recopilando información del equipo...');
    let equipment = await collectEquipmentData();
    console.log(`   ✅ Equipo: ${equipment.brand} ${equipment.model}`);
    console.log(`   ✅ Serial: ${equipment.serial}`);
    console.log(`   ✅ MAC: ${equipment.mac}\n`);

    // verificar si el equipo ya existe en la base de datos
    // si existe mostrar mensaje de advertencia y preguntar si desea continuar y actualizar o cancelar
    const existEquipment = await apiClient.verifyEquipmentExist(equipment.serial);
    if (existEquipment.exists) {
      console.log('⚠️  Advertencia: Este equipo ya existe en la base de datos');
      console.log('  Datos del equipo existente en la base de datos:')
      console.log(existEquipment.equipment);
      const continueStr = await question('¿Desea continuar y actualizar la información? (si/no): ');
      if (continueStr.toLowerCase().trim() !== 'si') {
        console.log('\n🚫 Proceso cancelado por el usuario')
        rl.close();
        process.exit(0);
      }
    }

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

    // Seleccionar sede (obligatorio)
    const sedeId = await selectHeadquarters();
    equipment.sedeId = sedeId;

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
    
    console.log('Presione Enter para salir...');
    await question('');

    rl.close();
    process.exit(0);
  } catch (error: any) {
    console.error('\n❌ Error durante el proceso de inventario:');
    console.error(error.message || error);
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
