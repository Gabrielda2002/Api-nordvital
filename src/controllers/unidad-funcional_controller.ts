import { Request, Response } from "express";
import { UnidadFuncional } from "../entities/unidad-funcional";

export async function getAllUnidadFuncional(req: Request, res: Response){

    try {
     
        const unidadFuncional = await UnidadFuncional.find();
        return res.json(unidadFuncional);

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Internal Server Error"});
    }

}