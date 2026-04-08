import { NextFunction, Request, Response } from "express";
import { ResultadoLlamada } from "../entities/resultado-llamada";

export const getAllResultCalls = async (req: Request, res: Response, next: NextFunction) => {
    try {
        
        const resultCalls = await ResultadoLlamada.find();

        if (!resultCalls || resultCalls.length === 0) {
            return res.status(404).json({ message: "Result Calls not found" });
        }

        res.status(200).json(resultCalls);

    } catch (error) {
        next(error);
    }
}

export const getResultCallByName = async (req: Request, res: Response, next: NextFunction) => {
    try {
        
        const { name } = req.body;

        let resultCall;
        
        if (name === "@") {
            resultCall = await ResultadoLlamada.createQueryBuilder("resultado_llamada")
            .limit(100)
            .getMany();
        }else {
            resultCall = await ResultadoLlamada.createQueryBuilder("resultado_llamada")
            .where("resultado_llamada.name LIKE :name", { name: `%${name}%` })
            .getMany();
        }

        if (!resultCall || resultCall.length === 0) {
            return res.status(404).json({ message: "Result Call not found" });
        }

        res.status(200).json(resultCall);

    } catch (error) {
        next(error);
    }
}