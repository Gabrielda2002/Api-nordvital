import { NextFunction, query, Request, Response } from "express";
import { Cirugias } from "../entities/cirugias";
import { validate } from "class-validator";
import { stat } from "fs";
import { Radicacion } from "../entities/radicacion";
import { CupsRadicados } from "../entities/cups-radicados";
import { Profesionales } from "../entities/profesionales";

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
    const  queryRunner = Cirugias.getRepository().manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
        

        const {
            surgeryDate,
            scheduledTime,
            ipsRemite,
            observation,
            radicadoId, 
            paraclinicalDate,
            anesthesiologyDate,
            specialist
        } = req.body;

        const specialistEntity = await Profesionales.findOne({
            where: { id: parseInt(specialist) },
            select: ["name"]
        });

        if (!specialistEntity) {
            return res.status(404).json({ message: "Specialist not found" });
        }

        const surgery = new Cirugias();
        surgery.surgeryDate = surgeryDate;
        surgery.scheduledTime = scheduledTime;
        surgery.ipsRemite = parseInt(ipsRemite);
        surgery.observation = observation;
        surgery.status = true;
        surgery.radicadoId = parseInt(radicadoId);
        surgery.paraclinicalDate = paraclinicalDate || "0000-00-00";
        surgery.anesthesiologyDate = anesthesiologyDate || "0000-00-00";
        surgery.specialist = specialistEntity.name;

        const errors = await validate(surgery);

        if (errors.length > 0) {
            const message = errors.map((err) => ({
                property: err.property,
                constraints: err.constraints
            }))
            return res.status(400).json({message: "Error creating surgery", errors: message})
        }

        await queryRunner.manager.save(surgery);

        if (radicadoId) {
            const cupsRadicado = await CupsRadicados.createQueryBuilder("cupsRadicados")
            .leftJoinAndSelect("cupsRadicados.radicacionRelation", "radicado")
            .where("radicado.id = :id", { id: radicadoId })
            .getMany();

            console.log("cupsRadicado", cupsRadicado)

            if (!cupsRadicado) {
                await queryRunner.rollbackTransaction();
                return res.status(404).json({ message: "Radicado not found" });
            }

            
            await Promise.all(
                cupsRadicado.map(  async (radicado) => {
                    radicado.status = 9;
                    await queryRunner.manager.save(cupsRadicado);
                }));
            


            console.log('se actualiza el estado del radicado', cupsRadicado);
        }

        await queryRunner.commitTransaction();

        return res.status(201).json(surgery);

    } catch (error) {
        await queryRunner.rollbackTransaction();
        next(error)
    }finally{
        await queryRunner.release();
    }
}

export async function updateSurgery(req: Request, res: Response, next: NextFunction){
    try {
        
        const { id } = req.params;

        const {
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