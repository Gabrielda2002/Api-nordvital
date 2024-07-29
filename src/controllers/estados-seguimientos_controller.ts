import { NextFunction, Request, Response } from "express";
import { EstadosSeguimiento } from "../entities/estados-seguimiento";
import { validate, Validator } from "class-validator";

export async function getEstadosSeguimientos(req: Request, res: Response, next: NextFunction){
    try {
        
        const estadosSeguimientos = await EstadosSeguimiento.find();
        return res.json(estadosSeguimientos);

    } catch (error) {
        next(error);
    }
}

export async function getEstadosSeguimiento(req: Request, res: Response, next: NextFunction){
    try {
        
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({message: "Id is required"});
        }

        const estadoSeguimiento = await EstadosSeguimiento.findOneBy({id: parseInt(id)});

        if (!estadoSeguimiento) {
            return res.status(404).json({message: "Estado de seguimiento not found"});
        }

        return res.json(estadoSeguimiento);

    } catch (error) {
        next(error);
    }
}

export async function createEstadosSeguimiento(req: Request, res: Response, next: NextFunction){
    try {
        
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({message: "Name and status are required"});
        }

        const estadoSeguimientoExist = await EstadosSeguimiento.findOneBy({name});

        if (estadoSeguimientoExist) {
            return res.status(400).json({message: "Estado de seguimiento already exists"});
        }

        const estadoSeguimiento = new EstadosSeguimiento();
        estadoSeguimiento.name = name;
        estadoSeguimiento.status = true;

        const errors = await validate(estadoSeguimiento);

        if (errors.length > 0) {

            const errorsMessage = errors.map(err => ({
                property: err.property,
                constraints: err.constraints
            }));

            return res.status(400).json({message: "Error creating estado de seguimiento", errors: errorsMessage});

        }

        await estadoSeguimiento.save();

        return res.json(estadoSeguimiento);

    } catch (error) {
        next(error);
    }
}

export async function updateEstadosSeguimiento(req: Request, res: Response, next: NextFunction){
    try {
        
        const { id } = req.params;
        
        if (!id) {
            return res.status(400).json({message: "Id is required"});
        }
        
        const { name, status } = req.body;
        
        if (!name || !status) {

            return res.status(400).json({message: "Name and status are required"});
        }

        const estadoSeguimiento = await EstadosSeguimiento.findOneBy({id: parseInt(id)});
        if (!estadoSeguimiento) {
            return res.status(404).json({message: "Estado de seguimiento not found"});
        }

        estadoSeguimiento.name = name;
        estadoSeguimiento.status = status;

        const errors = await validate(estadoSeguimiento);
        if (errors.length > 0) {
            const errorsMessage = errors.map(err => ({
                property: err.property,
                constraints: err.constraints
            }));

            return res.status(400).json({message: "Error updating estado de seguimiento", errors: errorsMessage});
        }

        await estadoSeguimiento.save();

        return res.json(estadoSeguimiento);

    } catch (error) {
        next(error);
    }
}

export async function deleteEstadosSeguimiento(req: Request, res: Response, next: NextFunction){
    try {
        
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({message: "Id is required"});
        }

        const estadoSeguimiento = await EstadosSeguimiento.findOneBy({id: parseInt(id)});

        if (!estadoSeguimiento) {
            return res.status(404).json({message: "Estado de seguimiento not found"});
        }

        await estadoSeguimiento.remove();

        return res.json({message: "Estado de seguimiento deleted"});

    } catch (error) {
        next(error);
    }
}