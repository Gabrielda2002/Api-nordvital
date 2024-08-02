import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload, VerifyErrors } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || 'secret-key';

// * Middleware para autenticar a los usuarios
export function authenticate(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(401).json({ message: "No se ha proporcionado el encabezado de autorizacion." });
    }

    const token = authHeader.substring(7);

    if (!token) {
        return res.status(401).json({ message: "Token no proporcionado." });
    }

    jwt.verify(token, JWT_SECRET, (err: VerifyErrors | null, decoded: string | JwtPayload | undefined) => {
        if (err) {
            return res.status(403).json({ message: "Token inválido o expirado." });
        }
        
        if (decoded) {
            req.user = decoded as JwtPayload & { rol: string | number };
            console.log("Usuario autenticado: ", req.user);
            return next(); // Asegúrate de que next() esté dentro del bloque if para el caso exitoso
        }

        res.status(403).json({ message: "Token no válido." });
    });
}
