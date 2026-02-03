import * as si from 'systeminformation';
import { ComponentData } from '../types/inventory.types';

export async function collectComponentsData(): Promise<ComponentData[]> {
  try {
    const [cpu, memory, disk, graphics] = await Promise.all([
      si.cpu(),
      si.memLayout(),
      si.diskLayout(),
      si.graphics()
    ]);

    const components: ComponentData[] = [];

    // CPU
    components.push({
      name: 'Procesador',
      brand: cpu.manufacturer || 'N/A',
      capacity: `${cpu.cores} cores`,
      speed: `${cpu.speed} GHz`,
      otherData: `${cpu.physicalCores} cores físicos, ${cpu.processors} procesadores`,
      model: cpu.brand || 'N/A',
      serial: 'N/A'
    });

    // RAM
    memory.forEach((mem, index) => {
      components.push({
        name: `Memoria RAM ${index + 1}`,
        brand: mem.manufacturer || 'Unknown',
        capacity: `${Math.round(mem.size / (1024 ** 3))} GB`,
        speed: `${mem.clockSpeed} MHz`,
        otherData: `Tipo: ${mem.type}, Slot: ${mem.bank}`,
        model: mem.partNum || 'Unknown',
        serial: mem.serialNum || 'N/A'
      });
    });

    // Discos
    disk.forEach((d, index) => {
      components.push({
        name: `Disco ${index + 1}`,
        brand: d.vendor || 'Unknown',
        capacity: `${Math.round(d.size / (1024 ** 3))} GB`,
        speed: d.interfaceType || 'N/A',
        otherData: `Tipo: ${d.type}, Interface: ${d.interfaceType}`,
        model: d.name || 'Unknown',
        serial: d.serialNum || 'N/A'
      });
    });

    // GPU (si es dedicada)
    graphics.controllers.forEach((gpu, index) => {
      if (!gpu.model.toLowerCase().includes('intel uhd') && 
          !gpu.model.toLowerCase().includes('intel hd')) {
        components.push({
          name: `Tarjeta Gráfica ${index + 1}`,
          brand: gpu.vendor || 'Unknown',
          capacity: `${gpu.vram} MB VRAM`,
          speed: 'N/A',
          otherData: `Bus: ${gpu.bus}, ${gpu.vram} MB`,
          model: gpu.model || 'Unknown',
          serial: 'N/A'
        });
      }
    });

    console.log('Componentes compilados:', components);

    return components;
  } catch (error) {
    console.error('Error recopilando componentes:', error);
    throw error;
  }
}
