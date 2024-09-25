"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = authenticate;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || 'secret-key';
// * Middleware para autenticar a los usuarios
function authenticate(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ message: "No se ha proporcionado el encabezado de autorizacion." });
    }
    const token = authHeader.substring(7);
    if (!token) {
        return res.status(401).json({ message: "Token no proporcionado." });
    }
    jsonwebtoken_1.default.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "Token inválido o expirado." });
        }
        if (decoded) {
            req.user = decoded;
            console.log("Usuario autenticado: ", req.user);
            return next(); // Asegúrate de que next() esté dentro del bloque if para el caso exitoso
        }
        res.status(403).json({ message: "Token no válido." });
    });
}
