import { NextFunction, Request, Response } from "express";
import { AreaEps } from "../entities/area-eps";
import { buildContainsPattern } from "@core/utils/search-helper";

export const getAllAreaEps = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const areaEps = await AreaEps.find();

    if (!areaEps || areaEps.length === 0) {
      return res.status(404).json({
        message: "Area EPS not found",
      });
    }

    return res.status(200).json(areaEps);
  } catch (error) {
    next(error);
  }
};

export const getAreaEpsByName = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name } = req.body;

    let areaEps;

    if (name === "@") {
      areaEps = await AreaEps.createQueryBuilder("areaEps")
        .limit(100)
        .getMany();
    } else {
      areaEps = await AreaEps.createQueryBuilder("areaEps")
        .where("areaEps.name LIKE :name ESCAPE '!'", { name: buildContainsPattern(name) })
        .getMany();
    }

    if (!areaEps || areaEps.length === 0) {
      return res.status(404).json({
        message: "Area EPS not found",
      });
    }

    return res.status(200).json(areaEps);
  } catch (error) {
    next(error);
  }
};
