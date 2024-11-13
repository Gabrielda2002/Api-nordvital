import { NextFunction, Request, Response } from "express";
import { SeguimientoDispositivosRed } from "../entities/seguimiento-dispositivos-red";
import { validate } from "class-validator";

export async function getAllMonitoringDevicesNetwork(req: Request, res: Response, next: NextFunction){
    try {
        
        const data = await SeguimientoDispositivosRed.find()

        if (data.length < 0)  {
            return res.status(404).json({
                message: "No data found"
            })
        }

        return res.json(data)

    } catch (error) {
        next(error)
    }
}

export async function getMonitoringDevicesNetwork(req: Request, res: Response, next: NextFunction){
    try {
        const id = req.params.id
        const data = await SeguimientoDispositivosRed.findOneBy({id: parseInt(id)})
        
        if (!data) {
            return res.status(404).json({
                message: "Data not found"
            })
        }

        return res.json(data)

    }
    catch (error) {
        next(error)
    }
}

export async function createMonitoringDevicesNetwork(req: Request, res: Response, next: NextFunction){
    try {

        const { deviceId, eventType, description, responsible } = req.body

        const data = new SeguimientoDispositivosRed()
        data.deviceId = parseInt(deviceId)
        data.eventType = eventType
        data.description = description
        data.responsible = parseInt(responsible)

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

export async function updateMonitoringDevicesNetwork(req: Request, res: Response, next: NextFunction){
    try {
        const id = req.params.id
        const { deviceId, eventType, description, responsible } = req.body

        const data = await SeguimientoDispositivosRed.findOneBy({id: parseInt(id)})

        if (!data) {
            return res.status(404).json({
                message: "Data not found"
            })
        }

        data.deviceId = parseInt(deviceId)
        data.eventType = eventType
        data.description = description
        data.responsible = parseInt(responsible)
        
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

    }
    catch (error) {
        next(error)
    }
}

export async function deleteMonitoringDevicesNetwork(req: Request, res: Response, next: NextFunction){
    try {
        const id = req.params.id
        const data = await SeguimientoDispositivosRed.findOneBy({id: parseInt(id)})

        if (!data) {
            return res.status(404).json({
                message: "Data not found"
            })
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