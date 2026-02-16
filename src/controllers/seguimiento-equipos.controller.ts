import { NextFunction, Request, Response } from "express";
import { seguimientoEquipos } from "../entities/seguimiento-equipos";
import { MaintenanceChecklistItem } from "../entities/maintenance-checklist-item";
import { MaintenanceChecklistResult } from "../entities/maintenance-checklist-result";
import { validate } from "class-validator";

export async function getAllFollowEquipment(req: Request, res: Response, next: NextFunction){
    try {
        
        const data = await seguimientoEquipos.find()

        if (data.length < 0)  {
            return res.status(404).json({
                message: "No se encontraron datos"
            })
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
            return res.status(404).json({
                message: "Dato no encontrado"
            })
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

        const errors = await validate(data)

        if (errors.length > 0) {
            const message = errors.map(err => (
                Object.values(err.constraints || {}).join(", ")
            ))
            return res.status(400).json({message})
        }

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
        const { equipmentId, eventDate, eventType, description, responsible } = req.body

        const data = await seguimientoEquipos.findOneBy({id: parseInt(String(id))})

        if (!data) {
            return res.status(404).json({
                message: "Dato no encontrado"
            })
        }

        data.equipmentId = parseInt(String(equipmentId))
        data.eventDate = eventDate
        data.eventType = eventType
        data.description = description
        data.responsible = parseInt(String(responsible))

        const errors = await validate(data)

        if (errors.length > 0) {
            const message = errors.map((err) => ({
                property: err.property,
                constraints: err.constraints
            }))
            return res.status(400).json({message})
        }

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
            return res.status(404).json({
                message: "Dato no encontrado"
            })
        }

        await data.remove()

        return res.json({
            message: "Dato eliminado"
        })
    } catch (error) {
        next(error)
    }
}