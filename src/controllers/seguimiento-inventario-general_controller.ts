import { NextFunction, Request, Response } from "express";
import { SeguimientoInventarioGeneral } from "../entities/seguimiento-inventario-general";
import { validate } from "class-validator";

export async function getAllInventoryTrackingGeneralByItem(req: Request, res: Response, next: NextFunction){
    try {
        
        const { id } = req.params;

        const seguimientoInventarioGeneral = await SeguimientoInventarioGeneral.createQueryBuilder("seguimiento")
            .leftJoinAndSelect("seguimiento.usuario", "usuario")
            .where("seguimiento.itemId = :id", { id: Number(id) })
            .orderBy("seguimiento.fecha_evento", "DESC")
            .getMany();

        if (seguimientoInventarioGeneral.length === 0) {
            return res.status(404).json({ message: "No se encontraron registros." });
        }

        res.status(200).json(seguimientoInventarioGeneral);

    } catch (error) {
        next(error);
    }
}

// crear seguimiento inventario general
export async function createInventoryTrackingGeneral(req: Request, res: Response, next: NextFunction) {
    try {
        const { itemId, eventDate, typeEvent, description, responsable } = req.body;

        const seguimientoInventarioGeneral = new SeguimientoInventarioGeneral();
        seguimientoInventarioGeneral.itemId = parseInt(itemId);
        seguimientoInventarioGeneral.fecha_evento = eventDate;
        seguimientoInventarioGeneral.typeEvent = typeEvent;
        seguimientoInventarioGeneral.description = description;
        seguimientoInventarioGeneral.responsable = parseInt(responsable);

        const errors = await validate(seguimientoInventarioGeneral);
        if (errors.length > 0) {
            const errorMessages = errors.map((error) => ({
                property: error.property,
                constraints: error.constraints,
            }));
            return res.status(400).json({ message: "Validation failed", errors: errorMessages });
        }

        await seguimientoInventarioGeneral.save();

        res.status(201).json(seguimientoInventarioGeneral);
    } catch (error) {
        next(error);
    }
}