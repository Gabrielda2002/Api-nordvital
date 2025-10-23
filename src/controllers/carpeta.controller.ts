import { NextFunction, Request, Response } from "express";
import { Carpeta } from "../entities/carpeta";
import { validate } from "class-validator";
import { error } from "console";
import * as fs from "fs";
import { promises as fsPromises } from "fs";
import path from "path";
import { Archivos } from "../entities/archivos";
import { IsNull, QueryRunner } from "typeorm";
import { AppDataSource } from "../db/conexion";

export async function getAllFolders(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const folders = await Carpeta.find({ order: { name: "ASC" } });
    res.json(folders);
  } catch (error) {
    next(error);
  }
}

export async function getFolderById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const folder = await Carpeta.findOneBy({ id: parseInt(id) });
    if (!folder) {
      return res.status(404).json({ message: "Folder not found" });
    }
    return res.json(folder);
  } catch (error) {
    next(error);
  }
}

export async function createFolder(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { folderName, parentFolderId, user_id, section } =
      req.body;

    const departmentUserId = req?.departmentUserId;

    let folderPath: string;

    // ? comprobar si la carpeta padre existe
    if (parentFolderId) {
      const parentFolder = await Carpeta.createQueryBuilder("carpeta")
        .where("carpeta.id = :id", { id: parentFolderId })
        .getOne();
      if (!parentFolder) {
        return res.status(404).json({ message: "Parent folder not found" });
      }
      folderPath = path.join(parentFolder.path, folderName).replace(/\\/g, "/");
    } else {
      // * si es una carpeta raiz
      folderPath = path
        .join("SistemaGestionCalidad", folderName)
        .replace(/\\/g, "/");
    }

    // ruta fisica absoluta
    const absoluteFolderPath = path.join(
      __dirname,
      "..",
      "uploads",
      folderPath
    );

    const folderExists = await fsPromises
      .access(absoluteFolderPath)
      .then(() => true)
      .catch(() => false);

    if (folderExists) {
      return res.status(409).json({ message: "Folder already exists" });
    }
    // crear carpeta fisica y verificar que se haya creado correctamente
    await fsPromises
      .mkdir(absoluteFolderPath, { recursive: true })
      .catch((err) => {
        return res
          .status(500)
          .json({ message: "Error creating folder", error: err.message });
      });

    const folder = new Carpeta();
    folder.name = folderName;
    folder.idDepartment = departmentUserId || 1;
    folder.parentFolderId = parentFolderId;
    folder.path = folderPath;
    folder.userId = user_id;
    folder.seccion = section;

    const errors = await validate(folder);

    if (errors.length > 0) {
      const message = errors.map((err) => (
        Object.values(err.constraints || {}).join(", ")
      ));

      return res
        .status(400)
        .json({ message: message });
    }

    await folder.save();

    return res.status(201).json(folder);
  } catch (error) {
    next(error);
  }
}

export async function updateFolder(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  
  try {
    const { id } = req.params;
    const { name, parentFolderId } = req.body;

    // Buscar la carpeta existente en la base de datos
    const folder = await Carpeta.findOneBy({ id: parseInt(id) });
    if (!folder) {
      return res.status(404).json({ message: "Folder not found" });
    }

    let newPath: string;

    if (parentFolderId !== null) {
      const parentFolder = await Carpeta.findOneBy({ id: parentFolderId });
      if (!parentFolder) {
        return res.status(404).json({ message: "Parent folder not found" });
      }
      newPath = path.join(parentFolder.path, name).replace(/\\/g, "/");
    } else {
      newPath = path.join("SistemaGestionCalidad", name).replace(/\\/g, "/");
    }

    const newPathAbsolute = path.join(__dirname, "..", "uploads", newPath);
    const oldPathAbsolute = path.join(__dirname, "..", "uploads", folder.path);

    // Verificar si la nueva ruta ya existe con el nuevo nombre
    try {
      await fsPromises.access(newPathAbsolute);
      return res
        .status(409)
        .json({ message: "Folder with the same name already exists" });
    } catch {
      // La carpeta no existe, proceder con la actualización
    }

    // Verificar si la nueva ruta no es un subdirectorio de la ruta antigua
    const resolvedOldPath = path.resolve(folder.path);
    const resolvedNewPath = path.resolve(newPath);

    const relativePath = path.relative(resolvedOldPath, resolvedNewPath);
    if (!relativePath.startsWith("..") && relativePath !== "") {
      return res
        .status(400)
        .json({ message: "New path is within the old path" });
    }

    // Renombrar la carpeta en el sistema de archivos
    await fsPromises.rename(oldPathAbsolute, newPathAbsolute);

    // Iniciar transacción
    await queryRunner.startTransaction();

    try {
      // Actualizar la entidad Carpeta en la base de datos
      folder.name = name;
      folder.parentFolderId = parentFolderId;
      folder.path = newPath;

      const errors = await validate(folder);
      if (errors.length > 0) {
        const message = errors.map((err) => (
          Object.values(err.constraints || {}).join(", ")
        ));
        throw new Error(`Validation error: ${message.join(", ")}`);
      }

      await queryRunner.manager.save(folder);

      // Actualizar las rutas de los archivos y subcarpetas usando QueryRunner
      await updateSubFilesWithTransaction(queryRunner, folder.id, newPath);
      await updateSubFoldersWithTransaction(queryRunner, folder.id, newPath);

      // Commit de la transacción
      await queryRunner.commitTransaction();

      return res.status(200).json(folder);
    } catch (dbError) {
      // Rollback en caso de error
      await queryRunner.rollbackTransaction();
      
      // Revertir el cambio físico de la carpeta
      try {
        await fsPromises.rename(newPathAbsolute, oldPathAbsolute);
      } catch (revertError) {
        console.error("Error reverting folder rename:", revertError);
      }
      
      throw dbError;
    }
  } catch (error) {
    next(error);
  } finally {
    await queryRunner.release();
  }
}

// Función para actualizar rutas de archivos CON TRANSACCIÓN
async function updateSubFilesWithTransaction(
  queryRunner: QueryRunner,
  folderId: number,
  newPath: string
) {
  const subFiles = await queryRunner.manager.find(Archivos, {
    where: { folderId },
  });

  for (const subfile of subFiles) {
    const newSubPathFile = path.join(newPath, path.basename(subfile.path)).replace(/\\/g, "/");
    
    subfile.path = newSubPathFile;
    await queryRunner.manager.save(subfile);
  }
}

// Función para actualizar rutas de subcarpetas CON TRANSACCIÓN
async function updateSubFoldersWithTransaction(
  queryRunner: QueryRunner,
  parentFolderId: number,
  newPath: string
) {
  const subFolders = await queryRunner.manager.find(Carpeta, {
    where: { parentFolderId },
  });

  for (const subFolder of subFolders) {
    const newSubPathFolder = path.join(newPath, subFolder.name).replace(/\\/g, "/");
    
    subFolder.path = newSubPathFolder;
    await queryRunner.manager.save(subFolder);

    // Actualizar recursivamente las rutas de subcarpetas y archivos
    await updateSubFilesWithTransaction(queryRunner, subFolder.id, newSubPathFolder);
    await updateSubFoldersWithTransaction(queryRunner, subFolder.id, newSubPathFolder);
  }
}

export async function deleteFolder(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;

    // Buscar la carpeta existente en la base de datos
    const folder = await Carpeta.findOneBy({ id: parseInt(id) });
    if (!folder) {
      return res.status(404).json({ message: "Folder not found" });
    }

    // * validacion para no eliminar carpetas con archivos
    const files = await Archivos.find({ where: { folderId: folder.id } });

    const subFolders = await Carpeta.find({
      where: { parentFolderId: folder.id },
    });

    if (files.length > 0 || subFolders.length > 0) {
      return res
        .status(400)
        .json({
          message: "Folder has files or subfolders",
          subFilesCount: files.length,
          subFoldersCount: subFolders.length,
        });
    }
    const folderAbsolutePath = path.join(
      __dirname,
      "..",
      "uploads",
      folder.path
    );
    await fsPromises.rmdir(folderAbsolutePath, { recursive: true });

    // Eliminar la entidad Carpeta en la base de datos
    await folder.remove();

    return res.status(204).json();
  } catch (error) {
    next(error);
  }
}

export async function getSgcFoldersFiles(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;

    const departmentUserId = req.departmentUserId;
    const hasGlobalAccess = req.hasGlobalFolderAccess;

    const { section } = req.query;

    let folders: {} = {}, files: {} = {};

    if (id) {
      // * mostrar archivos y carpetas de la carpeta seleccionada
      const folder = await Carpeta.createQueryBuilder("carpeta")
        .where("carpeta.id = :id", { id: parseInt(id) })
        .andWhere("carpeta.seccion = :section", { section: section })
        .orderBy("carpeta.name", "ASC")
        .getOne();

      if (!folder) {
        return res.status(404).json({ message: "Folder not found" });
      }

      // * Construir query para carpetas según acceso global
      const folderQuery = Carpeta.createQueryBuilder("carpeta")
        .leftJoinAndSelect("carpeta.departamentoRelation", "departamento")
        .where("carpeta.parentFolderId = :id", { id: folder.id })
        .andWhere("carpeta.seccion = :section", { section: section });

      // * Si no tiene acceso global, filtrar por departamento
      if (!hasGlobalAccess && departmentUserId) {
        folderQuery.andWhere("carpeta.idDepartment = :idDepartment", { 
          idDepartment: departmentUserId 
        });
      }

      folders = await folderQuery
        .orderBy("carpeta.name", "ASC")
        .getMany();

      files = await Archivos.find({ where: { folderId: folder.id }, order: { name: "ASC" } });
    } else {
      // * Construir query para carpetas raíz según acceso global
      const folderQuery = Carpeta.createQueryBuilder("carpeta")
        .leftJoinAndSelect("carpeta.departamentoRelation", "departamento")
        .where("carpeta.parentFolderId IS NULL")
        .andWhere("carpeta.seccion = :section", { section: section });

      // * Si no tiene acceso global, filtrar por departamento
      if (!hasGlobalAccess && departmentUserId) {
        folderQuery.andWhere("carpeta.idDepartment = :idDepartment", { 
          idDepartment: departmentUserId 
        });
      }

      folders = await folderQuery
        .orderBy("carpeta.name", "ASC")
        .getMany();
    }
    
    return res.json({ folders, files });
  } catch (error) {
    next(error);
  }
}

// mueve una carpeta a una nueva ubicacion
export async function moveFolder(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();

  try {
    const { id } = req.params;
    const { newParentId, section } = req.body;

    const folderToMove = await Carpeta.findOneBy({ id: parseInt(id) });
    // ? validar carpeta a mover
    if (!folderToMove) {
      return res.status(404).json({ message: "Folder not found" });
    }

    // ? validar carpeta padre destino si existe
    let newParentFolder = null;
    let newRelativePath: string;

    if (newParentId) {
      newParentFolder = await Carpeta.findOneBy({ id: parseInt(newParentId) });
      if (!newParentFolder) {
        return res.status(404).json({ message: "New parent folder not found" });
      }
      // ! verificar que no se este moviendo la carpeta a una subcarpeta de si misma
      if (await isDescendentFolder(newParentId, folderToMove.id)) {
        return res
          .status(400)
          .json({ message: "Cannot move folder into its own subfolder" });
      }

      newRelativePath = path
        .join(newParentFolder.path, folderToMove.name)
        .replace(/\\/g, "/");
    } else {
      // si no se especifica una carpeta padre, se movera a la carpeta raiz
      newRelativePath = path
        .join("SistemaGestionCalidad", folderToMove.name)
        .replace(/\\/g, "/");
    }

    const oldAbsolutePath = path.join(
      __dirname,
      "..",
      "uploads",
      folderToMove.path
    );
    const newAbsolutePath = path.join(
      __dirname,
      "..",
      "uploads",
      newRelativePath
    );

    // ? verificar que no exista una carpeta con el mismo nombre en la nueva ubicacion
    const existingFolder = await Carpeta.findOne({
      where: {
        name: folderToMove.name,
        parentFolderId: newParentId || IsNull(),
        seccion: section,
      },
    });

    if (existingFolder && existingFolder.id !== folderToMove.id) {
      return res
        .status(409)
        .json({
          message:
            "A folder with the same name already exists in the new location",
        });
    }

    // verificar que la nueva ruta no exista fisicamente
    const folderExists = await fsPromises
      .access(newAbsolutePath)
      .then(() => true)
      .catch(() => false);
    if (folderExists) {
      return res
        .status(409)
        .json({ message: "Folder already exists at the new location" });
    }

    // mover carpeta fisicamente
    await fsPromises.rename(oldAbsolutePath, newAbsolutePath);

    // Iniciar transacción
    await queryRunner.startTransaction();

    try {
      // actualizar carpeta en la base de datos
      folderToMove.parentFolderId = newParentId || null;
      folderToMove.path = newRelativePath;
      folderToMove.seccion = section;

      const errors = await validate(folderToMove);
      if (errors.length > 0) {
        const message = errors.map((err) => (
          Object.values(err.constraints || {}).join(", ")
        ));
        throw new Error(`Validation error: ${message.join(", ")}`);
      }

      await queryRunner.manager.save(folderToMove);

      // actualizar rutas de archivos y subcarpetas con transacción
      await updatteAllSubItemsPathsWithTransaction(
        queryRunner,
        folderToMove.id,
        newRelativePath,
        section
      );

      // Commit de la transacción
      await queryRunner.commitTransaction();

      return res.status(200).json(folderToMove);
    } catch (dbError) {
      // Rollback en caso de error
      await queryRunner.rollbackTransaction();

      // Revertir el movimiento físico de la carpeta
      try {
        await fsPromises.rename(newAbsolutePath, oldAbsolutePath);
      } catch (revertError) {
        console.error("Error reverting folder move:", revertError);
      }

      throw dbError;
    }
  } catch (error) {
    next(error);
  } finally {
    await queryRunner.release();
  }
}

// funcion para verificar si una carpeta es descendiente de otra
async function isDescendentFolder(
  parentId: number,
  childId: number
): Promise<boolean> {
  // ? Si el parentId es igual al childId, significa que son la misma carpeta
  if (parentId === childId) {
    return true;
  }
  // ? Buscar todas las carpetas hijas del childId
  const children = await Carpeta.find({ where: { parentFolderId: childId } });
  // ? Si no hay carpetas hijas, significa que no es descendiente
  for (const child of children) {
    if (
      child.id === childId ||
      (await isDescendentFolder(parentId, child.id))
    ) {
      return true;
    }
  }

  return false;
}

// funcion auxiliar para actualizar todas las rutas de subcarpetas y archivos CON TRANSACCIÓN
async function updatteAllSubItemsPathsWithTransaction(
  queryRunner: QueryRunner,
  folderId: number,
  newBasePath: string,
  section: string
) {
  await updateSubFilesWithTransaction(queryRunner, folderId, newBasePath);

  const subFolders = await queryRunner.manager.find(Carpeta, {
    where: { parentFolderId: folderId },
  });

  for (const subFolder of subFolders) {
    const newSubPath = path.join(newBasePath, subFolder.name).replace(/\\/g, "/");
    subFolder.path = newSubPath;
    subFolder.seccion = section;
    await queryRunner.manager.save(subFolder);

    await updatteAllSubItemsPathsWithTransaction(
      queryRunner,
      subFolder.id,
      newSubPath,
      section
    );
  }
}