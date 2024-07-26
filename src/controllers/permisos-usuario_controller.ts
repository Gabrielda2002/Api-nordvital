import { NextFunction, Request, Response } from "express";
import { PermisosUsuarios } from "../entities/permisos-usuario";
import { isExternal } from "util/types";
import { validate } from "class-validator";

export async function getAllPermisosUsuarios(req: Request, res: Response, next: NextFunction) {
    try {
        
        const permisosUsuarios = await PermisosUsuarios.find();
        res.json(permisosUsuarios);

    } catch (error) {
        next(error);
    }
}

export async function getPermisoUsuario(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;

        const permisoUsuario = await PermisosUsuarios.findOneBy({ id: parseInt(id) });

        if (!permisoUsuario) {
            return res.status(404).json({ message: "PermisoUsuario not found" });
        }

        return res.json(permisoUsuario);
    } catch (error) {
        next(error);
    }
}

export async function createPermisoUsuario(req: Request, res: Response, next: NextFunction) {
    try {
        const { idUser, idPermiso } = req.body;

        const permisoUsuarioExist = await PermisosUsuarios.findOneBy({ idUser, idPermiso });

        if (permisoUsuarioExist) {
            return res.status(400).json({ message: "PermisoUsuario already exists" });
        }

        const permisoUsuario = new PermisosUsuarios();
        permisoUsuario.idUser = idUser;
        permisoUsuario.idPermiso = idPermiso;

        const errors = await validate(permisoUsuario);

        if (errors.length > 0) {
            const messages = errors.map(err => ({
                property: err.property,
                constraints: err.constraints
            }))

            return res.status(400).json({ message: "Error creating permiso usuario", messages });
        }

        await permisoUsuario.save();

        return res.json(permisoUsuario);
    } catch (error) {
        next(error);
    }
}

export async function updatePermisoUsuario(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const { idUser, idPermiso } = req.body;

        const permisoUsuario = await PermisosUsuarios.findOneBy({ id: parseInt(id) });

        if (!permisoUsuario) {
            return res.status(404).json({ message: "PermisoUsuario not found" });
        }

        permisoUsuario.idUser = idUser;
        permisoUsuario.idPermiso = idPermiso;

        const errors = await validate(permisoUsuario);

        if (errors.length > 0) {
            const messages = errors.map(err => ({
                property: err.property,
                constraints: err.constraints
            }))

            return res.status(400).json({ message: "Error updating permiso usuario", messages });

        }

        await permisoUsuario.save();

        return res.json(permisoUsuario);
    } catch (error) {
        
    }
}

export async function deletePermisoUsuario(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;

        const permisoUsuario = await PermisosUsuarios.findOneBy({ id: parseInt(id) });

        if (!permisoUsuario) {
            return res.status(404).json({ message: "PermisoUsuario not found" });
        }

        await permisoUsuario.remove();

        return res.json({ message: "PermisoUsuario deleted" });

    } catch (error) {
        next(error);
    }
}