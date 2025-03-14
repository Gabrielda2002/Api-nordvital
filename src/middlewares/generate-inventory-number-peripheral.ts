import { NextFunction, Request, Response } from "express";
import { Equipos } from "../entities/equipos";

enum Deviceinitials {
  "MOUSE" = "MO",
  "TECLADO" = "TC",
  "MONITOR" = "MT",
  "IMPRESORA" = "IM",
  "CÁMARA WEB" = "CW",
  "MICRÓFONO" = "MI",
  "PARLANTES" = "PA",
  "ESCÁNER" = "ES",
  "AURICULARES" = "AU",
  "JOYSTICK" = "JO",
  "TABLETA GRÁFICA" = "TG",
  "DISPOSITIVO DE ALMACENAMIENTO EXTERNO" = "DA",
  "CARGADOR DE PORTÁTIL" = "CP",
  "PROYECTOR" = "PR",
  "CONTROL DE VIDEOJUEGOS" = "CV",
  "LECTOR DE HUELLAS" = "LH",
  "UPS" = "UP",
  "REGULADOR DE VOLTAJE" = "RV",
  "ROUTER" = "RO",
  "SWITCH" = "SW",
  "ACCESS POINT" = "AP",
  "CABLE DE RED" = "CR",
  "MICROTICK" = "MC",
  "CABLE HDMI" = "CH",
  "MEMORIA USB" = "MU",
}

export const generateInventoryNumberPheripheral = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { equipmentId, serial, name: typePheripheral } = req.body;

    // buscar el usuario responsable del equipo
    const equipment = await Equipos.createQueryBuilder("equipos")
      .leftJoinAndSelect("equipos.userRelation", "user")
      .leftJoinAndSelect("user.sedeRelation", "headquarters")
      .leftJoinAndSelect("headquarters.municipioRelation", "municipality")
      .andWhere("equipos.id = :id", { id: equipmentId })
      .getOne();

    // numero sede
    const numberHeadquarters =
      equipment?.userRelation?.sedeRelation?.numeroSede;
    const codeMunicipality =
      equipment?.userRelation?.sedeRelation?.municipioRelation?.municipioCode;
    const area = equipment?.userRelation?.area?.slice(0, 3);

    var diviceType: string;
    var diviceInitial: string;
    if (typePheripheral) {
      diviceType = typePheripheral.toUpperCase();
      diviceInitial = Deviceinitials[diviceType as keyof typeof Deviceinitials];
    } else {
      diviceType = typePheripheral.toUpperCase();
      diviceInitial = Deviceinitials[diviceType as keyof typeof Deviceinitials];
    }

    const lastFourSerial = serial.slice(-4);

    const inventoryNumber = `NV-${codeMunicipality}-0${numberHeadquarters}-${area}-${diviceInitial}-${lastFourSerial}`;

    req.body.inventoryNumber = inventoryNumber;

    next();
  } catch (error) {
    next(error);
  }
};
