import { apiClient } from "../api-client";
import { question } from "./shell-interactive";

export async function selectHeadquarters(): Promise<number> {
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