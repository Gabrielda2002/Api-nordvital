import { Request, Response } from "express";
import { Usuarios } from "../entities/usuarios";

export async function getAllUsuarios(req: Request, res: Response){
    try {
        
        const usuarios = await Usuarios.find();
        return res.json(usuarios);

    } catch (error) {
        if (error instanceof Error) {
            console.log(error.message);
            res.status(500).json({message: "Internal Server Error"});
            
        }
    }
}