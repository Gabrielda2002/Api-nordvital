import { Request, Response } from "express";
import { TipoDocumento } from "../entities/tipo-documento";


export async function getAllDocumentType(req: Request, res: Response){
    try {
        const documentType = await TipoDocumento.find();
        return res.json(documentType);
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }
    }
}