import { NextFunction, Request, Response } from "express";
import { Carpeta } from "../entities/carpeta";
import { validate } from "class-validator";
import { error } from "console";
import * as fs from "fs";
import { promises as fsPromises } from "fs";
import path from "path";
import { Archivos } from "../entities/archivos";
import { IsNull } from "typeorm";

export async function getAllFolders(req: Request, res: Response, next: NextFunction){
    try {
        const folders = await Carpeta.find();
        res.json(folders);
    } catch (error) {
        next(error)
    }
}

export async function getFolderById(req: Request, res: Response, next: NextFunction){
    try {
        const { id } = req.params;
        const folder = await Carpeta.findOneBy({id: parseInt(id)});
        if (!folder) {
            return res.status(404).json({ message: "Folder not found" });
        }
        return res.json(folder);
    } catch (error) {
        next(error)
    }
}

export async function createFolder(req: Request, res: Response, next: NextFunction){
    try {

        const {
            name,
            userId,
            parentFolderId
        } = req.body;

        let folderPath: string;
        
        // * comprobar si la carpeta padre existe

        if (parentFolderId) {
            const parentFolder = await Carpeta.findOneBy({id: parentFolderId});
            if (!parentFolder) {
                return res.status(404).json({ message: "Parent folder not found" });
            }
            folderPath = path.join(parentFolder.path, name);
        }else{
            // * si es una carpeta raiz
            folderPath = path.join(__dirname, "..", "uploads", name);
        }

        const folderExists = await fsPromises.access(folderPath).then(() => true).catch(() => false);

        if (folderExists) {
            return res.status(409).json({ message: "Folder already exists" });
        }

        await fsPromises.mkdir(folderPath, {recursive: true});

        const folder = new Carpeta();
        folder.name = name;
        folder.userId = userId;
        folder.parentFolderId = parentFolderId;
        folder.path = folderPath;

        const errors = await validate(folder);

        if (errors.length > 0) {

            const message = errors.map(err => ({
                property: err.property,
                constraints: err.constraints
            }));

            return res.status(400).json({ messages: "Error validating data", message });
            
        }


        await folder.save();

        return res.status(201).json(folder);
    } catch (error) {
        next(error)
    }
}

export async function updateFolder(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const { name, userId, parentFolderId } = req.body;

        // Buscar la carpeta existente en la base de datos
        const folder = await Carpeta.findOneBy({ id: parseInt(id) });
        if (!folder) {
            return res.status(404).json({ message: "Folder not found" });
        }

        let newPath: string;

        if (parentFolderId !== undefined) {
            const parentFolder = await Carpeta.findOneBy({ id: parentFolderId });
            if (!parentFolder) {
                return res.status(404).json({ message: "Parent folder not found" });
            }
            newPath = path.join(parentFolder.path, name);
        } else {
            newPath = path.join(__dirname, "..", "uploads", name);
        }

        // Verificar si la nueva ruta ya existe con el nuevo nombre
        try {
            await fsPromises.access(newPath);
            return res.status(409).json({ message: "Folder with the same name already exists" });
        } catch {
            // La carpeta no existe, proceder con la actualización
        }

        // Verificar si la nueva ruta no es un subdirectorio de la ruta antigua
        const resolvedOldPath = path.resolve(folder.path);
        const resolvedNewPath = path.resolve(newPath);
        if (resolvedNewPath.startsWith(resolvedOldPath)) {
            return res.status(400).json({ message: "New path is within the old path" });
        }

        // Renombrar la carpeta en el sistema de archivos
        await fsPromises.rename(folder.path, newPath);

        // Actualizar la entidad Carpeta en la base de datos
        folder.name = name;
        folder.userId = userId;
        folder.parentFolderId = parentFolderId;
        folder.path = newPath;

        const errors = await validate(folder);
        if (errors.length > 0) {
            const message = errors.map(err => ({
                property: err.property,
                constraints: err.constraints
            }));
            return res.status(400).json({ messages: "Error validating data", message });
        }

        await folder.save();

        // Actualizar las rutas de los archivos y subcarpetas
        await updateSubFiles(folder.id, newPath);
        await updateSubFolders(folder.id, newPath);

        return res.status(200).json(folder);
    } catch (error) {
        next(error);
    }
}

// Función para actualizar rutas de archivos
async function updateSubFiles(folderId: number, newPath: string) {
    const subFiles = await Archivos.find({ where: { folderId } });


    for (const subfile of subFiles) {
        const oldSubPathFile = subfile.path;

        // * reemplazar espacios por guiones bajos
        const sanitazedfileName = path.basename(subfile.name, path.extname(subfile.name)).replace(/ /g, '_' ) + path.extname(subfile.name);

        const newSubPathFile = path.join(newPath, path.basename(subfile.path));

        try {
            // await fsPromises.rename(oldSubPathFile, newSubPathFile);
            subfile.path = newSubPathFile;
            await subfile.save();
        } catch (error) {
            throw new Error(`File with the same name already exists: ${subfile.name}`);
        }
    }
}

// Función para actualizar rutas de subcarpetas
async function updateSubFolders(parentFolderId: number, newPath: string) {
    const subFolders = await Carpeta.find({ where: { parentFolderId } });

    for (const subFolder of subFolders) {
        const oldSubPathFolder = subFolder.path;
        const newSubPathFolder = path.join(newPath, subFolder.name);

        try {
            // await fsPromises.rename(oldSubPathFolder, newSubPathFolder);
            subFolder.path = newSubPathFolder;
            await subFolder.save();

            // Actualizar las rutas de subcarpetas y archivos dentro de esta subcarpeta
            await updateSubFiles(subFolder.id, newSubPathFolder);
            await updateSubFolders(subFolder.id, newSubPathFolder);
        } catch (error) {
            throw new Error(`Folder with the same name already exists: ${subFolder.name}`);
        }
    }
}

export async function deleteFolder(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;

        // Buscar la carpeta existente en la base de datos
        const folder = await Carpeta.findOneBy({ id: parseInt(id) });
        if (!folder) {
            return res.status(404).json({ message: "Folder not found" });
        }

        // * validacion para no eliminar carpetas con archivos

        const files = await Archivos.find({ where: { folderId: folder.id } });
        const subFolders = await Carpeta.find({ where: { parentFolderId: folder.id } });

        if (files.length > 0 || subFolders.length > 0) {
            return res.status(400).json({ message: "Folder has files or subfolders", subFilesCount: files.length, subFoldersCount: subFolders.length });
            
        }



        // Eliminar la carpeta en el sistema de archivos
        await fsPromises.rmdir(folder.path, { recursive: true });

        // Eliminar la entidad Carpeta en la base de datos
        await folder.remove();

        return res.status(204).json();
    } catch (error) {
        next(error);
    }
}

export async function getSgcFoldersFiles(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.body;
        console.log(id)

        let folders, files: {};

        if (id) {

            // * mostrar archivos y carpetas de la carpeta seleccionada
            const folder = await Carpeta.findOneBy({ id: parseInt(id) });

            if (!folder) {
                return res.status(404).json({ message: "Folder not found" });
            }

            // * mostrar archivos y carpetas de la carpeta seleccionada
            folders = await Carpeta.find({where: {parentFolderId: folder.id}});
            files = await Archivos.find({where: {folderId: folder.id}});
        }else{
            // * mostrar carpeta raiz
            folders = await Carpeta.find({where: {parentFolderId: IsNull()}}); // * se usa la funcion IsNull() para que typeorm busque los registros con parentFolderId = null
            files = [];
        }



        return res.json({ folders, files });
    } catch (error) {
        next(error);
    }
}