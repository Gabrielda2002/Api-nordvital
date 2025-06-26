import { NextFunction, Request, Response } from "express";
import { Profesionales } from "../entities/profesionales";
import { validate } from "class-validator";

export const getProfesionalByName = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name } = req.body;

    const profesional = await Profesionales.createQueryBuilder("profesionales")
      .where("profesionales.name LIKE :name", { name: `%${name}%` })
      .getMany();

    if (!profesional || profesional.length === 0) {
      return res.status(404).json({
        message: "Profesional not found",
      });
    }

    return res.status(200).json(profesional);
  } catch (error) {
    next(error);
  }
};

export const createProfesionales = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name } = req.body;

    if (!name || name.length < 3 || name.length > 100) {
      return res.status(400).json({
        message:
          "El nombre del profesional debe tener entre 3 y 100 caracteres",
      });
    }

    const nombreNormalizado = name.trim().toLowerCase();

    const newProfesional = Profesionales.create({
      name: nombreNormalizado,
    });

    const errors = await validate(newProfesional);
    if (errors.length > 0) {
      const message = errors.map((err) => ({
        property: err.property,
        constraints: err.constraints,
      }));
      return res.status(400).json({
        message: "Error creating profesional",
        errors: message,
      });
    }

    await newProfesional.save();

    return res.status(201).json(newProfesional);
  } catch (error) {
    next(error);
  }
};
