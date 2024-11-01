import { NextFunction, Request, Response } from "express";
import { dispositivosRed } from "../entities/dispositivos-red";
import { validate } from "class-validator";

export async function getAllDevices(req: Request, res: Response, next: NextFunction){
    try {
        
        const devices = await dispositivosRed.find()

        if (devices.length < 0) {
            return res.status(404).json({
                message: "No se encontraron dispositivos"
            })
        }

        return res.json(devices)

    } catch (error) {
        next(error)
    }
}

export async function getDevice(req: Request, res: Response, next: NextFunction){
    try {
        const id = req.params.id
        const device = await dispositivosRed.findOneBy({id: parseInt(id)})
        
        if (!device) {
            return res.status(404).json({
                message: "Dispositivo no encontrado"
            })
        }

        return res.json(device)

    }
    catch (error) {
        next(error)
    }
}

export async function createDevice(req: Request, res: Response, next: NextFunction){
    try {

        const { sedeId, name, brand, model, serial, addressIp, mac, otherData, status, inventoryNumber } = req.body

        const device = new dispositivosRed()
        device.sedeId = sedeId
        device.name = name
        device.brand = brand
        device.model = model
        device.serial = serial
        device.addressIp = addressIp
        device.mac = mac
        device.otherData = otherData
        device.status = status
        device.inventoryNumber = inventoryNumber

        const errors = await validate(device)
        if (errors.length > 0) {
            const message = errors.map((err) => ({
                property: err.property,
                constraints: err.constraints
            }))
            return res.status(400).json({message})
        }

        await device.save()

        return res.json(device)

    } catch (error) {
        next(error)
    }
}

export async function updateDevice(req: Request, res: Response, next: NextFunction){
    try {

        const { id } = req.params;

        const {
            sedeId,
            name,
            brand,
            model,
            serial,
            addressIp,
            mac,
            otherData,
            status,
            inventoryNumber
        } = req.body

        const device = await dispositivosRed.findOneBy({ id: parseInt(id) })

        if (!device) {
            return res.status(404).json({
                message: "Dispositivo no encontrado"
            })
        }

        device.sedeId = sedeId
        device.name = name
        device.brand = brand
        device.model = model
        device.serial = serial
        device.addressIp = addressIp
        device.mac = mac
        device.otherData = otherData
        device.status = status
        device.inventoryNumber = inventoryNumber

        const errors = await validate(device)
        if (errors.length > 0) {
            const message = errors.map((err) => ({
                property: err.property,
                constraints: err.constraints
            }))
            return res.status(400).json({message})
        }

        await device.save()

        return res.json(device)

    } catch (error) {
        next(error)
    }
}

export async function deleteDevice(req: Request, res: Response, next: NextFunction){
    try {
        const { id } = req.params

        const device = await dispositivosRed.findOneBy({ id: parseInt(id) })

        if (!device) {
            return res.status(404).json({
                message: "Dispositivo no encontrado"
            })
        }

        await device.remove()

        return res.json({
            message: "Dispositivo eliminado"
        })

    } catch (error) {
        next(error)
    }
}

