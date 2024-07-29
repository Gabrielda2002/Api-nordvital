import { NextFunction, Request, Response } from "express";
import { Roles } from "../entities/roles";
import { validate } from "class-validator";

export async function getAllRoles(req: Request, res: Response, next: NextFunction){
    try {
        
        const roles = await Roles.find();
        return res.json(roles);

    } catch (error) {
        next(error);
    }
}

export async function getRole(req: Request, res: Response, next: NextFunction){
    try {
        
        const { id } = req.params;

        const role = await Roles.findOneBy({id: parseInt(id)});

        if(!role){
            return res.status(404).json({message: 'roles no encontrados'});
        }

        return res.json(role);

    } catch (error) {
        next(error);
    }
}

export async function createRole(req: Request, res: Response, next: NextFunction){
    try {
        
        const { name } = req.body;

        const roleExist = await Roles.findOneBy({name});

        if (roleExist) {
            return res.status(400).json({message: 'El rol ya existe'});
        }

        const roles = new Roles();
        roles.name = name;

        const errors = await validate(roles);

        if (errors.length > 0) {
            const errorsMessage = errors.map(error => ({
                property : error.property,
                constraints: error.constraints
            }))

            return res.status(400).json({message: 'Error creando rol', errorsMessage});
        }

        await roles.save();

        return res.json(roles);

    } catch (error) {
        next(error);
    }
}

export async function updateRole(req: Request, res: Response, next: NextFunction){
    try {
        
        const { id } = req.params;

        const { name } = req.body;

        const rolExist = await Roles.findOneBy({id: parseInt(id)});

        if (!rolExist) {
            return res.status(404).json({message: 'Rol no encontrado'});
        }

        rolExist.name = name;

        const errors = await validate(rolExist);

        if (errors.length > 0) {
            const errorsMessage = errors.map(error => ({
                property : error.property,
                constraints: error.constraints
            }))

            return res.status(400).json({message: 'Error actualizando rol', errorsMessage});
        }

        await rolExist.save();

        return res.json(rolExist);

    } catch (error) {
        next(error);
    }
}

export async function deleteRole(req: Request, res: Response, next: NextFunction){
    try {
        
        const { id } = req.params;

        const rolExist = await Roles.findOneBy({id: parseInt(id)});

        if (!rolExist) {
            return res.status(404).json({message: 'Rol no encontrado'});
        }

        await rolExist.remove();

        return res.json({message: 'Rol eliminado'});

    } catch (error) {
        next(error);
    }
}