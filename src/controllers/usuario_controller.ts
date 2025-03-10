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
      area,
      cargo,
      sedeId,
      phoneNumber
    } = req.body;

    const userExist = await Usuarios.createQueryBuilder('usuarios')
    .where('usuarios.dniNumber = :dniNumber', {dniNumber})
    .getOne();

    if(userExist) return res.status(409).json({message: 'El usuario ya existe'});

    const usuario = new Usuarios();
    usuario.dniNumber = parseInt(dniNumber);
    usuario.name = name;
    usuario.lastName = lastName;
    usuario.dniType = parseInt(dniType);
    usuario.email = email;
    // incriptacion password
    const saltRounds = 10;
    usuario.password = await bcrypt.hash(password, saltRounds); 
    usuario.status = true;
    usuario.municipio = parseInt(municipio);
    usuario.rol = parseInt(rol);
    usuario.area = area.toUpperCase();
    usuario.position = cargo.toUpperCase();
    usuario.headquarters = parseInt(sedeId);
    usuario.phoneNumber = parseInt(phoneNumber);

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
      id: usuario.id || "N/A",
      dniNumber: usuario.dniNumber || "N/A",
      name: usuario.name  || "N/A",
      lastName: usuario.lastName || "N/A",
      email: usuario.email || "N/A",
      status: usuario.status !== undefined ? usuario.status : "N/A",
      createdAt: usuario.createdAt || "N/A",
      updatedAt: usuario.updatedAt || "N/A",
      documento: usuario.typeDocumentRelation?.name || "N/A",
      idDocumento: usuario.typeDocumentRelation?.id || "N/A",
      roles: usuario.rolesRelation?.name || "N/A",
      idRol: usuario.rolesRelation?.id || "N/A",
      municipio: usuario.municipioRelation?.name || "N/A",
      idMunicipio: usuario.municipioRelation?.id || "N/A",
      area: usuario.area|| "N/A",
      cargo: usuario.position || "N/A",
      sedeId: usuario.headquarters || "N/A",
      celular: usuario.phoneNumber || "N/A",
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

// actualizar datos del usuario
export async function updateUsuarioTable(request: Request, response: Response, next: NextFunction){
  try {
    
    const {id} = request.params;
    const { dniNumber, name, lastName, dniType, email, password, municipio,status, rol, area, position, headquarters, phoneNumber } = request.body;
    console.log(request.body);

    const usuario = await Usuarios.findOneBy({id: parseInt(id)});
    if(!usuario){
      return response.status(404).json({message: 'Usuario no encontrado'});
    }

    usuario.dniNumber = parseInt(dniNumber);
    usuario.status = status == 1;
    usuario.name = name;
    usuario.lastName = lastName;
    usuario.dniType = parseInt(dniType);
    usuario.email = email;
    if (password) {
      const saltRounds = 10;
      usuario.password = await bcrypt.hash(password, saltRounds);
    }
    usuario.municipio = parseInt(municipio);
    usuario.rol = parseInt(rol);
    usuario.area = area.toUpperCase();
    usuario.position = position.toUpperCase();
    usuario.headquarters = parseInt(headquarters);
    usuario.phoneNumber = parseInt(phoneNumber);

    const errors = await validate(usuario);
    if(errors.length > 0){
      const messageError = errors.map(error => ({
        property: error.property,
        constraints: error.constraints
      }));
      return response.status(400).json({message: 'Ocurrio un error', messageError});
    }

    await usuario.save();

    return response.json(usuario);

  } catch (error) {
    next(error);
  }
}

// buscar usuarios por nombre
export async function searchUsuarios(req: Request, res: Response, next: NextFunction){
  try {
    const { name } = req.body;
    const usuarios = await Usuarios.createQueryBuilder('usuarios')
    .where('CONCAT(usuarios.name, " ", usuarios.lastName) like :name', {name: `%${name}%`})
    .getMany();

    if(usuarios.length === 0){
      return res.status(404).json({message: 'Usuario no encontrado'});
    }

    // Transformar el resultado para concatenar nombre y apellido
    const usuariosTransformed = usuarios.map(usuario => ({
      ...usuario,
      name: `${usuario.name} ${usuario.lastName}`,
      id: usuario.id,
    }));

    return res.json(usuariosTransformed);
  } catch (error) {
    next(error);
  }
}

// funcion para actualizar contrasenas de usuarios a claves genenericas
export  async function updatePasswordGeneric(req: Request, res: Response, next: NextFunction){
  try {
    
    const genericPassword = 'Colombia24@';

    const saltRounds = 10;

    const hashedPassword = await bcrypt.hash(genericPassword, saltRounds);

    await Usuarios.createQueryBuilder()
    .update(Usuarios)
    .set({password: hashedPassword})
    .where('id > 72')
    .execute();

    return res.json({message: 'Contraseñas actualizadas correctamente'});

  } catch (error) {
    next(error);
  }
}