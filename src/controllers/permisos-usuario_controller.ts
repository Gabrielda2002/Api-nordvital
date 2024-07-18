import { Request, Response } from "express";
import { PermisosUsuarios } from "../entities/permisos-usuario";
import { isExternal } from "util/types";

export async function getAllPermisosUsuarios(req: Request, res: Response){
    try {
        
        const permisosUsuarios = await PermisosUsuarios.find();
        res.json(permisosUsuarios);

    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({message: error.message});
        }
    }
}