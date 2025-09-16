import { NextFunction, Request, Response } from "express";
import { Area } from "../entities/area";
import { validate } from "class-validator";

export async function getAllAreas(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const areas = await Area.find({
      join: {
        alias: "area",
        leftJoinAndSelect: { manager: "area.managerRelation" },
      },
    });

    if (areas.length === 0) {
      return res.status(404).json({ message: "No hay áreas registradas" });
    }

    const areasFormatted = areas.map((a) => ({
      id: a.id || "N/A",
      name: a.name || "N/A",
      description: a.description || "N/A",
      managerId: a.managerId || "N/A",
      managerName: a.managerRelation?.name || "N/A",
      status: a.status || "N/A",
    }));

    return res.status(200).json(areasFormatted);
  } catch (error) {
    next(error);
  }
}

export async function getAreaByName(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { name } = req.body;

    let area;
    if (name === "@") {
      area = await Area.createQueryBuilder("area")
        .where("area.status = true")
        .limit(50)
        .getMany();
    } else {
      area = await Area.find({ where: { name, status: true } });
    }

    if (!area || area.length === 0) {
      return res.status(404).json({ message: "Área no encontrada" });
    }

    return res.status(200).json(area);
  } catch (error) {
    next(error);
  }
}

export async function createArea(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { name, description, managerId } = req.body;

    const areaExist = await Area.findOne({ where: { name } });

    if (areaExist) {
      return res.status(400).json({
        message: "El área ya existe",
        area: areaExist,
      });
    }

    const newArea = new Area();
    newArea.name = name;
    newArea.description = description;
    newArea.managerId = managerId;
    newArea.status = true;

    const errors = await validate(newArea);
    if (errors.length > 0) {
      const errorMessages = errors
        .map((error) => Object.values(error.constraints || {}))
        .flat();
      return res.status(400).json({ message: errorMessages });
    }

    await newArea.save();

    return res.status(201).json(newArea);
  } catch (error) {
    next(error);
  }
}

export async function updateArea(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const { name, description, managerId, status } = req.body;

    const area = await Area.createQueryBuilder("area")
      .where("area.id = :id", { id })
      .getOne();

    if (!area) {
      return res.status(404).json({ message: "Área no encontrada" });
    }

    area.name = name;
    area.description = description;
    area.managerId = managerId;
    area.status = status;

    const errors = await validate(area);
    if (errors.length > 0) {
      const errorMessages = errors
        .map((error) => Object.values(error.constraints || {}))
        .flat();
      return res.status(400).json({ message: errorMessages });
    }

    await area.save();

    return res.status(200).json(area);
  } catch (error) {
    next(error);
  }
}
