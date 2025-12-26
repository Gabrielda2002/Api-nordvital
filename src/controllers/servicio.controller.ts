import { NextFunction, Request, Response } from "express";
import { Servicios } from "../entities/servicios";
import { NotFoundError, BadRequestError } from "../utils/custom-errors";
import { validateEntity } from "../utils/validation-helper";

export async function getAllServicios(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const servicios = await Servicios.find();
    return res.json(servicios);
  } catch (error) {
    next(error);
  }
}

export async function getServicioById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;

    const servicio = await Servicios.findOneBy({ id: parseInt(id) });

    if (!servicio) {
      throw new NotFoundError("Servicio no encontrado");
    }

    return res.json(servicio);
  } catch (error) {
    next(error);
  }
}

export async function createServicio(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { name } = req.body;

    if (!name) {
      throw new BadRequestError("El nombre del servicio es requerido");
    }

    const servicio = new Servicios();
    servicio.name = name;
    servicio.status = true;

    await validateEntity(servicio);
    await servicio.save();

    return res.status(201).json(servicio);
  } catch (error) {
    next(error);
  }
}

export async function updateServicio(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const { name, status } = req.body;

    const servicio = await Servicios.findOneBy({ id: parseInt(id) });

    if (!servicio) {
      throw new NotFoundError("Servicio no encontrado");
    }

    servicio.name = name;
    servicio.status = status;

    await validateEntity(servicio);
    await servicio.save();

    return res.json(servicio);
  } catch (error) {
    next(error);
  }
}

export async function deleteServicio(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;

    const servicio = await Servicios.findOneBy({ id: parseInt(id) });

    if (!servicio) {
      throw new NotFoundError("Servicio no encontrado");
    }

    await servicio.remove();

    return res.json({ message: "Servicio eliminado" });
  } catch (error) {
    next(error);
  }
}

export async function getServiciosByName(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { name } = req.body;

    if (!name) {
      throw new BadRequestError("El nombre del servicio es requerido");
    }

    let servicios;

    if (name === "@") {
      servicios = await Servicios.createQueryBuilder("servicios")
        .limit(100)
        .getMany();
    } else {
      servicios = await Servicios.createQueryBuilder("servicios")
        .where("servicios.name LIKE :name", { name: `%${name}%` })
        .getMany();
    }

    return res.json(servicios);
  } catch (error) {
    next(error);
  }
}

export async function updateStatusServicio(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const { status, name } = req.body;

    const servicio = await Servicios.findOneBy({ id: parseInt(id) });

    if (!servicio) {
      throw new NotFoundError("Servicio no encontrado");
    }

    if (name) {
      servicio.name = name;
    }

    if (status !== undefined && status !== "") {
      servicio.status = status == "1";
    }

    await validateEntity(servicio);
    await servicio.save();

    return res.json(servicio);
  } catch (error) {
    next(error);
  }
}
