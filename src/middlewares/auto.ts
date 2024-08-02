import { NextFunction, Request, Response } from "express";

export function authorizeRoles( roles: string[]){
    return (req: Request, res: Response, next: NextFunction) =>{
        const user = (req as any).user;

        if (!user || !roles.includes(user.role)) {
            return res.sendStatus(403);
            
        }
        next();
    }
}