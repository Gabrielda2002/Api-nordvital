import { collectEquipmentData } from './collectors/collector-equipment';
import { collectComponentsData } from './collectors/collector-components';
import { collectSoftwareData } from './collectors/collector-software';
import { apiClient } from './api-client';
import { InventoryPayload } from './types/inventory.types';
import { question, rl } from './utils/shell-interactive';
import { selectHeadquarters } from './utils/select-headquarters';
import { askAdministrativeData } from './utils/input-data';


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
