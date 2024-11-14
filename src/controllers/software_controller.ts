import { NextFunction, Request, Response } from "express";
import { Software } from "../entities/software";
import { validate } from "class-validator";

export async function getAllSoftware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const software = await Software.find();
    console.log("paso por aqui")
    if (!software) {
      return res.status(404).json({
        message: "No se encontraron software",
      });
        
    }

    return res.json(software);
  } catch (error) {
    next(error);
  }
}

export async function getSoftware(
    req: Request,
    res: Response,
    next: NextFunction
    ) {
    try {
        const id = req.params.id;
        const software = await Software.findOneBy({ id: parseInt(id) });
    
        if (!software) {
        return res.status(404).json({
            message: "Software no encontrado",
        });
        }
    
        return res.json(software);
    } catch (error) {
        next(error);
    }
}

export async function createSoftware(
    req: Request,
    res: Response,
    next: NextFunction
    ) {
    try {
        const {
            name,
            equipmentId,
            version,
            license,
            otherData,
            dateInstallation,
            status,
        } = req.body;

        const software =  new Software()

        software.equipmentId = parseInt(equipmentId);
        software.name = name;
        software.versions = version;
        software.license = license;
        software.otherData = otherData;
        software.installDate = dateInstallation;
        software.status = status;

        const errors = await validate(software);

        if (errors.length > 0) {
            return res.status(400).json(errors);
        }

        await software.save();

        return res.json(software);
    } catch (error) {
        next(error);
    }
}

export async function updateSoftware(
    req: Request,
    res: Response,
    next: NextFunction
    ) {
    try {
        const { id } = req.params;

        const {
            equipmentId,
            versions,
            license,
            otherData,
            installDate,
            status,
        } = req.body;

        const software = await Software.findOneBy({ id: parseInt(id) });

        if (!software) {
        return res.status(404).json({
            message: "Software no encontrado",
        });
        }

        software.equipmentId = equipmentId;
        software.versions = versions;
        software.license = license;
        software.otherData = otherData;
        software.installDate = installDate;
        software.status = status;

        const errors = await validate(software);

        if (errors.length > 0) {
            return res.status(400).json(errors);
        }

        await software.save();

        return res.json(software);
    } catch (error) {
        next(error);
    }
}

export async function deleteSoftware(
    req: Request,
    res: Response,
    next: NextFunction
    ) {
    try {
        const { id } = req.params;

        const software = await Software.findOneBy({ id: parseInt(id) });

        if (!software) {
        return res.status(404).json({
            message: "Software no encontrado",
        });
        }

        await software.remove();

        return res.json({
        message: "Software eliminado",
        });
    } catch (error) {
        next(error);
    }
}