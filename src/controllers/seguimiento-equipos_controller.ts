import { NextFunction, Request, Response } from "express";
import { seguimientoEquipos } from "../entities/seguimiento-equipos";
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
        const id = req.params.id
        const data = await seguimientoEquipos.findOneBy({id: parseInt(id)})

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

        const { equipmentId, eventDate, eventType, description, responsible } = req.body

        const data = new seguimientoEquipos()
        data.equipmentId = equipmentId
        data.eventDate = eventDate
        data.eventType = eventType
        data.description = description
        data.responsible = responsible

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

export async function updateFollowEquipment(req: Request, res: Response, next: NextFunction){
    try {
        const id = req.params.id
        const { equipmentId, eventDate, eventType, description, responsible } = req.body

        const data = await seguimientoEquipos.findOneBy({id: parseInt(id)})

        if (!data) {
            return res.status(404).json({
                message: "Dato no encontrado"
            })
        }

        data.equipmentId = equipmentId
        data.eventDate = eventDate
        data.eventType = eventType
        data.description = description
        data.responsible = responsible

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
        const id = req.params.id
        const data = await seguimientoEquipos.findOneBy({id: parseInt(id)})

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