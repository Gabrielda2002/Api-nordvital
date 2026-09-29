import { NextFunction, Request, Response } from "express";
import { seguimientoEquipos } from "../entities/seguimiento-equipos";
import { MaintenanceChecklistItem } from "../entities/maintenance-checklist-item";
import { MaintenanceChecklistResult } from "../entities/maintenance-checklist-result";
import { NotFoundError } from "@core/utils/custom-errors";
import { validateEntity } from "@core/utils/validation-helper";

export async function getAllFollowEquipment(req: Request, res: Response, next: NextFunction){
    try {
        
        const data = await seguimientoEquipos.find()

        if (data.length === 0) {
            throw new NotFoundError("No data found");
        }

        return res.json(data)
            
    } catch (error) {
        next(error)
        
    }
}

export async function getFollowEquipment(req: Request, res: Response, next: NextFunction){
    try {
        const id = String(req.params.id)
        const data = await seguimientoEquipos.findOne({
            where: { id: parseInt(String(id)) },
            relations: ["checklistResults", "checklistResults.checklistItemRelation"]
        })

        if (!data) {
            throw new NotFoundError("Data not found");
        }

        return res.json(data)
    } catch (error) {
        next(error)
    }
}

export async function createFollowEquipment(req: Request, res: Response, next: NextFunction){
    try {

        const { itemId, eventDate, typeEvent, description, managerId } = req.body

        const data = new seguimientoEquipos()
        data.equipmentId = parseInt(String(itemId))
        data.eventDate = eventDate
        data.eventType = typeEvent
        data.description = description
        data.responsible = parseInt(String(managerId))

        await validateEntity(data);

        await data.save()

        // Si es mantenimiento preventivo, crear automáticamente los items del checklist
        if (typeEvent === "MANTENIMIENTO PREVENTIVO") {
            const checklistItems = await MaintenanceChecklistItem.find({
                where: { isActive: true },
                order: { displayOrder: "ASC" }
            });

            // Crear un registro de resultado para cada ítem del checklist
            for (const item of checklistItems) {
                const result = new MaintenanceChecklistResult();
                result.seguimientoEquipoId = data.id;
                result.checklistItemId = item.id;
                result.isChecked = false;
                result.checkedAt = null;
                await result.save();
            }
        }

        return res.json(data)
    } catch (error) {
        next(error)
    }
}

export async function updateFollowEquipment(req: Request, res: Response, next: NextFunction){
    try {
        const id = String(req.params.id)
        const { itemId, eventDate, typeEvent, description, managerId } = req.body

        const data = await seguimientoEquipos.findOneBy({id: parseInt(String(id))})

        if (!data) {
            throw new NotFoundError("Data not found");
        }

        data.equipmentId = parseInt(String(itemId))
        data.eventDate = eventDate
        data.eventType = typeEvent
        data.description = description
        data.responsible = parseInt(String(managerId))

        await validateEntity(data);

        await data.save()

        return res.json(data)
    } catch (error) {
        next(error)
    }
}

export async function deleteFollowEquipment(req: Request, res: Response, next: NextFunction){
    try {
        const id = String(req.params.id)
        const data = await seguimientoEquipos.findOneBy({id: parseInt(String(id))})

        if (!data) {
            throw new NotFoundError("Data not found");
        }

        await data.remove()

        return res.json({
            message: "Dato eliminado"
        })
    } catch (error) {
        next(error)
    }
}