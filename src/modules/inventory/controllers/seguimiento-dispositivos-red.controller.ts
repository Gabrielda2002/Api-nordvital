import { NextFunction, Request, Response } from "express";
import { SeguimientoDispositivosRed } from "../entities/seguimiento-dispositivos-red";
import { NotFoundError } from "@core/utils/custom-errors";
import { validateEntity } from "@core/utils/validation-helper";

export async function getAllMonitoringDevicesNetwork(req: Request, res: Response, next: NextFunction){
    try {
        
        const data = await SeguimientoDispositivosRed.find()

        if (data.length === 0) {
            throw new NotFoundError("No data found");
        }

        return res.json(data)

    } catch (error) {
        next(error)
    }
}

export async function getMonitoringDevicesNetwork(req: Request, res: Response, next: NextFunction){
    try {
        const id = String(req.params.id)
        const data = await SeguimientoDispositivosRed.findOneBy({id: parseInt(String(id))})
        
        if (!data) {
            throw new NotFoundError("Data not found");
        }

        return res.json(data)

    }
    catch (error) {
        next(error)
    }
}

export async function createMonitoringDevicesNetwork(req: Request, res: Response, next: NextFunction){
    try {

        const { itemId, typeEvent, eventDate, description, managerId } = req.body

        const data = new SeguimientoDispositivosRed()
        data.deviceId = parseInt(String(itemId))
        data.eventType = typeEvent
        data.dateEvent = eventDate
        data.description = description
        data.responsible = parseInt(String(managerId))

        await validateEntity(data)

        await data.save()

        return res.json(data)

    } catch (error) {
        next(error)
    }
}

export async function updateMonitoringDevicesNetwork(req: Request, res: Response, next: NextFunction){
    try {
        const id = String(req.params.id)
        const { itemId, typeEvent, eventDate, description, managerId } = req.body

        const data = await SeguimientoDispositivosRed.findOneBy({id: parseInt(String(id))})

        if (!data) {
            throw new NotFoundError("Data not found");
        }

        data.deviceId = parseInt(String(itemId))
        data.eventType = typeEvent
        data.dateEvent = eventDate
        data.description = description
        data.responsible = parseInt(String(managerId))

        await validateEntity(data)

        await data.save()

        return res.json(data)

    }
    catch (error) {
        next(error)
    }
}

export async function deleteMonitoringDevicesNetwork(req: Request, res: Response, next: NextFunction){
    try {
        const id = String(req.params.id)
        const data = await SeguimientoDispositivosRed.findOneBy({id: parseInt(String(id))})

        if (!data) {
            throw new NotFoundError("Data not found");
        }

        await data.remove()

        return res.json({
            message: "Data deleted"
        })

    }
    catch (error) {
        next(error)
    }
}