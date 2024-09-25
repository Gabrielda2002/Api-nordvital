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
exports.getAllSorportes = getAllSorportes;
exports.getSoporteById = getSoporteById;
exports.createSoporte = createSoporte;
exports.updateSoporte = updateSoporte;
exports.deleteSoporte = deleteSoporte;
const soportes_1 = require("../entities/soportes");
const class_validator_1 = require("class-validator");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
function getAllSorportes(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const soportes = yield soportes_1.Soportes.find({
                relations: ["radicacionRelation"]
            });
            if (!soportes) {
                return res.status(404).json({ message: "No hay soportes registrados" });
            }
            return res.status(200).json(soportes);
        }
        catch (error) {
            next(error);
        }
    });
}
function getSoporteById(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const soporte = yield soportes_1.Soportes.findOne({
                where: { id: parseInt(id) },
                relations: ["radicacionRelation"]
            });
            if (!soporte) {
                return res.status(404).json({ message: "Soporte no encontrado" });
            }
            return res.status(200).json(soporte);
        }
        catch (error) {
            next(error);
        }
    });
}
function createSoporte(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const file = req.file;
            if (!file) {
                return res.status(400).json({ message: "El archivo es requerido" });
            }
            const soporteExists = yield soportes_1.Soportes.findOneBy({ name: file.originalname });
            if (soporteExists) {
                return res.status(409).json({ message: "El soporte ya existe" });
            }
            const fileNameWithoutExt = file ? path_1.default.basename(file.originalname, path_1.default.extname(file.originalname)) : '';
            const soporte = soportes_1.Soportes.create({
                name: fileNameWithoutExt === null || fileNameWithoutExt === void 0 ? void 0 : fileNameWithoutExt.normalize('NFC'),
                url: file === null || file === void 0 ? void 0 : file.path,
                size: file === null || file === void 0 ? void 0 : file.size,
                type: file === null || file === void 0 ? void 0 : file.mimetype,
                nameSaved: path_1.default.basename(file === null || file === void 0 ? void 0 : file.filename)
            });
            const errors = yield (0, class_validator_1.validate)(soporte);
            if (errors.length > 0) {
                const menssages = errors.map(err => ({
                    property: err.property,
                    constraints: err.constraints
                }));
                return res.status(400).json({ "message": "Error al validar los datos", menssages });
            }
            yield soporte.save();
            return res.status(201).json(soporte);
        }
        catch (error) {
            next(error);
        }
    });
}
function updateSoporte(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const { name, url } = req.body;
            const soporteExist = yield soportes_1.Soportes.findOneBy({ id: parseInt(id) });
            if (!soporteExist) {
                return res.status(404).json({ message: "Soporte no encontrado" });
            }
            soporteExist.name = name;
            soporteExist.url = url;
            const errors = yield (0, class_validator_1.validate)(soporteExist);
            if (errors.length > 0) {
                const messages = errors.map(err => ({
                    property: err.property,
                    constraints: err.constraints
                }));
                return res.status(400).json({ message: "Error al validar los datos", messages });
            }
            yield soporteExist.save();
            return res.status(200).json(soporteExist);
        }
        catch (error) {
            next(error);
        }
    });
}
function deleteSoporte(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const soporteExist = yield soportes_1.Soportes.findOneBy({ id: parseInt(id) });
            if (!soporteExist) {
                return res.status(404).json({ message: "Soporte no encontrado" });
            }
            const filePath = soporteExist.url;
            if (fs_1.default.existsSync(filePath)) {
                fs_1.default.unlinkSync(filePath);
            }
            yield soporteExist.remove();
            return res.status(200).json({ message: "Soporte eliminado" });
        }
        catch (error) {
            next(error);
        }
    });
}
