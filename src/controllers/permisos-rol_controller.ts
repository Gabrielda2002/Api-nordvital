import { NextFunction, Request, Response } from "express";
import { PermisosRol } from "../entities/permisos-rol";
import { validate } from "class-validator";

export async function getAllPermisosRol(req: Request, res: Response, next: NextFunction){
    try {
        
        const permisosRol = await PermisosRol.find({
            relations: ["rolRelation", "permisosRelation"]
        })
        res.json(permisosRol)

    } catch (error) {
        next(error);
    }
}

export async function getPermisosRolById(req: Request, res: Response, next: NextFunction){
    try {
        const { id } = req.params

        const permisosRol = await PermisosRol.findOne({
            where:{id: parseInt(id)} ,
            relations: ["rolRelation", "permisosRelation"]
        })

        if (!permisosRol){
            res.status(404).json({message: "PermisosRol not found"})
        }

        res.json(permisosRol)

    } catch (error) {
        next(error);
    }
}

export async function createPermisosRol(req: Request, res: Response, next: NextFunction){
    try {
        const { idRol, idPermisos } = req.body

        if (!idRol || !idPermisos){
            return res.status(400).json({message: "The fields idRol and idPermisos are required"})
        }

        const permisosRolExist = await PermisosRol.findOneBy({idRol, idPermisos})

        if (permisosRolExist){
            return res.status(400).json({message: "The PermisosRol already exists"})
            
        }

        const permisosRol = new PermisosRol()
        permisosRol.idRol = idRol
        permisosRol.idPermisos = idPermisos

        const errors = await validate(permisosRol)
        if (errors.length > 0){
            const messages = errors.map(err => ({
                property: err.property,
                constraints: err.constraints
            }))

            return res.status(400).json({message: "Error creating permisosRol", messages})
            
        }

        await permisosRol.save()

        res.json(permisosRol)

    } catch (error) {
     next(error)
    }
}

export async function updatePermisosRol(req: Request, res: Response, next: NextFunction){
    try {
        
        const { id } = req.params
        const { idRol, idPermisos } = req.body

        const permisosRol = await PermisosRol.findOneBy({id: parseInt(id)})

        if (!permisosRol){
            return res.status(404).json({message: "PermisosRol not found"})
        }

        permisosRol.idRol = idRol
        permisosRol.idPermisos = idPermisos

        const errors = await validate(permisosRol)

        if (errors.length > 0){
            const messages = errors.map(err => ({
                property: err.property,
                constraints: err.constraints
            }))

            return res.status(400).json({message: "Error updating permisosRol", messages})
        }

        await permisosRol.save()

        res.json(permisosRol)

    } catch (error) {
        next(error)
    }
}

export async function deletePermisosRol(req: Request, res: Response, next: NextFunction){
    try {
        
        const { id } = req.params

        const permisosRol = await PermisosRol.findOneBy({id: parseInt(id)})

        if (!permisosRol){
            return res.status(404).json({message: "PermisosRol not found"})
        }

        await permisosRol.remove()

        res.json({message: "PermisosRol deleted"})

    } catch (error) {
        next(error)
    }
}