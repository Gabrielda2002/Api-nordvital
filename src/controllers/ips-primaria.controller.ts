import { NextFunction, Request, Response } from "express";
import { IpsPrimaria } from "../entities/ips-primaria";
import { validate } from "class-validator";

export async function getAllIpsPrimaria(req: Request, res: Response, next: NextFunction){
    try {
        
        const ipsPrimaria = await IpsPrimaria.find();
        return res.json(ipsPrimaria);

    } catch (error) {
        next(error);
    }
}

export async function getIpsPrimaria(req: Request, res: Response, next: NextFunction) {
    try {
        
        const { id } = req.params;

        const ipsPrimaria = await IpsPrimaria.findOneBy({ id: parseInt(id) });

        if (!ipsPrimaria) {
            return res.status(404).json({ message: "Ips Primaria not found" });
        }

        return res.json(ipsPrimaria);

    } catch (error) {
        next(error);
    }
}

export async function createIpsPrimaria(req: Request, res: Response, next: NextFunction) {
    try {
        
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ message: "Name is required" });
        }

        const ipsPrimariaExist = await IpsPrimaria.findOneBy({ name });

        if (ipsPrimariaExist) {
            return res.status(400).json({ message: "Ips Primaria already exists" });
        }

        const ipsPrimaria = new IpsPrimaria();
        ipsPrimaria.name = name;
        ipsPrimaria.status = true;

        const errors = await validate(ipsPrimaria);

        if (errors.length > 0) {
            
            const errorsMessage = errors.map(err => ({
                property: err.property,
                constraints: err.constraints
            }))

            return res.status(400).json(errorsMessage);

        }

        await ipsPrimaria.save();

        return res.json(ipsPrimaria);

    } catch (error) {
        next(error);
    }
}

export async function updateIpsPrimaria(req: Request, res: Response, next: NextFunction) {
    try {
        
        const { id } = req.params;
        const { name, status } = req.body;

        const ipsPrimaria = await IpsPrimaria.findOneBy({ id: parseInt(id) });

        if (!ipsPrimaria) {
            return res.status(404).json({ message: "Ips Primaria not found" });
        }

        ipsPrimaria.name = name;
        ipsPrimaria.status = status;

        const errors = await validate(ipsPrimaria);

        if (errors.length > 0) {
            
            const errorsMessage = errors.map(err => ({
                property: err.property,
                constraints: err.constraints
            }))

            return res.status(400).json({"message" : "Error updating ips primaria ",errorsMessage});

        }

        await ipsPrimaria.save();

        return res.json(ipsPrimaria);

    } catch (error) {
        next(error);
    }
}

export async function deleteIpsPrimaria(req: Request, res: Response, next: NextFunction) {
    try {
        
        const { id } = req.params;

        const ipsPrimaria = await IpsPrimaria.findOneBy({ id: parseInt(id) });

        if (!ipsPrimaria) {
            return res.status(404).json({ message: "Ips Primaria not found" });
        }

        await ipsPrimaria.remove();

        return res.json({ message: "Ips Primaria deleted" });

    } catch (error) {
        next(error);
    }
}

export async function getIpsPrimariaByName(req: Request, res: Response, next: NextFunction) {
    try {
        
        const { name } = req.body;

        const ipsPrimaria = await IpsPrimaria.createQueryBuilder("ipsPrimaria")
            .where("ipsPrimaria.name LIKE :name", { name: `%${name}%` })
            .getMany();

        if (!ipsPrimaria) {
            return res.status(404).json({ message: "Ips Primaria not found" });
        }
        return res.json(ipsPrimaria);

    } catch (error) {
        next(error);
    }
}

// actualizar el estado de la ips primaria
export async function updateStatusIpsPrimaria(req: Request, res: Response, next: NextFunction) {
    try {
        
        const { id } = req.params;
        const { status, name } = req.body;

        const ipsPrimaria = await IpsPrimaria.findOneBy({ id: parseInt(id) });

        if (!ipsPrimaria) {
            return res.status(404).json({ message: "Ips Primaria not found" });
        }

        if (name) {
            ipsPrimaria.name = name;
        }

        if (status !== undefined && status !== "") {
            ipsPrimaria.status = status == "1";
        }

        const errors = await validate(ipsPrimaria);

        if (errors.length > 0) {
            const messages = errors.map(err => ({
                property: err.property,
                constraints: err.constraints
            }))

            return res.status(400).json({ message: 'Error actualizando estado radicador', messages });
        }

        await ipsPrimaria.save();

        return res.json(ipsPrimaria);

    } catch (error) {
        next(error);
    }
}