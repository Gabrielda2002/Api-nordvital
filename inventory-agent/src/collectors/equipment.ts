import * as si from 'systeminformation';
import { EquipmentData } from '../types/inventory.types';

export async function collectEquipmentData(): Promise<EquipmentData> {
  try {
    const [system, osInfo, bios, network] = await Promise.all([
      si.system(),
      si.osInfo(),
      si.bios(),
      si.networkInterfaces()
    ]);

    // Obtener la primera interfaz de red activa
    const activeNetwork = network.find(n => !n.internal && n.operstate === 'up') || network[0];

    const equipmentData: EquipmentData = {
      name: osInfo.hostname || 'Unknown',
      ubicacion: 'Por definir', // Debe ser asignado manualmente
      typeEquipment: system.model.includes('Laptop') || system.model.includes('Book') ? 'Laptop' : 'Desktop',
      brand: system.manufacturer || 'Unknown',
      model: system.model || 'Unknown',
      serial: system.serial || bios.serial || 'Unknown',
      operationalSystem: `${osInfo.distro} ${osInfo.release}`,
      addressIp: activeNetwork?.ip4 || undefined,
      mac: activeNetwork?.mac || 'Unknown',
      warrantyTime: 'Por definir',
      warranty: false,
      dhcp: true, // Asumir DHCP por defecto
      lock: false,
      lockKey: null
    };
    
    console.log('Datos del equipo recopilados:', equipmentData);

    return equipmentData;
  } catch (error) {
    console.error('Error recopilando datos del equipo:', error);
    throw error;
  }
}
