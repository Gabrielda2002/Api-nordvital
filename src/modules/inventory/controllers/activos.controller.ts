import { NextFunction, Request, Response } from "express";
import { Activo } from "../entities/activos";
import { validate } from "class-validator";

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

export async function create(req: Request, res: Response, next: NextFunction) {
  try {

    const { name, classificationId } = req.body;

    const exist = await Activo.createQueryBuilder('a')
      .where("a.name = :name", { name: name })
      .andWhere("a.classificationId = :id", { id: classificationId })
      .getOne();

    if (exist) {
      return res.status(409).json({ message: "Active already exist" })
    }

    const newActive = await Activo.create({
      name: name,
      classificationId: classificationId
    });

    const errors = await validate(newActive);

    if (errors.length > 0) {
      const messageError = errors.map(e => (
        Object.values(e.constraints || []).join(', ')
      ));
    }

    await newActive.save();

    return res.status(200).json(newActive);

  } catch (error) {
    next(error)
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {

    const { id } = req.params;

    const { name, classificationId } = req.body;

    const exist = await Activo.createQueryBuilder('a')
      .where("a.id = :id", { id: id })
      .getOne();

    if (!exist) {
      return res.status(409).json({ message: "Active already exist" });
    }

    exist.name = name
    exist.classificationId = classificationId

    const errors = await validate(exist);

    if (errors.length > 0) {
      const errorMessage = errors.map(e => (
        Object.values(e.constraints || {}).join(', ')
      ));

      return res.status(400).json({ message: errorMessage });
    }

    await exist.save();

    return res.status(200).json(exist);

  } catch (error) {
    next(error)
  }
}