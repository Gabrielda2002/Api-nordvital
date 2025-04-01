import { NextFunction, Request, Response } from "express"
import { SeguimientoAuxiliarCirugias } from "../entities/seguimiento-auxiliar-cirugias"
import { validate } from "class-validator"

export async function getAllAuxiliarySurgeries(req: Request, res: Response, next: NextFunction){
    try {
        
        const auxiliarySurgeries = await SeguimientoAuxiliarCirugias.find()
        res.json(auxiliarySurgeries)

    } catch (error) {
        next(error)
    }
}

export async function getAuxiliarySurgery(req: Request, res: Response, next: NextFunction){
    try {
        
        const { id } = req.params;

        const auxiliarySurgery = await SeguimientoAuxiliarCirugias.findOne({where: {id: parseInt(id)}})

        if (!auxiliarySurgery) {
            return res.status(404).json({ message: "Auxiliary surgery not found" });
        }

        res.json(auxiliarySurgery)

    } catch (error) {
        next(error)
    }
}

export async function createAuxiliarySurgery(req:Request, res: Response, next: NextFunction){
    try {
        
        const {
            observation,
            status,
            surgeryId,
            userId
        } = req.body;

        console.log(req.body);

        const auxiliarySurgery = new SeguimientoAuxiliarCirugias();
        auxiliarySurgery.observation = observation;
        auxiliarySurgery.status = status;
        auxiliarySurgery.cupsId = 1;
        auxiliarySurgery.surgeryId = parseInt(surgeryId);
        auxiliarySurgery.userId = userId ? parseInt(userId) : null;



        const errors = await validate(auxiliarySurgery);
        if (errors.length > 0) {
            const message = errors.map(err => ({
                property: err.property,
                constrainst: err.constraints
            }))
            return res.status(400).json({message: "Error creating auxiliary surgery", errors: message});
        }

        await auxiliarySurgery.save();

        res.json({auxiliarySurgery});

    } catch (error) {
        next(error)
    }
    
}

export async function updateAuxiliarySurgery(req: Request, res: Response, next: NextFunction){
    try {
        
        const { id } = req.params;

        const {
            obersevation,
            status,
            cupsId,
            surgeryId
        } = req.body;

        const auxiliarySurgery = await SeguimientoAuxiliarCirugias.findOne({where: {id: parseInt(id)}})

        if (!auxiliarySurgery) {
            return res.status(404).json({ message: "Auxiliary surgery not found" });
        }

        auxiliarySurgery.observation = obersevation;
        auxiliarySurgery.status = status;
        auxiliarySurgery.cupsId = cupsId;
        auxiliarySurgery.surgeryId = surgeryId;

        const errors = await validate(auxiliarySurgery);

        if (errors.length > 0) {
            const message = errors.map(err => ({
                property: err.property,
                constraints: err.constraints
            }));
            return res.status(400).json({message: "Error updating auxiliary surgery", errors: message});
        }

        await auxiliarySurgery.save();

        return res.json(auxiliarySurgery);

    } catch (error) {
        next(error)
    }
}

export async function deleteAuxiliarySurgery(req: Request, res: Response, next: NextFunction){
    try {
        
        const { id } = req.params;

        const auxiliarySurgery = await SeguimientoAuxiliarCirugias.findOne({where: {id: parseInt(id)}})

        if (!auxiliarySurgery) {
            return res.status(404).json({ message: "Auxiliary surgery not found" });
        }

        await auxiliarySurgery.remove();

        res.json({ message: 'Auxiliary surgery deleted' });

    } catch (error) {
        next(error);
    }
}