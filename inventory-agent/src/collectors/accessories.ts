import * as si from 'systeminformation';
import { AccessoryData } from '../types/inventory.types';
import { exec } from 'child_process';

function getPrintersWindows(): Promise<any[]> {
    return new Promise((resolve, reject) => {
        exec(
            `powershell -Command "Get-Printer | ConvertTo-Json"`,
            { maxBuffer: 1024 * 500 },
            (err, stdout) => {
                if (err) reject(err);
                else resolve(JSON.parse(stdout));
            }
        )
    })
}

export async function collectAccessoriesData(): Promise<AccessoryData[]> {
    try {
        const [usb, graphics, printer] = await Promise.all([
            si.usb(),
            si.graphics(),
            si.printer()
        ]);

        const accessories: AccessoryData[] = [];

        // Monitores externos (excluir pantallas integradas de laptops)
        graphics.displays
            .filter(display => !display.builtin && display.connection)
            .forEach((monitor, index) => {
                accessories.push({
                    name: `Monitor ${index + 1}`,
                    brand: monitor.vendor || 'N/A',
                    model: monitor.model || 'N/A',
                    serial: monitor.serial || undefined,
                    otherData: `Resolución: ${monitor.resolutionX}x${monitor.resolutionY}, Conexión: ${monitor.connection}`,
                    status: 'Pendiente verificación'
                });
            });

        const printersPS = await getPrintersWindows();

        // Impresoras
        printersPS.filter(p => {
            const virualPrinters = [
                'onenote', 'pdf', 'fax', 'xps', 'anydesk', "teamviewer",
                'microsoft print to pdf', 'microsoft print', 'send to'
            ];

            const modelLower = p.model?.toLowerCase() || '';
            return !virualPrinters.some(vp => modelLower.includes(vp));
        })
            .forEach((printerDevice, index) => {
                accessories.push({
                    name: `Impresora ${index + 1}`,
                    brand: printerDevice.DriverName.split(' ')[0] || 'N/A',
                    model: printerDevice.Name || 'N/A',
                    serial: undefined,
                    otherData: `Red: ${printerDevice.PortName ? 'Sí' : 'USB/local'}`,
                    status: 'Pendiente verificación'
                })
            })

        usb.forEach(device => {
            const deviceName = device.name?.toLowerCase() || '';
            const manufacturer = device.manufacturer?.toLowerCase() || '';

            // Detectar mouse/teclado de marcas conocidas
            const isKnownBrand = ['logitech', 'razer', 'corsair', 'microsoft', 'hp', 'dell'].some(brand =>
                manufacturer.includes(brand) || deviceName.includes(brand)
            );

            // Incluir si: tiene serial O es marca conocida O NO es HID genérico
            if (device.serialNumber || isKnownBrand || (device.type && !device.type.includes('HID'))) {
                // Detectar tipo de dispositivo
                let deviceType = 'Dispositivo USB';
                if (deviceName.includes('mouse') || device.type?.includes('Mouse')) {
                    deviceType = 'Mouse';
                } else if (deviceName.includes('keyboard') || device.type?.includes('Keyboard')) {
                    deviceType = 'Teclado';
                } else if (deviceName.includes('webcam') || deviceName.includes('camera')) {
                    deviceType = 'Cámara Web';
                } else if (deviceName.includes('storage') || deviceName.includes('disk')) {
                    deviceType = 'Disco Externo';
                }

                accessories.push({
                    name: deviceType,
                    brand: device.manufacturer || 'Unknown',
                    model: device.name || `${device.vendor}:${device.deviceId}`,
                    serial: device.serialNumber || undefined,
                    otherData: `Tipo: ${device.type || 'USB'}, VID:PID ${device.vendor}:${device.deviceId}`,
                    status: 'Pendiente verificación'
                });
            }
        });

        console.log('Informacion accesorios compilada:', accessories);

        return accessories;
    } catch (error) {
        console.error('Error recopilando accesorios:', error);
        return [];
    }
}
