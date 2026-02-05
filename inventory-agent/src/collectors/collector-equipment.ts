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
      sedeId: 0, // Será asignado después por el usuario
      name: osInfo.hostname || 'N/A',
      ubicacion: 'Por definir', // Debe ser asignado manualmente
      typeEquipment: system.model.includes('Laptop') || system.model.includes('Book') ? 'Laptop' : 'Desktop',
      brand: system.manufacturer || 'N/A',
      model: system.model || 'N/A',
      serial: system.serial || bios.serial || 'N/A',
      operationalSystem: `${osInfo.distro} ${osInfo.release}`,
      addressIp: activeNetwork?.ip4 || undefined,
      mac: activeNetwork?.mac || 'N/A',
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
