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
exports.getAllFiles = getAllFiles;
exports.getFileById = getFileById;
exports.createFile = createFile;
exports.updateFile = updateFile;
exports.deleteFile = deleteFile;
exports.downloadFile = downloadFile;
const archivos_1 = require("../entities/archivos");
const path_1 = __importDefault(require("path"));
const class_validator_1 = require("class-validator");
const fs_1 = __importDefault(require("fs"));
function getAllFiles(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const files = yield archivos_1.Archivos.find();
            if (!files) {
                return res.status(404).json({ message: "No hay archivos registrados" });
            }
            return res.status(200).json(files);
        }
        catch (error) {
            next(error);
        }
    });
}
function getFileById(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const file = yield archivos_1.Archivos.findOne({
                where: { id: parseInt(id) }
            });
            if (!file) {
                return res.status(404).json({ message: "Archivo no encontrado" });
            }
            return res.status(200).json(file);
        }
        catch (error) {
            next(error);
        }
    });
} // Asegúrate de que la ruta es correcta
function createFile(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { parentFolderId } = req.query;
            console.log(parentFolderId);
            // Asegúrate de que req.files sea un array de archivos
            const files = req.files;
            console.log(files);
            if (!files || files.length === 0) {
                return res.status(400).json({ message: "At least one file is required" });
            }
            // Procesa cada archivo
            const fileResponses = yield Promise.all(files.map((file) => __awaiter(this, void 0, void 0, function* () {
                const fileExists = yield archivos_1.Archivos.findOne({ where: { name: file.originalname } });
                if (fileExists) {
                    return { status: 409, message: `File ${file.originalname} already exists` };
                }
                const fileNameWithOutExt = path_1.default.basename(file.originalname, path_1.default.extname(file.originalname));
                const newFile = new archivos_1.Archivos();
                newFile.name = fileNameWithOutExt === null || fileNameWithOutExt === void 0 ? void 0 : fileNameWithOutExt.normalize('NFC');
                // * obtener la ruta relativa del archivo
                const relativePath = path_1.default.relative(path_1.default.resolve('src', 'uploads'), file.path);
                console.log(relativePath);
                newFile.path = relativePath;
                newFile.size = file.size;
                newFile.mimeType = file.mimetype;
                newFile.folderId = parseInt(parentFolderId);
                newFile.nameSaved = path_1.default.basename(file.filename);
                const errors = yield (0, class_validator_1.validate)(newFile);
                if (errors.length > 0) {
                    const message = errors.map(err => ({
                        property: err.property,
                        constraints: err.constraints
                    }));
                    return { status: 400, message };
                }
                yield newFile.save();
                return { status: 201, file: newFile };
            })));
            // Filtra las respuestas fallidas y devuelve un mensaje combinado
            const errors = fileResponses.filter(response => response.status !== 201);
            if (errors.length > 0) {
                return res.status(errors[0].status).json(errors.map(error => error.message));
            }
            return res.status(201).json(fileResponses.map(response => response.file));
        }
        catch (error) {
            next(error);
        }
    });
}
function updateFile(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const { name, parentFolderId } = req.body;
            const file = yield archivos_1.Archivos.findOne({ where: { id: parseInt(id) } });
            if (!file) {
                return res.status(404).json({ message: "Archivo no encontrado" });
            }
            file.name = name;
            file.folderId = parentFolderId;
            const errors = yield (0, class_validator_1.validate)(file);
            if (errors.length > 0) {
                const message = errors.map(err => ({
                    property: err.property,
                    constraints: err.constraints
                }));
                return res.status(400).json({ message });
            }
            yield file.save();
            return res.status(200).json(file);
        }
        catch (error) {
            next(error);
        }
    });
}
function deleteFile(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const file = yield archivos_1.Archivos.findOne({ where: { id: parseInt(id) } });
            if (!file) {
                return res.status(404).json({ message: "Archivo no encontrado" });
            }
            yield file.remove();
            return res.status(204).json({ message: "Archivo eliminado" });
        }
        catch (error) {
            next(error);
        }
    });
}
function downloadFile(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const file = yield archivos_1.Archivos.findOne({ where: { id: parseInt(id) } });
            if (!file) {
                return res.status(404).json({ message: "Archivo no encontrado" });
            }
            console.log(file.path);
            const filePath = path_1.default.resolve('src', 'uploads', file.path);
            console.log(filePath);
            if (!fs_1.default.existsSync(filePath)) {
                return res.status(404).json({ message: "Archivo no encontrado en el servidor" });
            }
            res.download(filePath, file.nameSaved, (err) => {
                if (err) {
                    console.error("Error al descargar el archivo: ", err);
                    res.status(500).json({ message: "Error al descargar el archivo" });
                }
            });
        }
        catch (error) {
            next(error);
        }
    });
}
