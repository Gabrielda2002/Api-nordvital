import e, { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload, VerifyErrors } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || 'secret-key';

// * Middleware para autenticar a los usuarios

export function authenticate(req: Request, res: Response, next: NextFunction) {
    try {
    const authHeader = req.headers['authorization'];

    // console.log(authHeader);

    if (!authHeader) {
        return res.status(401).json({ message: "No se ha proporcionado el encabezado de autorizacion." });
    }

    const token = authHeader.substring(7);

    console.log(token);

    if (!token) {
        return res.status(401).json({ message: "Token no proporcionado." });
    }

        
        jwt.verify(token, JWT_SECRET, (err: VerifyErrors | null, decoded: string | JwtPayload | undefined) => {
            // if (err) {
            //     return res.status(403).json({ message: "Token inválido o expirado." });
            // }
            
            if (decoded) {
                //@ts-ignore
                req.user = decoded as JwtPayload & { rol: string };
            }
            next();
    
        });
    } catch (error) {
        console.log(error);
    }
}
