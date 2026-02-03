import * as si from 'systeminformation';
import { SoftwareData } from '../types/inventory.types';

export async function collectSoftwareData(): Promise<SoftwareData[]> {
  try {
    const installedApps = await si.versions();
    const software: SoftwareData[] = [];

    // Software importante del sistema
    const importantSoftware = [
      { key: 'node', name: 'Node.js' },
      { key: 'npm', name: 'NPM' },
      { key: 'git', name: 'Git' },
      { key: 'python', name: 'Python' },
      { key: 'java', name: 'Java' },
      { key: 'docker', name: 'Docker' },
      { key: 'chrome', name: 'Google Chrome' },
      { key: 'firefox', name: 'Firefox' }
    ];

    for (const app of importantSoftware) {
      const version = installedApps[app.key as keyof typeof installedApps];
      if (version) {
        software.push({
          name: app.name,
          versions: version,
          license: 'Por verificar',
          otherData: 'Detectado automáticamente',
          status: 'Activo'
        });
      }
    }

    // Si no se detectó software, agregar al menos el SO
    if (software.length === 0) {
      const osInfo = await si.osInfo();
      software.push({
        name: 'Sistema Operativo',
        versions: `${osInfo.distro} ${osInfo.release}`,
        license: 'OEM',
        otherData: `Arch: ${osInfo.arch}, Build: ${osInfo.build}`,
        status: 'Activo'
      });
    }

    console.log('Software recopilado:', software);

    return software;
  } catch (error) {
    console.error('Error recopilando software:', error);
    return [];
  }
}
