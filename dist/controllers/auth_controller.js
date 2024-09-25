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
exports.login = login;
const usuarios_1 = require("../entities/usuarios");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || 'secret-key';
function login(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { dniNumber, password } = req.body;
            console.log(dniNumber, password);
            // Buscar el usuario por dniNumber
            const user = yield usuarios_1.Usuarios.findOneBy({ dniNumber });
            const passwordMatch = yield bcrypt_1.default.compare(password, (user === null || user === void 0 ? void 0 : user.password) || '');
            // Validar el usuario y la contraseña
            if (!user || !passwordMatch) {
                return res.status(401).json({ message: "Usuario o contraseña incorrectos" });
            }
            // Generar el token JWT
            const token = jsonwebtoken_1.default.sign({ id: user.id, dniNumber: user.dniNumber, rol: user.rol }, JWT_SECRET, { expiresIn: '1h' });
            // Enviar el token al cliente
            res.json({ token, Municipio: user.municipio, rol: user.rol, user: {
                    id: user.id,
                    dniNumber: user.dniNumber,
                    email: user.email,
                    nombre: user.name,
                    apellido: user.lastName,
                    rol: user.rol,
                    date: user.date,
                    status: user.status,
                    photo: user.photo
                }, message: "Inicio de sesión exitoso" });
        }
        catch (error) {
            // Pasar el error al middleware de manejo de errores
            next(error);
        }
    });
}
