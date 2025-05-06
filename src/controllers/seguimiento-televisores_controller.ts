import { NextFunction, Request, Response } from "express";
import { SeguimientoTelevisor } from "../entities/seguimiento-televisor";
import { validate } from "class-validator";

export async function createProcessTelevisor(req: Request, res: Response, next: NextFunction) {
    try {
        
        const {
            televisorId,
            eventDate,
            eventType,
            description,
            responsableId
        } = req.body;

        const newProcess = await SeguimientoTelevisor.create()
        newProcess.televisorId = parseInt(televisorId);
        newProcess.eventDate = eventDate;
        newProcess.eventType = eventType;
        newProcess.description = description;
        newProcess.responsable = parseInt(responsableId);

        const errors = await validate(newProcess);

        if (errors.length > 0)  {
            const errorMessages = errors?.map(err => ({
                property: err.property,
                constraints: err.constraints
            }));
            return res.status(400).json({
                message: "Error de validación",
                errors: errorMessages
            });
        }

        const savedProcess = await newProcess.save();

        return res.status(201).json({newProcess})

    } catch (error) {
        next(error);
    }
}