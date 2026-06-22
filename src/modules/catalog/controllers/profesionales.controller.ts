import { NextFunction, Request, Response } from "express";
import { Profesionales } from "../entities/profesionales";
import { validate } from "class-validator";

export async function getAllProfessional (req: Request, res: Response, next: NextFunction) {
  try {
    
    const data = await Profesionales.find()

    if (!data) {
      return res.status(404).json({ message: "Profesional not found"})
    }

    return res.status(200).json(data)
  } catch (error) {
    next(error)
  }
}

export const getProfesionalByName = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name } = req.body;

    let profesional;

    if (name === "@") {
      profesional = await Profesionales.createQueryBuilder("profesionales")
        .limit(100)
        .getMany();
    } else {
      profesional = await Profesionales.createQueryBuilder("profesionales")
        .where("profesionales.name LIKE :name", { name: `%${name}%` })
        .getMany();
    }

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

    const nombreNormalizado = name.toUpperCase();

    const existingProfesional = await Profesionales.findOne({
      where: { name: nombreNormalizado },
    });

    if (existingProfesional) {
      return res.status(400).json({
        message: "Profesional already exists",
        profesional: existingProfesional,
      });
    }

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


export async function updateProfessional(req: Request, res: Response, next: NextFunction) {
  try {

    const { id } = req.params;

    const { name } = req.body;

    const exist = await Profesionales.createQueryBuilder("p")
      .where("p.id = :id", { id })
      .getOne();

    if (!exist) {
      return res.status(400).json({ message: "Professional not found" })
    }

    exist.name = name

    const error = await validate(exist)
    if (error.length > 0) {

      const message = error.map((e) => ({
        property: e.property,
        constraints: e.constraints
      }))
      return res.status(400).json({
        message: message
      })
    }

    await exist.save();

    return res.status(200).json(exist)

  } catch (error) {
    next(error)
  }
}