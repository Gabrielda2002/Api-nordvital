import { Request, Response } from "express";
import { IpsRemite } from "../entities/ips-remite";

export async function getAllIpsRemite(req: Request, res: Response){
    try {
        
        const ipsRemite = await IpsRemite.find();
        return res.json(ipsRemite);

    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
            res.status(500).json({message: error.message});
        }    }
}