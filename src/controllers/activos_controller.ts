import { NextFunction, Request, Response } from "express";
import { Activo } from "../entities/activos";

export async function getAllByAssetId(req: Request, res: Response, next: NextFunction) {
  try {

    const { id } = req.params;
    
    const activos = await Activo.createQueryBuilder("a")
        .leftJoinAndSelect("a.clasificacion", "c")
        .where("c.id = :id", { id })
        .getMany();

    if (!activos) {
      return res.status(404).json({ message: "No assets found for the given classification ID." });
    }

    const formattedActivos = activos.map((a) => ({
      id: a.id,
      name: a.name,
    }));

    res.status(200).json(formattedActivos);
  } catch (error) {
    next(error);
  }
}