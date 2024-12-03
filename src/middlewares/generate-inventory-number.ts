import { NextFunction, Request, Response } from "express";
import { LugarRadicacion } from "../entities/lugar-radicacion";
import { Usuarios } from "../entities/usuarios";

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
        
        const { typeEquipment, sedeId, serial, name, managerId} = req.body; // * typeEquipment, el tipo de equipo, name, para el nombre de dispositivos red y perifericos

        // buscar el numero de la sede y el codigo de la sede
        const sedes = await LugarRadicacion.createQueryBuilder('lugar_radicacion')
        .leftJoinAndSelect('lugar_radicacion.municipioRelation', 'municipio')
        .andWhere('lugar_radicacion.id = :id', {id: sedeId})
        .getOne();

        const numberSede = sedes?.numeroSede;
        const codeMunicipio = sedes?.municipioRelation?.municipioCode;

        // buscar el responsable del dispositivo y sacar el area
        const manager = await Usuarios.createQueryBuilder('usuarios')
        .select('usuarios.area')
        .andWhere('usuarios.id = :id', {id: managerId})
        .getOne();
        // se toma las 3 ultimas letras del area del usuario responsable
        const area = manager?.area?.slice(0, 3);

        // se inicializa el tipo de dispositivo y su inicial
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

        const inventoryNumber = `NV-${codeMunicipio}-0${numberSede}-${area}-${diviceInitial}-${lastFourSerial}`;

        req.body.inventoryNumber = inventoryNumber;

        next();
        
    } catch (error) {
    next(error);
    }
}