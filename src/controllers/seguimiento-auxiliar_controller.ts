import { NextFunction, Request, Response } from "express";
import { SeguimietoAuxiliar } from "../entities/seguimiento-auxiliar";
import { validate } from "class-validator";

export async function getAllSeguimientosAuxiliares(req: Request, res: Response, next: NextFunction){
    try {
        
        const seguimientosAuxiliares = await SeguimietoAuxiliar.find({
            relations: ["radicacionRelation", "estadoSeguimientoRelation"]
        });
        return res.json(seguimientosAuxiliares);

    } catch (error) {
        next(error);

    }
}

export async function getSeguimientoAuxiliar(req: Request, res: Response, next: NextFunction){
    try {
        const { id } = req.params;

        const seguimientoAuxiliar = await SeguimietoAuxiliar.findOne({
            where: {id: parseInt(id)},
            relations: ["radicacionRelation", "estadoSeguimientoRelation"]
        });

        if (!seguimientoAuxiliar) {
            return res.status(404).json({message: "Seguimiento auxiliar no encontrado"});
        }

        return res.json(seguimientoAuxiliar);
    } catch (error) {
        next(error);
    }
}

export async function createSeguimientoAuxiliar(req: Request, res: Response, next: NextFunction){
    try {
        
        const { observation, status, codeCups, idRadicacion } = req.body;

        if (!observation || !status || !codeCups || !idRadicacion) {
            return res.status(400).json({message: "Todos los campos son requeridos"});
        }

        const seguimientoAuxiliar = new SeguimietoAuxiliar();

        seguimientoAuxiliar.observation = observation;
        seguimientoAuxiliar.status = status;
        seguimientoAuxiliar.codeCups = codeCups;
        seguimientoAuxiliar.idRadicacion = idRadicacion;

        const errors = await validate(seguimientoAuxiliar);

        if (errors.length > 0) {
            const errorsMessage = errors.map(error => ({
                property: error.property,
                constraints: error.constraints
            }));

            return res.status(400).json({message: "Error creando seguimiento auxiliar", errorsMessage});
        }

        await seguimientoAuxiliar.save();

        return res.json(seguimientoAuxiliar);

    } catch (error) {
        next(error);
    }
}

export async function updateSeguimientoAuxiliar(req: Request, res: Response, next: NextFunction){
    try {
        
        const { id } = req.params;

        const { observation, status, codeCups } = req.body;

        const seguimientoAuxiliar = await SeguimietoAuxiliar.findOneBy({id: parseInt(id)});

        if (!seguimientoAuxiliar) {
            return res.status(404).json({message: "Seguimiento auxiliar no encontrado"});
        }

        seguimientoAuxiliar.observation = observation;
        seguimientoAuxiliar.status = status;
        seguimientoAuxiliar.codeCups = codeCups;

        const errors = await validate(seguimientoAuxiliar);

        if (errors.length > 0) {
            const errorsMessage = errors.map(error => ({
                property: error.property,
                constraints: error.constraints
            }));

            return res.status(400).json({message: "Error actualizando seguimiento auxiliar", errorsMessage});
        }

        await seguimientoAuxiliar.save();

        return res.json(seguimientoAuxiliar);

    } catch (error) {
        next(error);
    }
}

export async function deleteSeguimientoAuxiliar(req: Request, res: Response, next: NextFunction){
    try {
        
        const { id } = req.params;

        const seguimientoAuxiliar = await SeguimietoAuxiliar.findOneBy({id: parseInt(id)});

        if (!seguimientoAuxiliar) {
            return res.status(404).json({message: "Seguimiento auxiliar no encontrado"});
        }

        await seguimientoAuxiliar.remove();

        return res.json({message: "Seguimiento auxiliar eliminado"});

    } catch (error) {
        next(error);
    }
}