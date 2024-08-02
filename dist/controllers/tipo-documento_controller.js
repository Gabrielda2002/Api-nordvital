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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDocumentType = exports.updateDocumentType = exports.createDocumentType = exports.getDocumentTypeById = exports.getAllDocumentType = void 0;
const tipo_documento_1 = require("../entities/tipo-documento");
const class_validator_1 = require("class-validator");
function getAllDocumentType(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const documentType = yield tipo_documento_1.TipoDocumento.find();
            return res.json(documentType);
        }
        catch (error) {
            next(error);
        }
    });
}
exports.getAllDocumentType = getAllDocumentType;
function getDocumentTypeById(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const documentType = yield tipo_documento_1.TipoDocumento.findOneBy({ id: parseInt(id) });
            if (!documentType) {
                return res.status(404).json({ message: "Tipo de documento no encontrado" });
            }
            return res.json(documentType);
        }
        catch (error) {
            next(error);
        }
    });
}
exports.getDocumentTypeById = getDocumentTypeById;
function createDocumentType(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { name } = req.body;
            const documentTypeExist = yield tipo_documento_1.TipoDocumento.findOneBy({ name });
            if (documentTypeExist) {
                return res.status(409).json({ message: "Tipo de documento ya existe" });
            }
            const documentType = new tipo_documento_1.TipoDocumento();
            documentType.name = name;
            documentType.status = true;
            const errors = yield (0, class_validator_1.validate)(documentType);
            if (errors.length > 0) {
                const errorsMessage = errors.map(err => ({
                    property: err.property,
                    constraints: err.constraints
                }));
                return res.status(400).json({ "message": "Ocurrio un error", errorsMessage });
            }
            yield documentType.save();
            return res.json(documentType);
        }
        catch (error) {
            next(error);
        }
    });
}
exports.createDocumentType = createDocumentType;
function updateDocumentType(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const { name, status } = req.body;
            const documentType = yield tipo_documento_1.TipoDocumento.findOneBy({ id: parseInt(id) });
            if (!documentType) {
                return res.status(404).json({ message: "Tipo de documento no encontrado" });
            }
            documentType.name = name;
            documentType.status = status;
            const errors = yield (0, class_validator_1.validate)(documentType);
            if (errors.length > 0) {
                const errorsMessage = errors.map(err => ({
                    property: err.property,
                    constraints: err.constraints
                }));
                return res.status(400).json({ "message": "Ocurrio un error", errorsMessage });
            }
            yield documentType.save();
            return res.json(documentType);
        }
        catch (error) {
            next(error);
        }
    });
}
exports.updateDocumentType = updateDocumentType;
function deleteDocumentType(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const documentType = yield tipo_documento_1.TipoDocumento.findOneBy({ id: parseInt(id) });
            if (!documentType) {
                return res.status(404).json({ message: "Tipo de documento no encontrado" });
            }
            yield documentType.remove();
            return res.json({ message: "Tipo de documento eliminado" });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.deleteDocumentType = deleteDocumentType;
