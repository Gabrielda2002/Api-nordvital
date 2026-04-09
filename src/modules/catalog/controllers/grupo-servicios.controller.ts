import { NextFunction, Request, Response } from "express";
import { GrupoServicios } from "../entities/grupo-servicios";
import { validate } from "class-validator";
import { parse } from "path";
import { Radicacion } from "../../radicacion/entities";

export async function getAllGruposServicios(req: Request, res: Response, next: NextFunction ) {
  try {
    const gruposServicios = await GrupoServicios.find();
    return res.json(gruposServicios);
  } catch (error) {
    next(error);
  }
}

export async function getGrupoServicios(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    const grupoServicios = await GrupoServicios.findOneBy({ id: parseInt(String(id)) });

    if (!grupoServicios) {
      return res.status(404).json({ message: "Grupo de servicios no encontrado" });
    }

    return res.json(grupoServicios);
  } catch (error) {
    next(error);
  }
}

export async function createGrupoServicios(req: Request, res: Response, next: NextFunction) {
  try {
    
    const {name} = req.body;

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    const grupoServiciosExist = await GrupoServicios.findOneBy({ name });

    if (grupoServiciosExist) {
      return res.status(400).json({ message: "Grupo de servicios ya existe" });
    }

    const grupoServicios = new GrupoServicios();
    grupoServicios.name = name;
    grupoServicios.status = true;

    const errors = await validate(grupoServicios);

    if (errors.length > 0) {

      const errorsMessage = errors.map(err => ({
        property: err.property,
        constraints: err.constraints
      }))

      return res.status(400).json({ message: "Error creating grupo de servicios", errors: errorsMessage });

    }

    await grupoServicios.save();

    return res.status(201).json(grupoServicios);

  } catch (error) {
    next(error);
  }
}

export async function updateGrupoServicios(req: Request, res: Response, next: NextFunction) {
  try {
    
    const { id } = req.params;
    const { name, status } = req.body;

    const grupoServicios = await GrupoServicios.findOneBy({ id: parseInt(String(id)) });

    if (!grupoServicios) {
      return res.status(404).json({ message: "Grupo de servicios no encontrado" });
    }

    grupoServicios.name = name;
    grupoServicios.status = status;

    const errors = await validate(grupoServicios);

    if (errors.length > 0) {

      const errorsMessage = errors.map(err => ({
        property: err.property,
        constraints: err.constraints
      }))

      return res.status(400).json({ message: "Error updating grupo de servicios", errors: errorsMessage });

    }

    await grupoServicios.save();

    return res.json(grupoServicios);

  } catch (error) {
    next(error);
  }
}

export async function deleteGrupoServicios(req: Request, res: Response, next: NextFunction) {
  try {
    
    const { id } = req.params;

    const grupoServicios = await GrupoServicios.findOneBy({ id: parseInt(String(id)) });

    if (!grupoServicios) {
      return res.status(404).json({ message: "Grupo de servicios no encontrado" });
    }

    await grupoServicios.remove();

    return res.json({ message: "Grupo de servicios eliminado" });

  } catch (error) {
    next(error);
  }
}

export async function getGrupoServiciosByName(req: Request, res: Response, next: NextFunction) {
  try {
    const { name } = req.body;

    let grupoServicios;
    
    if (name === "@") {
      grupoServicios = await GrupoServicios.createQueryBuilder("grupo_servicios")
        .limit(100)
        .getMany();
    }else{
      grupoServicios = await GrupoServicios.createQueryBuilder("grupo_servicios")
        .where("grupo_servicios.name LIKE :name", { name: `%${name}%` })
        .getMany();
    }

    if (!grupoServicios) {
      return res.status(404).json({ message: "Grupo de servicios no encontrado" });
    }

    return res.json(grupoServicios);
  } catch (error) {
    next(error);
  }
}

export async function updateByRadicacion(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;

    const { groupServices } = req.body;

    const radicacion = await Radicacion.findOneBy({ id: parseInt(String(id)) });

    if (!radicacion) {
      return res.status(404).json({ message: "Radicacion not found" });
    }

    radicacion.serviceGroupId = Number(groupServices);

    const errors = await validate(radicacion, { skipMissingProperties: true });

    if (errors.length > 0) {
      const message = errors.map((err) => ({
        property: err.property,
        constraints: err.constraints,
      }));
      return res
        .status(400)
        .json({ message: "Error updating radicacion", errors: message });
    }

    await radicacion.save();

    return res.status(200).json({ message: "Grupo actualizado exitosamente!" });
  } catch (error) {
    next(error);
  }
}