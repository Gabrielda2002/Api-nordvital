import { NextFunction, Request, Response } from "express";
import { SeguimientoAuxiliar } from "../entities";
import { validate } from "class-validator";

export async function getAllSeguimientosAuxiliares(req: Request, res: Response, next: NextFunction){
    try {
        
        const seguimientosAuxiliares = await SeguimientoAuxiliar.find({
            relations: ["cupsRadicadosRelation", "estadoSeguimientoRelation"]
        });
        return res.json(seguimientosAuxiliares);

    } catch (error) {
        next(error);

    }
}

export async function getSeguimientoAuxiliar(req: Request, res: Response, next: NextFunction){
    try {
        const { id } = req.params;

        const seguimientoAuxiliar = await SeguimientoAuxiliar.findOne({
            where: {id: parseInt(String(id))},
            relations: ["cupsRadicadosRelation", "estadoSeguimientoRelation"]
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
        
        const { observation, status, idRadicacion, userId } = req.body;

        if (!observation || !status || !idRadicacion) {
            return res.status(400).json({message: "Todos los campos son requeridos"});
        }

        const seguimientoAuxiliar = new SeguimientoAuxiliar();

        seguimientoAuxiliar.observation = observation;
        seguimientoAuxiliar.statusId = parseInt(String(status));
        seguimientoAuxiliar.cupsRadicadoId = parseInt(String(idRadicacion));
        seguimientoAuxiliar.userId = parseInt(String(userId));

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

        const { observation, status } = req.body;

        const seguimientoAuxiliar = await SeguimientoAuxiliar.findOneBy({id: parseInt(String(id))});

        if (!seguimientoAuxiliar) {
            return res.status(404).json({message: "Seguimiento auxiliar no encontrado"});
        }

        seguimientoAuxiliar.observation = observation;
        seguimientoAuxiliar.statusId = status;

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

        const seguimientoAuxiliar = await SeguimientoAuxiliar.findOneBy({id: parseInt(String(id))});

        if (!seguimientoAuxiliar) {
            return res.status(404).json({message: "Seguimiento auxiliar no encontrado"});
        }

        await seguimientoAuxiliar.remove();

        return res.json({message: "Seguimiento auxiliar eliminado"});

    } catch (error) {
        next(error);
    }
}