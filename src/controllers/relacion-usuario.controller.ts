import { NextFunction, Request, Response } from "express";
import { RelacionUsuario } from "../entities/relacion-usuario";

export const getAllRelationUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        
        const relationUser = await RelacionUsuario.find();
        
        if (relationUser.length === 0) {
            return res.status(404).json({ message: "Relation User not found" });
        }

        res.status(200).json(relationUser);
        
    } catch (error) {
        next(error);
    }
}

export const getRelationUserByName = async (req: Request, res: Response, next: NextFunction) => {
    try {
        
        const { name } = req.body;

        let relationUser;
        if (name === "@") {
            relationUser = await RelacionUsuario.createQueryBuilder("relation_user")
            .limit(100)
            .getMany();
            
        }else {
            relationUser = await RelacionUsuario.createQueryBuilder("relation_user")
            .where("relation_user.name LIKE :name", { name: `%${name}%` })
            .getMany();
        }

        if (relationUser.length === 0) {
            return res.status(404).json({ message: "Relation User not found" });
        }

        res.status(200).json(relationUser);

    } catch (error) {
        next(error);
    }
}