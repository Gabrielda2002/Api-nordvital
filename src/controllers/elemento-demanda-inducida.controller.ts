import { NextFunction, Request, Response } from "express";
import { ElementoDemandaInducida } from "../entities/elemento-demanda-inducida";

export const getAllElementDemandInduced = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const elementDemandInduced = await ElementoDemandaInducida.find();

    if (!elementDemandInduced || elementDemandInduced.length === 0) {
      res.status(404).json({
        message: "Elements demand induced not found",
      });
    }

    res.status(200).json({
      message: "Elements demand induced found",
      data: elementDemandInduced,
    });
  } catch (error) {
    next(error);
  }
};

export const getElementDemandInducedByName = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({
        message: "Name is required",
      });
    }

    let elementDemandInduced;
    if (name === "@") {
      elementDemandInduced = await ElementoDemandaInducida.createQueryBuilder(
        "elemento"
      )
        .limit(100)
        .getMany();
    } else {
      elementDemandInduced = await ElementoDemandaInducida.createQueryBuilder("elemento")
        .where("elemento.name LIKE :name", { name: `%${name}%` })
        .getMany();
    }

    if (!elementDemandInduced || elementDemandInduced.length === 0) {
      res.status(404).json({
        message: "Elements demand induced not found",
      });
    }

    res.status(200).json(elementDemandInduced);
  } catch (error) {
    next(error);
  }
};
