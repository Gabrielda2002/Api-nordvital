import { NextFunction, Request, Response } from "express";
import { AccesoriosEquipos } from "../entities/accesorios-equipos";
import { validate } from "class-validator";

export async function getAllAccessories(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const accessories = await AccesoriosEquipos.find();

    if (accessories.length < 0) {
      return res.status(404).json({
        message: "No se encontraron accesorios",
      });
    }

    return res.json(accessories);
  } catch (error) {
    next(error);
  }
}

export async function getAccessory(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = req.params.id;
    const accessory = await AccesoriosEquipos.findOneBy({ id: parseInt(id) });

    if (!accessory) {
      return res.status(404).json({
        message: "Accesorio no encontrado",
      });
    }

    return res.json(accessory);
  } catch (error) {
    next(error);
  }
}

export async function createAccessory(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const {
      name,
      equipmentId,
      brand,
      model,
      serial,
      otherData,
      status,
      inventoryNumber,
    } = req.body;

    const accessory = new AccesoriosEquipos();
    accessory.equipmentId = parseInt(equipmentId);
    accessory.name = name;
    accessory.brand = brand;
    accessory.model = model;
    accessory.serial = serial;
    accessory.otherData = otherData;
    accessory.status = status;
    accessory.inventoryNumber = inventoryNumber;

    const errors = await validate(accessory);
    if (errors.length > 0) {
      const message = errors.map((err) => ({
        property: err.property,
        constraints: err.constraints,
      }));
      return res.status(400).json({ message });
    }

    await accessory.save();

    return res.json(accessory);
  } catch (error) {
    next(error);
  }
}

export async function updateAccessory(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;

    const { name, brand, model, serial, otherData, status, inventoryNumber } =
      req.body;

    const accessory = await AccesoriosEquipos.findOne({
      where: { id: parseInt(id) },
    });

    if (!accessory) {
      return res.status(404).json({ message: "Accesorio no encontrado" });
    }

    accessory.name = name;
    accessory.brand = brand;
    accessory.model = model;
    accessory.serial = serial;
    accessory.otherData = otherData;
    accessory.status = status;
    accessory.inventoryNumber = inventoryNumber;

    const errors = await validate(accessory);

    if (errors.length > 0) {
      const message = errors.map((err) => ({
        property: err.property,
        constraints: err.constraints,
      }));
      return res
        .status(400)
        .json({ message: "Error actualizando accesorio", errors: message });
    }

    await accessory.save();

    return res.json(accessory);
  } catch (error) {
    next(error);
  }
}

export async function deleteAccessory(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;

    const accessory = await AccesoriosEquipos.findOne({
      where: { id: parseInt(id) },
    });

    if (!accessory) {
      return res.status(404).json({ message: "Accesorio no encontrado" });
    }

    await accessory.remove();

    return res.json({ message: "Accesorio eliminado" });
  } catch (error) {
    next(error);
  }
}
