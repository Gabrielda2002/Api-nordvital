import { NextFunction, Request, Response } from "express";
import { Servicios } from "../entities/servicios";
import exp from "constants";
import { validate } from "class-validator";

export async function getAllServicios(req: Request, res: Response, next: NextFunction){
    try {
        
        const servicios = await Servicios.find();
        return res.json(servicios);

    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
            
        }
        
    }
}

export async function getServicioById(req: Request, res: Response, next: NextFunction){
    try {
        
        const { id } = req.params;

        const servicio = await Servicios.findOneBy({id: parseInt(id)});

        if (!servicio) {
            return res.status(404).json({ message: "Servicio no encontrado" });
            
        }

        return res.json(servicio);

    } catch (error) {
        next(error);
    }
}

export async function createServicio(req: Request, res: Response, next: NextFunction){
    try {
        
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ message: "El nombre y el estado del servicio son requeridos" });
            
        }

        const servicio = new Servicios();
        servicio.name = name;
        servicio.status = true;

        const errors = await validate(servicio);

        if (errors.length > 0) {
            const message = errors.map(err => ({
                property: err.property,
                constraints: err.constraints
            }))
            return res.status(400).json({ "messages": "ocurrio un error" , message });
        }

        await servicio.save();

        return res.status(201).json(servicio);

    } catch(error) {
        next(error);
    }
}

export async function updateServicio(req: Request, res: Response, next: NextFunction){
    try {
        
        const { id } = req.params;
        const { name, status } = req.body;

        const servicio = await Servicios.findOneBy({id: parseInt(id)});

        if (!servicio) {
            return res.status(404).json({ message: "Servicio no encontrado" });
            
        }

            servicio.name = name;
            servicio.status = status;

        const errors = await validate(servicio);

        if (errors.length > 0) {
            const message = errors.map(err => ({
                property: err.property,
                constraints: err.constraints
            }))
            return res.status(400).json({ "messages": "ocurrio un error" , message });
        }

        await servicio.save();

        return res.json(servicio);

    } catch (error) {
        next(error);
    }
}

export async function deleteServicio(req: Request, res: Response, next: NextFunction){
    try {
        
        const { id } = req.params;

        const servicio = await Servicios.findOneBy({id: parseInt(id)});

        if (!servicio) {
            return res.status(404).json({ message: "Servicio no encontrado" });
            
        }

        await servicio.remove();

        return res.json({ message: "Servicio eliminado" });

    } catch (error) {
        next(error);
    }
}

export async function getServiciosByName(req: Request, res: Response, next: NextFunction){
    try {
        
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ message: "El nombre del servicio es requerido" });
            
        }

        const servicios = await Servicios.createQueryBuilder("servicios")
        .where("servicios.name LIKE :name", { name: `%${name}%` })
        .getMany();

        return res.json(servicios);

    } catch (error) {
        next(error);
    }
}

// actualizar el estado de servicio

export async function updateStatusServicio(req: Request, res: Response, next: NextFunction){
    try {
        
        const { id } = req.params;
        const { status, name } = req.body;

        const servicio = await Servicios.findOneBy({id: parseInt(id)});

        if (!servicio) {
            return res.status(404).json({ message: "Servicio no encontrado" });
            
        }

        if (name) {
            servicio.name = name;
        }

        if (status !== undefined && status !== "") {
            servicio.status = status == "1";
        }

        const errors = await validate(servicio);

        if (errors.length > 0) {
            const message = errors.map(err => ({
                property: err.property,
                constraints: err.constraints
            }))
            return res.status(400).json({ "messages": "ocurrio un error" , message });
        }

        await servicio.save();

        return res.json(servicio);

    } catch (error) {
        next(error);
    }
}