import { Request, Response } from "express";
import { Roles } from "../entities/roles";

export async function getAllRoles(req: Request, res: Response){
    try {
        
        const roles = await Roles.find();
        return res.json(roles);

    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }
    }
}