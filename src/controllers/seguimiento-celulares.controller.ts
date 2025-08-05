import { NextFunction, Request, Response } from "express";
import { SeguimientoCelular } from "../entities/seguimiento-celular";
import { validate } from "class-validator";

export async function createProcessPhone(req: Request, res: Response, next: NextFunction) {
    try {
        
        const {
            itemId,
            eventDate,
            typeEvent,
            description,
            responsable
        } = req.body;

        const processPhone = new SeguimientoCelular();
        processPhone.phoneId = parseInt(itemId);
        processPhone.eventDate = new Date(eventDate);
        processPhone.eventType = typeEvent;
        processPhone.description = description;
        processPhone.responsable = parseInt(responsable);
        
        const errors = await validate(processPhone);
        if (errors.length > 0) {
            const errorMessages = errors.map(err => ({
                property: err.property,
                constraints: err.constraints
            }));
            return res.status(400).json({
                message: "Validation failed",
                errors: errorMessages
            });
        }

        const newProcessPhone = await processPhone.save();

        return res.status(201).json({ newProcessPhone });

    } catch (error) {
        next(error);
    }
}