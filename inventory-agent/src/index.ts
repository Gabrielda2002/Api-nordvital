import { collectEquipmentData } from './collectors/equipment';
import { collectComponentsData } from './collectors/components';
import { collectSoftwareData } from './collectors/software';
import { collectAccessoriesData } from './collectors/accessories';
import { apiClient } from './api-client';
import { InventoryPayload } from './types/inventory.types';

async function main() {
  console.log('🚀 NordVital - Agente de Inventario Automático');
  console.log('================================================\n');

  try {
    console.log('🔍 Paso 1/4: Recopilando información del equipo...');
    const equipment = await collectEquipmentData();
    console.log(`   ✅ Equipo: ${equipment.brand} ${equipment.model}`);
    console.log(`   ✅ Serial: ${equipment.serial}`);
    console.log(`   ✅ MAC: ${equipment.mac}\n`);

    console.log('🔍 Paso 2/4: Detectando componentes de hardware...');
    const components = await collectComponentsData();
    console.log(`   ✅ Componentes detectados: ${components.length}`);
    components.forEach(c => console.log(`      - nombre: ${c.name}, Marca: ${c.brand}, Modelo: ${c.model}`));
    console.log('');

    console.log('🔍 Paso 3/4: Escaneando software instalado...');
    const software = await collectSoftwareData();
    console.log(`   ✅ Software detectado: ${software.length}`);
    software.forEach(s => console.log(`      - nombre: ${s.name}, Versión: ${s.versions}`));
    console.log('');

    // console.log('🔍 Paso 4/4: Identificando accesorios...');
    // const accessories = await collectAccessoriesData();
    // console.log(`   ✅ Accesorios detectados: ${accessories.length}`);
    // if (accessories.length > 0) {
    //   accessories.forEach(a => console.log(`      - nombre: ${a.name}, Marca: ${a.brand}, Modelo: ${a.model}`));
    // } else {
    //   console.log('      - No se detectaron accesorios externos');
    // }
    // console.log('');

    const payload: InventoryPayload = {
      equipment,
      components,
      software,
      // accessories
    };

    console.log('📤 Enviando información a la API...');
    await apiClient.sendInventory(payload);

    console.log('\n✅ ¡Inventario completado exitosamente!');
    console.log('================================================\n');
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error durante el proceso de inventario:');
    console.error(error);
    console.log('\n================================================\n');
    process.exit(1);
  }
}

// Manejar cierre inesperado
process.on('SIGINT', () => {
  console.log('\n\n⚠️  Proceso interrumpido por el usuario');
  process.exit(130);
});

process.on('SIGTERM', () => {
  console.log('\n\n⚠️  Proceso terminado');
  process.exit(143);
});

// Ejecutar
main();
