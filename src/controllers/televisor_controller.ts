import { NextFunction, Request, Response } from "express";
import { Televisor } from "../entities/televisor";
import { validate } from "class-validator";

export async function getTelevisorBySedeId(req: Request, res: Response, next: NextFunction){
    try {
        
        const { id } = req.params;

        const televisor = await Televisor.createQueryBuilder("televisor")
        .leftJoinAndSelect('televisor.sedeRelation', 'sede')
        .leftJoinAndSelect('televisor.responsableRelation', 'responsable')
        .leftJoinAndSelect('televisor.seguimientoRelation', 'seguimiento')
        .where("televisor.sede_id = :id", { id })
        .getMany();

        if (!televisor) {
            return res.status(404).json({ message: "No se encontraron televisores para esta sede" });
        }

        const televisorFormatted = televisor.map( t => ({
            id: t.id,
            name: t.name,
            location: t.location,
            brand: t.brand,
            model: t.model,
            serial: t.serial,
            pulgadas: t.pulgadas,
            screenType: t.screenType,
            smartTv: t.smartTv,
            operativeSystem: t.operativeSystem,
            addressIp: t.addressIp,
            mac: t.mac,
            resolution: t.resolution,
            numPuertosHdmi: t.numPuertosHdmi,
            numPuertosUsb: t.numPuertosUsb,
            connectivity: t.connectivity,
            purchaseDate: t.purchaseDate,
            warrantyTime: t.warrantyTime,
            warranty: t.warranty,
            deliveryDate: t.deliveryDate,
            inventoryNumber: t.inventoryNumber,
            responsableName: t.responsableRelation?.name,
            responsableLastName: t.responsableRelation?.lastName,
            observations: t.observation,
            status: t.status,
            acquisitionValue: t.acquisitionValue,
            controlRemote: t.controlRemote,
            utility: t.utility,
        }))

        return res.status(200).json(televisorFormatted);

    } catch (error) {
        next(error);
    }
}

export async function createTelevisor(req: Request, res: Response, next: NextFunction){
    try {
        
        const {
            sedeId,
            name,
            location,
            brand,
            model,
            serial,
            pulgadas,
            screenType,
            smartTv,
            operativeSystem,
            addressIp,
            mac,
            resolution,
            numPuertosHdmi,
            numPuertosUsb,
            connectivity,
            purchaseDate,
            warrantyTime,
            warranty,
            deliveryDate,
            inventoryNumber,
            observation,
            status,
            acquisitionValue,
            controlRemote,
            utility
        }  = req.body;

        const televisor = new Televisor();
        televisor.sedeId = parseInt(sedeId);
        televisor.name = name.toLowerCase();
        televisor.location = location;
        televisor.brand = brand;
        televisor.model = model;
        televisor.serial = serial;
        televisor.pulgadas = Number(pulgadas);
        televisor.screenType = screenType;
        televisor.smartTv = smartTv === 1 ? true : false;
        televisor.operativeSystem = operativeSystem;
        televisor.addressIp = addressIp;
        televisor.mac = mac;
        televisor.resolution = resolution;
        televisor.numPuertosHdmi = Number(numPuertosHdmi);
        televisor.numPuertosUsb = Number(numPuertosUsb);
        televisor.connectivity = connectivity;
        televisor.purchaseDate = purchaseDate;
        televisor.warrantyTime = warrantyTime;
        televisor.warranty = warranty === 1 ? true : false;
        televisor.deliveryDate = deliveryDate;
        televisor.inventoryNumber = inventoryNumber;
        televisor.observation = observation;
        televisor.status = status;
        televisor.acquisitionValue = Number(acquisitionValue);
        televisor.controlRemote = controlRemote === 1 ? true : false;
        televisor.utility = utility;


        const errors = await validate(televisor);
        if (errors.length > 0) {
            const errorMessages = errors.map(err => ({
                property: err.property,
                constraints: err.constraints
            }))
            return res.status(400).json({ message: "Error de validación", errors: errorMessages });
        }

        const newTelevisor = await televisor.save();

        return res.status(201).json({televisor});

    } catch (error) {
        next(error);
    }
}