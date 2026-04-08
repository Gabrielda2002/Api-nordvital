import { NextFunction, Request, Response } from "express";
import { TipoDemandaInducida } from "../entities/tipo-demanda-inducida";

export const getAllTypeDemandInduced = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const TypeDemandInduced = await TipoDemandaInducida.find();

    res.status(200).json({
      message: "Lista de tipos de demanda inducida obtenida correctamente",
      data: TypeDemandInduced,
    });

    res.status(200).json(TypeDemandInduced);
  } catch (error) {
    next(error);
  }
};

export const getTypeDemandInducedByName = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name } = req.body;

    let typeDemandInduced;

    if (name === "@") {
      typeDemandInduced = await TipoDemandaInducida.createQueryBuilder("tipo")
        .limit(100)
        .getMany();
    }else {
      typeDemandInduced = await TipoDemandaInducida.createQueryBuilder("tipo")
        .where("tipo.name LIKE :name", { name: `%${name}%` })
        .getMany();
    }

    if (typeDemandInduced.length === 0) {
      return res.status(404).json({
        message: "Type Demand Induced not found",
      });
    }

    res.status(200).json(typeDemandInduced);
  } catch (error) {
    next(error);
  }
};
