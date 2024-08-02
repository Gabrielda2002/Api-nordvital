import { NextFunction, Request, Response } from "express";

export function authorizeRoles(roles: string[]) {
    return (req: Request, res: Response, next: NextFunction) => {
        const userRole = req.user?.rol;

        if (!roles.includes(userRole as string)) {
            return res.status(403).json({ message: "No tienes permiso para acceder a este recurso." });
        }
        next();
    }
}
