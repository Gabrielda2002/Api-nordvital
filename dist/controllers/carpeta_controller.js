"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllFolders = getAllFolders;
exports.getFolderById = getFolderById;
exports.createFolder = createFolder;
exports.updateFolder = updateFolder;
exports.deleteFolder = deleteFolder;
exports.getSgcFoldersFiles = getSgcFoldersFiles;
const carpeta_1 = require("../entities/carpeta");
const class_validator_1 = require("class-validator");
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const archivos_1 = require("../entities/archivos");
function getAllFolders(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const folders = yield carpeta_1.Carpeta.find();
            res.json(folders);
        }
        catch (error) {
            next(error);
        }
    });
}
function getFolderById(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const folder = yield carpeta_1.Carpeta.findOneBy({ id: parseInt(id) });
            if (!folder) {
                return res.status(404).json({ message: "Folder not found" });
            }
            return res.json(folder);
        }
        catch (error) {
            next(error);
        }
    });
}
function createFolder(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { folderName, municipio, parentFolderId, user_id } = req.body;
            console.log(req.body);
            console.log("id carpeta padre", parentFolderId);
            let folderPath;
            // * comprobar si la carpeta padre existe
            if (parentFolderId) {
                const parentFolder = yield carpeta_1.Carpeta.createQueryBuilder("carpeta")
                    .where("carpeta.id = :id", { id: parentFolderId })
                    .getOne();
                if (!parentFolder) {
                    return res.status(404).json({ message: "Parent folder not found" });
                }
                console.log("carpeta padre:", parentFolder);
                folderPath = path_1.default.join(parentFolder.path, folderName);
                console.log(folderPath);
            }
            else {
                // * si es una carpeta raiz
                folderPath = path_1.default.join(__dirname, "..", "uploads", folderName);
            }
            const folderExists = yield fs_1.promises.access(folderPath).then(() => true).catch(() => false);
            if (folderExists) {
                return res.status(409).json({ message: "Folder already exists" });
            }
            yield fs_1.promises.mkdir(folderPath, { recursive: true });
            const folder = new carpeta_1.Carpeta();
            folder.name = folderName;
            folder.idMunicipio = municipio;
            folder.parentFolderId = parentFolderId;
            folder.path = folderPath;
            folder.userId = user_id;
            const errors = yield (0, class_validator_1.validate)(folder);
            if (errors.length > 0) {
                const message = errors.map(err => ({
                    property: err.property,
                    constraints: err.constraints
                }));
                return res.status(400).json({ messages: "Error validating data", message });
            }
            yield folder.save();
            return res.status(201).json(folder);
        }
        catch (error) {
            next(error);
        }
    });
}
/**
 * Updates a folder in the system.
 *
 * @param req - The request object.
 * @param res - The response object.
 * @param next - The next function.
 * @returns The updated folder.
 * @throws If an error occurs during the update process.
 */
function updateFolder(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const { name, parentFolderId } = req.body;
            // Buscar la carpeta existente en la base de datos
            const folder = yield carpeta_1.Carpeta.findOneBy({ id: parseInt(id) });
            if (!folder) {
                return res.status(404).json({ message: "Folder not found" });
            }
            let newPath;
            if (parentFolderId !== undefined) {
                const parentFolder = yield carpeta_1.Carpeta.findOneBy({ id: parentFolderId });
                if (!parentFolder) {
                    return res.status(404).json({ message: "Parent folder not found" });
                }
                newPath = path_1.default.join(parentFolder.path, name);
            }
            else {
                newPath = path_1.default.join(__dirname, "..", "uploads", name);
            }
            // Verificar si la nueva ruta ya existe con el nuevo nombre
            try {
                yield fs_1.promises.access(newPath);
                return res.status(409).json({ message: "Folder with the same name already exists" });
            }
            catch (_a) {
                // La carpeta no existe, proceder con la actualización
            }
            // Verificar si la nueva ruta no es un subdirectorio de la ruta antigua
            const resolvedOldPath = path_1.default.resolve(folder.path);
            const resolvedNewPath = path_1.default.resolve(newPath);
            if (resolvedNewPath.startsWith(resolvedOldPath)) {
                return res.status(400).json({ message: "New path is within the old path" });
            }
            // Renombrar la carpeta en el sistema de archivos
            yield fs_1.promises.rename(folder.path, newPath);
            // Actualizar la entidad Carpeta en la base de datos
            folder.name = name;
            folder.parentFolderId = parentFolderId;
            folder.path = newPath;
            const errors = yield (0, class_validator_1.validate)(folder);
            if (errors.length > 0) {
                const message = errors.map(err => ({
                    property: err.property,
                    constraints: err.constraints
                }));
                return res.status(400).json({ messages: "Error validating data", message });
            }
            yield folder.save();
            // Actualizar las rutas de los archivos y subcarpetas
            yield updateSubFiles(folder.id, newPath);
            yield updateSubFolders(folder.id, newPath);
            return res.status(200).json(folder);
        }
        catch (error) {
            next(error);
        }
    });
}
// Función para actualizar rutas de archivos
function updateSubFiles(folderId, newPath) {
    return __awaiter(this, void 0, void 0, function* () {
        const subFiles = yield archivos_1.Archivos.find({ where: { folderId } });
        for (const subfile of subFiles) {
            const oldSubPathFile = subfile.path;
            // * reemplazar espacios por guiones bajos
            const sanitazedfileName = path_1.default.basename(subfile.name, path_1.default.extname(subfile.name)).replace(/ /g, '_') + path_1.default.extname(subfile.name);
            const newSubPathFile = path_1.default.join(newPath, path_1.default.basename(subfile.path));
            try {
                // await fsPromises.rename(oldSubPathFile, newSubPathFile);
                subfile.path = newSubPathFile;
                yield subfile.save();
            }
            catch (error) {
                throw new Error(`File with the same name already exists: ${subfile.name}`);
            }
        }
    });
}
// Función para actualizar rutas de subcarpetas
function updateSubFolders(parentFolderId, newPath) {
    return __awaiter(this, void 0, void 0, function* () {
        const subFolders = yield carpeta_1.Carpeta.find({ where: { parentFolderId } });
        for (const subFolder of subFolders) {
            const oldSubPathFolder = subFolder.path;
            const newSubPathFolder = path_1.default.join(newPath, subFolder.name);
            try {
                // await fsPromises.rename(oldSubPathFolder, newSubPathFolder);
                subFolder.path = newSubPathFolder;
                yield subFolder.save();
                // Actualizar las rutas de subcarpetas y archivos dentro de esta subcarpeta
                yield updateSubFiles(subFolder.id, newSubPathFolder);
                yield updateSubFolders(subFolder.id, newSubPathFolder);
            }
            catch (error) {
                throw new Error(`Folder with the same name already exists: ${subFolder.name}`);
            }
        }
    });
}
function deleteFolder(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            // Buscar la carpeta existente en la base de datos
            const folder = yield carpeta_1.Carpeta.findOneBy({ id: parseInt(id) });
            if (!folder) {
                return res.status(404).json({ message: "Folder not found" });
            }
            // * validacion para no eliminar carpetas con archivos
            const files = yield archivos_1.Archivos.find({ where: { folderId: folder.id } });
            const subFolders = yield carpeta_1.Carpeta.find({ where: { parentFolderId: folder.id } });
            if (files.length > 0 || subFolders.length > 0) {
                return res.status(400).json({ message: "Folder has files or subfolders", subFilesCount: files.length, subFoldersCount: subFolders.length });
            }
            // Eliminar la carpeta en el sistema de archivos
            yield fs_1.promises.rmdir(folder.path, { recursive: true });
            // Eliminar la entidad Carpeta en la base de datos
            yield folder.remove();
            return res.status(204).json();
        }
        catch (error) {
            next(error);
        }
    });
}
function getSgcFoldersFiles(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const { Municipio } = req.query;
            let folders = {}, files = {};
            if (id) {
                // * mostrar archivos y carpetas de la carpeta seleccionada
                const folder = yield carpeta_1.Carpeta.findOneBy({ id: parseInt(id) });
                if (!folder) {
                    return res.status(404).json({ message: "Folder not found" });
                }
                // * mostrar archivos y carpetas de la carpeta seleccionada
                folders = yield carpeta_1.Carpeta.createQueryBuilder("carpeta")
                    .where("carpeta.parentFolderId = :id", { id: folder.id })
                    .andWhere("carpeta.idMunicipio = :municipio", { municipio: Municipio })
                    .getMany();
                files = yield archivos_1.Archivos.find({ where: { folderId: folder.id } });
            }
            else {
                // * mostrar carpeta raiz
                folders = yield carpeta_1.Carpeta.createQueryBuilder("carpeta")
                    .where("carpeta.parentFolderId IS NULL")
                    .andWhere("carpeta.idMunicipio = :municipio", { municipio: Municipio })
                    .getMany();
            }
            return res.json({ folders, files });
        }
        catch (error) {
            next(error);
        }
    });
}
