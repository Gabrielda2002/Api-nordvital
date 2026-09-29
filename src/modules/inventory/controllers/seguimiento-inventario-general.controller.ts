import { NextFunction, Request, Response } from "express";
import { SeguimientoInventarioGeneral } from "../entities/seguimiento-inventario-general";
import { NotFoundError } from "@core/utils/custom-errors";
import { validateEntity } from "@core/utils/validation-helper";

export async function getAllInventoryTrackingGeneralByItem(req: Request, res: Response, next: NextFunction){
    try {
        
        const { id } = req.params;

        const seguimientoInventarioGeneral = await SeguimientoInventarioGeneral.createQueryBuilder("seguimiento")
            .leftJoinAndSelect("seguimiento.usuario", "usuario")
            .where("seguimiento.itemId = :id", { id: Number(id) })
            .orderBy("seguimiento.eventDate", "DESC")
            .getMany();

        if (seguimientoInventarioGeneral.length === 0) {
            throw new NotFoundError("No tracking records found");
        }

        return res.status(200).json(seguimientoInventarioGeneral);

    } catch (error) {
        next(error);
    }
}

// crear seguimiento inventario general
export async function createInventoryTrackingGeneral(req: Request, res: Response, next: NextFunction) {
    try {
        const { itemId, eventDate, typeEvent, description, managerId } = req.body;

        const seguimientoInventarioGeneral = new SeguimientoInventarioGeneral();
        seguimientoInventarioGeneral.itemId = parseInt(String(itemId));
        seguimientoInventarioGeneral.eventDate = eventDate;
        seguimientoInventarioGeneral.typeEvent = typeEvent;
        seguimientoInventarioGeneral.description = description;
        seguimientoInventarioGeneral.responsible = parseInt(String(managerId));

        await validateEntity(seguimientoInventarioGeneral);

        await seguimientoInventarioGeneral.save();

        res.status(201).json(seguimientoInventarioGeneral);
    } catch (error) {
        next(error);
    }
}