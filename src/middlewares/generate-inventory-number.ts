import { NextFunction, Request, Response } from "express";

enum Deviceinitials{
    'LAPTOP' = 'LT',
    'PC MESA' = 'CM',
    'TODO EN 1' = 'IU',
    'TECLADO' = 'TC',
    'MOUSE' = 'MS',
    'IMPRESORA' = 'IM',
    'SCANER' = 'SC',
    'PANTALLA' = 'PT',
    'BIOMETRICO' = 'BI',
    'MANOS LIBRES' = 'ML',
    'TELEFONO' = 'TF',
    'CELULAR' = 'CL',
    'ROUTER' = 'RT',
    'CAMARA VIGILANCIA' = 'CV',
    'TABLET' = 'TB',
    'TELEVISION' = 'TV',
}

export const generateInventoryNumber = async (req: Request, res: Response, next: NextFunction) => {
    try {
        
        const { typeEquipment, sedeId, serial, name} = req.body; // * typeEquipment, el tipo de equipo, name, para el nombre de dispositivos red y perifericos

        var diviceType : string;
        var diviceInitial: string;
        if (typeEquipment) {
            diviceType = typeEquipment.toUpperCase();
            diviceInitial = Deviceinitials[diviceType as keyof typeof Deviceinitials];
        }else{
            diviceType = name.toUpperCase();
            diviceInitial = Deviceinitials[diviceType as keyof typeof Deviceinitials];
        }


        const lastFourSerial = serial.slice(-4);

        const inventoryNumber = `NV-${54001}-${diviceInitial}-${lastFourSerial}`;

        req.body.inventoryNumber = inventoryNumber;

        next();
        
    } catch (error) {
    next(error);
    }
}