import { NextFunction, Request, Response } from "express";
import { Usuarios } from "../entities/usuarios";

export const getDepartmentUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return next();
    }

    const user = await Usuarios.createQueryBuilder("usuarios")
      .leftJoinAndSelect("usuarios.sedeRelation", "sede")
      .leftJoinAndSelect("sede.municipioRelation", "municipio")
      .leftJoinAndSelect("municipio.departmentRelation", "departamento")
      .where("usuarios.id = :id", { id: userId })
      .getOne();

    if (!user) {
      return next();
    }

    req.departmentUserId =
      user.sedeRelation?.municipioRelation.departmentRelation?.id;

    console.log("Departamento del usuario: ", req.departmentUserId);

    next();
  } catch (error) {
    next(error);
  }
};
