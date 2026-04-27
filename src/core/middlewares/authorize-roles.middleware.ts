import { NextFunction, Request, Response } from "express";

console.log("roles autorizados");
export function authorizeRoles(roles: readonly (string | number)[]) {

    return (req: Request, res: Response, next: NextFunction) => {
        const userRole = req.user?.rol;

        if (!userRole || !roles.map(String).includes(String(userRole))) {
            return res.status(403).json({ message: "No tienes permiso para acceder a este recurso." });
        }
        
        next();
    }
}
