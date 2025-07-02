import { NextFunction, Request, Response } from "express";
import { ResumenSeguimientoActividad } from "../entities/resumen-seguimiento-actividad";

export const getAllSummaryActivity = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const summaryActivity = await ResumenSeguimientoActividad.find();

    if (!summaryActivity || summaryActivity.length === 0) {
      return res.status(404).json({
        message: "Summary activity not found",
      });
    }

    return res.status(200).json(summaryActivity);
  } catch (error) {
    next(error);
  }
};

export const getSummaryActivityByName = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name } = req.body;

    let summaryActivity;

    if (name === "@") {
      summaryActivity = await ResumenSeguimientoActividad.createQueryBuilder(
        "resumen"
      )
        .limit(100)
        .getMany();
    } else {
      summaryActivity = await ResumenSeguimientoActividad.createQueryBuilder(
        "resumen"
      )
        .where("resumen.name LIKE :name", { name: `%${name}%` })
        .getMany();
    }

    if (!summaryActivity || summaryActivity.length === 0) {
      return res.status(404).json({
        message: "Summary activity not found",
      });
    }

    return res.status(200).json(summaryActivity);
  } catch (error) {
    next(error);
  }
};
