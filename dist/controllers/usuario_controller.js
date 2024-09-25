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
exports.getAllUsuarios = getAllUsuarios;
exports.getUsuario = getUsuario;
exports.createUsuario = createUsuario;
exports.updateUsuario = updateUsuario;
exports.deleteUsuario = deleteUsuario;
exports.uploadPhoto = uploadPhoto;
exports.deletePhoto = deletePhoto;
exports.getUsuariosTable = getUsuariosTable;
const usuarios_1 = require("../entities/usuarios");
const class_validator_1 = require("class-validator");
const bcrypt_1 = __importDefault(require("bcrypt"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
function getAllUsuarios(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const usuarios = yield usuarios_1.Usuarios.find({
                relations: ["rolesRelation", "municipioRelation", "typeDocumentRelation"],
            });
            return res.json(usuarios);
        }
        catch (error) {
            next(error);
        }
    });
}
function getUsuario(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const usuario = yield usuarios_1.Usuarios.findOne({
                where: { id: parseInt(id) },
                relations: ["rolesRelation", "municipioRelation", "typeDocumentRelation"],
            });
            if (!usuario) {
                return res.status(404).json({ message: "Usuario no encontrado" });
            }
            return res.json(usuario);
        }
        catch (error) {
            next(error);
        }
    });
}
function createUsuario(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { dniNumber, name, lastName, dniType, email, password, date, municipio, rol, } = req.body;
            const usuario = new usuarios_1.Usuarios();
            usuario.dniNumber = dniNumber;
            usuario.name = name;
            usuario.lastName = lastName;
            usuario.dniType = dniType;
            usuario.email = email;
            const saltRounds = 10;
            usuario.password = yield bcrypt_1.default.hash(password, saltRounds);
            usuario.date = date;
            usuario.status = true;
            usuario.municipio = municipio;
            usuario.rol = rol;
            const errors = yield (0, class_validator_1.validate)(usuario);
            if (errors.length > 0) {
                const messageError = errors.map((error) => ({
                    property: error.property,
                    constraints: error.constraints
                }));
                return res.status(400).json({ "message": "Ocurrio un error: ", messageError });
            }
            yield usuario.save();
            return res.json(usuario);
        }
        catch (error) {
            next(error);
        }
    });
}
function updateUsuario(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const { dniNumber, name, lastName, dniType, email, password, date, status, municipio, rol, } = req.body;
            const usuario = yield usuarios_1.Usuarios.findOneBy({ id: parseInt(id) });
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
                usuario.password = yield bcrypt_1.default.hash(password, saltRounds);
            }
            usuario.date = date;
            usuario.status = status;
            usuario.municipio = municipio;
            usuario.rol = rol;
            const errors = yield (0, class_validator_1.validate)(usuario);
            if (errors.length > 0) {
                const messageError = errors.map((error) => ({
                    property: error.property,
                    constraints: error.constraints
                }));
                return res.status(400).json({ "message": "Ocurrio un error: ", messageError });
            }
            yield usuario.save();
            return res.json(usuario);
        }
        catch (error) {
            next(error);
        }
    });
}
function deleteUsuario(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const usuario = yield usuarios_1.Usuarios.findOneBy({ id: parseInt(id) });
            if (!usuario) {
                return res.status(404).json({ message: "Usuario no encontrado" });
            }
            yield usuario.remove();
            return res.json({ message: "Usuario eliminado" });
        }
        catch (error) {
            next(error);
        }
    });
}
// * funcion para subir la foto de perfil del usuario
function uploadPhoto(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const file = req.file;
            const { id } = req.params;
            const usuario = yield usuarios_1.Usuarios.findOneBy({ id: parseInt(id) });
            if (!usuario) {
                return res.status(404).json({ message: "Usuario no encontrado" });
            }
            if (file) {
                const relativePath = file.path.replace(/^.*[\\\/]/, ""); // obtener el nombre del archivo
                usuario.photo = `uploads/FotosPerfil/${relativePath}`;
                yield usuario.save();
            }
            return res.json(usuario);
        }
        catch (error) {
            next(error);
        }
    });
}
// * eliminar la foto de perfil del usuario
function deletePhoto(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            // Busca el usuario en la base de datos
            const usuario = yield usuarios_1.Usuarios.findOneBy({ id: parseInt(id) });
            if (!usuario) {
                return res.status(404).json({ message: "Usuario no encontrado" });
            }
            // Obtén la ruta de la foto de perfil
            const filePath = path_1.default.join(__dirname, '..', usuario.photo); // Ajusta según la estructura de tu proyecto
            // Verifica si el archivo existe antes de intentar eliminarlo
            if (fs_1.default.existsSync(filePath)) {
                fs_1.default.unlinkSync(filePath);
            }
            else {
                return res.status(404).json({ message: "Foto de perfil no encontrada" });
            }
            // Actualiza el campo 'photo' en la base de datos
            usuario.photo = "";
            yield usuario.save();
            return res.json({ message: "Foto de perfil eliminada" });
        }
        catch (error) {
            next(error);
        }
    });
}
function getUsuariosTable(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const usuariosData = yield usuarios_1.Usuarios.createQueryBuilder("usuarios")
                .leftJoinAndSelect("usuarios.typeDocumentRelation", "documento")
                .leftJoinAndSelect("usuarios.rolesRelation", "roles")
                .leftJoinAndSelect("usuarios.municipioRelation", "municipio")
                .getMany();
            const usuarios = usuariosData.map((usuario) => {
                var _a, _b, _c;
                return ({
                    id: usuario.id,
                    dniNumber: usuario.dniNumber,
                    name: usuario.name,
                    lastName: usuario.lastName,
                    email: usuario.email,
                    status: usuario.status,
                    createdAt: usuario.createdAt,
                    updatedAt: usuario.updatedAt,
                    documento: (_a = usuario.typeDocumentRelation) === null || _a === void 0 ? void 0 : _a.name,
                    roles: (_b = usuario.rolesRelation) === null || _b === void 0 ? void 0 : _b.name,
                    municipio: (_c = usuario.municipioRelation) === null || _c === void 0 ? void 0 : _c.name,
                });
            });
            return res.json(usuarios);
        }
        catch (error) {
            next(error);
        }
    });
}
