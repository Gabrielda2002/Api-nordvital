import { NextFunction, Request, Response } from "express";
import { Usuarios } from "../entities/usuarios";
import { validate } from "class-validator";
import bcrypt from "bcrypt";

export async function getAllUsuarios(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const usuarios = await Usuarios.find();
    return res.json(usuarios);
  } catch (error) {
    next(error);
  }
}

export async function getUsuario(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;

    const usuario = await Usuarios.findOneBy({ id: parseInt(id) });

    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    return res.json(usuario);
  } catch (error) {
    next(error);
  }
}

export async function createUsuario(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const {
      dniNumber,
      name,
      lastName,
      dniType,
      email,
      password,
      date,
      municipio,
      rol,
    } = req.body;

    const usuario = new Usuarios();
    usuario.dniNumber = dniNumber;
    usuario.name = name;
    usuario.lastName = lastName;
    usuario.dniType = dniType;
    usuario.email = email;

    const saltRounds = 10;
    usuario.password = await bcrypt.hash(password, saltRounds); 
    usuario.date = date;
    usuario.status = true;
    usuario.municipio = municipio;
    usuario.rol = rol;

    const errors = await validate(usuario);

    if (errors.length > 0) {
        const messageError = errors.map((error) => ({
            property: error.property,
            constraints: error.constraints
        }));

        return res.status(400).json({"message" : "Ocurrio un error: ", messageError});
    }

    await usuario.save();

    return res.json(usuario);

  } catch (error) {
    next(error);
  }
}

export async function updateUsuario(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const {
      dniNumber,
      name,
      lastName,
      dniType,
      email,
      password,
      date,
      status,
      municipio,
      rol,
    } = req.body;

    const usuario = await Usuarios.findOneBy({ id: parseInt(id) });

    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    usuario.dniNumber = dniNumber;
    usuario.name = name;
    usuario.lastName = lastName;
    usuario.dniType = dniType;
    usuario.email = email;

    if (password) {
        const saltRounds = 10;
        usuario.password = await bcrypt.hash(password, saltRounds);
    }
    usuario.date = date;
    usuario.status = status;
    usuario.municipio = municipio;
    usuario.rol = rol;

    const errors = await validate(usuario);

    if (errors.length > 0) {
        const messageError = errors.map((error) => ({
            property: error.property,
            constraints: error.constraints
        }));

        return res.status(400).json({"message" : "Ocurrio un error: ", messageError});
    }

    await usuario.save();

    return res.json(usuario);
  } catch (error) {
    next(error);
  }
}

export async function deleteUsuario(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;

    const usuario = await Usuarios.findOneBy({ id: parseInt(id) });

    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    await usuario.remove();

    return res.json({ message: "Usuario eliminado" });
  } catch (error) {
    next(error);
  }
}