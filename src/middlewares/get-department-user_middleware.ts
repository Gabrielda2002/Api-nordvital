import { NextFunction, Request, Response } from "express";
import { Usuarios } from "../entities/usuarios";
import { GLOBAL_FOLDER_ACCESS_ROLES } from "../constants/roles";

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
      .leftJoinAndSelect("usuarios.rolesRelation", "rol")
      .where("usuarios.id = :id", { id: userId })
      .getOne();

    if (!user) {
      return next();
    }

    req.departmentUserId =
      user.sedeRelation?.municipioRelation.departmentRelation?.id;

    // * Verificar si el usuario tiene acceso global a carpetas basado en su rol
    const userRoleName = user.rolesRelation?.name;
    req.hasGlobalFolderAccess = GLOBAL_FOLDER_ACCESS_ROLES.includes(userRoleName);
    
    next();
  } catch (error) {
    next(error);
  }
};
