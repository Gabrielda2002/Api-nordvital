import { NextFunction, Request, Response } from "express"
import { Equipos } from "../entities/equipos"
import { validate } from "class-validator"

export async function getAllEquipments(req: Request, res: Response, next: NextFunction) {
    try {
        const equipments = await Equipos.find()
        return res.json(equipments)
    } catch (error) {
        next(error)
    }
}

export async function getEquipment(req: Request, res: Response, next: NextFunction) {
    try {
        const id = req.params.id
        const equipment = await Equipos.findOneBy({ id: parseInt(id) })

        if (!equipment) {
            return res.status(404).json({
                message: "Equipo no encontrado"
            })
        }

        return res.json(equipment)
    } catch (error) {
        next(error)
    }
}

export async function createEquipment(req: Request, res: Response, next: NextFunction) {
    try {
        const { sedeId, name, area, typeEquipment, brand, model, serial, operatuingSystem, addressIp, mac, purchaseDate, warrantyTime, warranty, deliveryDate, inventoryNumber } = req.body

        const equipment = new Equipos()
        equipment.sedeId = sedeId
        equipment.name = name
        equipment.area = area
        equipment.typeEquipment = typeEquipment
        equipment.brand = brand
        equipment.model = model
        equipment.serial = serial
        equipment.operatuingSystem = operatuingSystem
        equipment.addressIp = addressIp
        equipment.mac = mac
        equipment.purchaseDate = purchaseDate
        equipment.warrantyTime = warrantyTime
        equipment.warranty = warranty
        equipment.deliveryDate = deliveryDate
        equipment.inventoryNumber = inventoryNumber

        const errors = await validate(equipment)

        if (errors.length > 0) {
            const message = errors.map((err) => ({
                property: err.property,
                constraints: err.constraints
            }))
            return res.status(400).json({ message })
        }

        await equipment.save()
        return res.json(equipment)
    } catch (error) {
        next(error)
    }
}

export async function updateEquipment(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params

        const { sedeId, name, area, typeEquipment, brand, model, serial, operatuingSystem, addressIp, mac, purchaseDate, warrantyTime, warranty, deliveryDate, inventoryNumber } = req.body

        const equipment = await Equipos.findOneBy({ id: parseInt(id) })

        if (!equipment) {
            return res.status(404).json({
                message: "Equipo no encontrado"
            })
        }

        equipment.sedeId = sedeId
        equipment.name = name
        equipment.area = area
        equipment.typeEquipment = typeEquipment
        equipment.brand = brand
        equipment.model = model
        equipment.serial = serial
        equipment.operatuingSystem = operatuingSystem
        equipment.addressIp = addressIp
        equipment.mac = mac
        equipment.purchaseDate = purchaseDate
        equipment.warrantyTime = warrantyTime
        equipment.warranty = warranty
        equipment.deliveryDate = deliveryDate
        equipment.inventoryNumber = inventoryNumber

        const errors = await validate(equipment)

        if (errors.length > 0) {
            const message = errors.map((err) => ({
                property: err.property,
                constraints: err.constraints
            }))
            return res.status(400).json({ message })
        }

        await equipment.save()
        return res.json(equipment)
    } catch (error) {
        next(error)
    }
}

export async function deleteEquipment(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params
        const equipment = await Equipos.findOneBy({ id: parseInt(id) })

        if (!equipment) {
            return res.status(404).json({
                message: "Equipo no encontrado"
            })
        }

        await equipment.remove()
        return res.json({
            message: "Equipo eliminado"
        })
    } catch (error) {
        next(error)
    }
}