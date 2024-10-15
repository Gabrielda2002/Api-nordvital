import { NextFunction, Request, Response } from "express";
import { Cirugias } from "../entities/cirugias";
import { validate } from "class-validator";
import { stat } from "fs";

export async function getAllSurgery(req: Request, res: Response, next: NextFunction){
    try {
        
        const surgery = await Cirugias.find()
        res.json(surgery)

    } catch (error) {
        next(error)
    }
}

export async function getSurgery(req: Request, res: Response, next: NextFunction){
    try {
        
        const { id } = req.params;

        const surgery = await Cirugias.findOne({where: {id: parseInt(id)}})

        if (!surgery) {
            return res.status(404).json({ message: "Surgery not found" });
        }

        res.json(surgery)

    } catch (error) {
        next(error)
    }
}

export async function createSurgery(req: Request, res: Response, next: NextFunction){
    try {
        
        const {
            orderingDate,
            surgeryDate,
            scheduledTime,
            ipsRemite,
            observation,
            radicadoId
        } = req.body;

        const surgery = new Cirugias();
        surgery.orderingDate = orderingDate;
        surgery.surgeryDate = surgeryDate;
        surgery.scheduledTime = scheduledTime;
        surgery.ipsRemite = parseInt(ipsRemite);
        surgery.observation = observation;
        surgery.status = true;
        surgery.radicadoId = parseInt(radicadoId);

        const errors = await validate(surgery);

        if (errors.length > 0) {
            const message = errors.map((err) => ({
                property: err.property,
                constraints: err.constraints
            }))
            return res.status(400).json({message: "Error creating surgery", errors: message})
        }

        await surgery.save();

        return res.status(201).json(surgery);

    } catch (error) {
        next(error)
    }
}

export async function updateSurgery(req: Request, res: Response, next: NextFunction){
    try {
        
        const { id } = req.params;

        const {
            orderingDate,
            surgeryDate,
            scheduledTime,
            ipsRemite,
            observation,
            status,
            radicadoId
        } = req.body;

        const surgery = await Cirugias.findOne({where: {id: parseInt(id)}})

        if (!surgery) {
            return res.status(404).json({ message: "Surgery not found" });
        }

        surgery.orderingDate = orderingDate;
        surgery.surgeryDate = surgeryDate;
        surgery.scheduledTime = scheduledTime;
        surgery.ipsRemite = ipsRemite;
        surgery.observation = observation;
        surgery.status = status;
        surgery.radicadoId = radicadoId;

        const errors = await validate(surgery);

        if (errors.length > 0) {
            const message = errors.map((err) => ({
                property: err.property,
                constraints: err.constraints
            }))
            return res.status(400).json({message: "Error updating surgery", errors: message})
        }

        await surgery.save();

        return res.json(surgery);

    } catch (error) {
        next(error)
    }
}

export async function deleteSurgery(req: Request, res: Response, next: NextFunction){
    try {
        
        const { id } = req.params;

        const surgery = await Cirugias.findOne({where: {id: parseInt(id)}})

        if (!surgery) {
            return res.status(404).json({ message: "Surgery not found" });
        }

        await surgery.remove();

        return res.json({ message: "Surgery deleted" });

    } catch (error) {
        next(error)
    }
}

export async function getSurgeryTable(req: Request, res: Response, next: NextFunction){
    try {
        
        const surgery = await Cirugias.createQueryBuilder("cirugias")
        .leftJoinAndSelect("cirugias.speciality", "speciality")
        .leftJoinAndSelect("cirugias.ipsRemiteRelation", "ips")
        .leftJoinAndSelect("cirugias.radicacionRelation", "radicado")
        .leftJoinAndSelect("radicado.patientRelation", "pacientes")
        .leftJoinAndSelect("cirugias.statusRelation", "status")
        .getMany();

        res.json(surgery);

    } catch (error) {
        next(error)
    }
}