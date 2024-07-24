import { Request, Response } from "express";
import { IpsRemite } from "../entities/ips-remite";
import { validate } from "class-validator";
import { error } from "console";

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

export async function getIpsRemite(req: Request, res: Response){
    try {
        
        const { id } = req.params;

        const ipsRemiteId = parseInt(id);

        if (isNaN(ipsRemiteId)) {
            return res.status(400).json({ message: "Id must be a number" });
        }

        const ipsRemite = await IpsRemite.findOneBy({ id: ipsRemiteId });

        if (!ipsRemite) {
            return res.status(404).json({ message: "Ips Remite not found" });
        }

        return res.json(ipsRemite);

    } catch (error) {
        
        console.log(error);

        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }

        return res.status(500).json({ message: "Internal Server Error" });

    }
}

export async function createIpsRemite(req: Request, res: Response) {
    try {
        
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ message: "Name is required" });
        }

        const ipsRemiteExist = await IpsRemite.findOneBy({ name });

        if (ipsRemiteExist) {
            return res.status(400).json({ message: "Ips Remite already exists" });
        }

        const ipsRemite = new IpsRemite();
        ipsRemite.name = name;
        ipsRemite.status = true;

        const erros = await validate(ipsRemite);

        if (erros.length > 0) {

            const messages = erros.map(err => ({
                property: err.property,
                constraints: err.constraints
            }))

            return res.status(400).json({ message: "Error creating ips Remite ",  messages });

        }

        await ipsRemite.save();

        return res.json(ipsRemite);

    } catch (error) {
        
        console.log(error);

        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }

        return res.status(500).json({ message: "Internal Server Error" });

    }
}

export async function updateIpsRemite(req: Request, res: Response) {
    try {
        
        const { id } = req.params;
        const { name, status } = req.body;

        const ipsRemiteId = parseInt(id);

        if (isNaN(ipsRemiteId)) {
            return res.status(400).json({ message: "Id must be a number" });
        }

        const ipsRemite = await IpsRemite.findOneBy({ id: ipsRemiteId });

        if (!ipsRemite) {
            return res.status(404).json({ message: "Ips Remite not found" });
        }

        ipsRemite.name = name;
        ipsRemite.status = status;

        const errors = await validate(ipsRemite);

        if (errors.length > 0) {

            const messages = errors.map(err => ({
                property: err.property,
                constraints: err.constraints
            }));

            return res.status(400).json({ message: "Error updating ips Remite", messages });

        }

        await ipsRemite.save();

        return res.json(ipsRemite);

    } catch (error) {
        
        console.log(error);

        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }

        return res.status(500).json({ message: "Internal Server Error" });

    }
}

export async function deleteIpsRemite(req: Request, res: Response) {
    try {
        
        const { id } = req.params;

        const ipsRemiteId = parseInt(id);

        if (isNaN(ipsRemiteId)) {
            return res.status(400).json({ message: "Id must be a number" });
        }

        const ipsRemite = await IpsRemite.findOneBy({ id: ipsRemiteId });

        if (!ipsRemite) {
            return res.status(404).json({ message: "Ips Remite not found" });
        }

        await ipsRemite.remove();

        return res.json({ message: "Ips Remite deleted" });

    } catch (error) {
        
        console.log(error);

        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }

        return res.status(500).json({ message: "Internal Server Error" });
    }
}