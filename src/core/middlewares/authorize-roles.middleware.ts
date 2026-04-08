import { NextFunction, Request, Response } from "express";

console.log("roles autorizados");
export function authorizeRoles(roles: (string | number)[]) {

    return (req: Request, res: Response, next: NextFunction) => {
        console.log("roles autorizados", roles);
        const userRole = req.user?.rol;
        console.log("usuario autorizado rol", userRole);

        if (!userRole || !roles.map(String).includes(String(userRole))) {
            return res.status(403).json({ message: "No tienes permiso para acceder a este recurso." });
        }
        
        next();
    }
}
