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
        .leftJoinAndSelect('seguimiento.usuarioRelation', 'responsable_seguimiento')
        .where("televisor.sede_id = :id", { id })
        .getMany();

        if (!televisor) {
            return res.status(404).json({ message: "No se encontraron televisores para esta sede" });
        }

        const televisorFormatted = televisor.map( t => ({
            id: t.id || 'N/A',
            name: t.name || 'N/A',
            location: t.location || 'N/A',
            brand: t.brand || 'N/A',
            model: t.model || 'N/A',
            serial: t.serial || 'N/A',
            pulgadas: t.pulgadas || 'N/A',
            screenType: t.screenType || 'N/A',
            smartTv: t.smartTv || 'N/A',
            operativeSystem: t.operativeSystem || 'N/A',    
            addressIp: t.addressIp || 'N/A',
            mac: t.mac || 'N/A',
            resolution: t.resolution || 'N/A',
            numPuertosHdmi: t.numPuertosHdmi || 'N/A',
            numPuertosUsb: t.numPuertosUsb || 'N/A',
            connectivity: t.connectivity || 'N/A',
            purchaseDate: t.purchaseDate || 'N/A',
            warrantyTime: t.warrantyTime || 'N/A',
            warranty: t.warranty || 'N/A',
            deliveryDate: t.deliveryDate || 'N/A',
            inventoryNumber: t.inventoryNumber || 'N/A',
            responsableId: t.responsableRelation?.id || 'N/A',
            responsableName: t.responsableRelation?.name || 'N/A',
            responsableLastName: t.responsableRelation?.lastName || 'N/A',
            observations: t.observation || 'N/A',
            status: t.status || 'N/A',
            acquisitionValue: t.acquisitionValue || 'N/A',
            controlRemote: t.controlRemote || 'N/A',
            utility: t.utility,
            seguimiento: t.seguimientoRelation?.map( s => ({
                id: s.id || 'N/A',
                eventDate: s.eventDate || 'N/A',
                typeEvent: s.eventType || 'N/A',
                description: s.description || 'N/A',
                responsableId: s.usuarioRelation?.id || 'N/A',
                responsableName: s.usuarioRelation?.name || 'N/A',
                responsableLastName: s.usuarioRelation?.lastName || 'N/A'
            }))
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
            utility,
            responsable
        }  = req.body;

        console.log("tiempo garantia",req.body.warrantyTime);

        const televisor = new Televisor();
        televisor.sedeId = parseInt(sedeId);
        televisor.name = name.toLowerCase();
        televisor.location = location;
        televisor.brand = brand;
        televisor.model = model;
        televisor.serial = serial;
        televisor.pulgadas = Number(pulgadas);
        televisor.screenType = screenType;
        televisor.smartTv = smartTv;
        televisor.operativeSystem = operativeSystem;
        televisor.addressIp = addressIp;
        televisor.mac = mac;
        televisor.resolution = resolution;
        televisor.numPuertosHdmi = Number(numPuertosHdmi);
        televisor.numPuertosUsb = Number(numPuertosUsb);
        televisor.connectivity = connectivity;
        televisor.purchaseDate = purchaseDate;
        televisor.warrantyTime = warrantyTime || "Sin garantía";
        televisor.warranty = warranty;
        televisor.deliveryDate = deliveryDate ;
        televisor.inventoryNumber = inventoryNumber || "Sin número de inventario";
        televisor.observation = observation;
        televisor.status = status;
        televisor.acquisitionValue = Number(acquisitionValue);
        televisor.controlRemote = controlRemote;
        televisor.utility = utility;
        televisor.idResponsable = responsable;


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

export async function updateTelevisor(req: Request, res: Response, next: NextFunction){
    try {
        
        const { id } = req.params;
        const {
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
            utility,
            responsable
        }  = req.body;

        const televisor = await Televisor.findOneBy({ id: parseInt(id) });

        if (!televisor) {
            return res.status(404).json({ message: "Televisor no encontrado" });
        }

        televisor.name = name.toLowerCase() || televisor.name;
        televisor.location = location || televisor.location;
        televisor.brand = brand || televisor.brand;
        televisor.model = model || televisor.model;
        televisor.serial = serial || televisor.serial;
        televisor.pulgadas = Number(pulgadas) || televisor.pulgadas;
        televisor.screenType = screenType || televisor.screenType;
        televisor.smartTv = smartTv || televisor.smartTv;
        televisor.operativeSystem = operativeSystem || televisor.operativeSystem;
        televisor.addressIp = addressIp || televisor.addressIp;
        televisor.mac = mac || televisor.mac;
        televisor.resolution = resolution || televisor.resolution;
        televisor.numPuertosHdmi = Number(numPuertosHdmi) || televisor.numPuertosHdmi;
        televisor.numPuertosUsb = Number(numPuertosUsb) || televisor.numPuertosUsb;
        televisor.connectivity = connectivity || televisor.connectivity;
        televisor.purchaseDate = purchaseDate || televisor.purchaseDate;
        televisor.warrantyTime = warrantyTime || televisor.warrantyTime;
        televisor.warranty = warranty || televisor.warranty;
        televisor.deliveryDate = deliveryDate || televisor.deliveryDate;
        televisor.inventoryNumber = inventoryNumber || televisor.inventoryNumber;
        televisor.observation = observation || televisor.observation;
        televisor.status = status || televisor.status;
        televisor.acquisitionValue = Number(acquisitionValue) || televisor.acquisitionValue;
        televisor.controlRemote = controlRemote || televisor.controlRemote;
        televisor.utility = utility || televisor.utility;
        televisor.idResponsable = Number(responsable) || televisor.idResponsable;

        const errors = await validate(televisor);
        if (errors.length > 0) {
            const errorMessages = errors.map(err => ({
                property: err.property,
                constraints: err.constraints
            }))
            return res.status(400).json({ message: "Error de validación", errors: errorMessages });
        }

        const updatedTelevisor = await televisor.save();

        return res.status(200).json({televisor: updatedTelevisor});

    } catch (error) {
        next(error);
    }
}