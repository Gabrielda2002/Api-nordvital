import { Request, Response } from "express";
import { PermisosRol } from "../entities/permisos-rol";

export async function getAllPermisosRol(req: Request, res: Response){
    try {
        
        const permisosRol = await PermisosRol.find()
        res.json(permisosRol)

    } catch (error) {
        if (error instanceof Error){
            res.status(500).json({error: error.message})
        }
    }
}