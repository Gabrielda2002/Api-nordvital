import { NextFunction, Request, Response } from "express";
import { Usuarios } from "../entities/usuarios";
import { validate } from "class-validator";
import bcrypt from "bcrypt";
import fs from "fs";
import path from "path";

export async function getAllUsuarios(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const usuarios = await Usuarios.find({
      relations: ["rolesRelation", "municipioRelation", "typeDocumentRelation"],
    });
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

    const usuario = await Usuarios.findOne({ 
      where: { id: parseInt(id) },
      relations: ["rolesRelation", "municipioRelation", "typeDocumentRelation"],
     });

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
      municipio,
      rol,
      date
    } = req.body;

    const usuario = new Usuarios();
    usuario.dniNumber = parseInt(dniNumber);
    usuario.name = name;
    usuario.lastName = lastName;
    usuario.dniType = parseInt(dniType);
    usuario.email = email;

    const saltRounds = 10;
    usuario.password = await bcrypt.hash(password, saltRounds); 
    usuario.status = true;
    usuario.municipio = parseInt(municipio);
    usuario.rol = parseInt(rol);
    usuario.date = date;

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

// * funcion para actualizar los datos basicos del usuario
export async function updateUsuarioBasicData(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const {
      name,
      lastName,
      email
    } = req.body;

    const usuario = await Usuarios.findOneBy({ id: parseInt(id) });

    if (!usuario) {
      return res.status(404).json({ message: "Usuario not found" });
    }

    usuario.name = name;
    usuario.lastName = lastName;
    usuario.email = email;

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

// * funcion para subir la foto de perfil del usuario

export async function uploadPhoto(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const file = req.file;

    const { id } = req.params; 

    const usuario = await Usuarios.findOneBy({ id: parseInt(id) });

    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    if (file) {
      const relativePath = file.path.replace(/^.*[\\\/]/, ""); // obtener el nombre del archivo
      usuario.photo = `uploads/FotosPerfil/${relativePath}`;
      await usuario.save();
    }

    return res.json(usuario);
  } catch (error) {
    next(error);
  }
}

// * eliminar la foto de perfil del usuario
export async function deletePhoto(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;

    // Busca el usuario en la base de datos
    const usuario = await Usuarios.findOneBy({ id: parseInt(id) });

    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Obtén la ruta de la foto de perfil
    const filePath = path.join(__dirname, '..', usuario.photo); // Ajusta según la estructura de tu proyecto

    // Verifica si el archivo existe antes de intentar eliminarlo
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    } else {
      return res.status(404).json({ message: "Foto de perfil no encontrada" });
    }

    // Actualiza el campo 'photo' en la base de datos
    usuario.photo = "";
    await usuario.save();

    return res.json({ message: "Foto de perfil eliminada" });
  } catch (error) {
    next(error);
  }
}

export async function getUsuariosTable(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const usuariosData = await Usuarios.createQueryBuilder("usuarios")
    .leftJoinAndSelect("usuarios.typeDocumentRelation", "documento")
    .leftJoinAndSelect("usuarios.rolesRelation", "roles")
    .leftJoinAndSelect("usuarios.municipioRelation", "municipio")
    .getMany();

    const usuarios = usuariosData.map((usuario) => ({
      id: usuario.id,
      dniNumber: usuario.dniNumber,
      name: usuario.name,
      lastName: usuario.lastName,
      email: usuario.email,
      status: usuario.status,
      createdAt: usuario.createdAt,
      updatedAt: usuario.updatedAt,
      documento: usuario.typeDocumentRelation?.name,
      roles: usuario.rolesRelation?.name,
      municipio: usuario.municipioRelation?.name,
    }))

    return res.json(usuarios);
  } catch (error) {
    next(error);
  }
}

export async function updatePassword(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Las contraseñas no coinciden" });
    }

    const usuario = await Usuarios.findOneBy({ id: parseInt(id) });

    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const isMatch = await bcrypt.compare(currentPassword, usuario.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Contraseña actual incorrecta" });
    }

    const saltRounds = 10;
    usuario.password = await bcrypt.hash(newPassword, saltRounds);

    await usuario.save();

    return res.json({ message: "Contraseña actualizada correctamente" });
  } catch (error) {
    next(error);
  }
}