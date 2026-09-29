import { NextFunction, Request, Response } from "express";
import { SeguimientoCelular } from "../entities/seguimiento-celular";
import { validateEntity } from "@core/utils/validation-helper";

export async function createProcessPhone(req: Request, res: Response, next: NextFunction) {
    try {
        
        const {
            itemId,
            eventDate,
            typeEvent,
            description,
            managerId
        } = req.body;

        const processPhone = new SeguimientoCelular();
        processPhone.phoneId = parseInt(String(itemId));
        processPhone.eventDate = new Date(eventDate);
        processPhone.eventType = typeEvent;
        processPhone.description = description;
        processPhone.responsible = parseInt(String(managerId));
        
        await validateEntity(processPhone);

        const newProcessPhone = await processPhone.save();

        return res.status(201).json({ newProcessPhone });

    } catch (error) {
        next(error);
    }
}