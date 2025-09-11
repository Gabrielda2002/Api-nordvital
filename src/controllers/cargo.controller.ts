import { NextFunction, Request, Response } from "express";
import { Cargo } from "../entities/cargo";
import { validate } from "class-validator";

export async function getAllPosition(
  req: Request,
  res: Response,
    next: NextFunction
) {
    try {
        
        const areas = await Cargo.find();

        if (areas.length === 0) {
            return res.status(404).json({ message: "No hay áreas registradas" });
        }
        return res.status(200).json(areas);
    } catch (error) {
        next(error);
    }
}

export async function getPositionByName(
  req: Request,
  res: Response,
    next: NextFunction
) {
    try {
        
        const { name } = req.body;

        let position;

        if (name === "@") {
            position = await Cargo.createQueryBuilder("area")
                .where("area.status = true")
                .limit(100)
                .getMany();
        }else {
            position = await Cargo.createQueryBuilder("area")
                .where("area.name LIKE :name AND area.status = true", { name: `%${name}%` })
                .getMany();
        }

        if (!position || position.length === 0) {
            return res.status(404).json({
                message: "Cargo not found",
            });
        }

        return res.status(200).json(position);

    } catch (error) {
        next(error);
    }
}

export async function createPosition(
  req: Request,
  res: Response,
    next: NextFunction
) {
try {
    const { name, description, areaId } = req.body;

    const positionExist = await Cargo.findOne({ where: { name } });

    if (positionExist) {
        return res.status(400).json({
            message: "El cargo ya existe",
            position: positionExist,
        });
    }

    const newPosition = Cargo.create();
    newPosition.name = name;
    newPosition.description = description;
    newPosition.areaId = areaId;

    const errors = await validate(newPosition);

    if (errors.length > 0) {
        const validationErrors = errors.map((error) => Object.values(error.constraints || {})).flat();
        return res.status(400).json({ message: validationErrors });
    }

    await newPosition.save();

    return res.status(201).json({
        message: "Cargo created successfully",
        position: newPosition,
    });

} catch (error) {
    next(error);
}
}

export async function updatePosition(
  req: Request,
  res: Response,
  next: NextFunction
) {
    try {
        
        const { id } = req.params;
        const { name, description, areaId, status } = req.body;

        const position = await Cargo.findOne({ where: { id: parseInt(id, 10) } });

        if (!position) {
            return res.status(404).json({ message: "Cargo no encontrado" });
        }

        position.name = name;
        position.description = description;
        position.areaId = areaId;
        position.status = status;

        const errors = await validate(position);
        if (errors.length > 0) {
            const validationErrors = errors.map((error) => Object.values(error.constraints || {})).flat();
            return res.status(400).json({ message: validationErrors });
        }

        await position.save();

        return res.status(200).json({
            message: "Cargo updated successfully",
            position,
        });

    } catch (error ) {
        next(error);
    }
}