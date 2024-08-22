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
            paraclinicalDate,
            anesthesiaAssessmentDate,
            surgeryDate,
            scheduledTime,
            ipsRemite,
            observation,
            specialistName,
            specialityId,
            status,
            radicadoId
        } = req.body;

        const surgery = new Cirugias();
        surgery.orderingDate = orderingDate;
        surgery.paraclinicalDate = paraclinicalDate;
        surgery.anesthesiaAssessmentDate = anesthesiaAssessmentDate;
        surgery.surgeryDate = surgeryDate;
        surgery.scheduledTime = scheduledTime;
        surgery.ipsRemite = ipsRemite;
        surgery.observation = observation;
        surgery.specialistName = specialistName;
        surgery.specialityId = specialityId;
        surgery.status = status;
        surgery.radicadoId = radicadoId;

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
            paraclinicalDate,
            anesthesiaAssessmentDate,
            surgeryDate,
            scheduledTime,
            ipsRemite,
            observation,
            specialistName,
            specialityId,
            status,
            radicadoId
        } = req.body;

        const surgery = await Cirugias.findOne({where: {id: parseInt(id)}})

        if (!surgery) {
            return res.status(404).json({ message: "Surgery not found" });
        }

        surgery.orderingDate = orderingDate;
        surgery.paraclinicalDate = paraclinicalDate;
        surgery.anesthesiaAssessmentDate = anesthesiaAssessmentDate;
        surgery.surgeryDate = surgeryDate;
        surgery.scheduledTime = scheduledTime;
        surgery.ipsRemite = ipsRemite;
        surgery.observation = observation;
        surgery.specialistName = specialistName;
        surgery.specialityId = specialityId;
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