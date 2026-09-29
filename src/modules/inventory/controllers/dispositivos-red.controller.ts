import { NextFunction, Request, Response } from "express";
import { dispositivosRed } from "../entities/dispositivos-red";
import { BadRequestError, ConflictError, NotFoundError } from "@core/utils/custom-errors";
import { validateEntity } from "@core/utils/validation-helper";

export async function getAllDevices(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const devices = await dispositivosRed.find();

    if (devices.length === 0) {
      throw new NotFoundError("No devices found");
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
    const device = await dispositivosRed.findOneBy({ id: parseInt(String(req.params.id)) });

    if (!device) {
      throw new NotFoundError("Device not found");
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
      throw new ConflictError("Serial number already exists");
    }

    const device = new dispositivosRed();
    device.sedeId = parseInt(String(sedeId));
    device.name = name;
    device.brand = brand;
    device.model = model;
    device.serial = serial;
    device.addressIp = addressIp;
    device.mac = mac;
    device.otherData = otherData;
    device.status = status;
    device.inventoryNumber = inventoryNumber;

    await validateEntity(device);

    await device.save();

    return res.status(200).json(device);
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

    const device = await dispositivosRed.findOneBy({ id: parseInt(String(id)) });

    if (!device) {
      throw new NotFoundError("Device not found");
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
    device.sedeId = parseInt(String(sedeId));

    await validateEntity(device);

    await device.save();

    return res.status(200).json(device);
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

    const device = await dispositivosRed.findOneBy({ id: parseInt(String(id)) });

    if (!device) {
      throw new NotFoundError("Device not found");
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
      .where("dispositivosRed.sedeId = :sedeId", { sedeId: parseInt(String(id)) })
      .getMany();

    if (devices.length === 0) {
      throw new NotFoundError("No devices found for this headquarters");
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
      monitoring: d.seguimientoDispositivosRedRelation.map((s) => ({
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

    const { id } = req.params;

    const devices = await dispositivosRed
      .createQueryBuilder("dispositivosRed")
      .leftJoin("dispositivosRed.placeRelation", "place")
      .select("place.name", "name")
      .addSelect("COUNT(dispositivosRed.id)", "count")
      .where("dispositivosRed.sedeId = :sedeId", { sedeId: parseInt(String(id)) })
      .groupBy("place.name")
      .getRawMany();

    if (devices.length === 0) {
      throw new NotFoundError("No device data found");
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

    if (!query || typeof query !== "string" || query.trim().length < 2) {
      throw new BadRequestError("Query must be a string of at least 2 characters");
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
      .leftJoinAndSelect("sede.municipioRelation", "municipio")
      .leftJoinAndSelect("municipio.departmentRelation", "department")
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

    if (devices.length === 0) {
      throw new NotFoundError("No devices found");
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
      sedeId: d.placeRelation?.id || 0
    }));

    return res.json(deviceDataFormatted);
  } catch (error) {
    next(error);
  }
}
