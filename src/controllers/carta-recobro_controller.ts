import { NextFunction, Request, Response } from "express";
import { CartaRecobro } from "../entities/Carta_recobro";
import { validate } from "class-validator";

export async function getAllRecoveryLetter (req: Request, res: Response, next: NextFunction){
    try {
        
        const recoveryLatter = await CartaRecobro.createQueryBuilder("carta_recobro")
        .leftJoinAndSelect("carta_recobro.radicacionRelation", "radicacion")
        .leftJoinAndSelect("carta_recobro.userRequestRelation", "usuario_solicita")
        .leftJoinAndSelect("carta_recobro.userAuditRelation", "usuario_audita")
        .getMany();

        return res.json(recoveryLatter);
        
    } catch (error) {
        next(error);
    }
}

export async function getRecoveryLetterById (req: Request, res: Response, next: NextFunction){
    try {
        
        const { id } = req.params;

        const recoveryLatter = await CartaRecobro.createQueryBuilder("carta_recobro")
        .leftJoinAndSelect("carta_recobro.radicacionRelation", "radicacion")
        .leftJoinAndSelect("carta_recobro.userRequestRelation", "usuario_solicita")
        .leftJoinAndSelect("carta_recobro.userAuditRelation", "usuario_audita")
        .where("carta_recobro.id = :id", {id})
        .getOne();

        if(!recoveryLatter){
            return res.status(404).json({message: "Carta de recobro no encontrada"});
        }

        return res.json(recoveryLatter);

    } catch (error) {
        next(error);
        
    }
}

export async function createRecoveryLetter (req: Request, res: Response, next: NextFunction){
    try {
        
        const { idRadicado, idUserRequest, idUserAudit, observacion, justification, dateImpression } = req.body;

        const recoveryLatter = new CartaRecobro();
        recoveryLatter.idRadicado = parseInt(idRadicado);
        recoveryLatter.idUserRequest = parseInt(idUserRequest);
        recoveryLatter.idUserAudit = parseInt(idUserAudit);
        recoveryLatter.observacion = observacion;
        recoveryLatter.justification = justification;
        recoveryLatter.dateImpression = dateImpression;

        const erros = await validate(recoveryLatter);

        if (erros.length > 0) {
            const errorsMessage = erros.map(err => ({
                property: err.property,
                constraints: err.constraints
            }))
            return res.status(400).json({"message" : "Ocurrio un error",errorsMessage});
        }

        await recoveryLatter.save();

        return res.json(recoveryLatter);

    } catch (error) {
        next(error);
        
    }
}

export async function updateRecoveryLetter (req: Request, res: Response, next: NextFunction){
    try {
        
        const { id } = req.params;
        const { idRadicado, idUserRequest, idUserAudit, observacion, justification, dateImpression } = req.body;

        const recoveryLatter = await CartaRecobro.createQueryBuilder("carta_recobro")
        .where("carta_recobro.id = :id", {id})
        .getOne();

        if(!recoveryLatter){
            return res.status(404).json({message: "Carta de recobro no encontrada"});
        }

        recoveryLatter.idRadicado = parseInt(idRadicado);
        recoveryLatter.idUserRequest = parseInt(idUserRequest);
        recoveryLatter.idUserAudit = parseInt(idUserAudit);
        recoveryLatter.observacion = observacion;
        recoveryLatter.justification = justification;
        recoveryLatter.dateImpression = dateImpression;

        const erros = await validate(recoveryLatter);

        if (erros.length > 0) {
            const errorsMessage = erros.map(err => ({
                property: err.property,
                constraints: err.constraints
            }))
            return res.status(400).json({"message" : "Ocurrio un error",errorsMessage});
        }

        await recoveryLatter.save();

        return res.json(recoveryLatter);

    } catch (error) {
        next(error);
        
    }
}

export async function deleteRecoveryLetter (req: Request, res: Response, next: NextFunction){
    try {
        
        const { id } = req.params;

        const recoveryLatter = await CartaRecobro.createQueryBuilder("carta_recobro")
        .where("carta_recobro.id = :id", {id})
        .getOne();

        if(!recoveryLatter){
            return res.status(404).json({message: "Carta de recobro no encontrada"});
        }

        await recoveryLatter.remove();

        return res.json({message: "Carta de recobro eliminada"});

    } catch (error) {
        next(error);
        
    }
}