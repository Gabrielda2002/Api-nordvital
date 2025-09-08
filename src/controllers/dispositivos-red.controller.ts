import { NextFunction, Request, Response } from "express";
import { dispositivosRed } from "../entities/dispositivos-red";
import { validate } from "class-validator";

export async function getAllDevices(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const devices = await dispositivosRed.find();

    if (devices.length < 0) {
      return res.status(404).json({
        message: "No se encontraron dispositivos",
      });
    }

    return res.json(devices);
  } catch (error) {
    next(error);
  }
}

export async function getDevice(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = req.params.id;
    const device = await dispositivosRed.findOneBy({ id: parseInt(id) });

    if (!device) {
      return res.status(404).json({
        message: "Dispositivo no encontrado",
      });
    }

    return res.json(device);
  } catch (error) {
    next(error);
  }
}

export async function createDevice(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const {
      sedeId,
      name,
      brand,
      model,
      serial,
      addressIp,
      mac,
      otherData,
      status,
      inventoryNumber,
    } = req.body;

    const serialExist = await dispositivosRed.findOneBy({
      serial: serial,
    });

    if (serialExist) {
      return res.status(409).json({
        message: "El número de serie ya existe",
      });
    }

    const device = new dispositivosRed();
    device.sedeId = parseInt(sedeId);
    device.name = name;
    device.brand = brand;
    device.model = model;
    device.serial = serial;
    device.addressIp = addressIp;
    device.mac = mac;
    device.otherData = otherData;
    device.status = status;
    device.inventoryNumber = inventoryNumber;

    const errors = await validate(device);
    if (errors.length > 0) {
      const message = errors.map((err) => ({
        property: err.property,
        constraints: err.constraints,
      }));
      return res.status(400).json({ message });
    }

    await device.save();

    return res.json(device);
  } catch (error) {
    next(error);
  }
}

export async function updateDevice(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;

    const {
      name,
      brand,
      model,
      serial,
      addressIp,
      mac,
      otherData,
      status,
      inventoryNumber,
      sedeId,
    } = req.body;

    const serialExist = await dispositivosRed.findOneBy({
      serial: serial,
    });

    if (serialExist) {
      return res.status(409).json({
        message: "El número de serie ya existe",
      });
    }

    const device = await dispositivosRed.findOneBy({ id: parseInt(id) });

    if (!device) {
      return res.status(404).json({
        message: "Dispositivo no encontrado",
      });
    }

    device.name = name;
    device.brand = brand;
    device.model = model;
    device.serial = serial;
    device.addressIp = addressIp;
    device.mac = mac;
    device.otherData = otherData;
    device.status = status;
    device.inventoryNumber = inventoryNumber;
    device.sedeId = parseInt(sedeId);

    const errors = await validate(device);
    if (errors.length > 0) {
      const message = errors.map((err) => ({
        property: err.property,
        constraints: err.constraints,
      }));
      return res.status(400).json({ message });
    }

    await device.save();

    return res.json(device);
  } catch (error) {
    next(error);
  }
}

export async function deleteDevice(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;

    const device = await dispositivosRed.findOneBy({ id: parseInt(id) });

    if (!device) {
      return res.status(404).json({
        message: "Dispositivo no encontrado",
      });
    }

    await device.remove();

    return res.json({
      message: "Dispositivo eliminado",
    });
  } catch (error) {
    next(error);
  }
}

// buscar dispositivos por sede
export async function getDevicesBySede(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const devices = await dispositivosRed
      .createQueryBuilder("dispositivosRed")
      .leftJoinAndSelect(
        "dispositivosRed.seguimientoDispositivosRedRelation",
        "seguimiento"
      )
      .leftJoinAndSelect("seguimiento.userRelation", "user")
      .where("dispositivosRed.sedeId = :sedeId", { sedeId: parseInt(id) })
      .getMany();

    if (devices.length < 0) {
      return res.status(404).json({
        message: "No se encontraron dispositivos",
      });
    }

    const deviceDataFormatted = devices.map((d) => ({
      id: d.id,
      sedeId: d.sedeId,
      name: d.name,
      brand: d.brand,
      model: d.model,
      serial: d.serial,
      addressIp: d.addressIp,
      mac: d.mac,
      otherData: d.otherData,
      status: d.status,
      inventoryNumber: d.inventoryNumber,
      seguimiento: d.seguimientoDispositivosRedRelation.map((s) => ({
        id: s.id,
        eventDate: s.dateEvent,
        typeEvent: s.eventType,
        description: s.description,
        responsableName: s.userRelation?.name,
        responsableLastName: s.userRelation?.lastName,
      })),
    }));

    return res.json(deviceDataFormatted);
  } catch (error) {
    next(error);
  }
}

// cantidad items por sede
export async function getDevicesCountByHeadquarters(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const devices = await dispositivosRed
      .createQueryBuilder("dispositivosRed")
      .leftJoin("dispositivosRed.placeRelation", "place")
      .select("place.name", "name")
      .addSelect("COUNT(dispositivosRed.id)", "count")
      .groupBy("place.name")
      .getRawMany();

    if (devices.length < 0) {
      return res.status(404).json({
        message: "No se encontraron dispositivos",
      });
    }

    const deviceDataFormatted = devices.map((d) => ({
      sedeName: d.name,
      count: parseInt(d.count),
    }));

    return res.json(deviceDataFormatted);
  } catch (error) {
    next(error);
  }
}

// busqueda global de dispositivos

export async function searchDevices(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { query } = req.query;
    console.log("Query:", query);

    if (!query || typeof query !== "string" || query.trim().length < 2) {
      return res.status(400).json({
        message: "La consulta debe ser una cadena de al menos 2 caracteres",
      });
    }

    const searchTerm = `%${query.trim().toLowerCase()}%`;

    const devices = await dispositivosRed
      .createQueryBuilder("dispositivosRed")
      .leftJoinAndSelect(
        "dispositivosRed.seguimientoDispositivosRedRelation",
        "seguimiento"
      )
      .leftJoinAndSelect("seguimiento.userRelation", "user")
      .leftJoinAndSelect("dispositivosRed.placeRelation",'sede')
      .leftJoinAndSelect("sede.departmentRelation", "department")
      .where(
        `(
          LOWER(dispositivosRed.name) LIKE :searchTerm OR
          LOWER(dispositivosRed.serial) LIKE :searchTerm
        )`, 
        { searchTerm }
      )
      .orderBy("dispositivosRed.name", "ASC")
      .limit(50)
      .getMany();

    if (devices.length < 0) {
      return res.status(404).json({
        message: "No se encontraron dispositivos",
      });
    }

    const deviceDataFormatted = devices.map((d) => ({
      item : {
        id: d.id,
        sedeId: d.sedeId,
        name: d.name,
        brand: d.brand,
        model: d.model,
        serial: d.serial,
        addressIp: d.addressIp,
        mac: d.mac,
        otherData: d.otherData,
        status: d.status,
        inventoryNumber: d.inventoryNumber,
        seguimiento: d.seguimientoDispositivosRedRelation.map((s) => ({
          id: s.id,
          eventDate: s.dateEvent,
          typeEvent: s.eventType,
          description: s.description,
          responsableName: s.userRelation?.name,
          responsableLastName: s.userRelation?.lastName,
        }))
      },
      departmentId: d.placeRelation?.municipioRelation?.departmentRelation?.id || 0,
      departmentRelationName: d.placeRelation?.municipioRelation?.departmentRelation?.name || "N/A",
      sedeName: d.placeRelation?.name || "N/A",
      sedeId: d.placeRelation.id || 0
    }));

    return res.json(deviceDataFormatted);
  } catch (error) {
    next(error);
  }
}
