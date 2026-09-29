import { NextFunction, Request, Response } from "express";
import { SeguimientoTelevisor } from "../entities/seguimiento-televisor";
import { validateEntity } from "@core/utils/validation-helper";

export async function createProcessTelevisor(req: Request, res: Response, next: NextFunction) {
    try {
        
        const {
            itemId,
            eventDate,
            typeEvent,
            description,
            managerId
        } = req.body;;

        const newProcess = await SeguimientoTelevisor.create()
        newProcess.televisorId = parseInt(String(itemId));
        newProcess.eventDate = eventDate;
        newProcess.eventType = typeEvent;
        newProcess.description = description;
        newProcess.responsible = parseInt(String(managerId));

        await validateEntity(newProcess);

        const savedProcess = await newProcess.save();

        return res.status(201).json({newProcess})

    } catch (error) {
        next(error);
    }
}