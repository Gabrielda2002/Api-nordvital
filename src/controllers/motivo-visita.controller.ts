import { Request, Response } from "express";
import { MotivoVisita } from "../entities/motivo-visita";

export const getAllReasonVisit = async (
  req: Request,
  res: Response,
  next: Function
) => {
  try {
    const motivoVisitas = await MotivoVisita.find();

    if (!motivoVisitas || motivoVisitas.length === 0) {
      return res.status(404).json({
        message: "Motivo Visita not found",
      });
    }

    return res.status(200).json(motivoVisitas);
  } catch (error) {
    next(error);
  }
};

export const getReasonVisitByName = async (
  req: Request,
  res: Response,
  next: Function
) => {
  try {
    const { name } = req.body;

    let motivoVisitas;

    if (name === "@") {
      motivoVisitas = await MotivoVisita.createQueryBuilder("motivoVisita")
        .limit(100)
        .getMany();
    } else {
      motivoVisitas = await MotivoVisita.createQueryBuilder(
        "motivoVisita"
      ).where("motivoVisita.name LIKE :name", { name: `%${name}%` }).getMany;
    }

    if (!motivoVisitas || motivoVisitas.length === 0) {
      return res.status(404).json({
        message: "Motivo Visita not found",
      });
    }

    return res.status(200).json(motivoVisitas);
  } catch (error) {
    next(error);
  }
};
