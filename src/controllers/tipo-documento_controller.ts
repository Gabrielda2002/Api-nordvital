import { NextFunction, Request, Response } from "express";
import { TipoDocumento } from "../entities/tipo-documento";
import { validate } from "class-validator";


export async function getAllDocumentType(req: Request, res: Response, next: NextFunction){
    try {
        const documentType = await TipoDocumento.find();
        return res.json(documentType);
    } catch (error) {
        next(error);
    }
}

export async function getDocumentTypeById(req: Request, res: Response, next: NextFunction){
    try {

        const { id } = req.params;

        const documentType = await TipoDocumento.findOneBy({id : parseInt(id)});

        if(!documentType){
            return res.status(404).json({message: "Tipo de documento no encontrado"});
        }

        return res.json(documentType);

    } catch (error) {
        next(error);
    }
}

export async function createDocumentType(req: Request, res: Response, next: NextFunction){
    try {
        const { name } = req.body;

        const documentTypeExist = await TipoDocumento.findOneBy({name});

        if(documentTypeExist){
            return res.status(409).json({message: "Tipo de documento ya existe"});
        }

        const documentType = new TipoDocumento();
        documentType.name = name;
        documentType.status = true;

        const errors = await validate(documentType);

        if (errors.length > 0) {
            const errorsMessage = errors.map(err => ({
                property: err.property,
                constraints: err.constraints
            }))
            return res.status(400).json({"message" : "Ocurrio un error",errorsMessage});

        }

        await documentType.save();

        return res.json(documentType);
    } catch (error) {
        next(error);
    }
}

export async function updateDocumentType(req: Request, res: Response, next: NextFunction){
    try {
        const { id } = req.params;
        const { name, status } = req.body;

        const documentType = await TipoDocumento.findOneBy({id : parseInt(id)});

        if(!documentType){
            return res.status(404).json({message: "Tipo de documento no encontrado"});
        }

        documentType.name = name;
        documentType.status = status;

        const errors = await validate(documentType);

        if (errors.length > 0) {
            const errorsMessage = errors.map(err => ({
                property: err.property,
                constraints: err.constraints
            }))
            return res.status(400).json({"message" : "Ocurrio un error",errorsMessage});

        }

        await documentType.save();

        return res.json(documentType);

    } catch (error) {
        next(error);
    }
}

export async function deleteDocumentType(req: Request, res: Response, next: NextFunction){
    try {
        const { id } = req.params;

        const documentType = await TipoDocumento.findOneBy({id : parseInt(id)});

        if(!documentType){
            return res.status(404).json({message: "Tipo de documento no encontrado"});
        }

        await documentType.remove();

        return res.json({message: "Tipo de documento eliminado"});

    } catch (error) {
        next(error);
    }
}

// actualizar el estado de un tipo de documento

export async function updateStatusDocumentType(req: Request, res: Response, next: NextFunction){
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        console.log(status)
        console.log(Boolean(status));

        const tipoDocumento = await TipoDocumento.findOneBy({ id: parseInt(id) });

        if (!tipoDocumento) {
            return res.status(404).json({ message: 'Document type not fond' });
        }

        tipoDocumento.status = status == "1";

        const errors = await validate(tipoDocumento);

        if (errors.length > 0) {
            const messages = errors.map(err => ({
                property: err.property,
                constraints: err.constraints
            }))

            return res.status(400).json({ message: 'Error actualizando estado tipo documento', messages });
        }

        await tipoDocumento.save();

        return res.json(tipoDocumento);

    } catch (error) {
        next(error);
    }
}