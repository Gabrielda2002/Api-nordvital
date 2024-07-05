import { Request, Response } from "express";
import { IpsPrimaria } from "../entities/ips-primaria";

export async function getAllIpsPrimaria(req: Request, res: Response){
    try {
        
        const ipsPrimaria = await IpsPrimaria.find();
        return res.json(ipsPrimaria);

    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }
    }
}