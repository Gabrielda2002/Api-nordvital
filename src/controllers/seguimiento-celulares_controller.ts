import { NextFunction, Request, Response } from "express";
import { SeguimientoCelular } from "../entities/seguimiento-celular";
import { validate } from "class-validator";

export async function createProcessPhone(req: Request, res: Response, next: NextFunction) {
    try {
        
        const {
            phoneId,
            eventDate,
            eventType,
            description,
            responsableId
        } = req.body;

        const processPhone = new SeguimientoCelular();
        processPhone.phoneId = parseInt(phoneId);
        processPhone.eventDate = new Date(eventDate);
        processPhone.eventType = eventType;
        processPhone.description = description;
        processPhone.responsable = parseInt(responsableId);
        
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