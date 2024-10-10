import { NextFunction, Request, Response } from "express";
import { IpsRemite } from "../entities/ips-remite";
import { validate } from "class-validator";

export async function getAllIpsRemite(req: Request, res: Response, next: NextFunction){
    try {
        
        const ipsRemite = await IpsRemite.find();
        return res.json(ipsRemite);

    } catch (error) {
        next(error);
    }
}

export async function getIpsRemite(req: Request, res: Response, next: NextFunction) {
    try {
        
        const { id } = req.params;

        const ipsRemite = await IpsRemite.findOneBy({ id: parseInt(id) });

        if (!ipsRemite) {
            return res.status(404).json({ message: "Ips Remite not found" });
        }

        return res.json(ipsRemite);

    } catch (error) {
        next(error);
    }
}

export async function createIpsRemite(req: Request, res: Response, next: NextFunction) {
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
        next(error);
    }
}

export async function updateIpsRemite(req: Request, res: Response, next: NextFunction) {
    try {
        
        const { id } = req.params;
        const { name, status } = req.body;

        const ipsRemite = await IpsRemite.findOneBy({ id: parseInt(id) });

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
        next(error);
    }
}

export async function deleteIpsRemite(req: Request, res: Response, next: NextFunction) {
    try {
        
        const { id } = req.params;

        const ipsRemite = await IpsRemite.findOneBy({ id: parseInt(id) });

        if (!ipsRemite) {
            return res.status(404).json({ message: "Ips Remite not found" });
        }

        await ipsRemite.remove();

        return res.json({ message: "Ips Remite deleted" });

    } catch (error) {
        next(error);
    }
}

export async function getIpsRemiteByName(req: Request, res: Response, next: NextFunction) {
    try {
        
        const { name } = req.body;

        const ipsRemite = await IpsRemite.createQueryBuilder("ipsRemite")
            .where("ipsRemite.name LIKE :name", { name: `%${name}%` })
            .getMany();

        if (ipsRemite.length === 0) {
            return res.status(404).json({ message: "Ips Remite not found" });
            
        }

        return res.json(ipsRemite);

    } catch (error) {
        next(error);
    }
}

// actualizar el estado de la ips remite
export async function updateStatusIpsRemite(req: Request, res: Response, next: NextFunction) {
    try {
        
        const { id } = req.params;
        const { status, name } = req.body;

        const ipsRemite = await IpsRemite.findOneBy({ id: parseInt(id) });

        if (!ipsRemite) {
            return res.status(404).json({ message: "Ips Remite not found" });
        }

        if (name) {
            ipsRemite.name = name;
        }

        if (status !== undefined && status !== "") {
            ipsRemite.status = status == "1";
        }

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
        next(error);
    }
}