import { NextFunction, Request, Response } from "express";
import { CupsRadicados } from "../entities/cups-radicados";
import { validate } from "class-validator";

export async function getAllCupsRadicados(req: Request, res: Response, next: NextFunction){
    try {
        
        const cupsRadicados = await CupsRadicados.find({
            relations: ['radicacionRelation', 'functionalUnitRelation']
        });
        return res.json(cupsRadicados);

    } catch (error) {
        next(error);
    }
}

export async function getCupsRadicados(req: Request, res: Response, next: NextFunction) {
    try {
        
        const { id } = req.params;

        const cupsRadicados = await CupsRadicados.findOne({
            where:{ id: parseInt(id)} ,
            relations: ['radicacionRelation', 'functionalUnitRelation']
            });

        if (!cupsRadicados) {
            return res.status(404).json({ message: "Cups Radicados not found" });
        }

        return res.json(cupsRadicados);

    } catch (error) {
        next(error);
    }
}

export async function createCupsRadicados(req: Request, res: Response, next: NextFunction) {

    try {
        
        const { code, DescriptionCode, idRadicado } = req.body;


        if (!code || !DescriptionCode) {
            return res.status(400).json({ message: "All fields are required" });
        }
        console.log(req.body);

        // * se crea array de codigos y descripciones CUPS 

        const  codigosArray = code ?  code.split(',') : [];
        console.log(codigosArray);
        const  descripcionesArray = DescriptionCode ? DescriptionCode.split(',') : [];
        console.log(descripcionesArray);

        const cupCreados = [];

        for (let i = 0; i < codigosArray.length; i++) {
            const cupsRadicados = new CupsRadicados();
            cupsRadicados.code = parseInt(codigosArray[i], 10);
            cupsRadicados.DescriptionCode = descripcionesArray[i];
            cupsRadicados.status = 6;
            cupsRadicados.observation = "Pendiente";
            cupsRadicados.functionalUnit = 12;
            cupsRadicados.idRadicacion = parseInt(idRadicado);
            
            const errors = await validate(cupsRadicados);
    
            if (errors.length > 0) {
    
                const errorMensage = errors.map(err => ({
                    property: err.property,
                    constraints: err.constraints
                }))
    
                return res.status(400).json({ "mensaje": "Error creating cup", errorMensage });
            }
    
            await cupsRadicados.save();

            cupCreados.push(cupsRadicados);

        }

        return res.status(201).json();

    } catch (error) {
        next(error);
    }
}

export async function updateCupsRadicados(req: Request, res: Response, next: NextFunction) {
    
    try {
        
        const { id } = req.params;
        const { code, DescriptionCode, status, observation, functionalUnit, idRadicacion } = req.body;

        if (!code || !DescriptionCode || !status || !observation || !functionalUnit || !idRadicacion) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const cupsRadicados = await CupsRadicados.findOneBy({ id: parseInt(id) });

        if (!cupsRadicados) {
            return res.status(404).json({ message: "Cups Radicados not found" });
        }

        cupsRadicados.code = code;
        cupsRadicados.DescriptionCode = DescriptionCode;
        cupsRadicados.status = status;
        cupsRadicados.observation = observation;
        cupsRadicados.functionalUnit = functionalUnit;

        const errors = await validate(cupsRadicados);

        if (errors.length > 0) {
            const errorMensage = errors.map(err => ({
                property: err.property,
                constraints: err.constraints
            }));

            return res.status(400).json({ message: "Error updating cups", errorMensage });
        }

        await cupsRadicados.save();

        return res.json(cupsRadicados);

    } catch (error) {
        next(error);
    }

}

export async function deleteCupsRadicados(req: Request, res: Response, next: NextFunction) {
    try {
        
        const { id } = req.params;

        const cupsRadicados = await CupsRadicados.findOneBy({ id: parseInt(id) });

        if (!cupsRadicados) {
            return res.status(404).json({ message: "Cups Radicados not found" });
        }

        await cupsRadicados.remove();

        return res.json({ message: "Cups Radicados deleted" });

    } catch (error) {
        next(error);
    }
}