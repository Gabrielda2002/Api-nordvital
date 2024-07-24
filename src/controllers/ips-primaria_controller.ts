import { Request, Response } from "express";
import { IpsPrimaria } from "../entities/ips-primaria";
import { validate, ValidationError } from "class-validator";

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

export async function getIpsPrimaria(req: Request, res: Response){
    try {
        
        const { id } = req.params;

        const ipsPrimariaId = parseInt(id);

        if (isNaN(ipsPrimariaId)) {
            return res.status(400).json({ message: "Id must be a number" });
        }

        const ipsPrimaria = await IpsPrimaria.findOneBy({ id: ipsPrimariaId });

        if (!ipsPrimaria) {
            return res.status(404).json({ message: "Ips Primaria not found" });
        }

        return res.json(ipsPrimaria);

    } catch (error) {
        
        console.log(error);

        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }

        return res.status(500).json({ message: "Internal Server Error" });
        
    }
}

export async function createIpsPrimaria(req: Request, res: Response){
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
        
        console.log(error);

        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }

        return res.status(500).json({ message: "Internal Server Error" });

    }
}

export async function updateIpsPrimaria(req: Request, res: Response){
    try {
        
        const { id } = req.params;
        const { name, status } = req.body;

        const ipsPrimariaId = parseInt(id);

        if (isNaN(ipsPrimariaId)) {
            return res.status(400).json({ message: "Id must be a number" });
        }

        const ipsPrimaria = await IpsPrimaria.findOneBy({ id: ipsPrimariaId });

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
        
        console.log(error);

        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }

        return res.status(500).json({ message: "Internal Server Error" });

    }
}

export async function deleteIpsPrimaria(req: Request, res: Response) {
    try {
        
        const { id } = req.params;

        const ipsPrimariaId = parseInt(id);

        if (isNaN(ipsPrimariaId)) {
            return res.status(400).json({ message: "Id must be a number" });
        }

        const ipsPrimaria = await IpsPrimaria.findOneBy({ id: ipsPrimariaId });

        if (!ipsPrimaria) {
            return res.status(404).json({ message: "Ips Primaria not found" });
        }

        await ipsPrimaria.remove();

        return res.json({ message: "Ips Primaria deleted" });

    } catch (error) {
        
        console.log(error);

        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }

        return res.status(500).json({ message: "Internal Server Error" });

    }
}