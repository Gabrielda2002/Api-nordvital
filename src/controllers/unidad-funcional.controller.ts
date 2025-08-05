import { NextFunction, Request, Response } from "express";
import { UnidadFuncional } from "../entities/unidad-funcional";
import { validate } from "class-validator";

export async function getAllUnidadFuncional(req: Request, res: Response, next: NextFunction){

    try {
     
        const unidadFuncional = await UnidadFuncional.find();
        return res.json(unidadFuncional);

    } catch (error) {
        next(error);

    }

}

export async function getUnidadFuncionalById(req: Request, res: Response, next: NextFunction){
    try {
        
        const { id } = req.params;

        const unidadFuncional = await UnidadFuncional.findOneBy({id: parseInt(id)});

        if(!unidadFuncional){
            return res.status(404).json({message: "Unidad Funcional no encontrada"});
        }

        return res.json(unidadFuncional);

    } catch (error) {
        next(error);
        
    }
}

export async function createUnidadFuncional(req: Request, res: Response, next: NextFunction){
    try {
        
        const { name } = req.body;

        const unidadFuncionalExist = await UnidadFuncional.findOneBy({name});

        if (unidadFuncionalExist){
            return res.status(409).json({message: "La unidad funcional ya existe"});
            
        }

        const unidadFuncional = new UnidadFuncional();
        unidadFuncional.name = name;
        unidadFuncional.status = true;

        const errors =  await validate(unidadFuncional);

        if (errors.length > 0) {
            const messageErrro = errors.map(err => ({
                property: err.property,
                constraints: err.constraints
            }))
            return res.status(400).json({"message" : "Ocurrio un error: ",  messageErrro});
        }

        await unidadFuncional.save();

        return res.json(unidadFuncional);

    } catch (error) {
        next(error);
        
    }
}

export async function updateUnidadFuncional(req: Request, res: Response, next: NextFunction){
    try {
        
        const { id } = req.params;

        const { name, status } = req.body;

        const unidadFuncional = await UnidadFuncional.findOneBy({id: parseInt(id)});

        if (!unidadFuncional){
            return res.status(404).json({message: "Unidad Funcional no encontrada"});
            
        }

        unidadFuncional.name = name;
        unidadFuncional.status = status;

        const errors =  await validate(unidadFuncional);

        if (errors.length > 0) {
            const messageErrro = errors.map(err => ({
                property: err.property,
                constraints: err.constraints
            }))
            return res.status(400).json({"message" : "Ocurrio un error: ",  messageErrro});
        }

        await unidadFuncional.save();

        return res.json(unidadFuncional);

    } catch (error) {
        next(error);
    }
}

export async function deleteUnidadFuncional(req: Request, res: Response, next: NextFunction){
    try {
        
        const { id } = req.params;

        const unidadFuncional = await UnidadFuncional.findOneBy({id: parseInt(id)});

        if (!unidadFuncional){
            return res.status(404).json({message: "Unidad Funcional no encontrada"});
            
        }

        await unidadFuncional.remove();

        return res.json({message: "Unidad Funcional eliminada"});

    } catch (error) {
        next(error);
    }
}