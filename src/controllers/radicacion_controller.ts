import { Request, Response } from "express";
import { Radicacion } from "../entities/radicacion";

export async function getAllRadicacion(req: Request, res: Response) {

    try {
        const radicacion = await Radicacion.find();
        return res.json(radicacion);
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }
    }
};

export async function getRadicacionById(req: Request, res: Response){
    try {
        const { id } = req.params;

        const radicacion = await Radicacion.findOneBy( {id: parseInt(id)} );
        return res.json(radicacion);

    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }
    }
}

export async function createRadicado(req: Request, res: Response){
    try {
        const { id, name, email,landline, phoneNumber, address, agreement , documentNumber,documentType } = req.body;

        const radicacado = new Radicacion();

        radicacado.documentNumber = documentNumber;
        radicacado.documentType = documentType;
        radicacado.patientName = name;
        radicacado.email = email;
        radicacado.phoneNumber = phoneNumber;
        radicacado.landline = landline;
        radicacado.address = address;
        radicacado.agreement = agreement;

        await radicacado.save();

        return res.json(radicacado);

    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }
    }
}