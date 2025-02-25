import { NextFunction, Request, Response } from "express";
import { Prioridad } from "../entities/prioridad";

export async function getAllPriority(req: Request, res: Response, next: NextFunction){
    try {
        
        const priorities = await Prioridad.find();

        res.json(priorities);

    } catch (error) {
        next(error);
    }
}

export async function getPriorityById(req: Request, res: Response, next: NextFunction){
    try {
        
        const { id } = req.params;

        const priority = await Prioridad.findOneBy({ id: parseInt(id) });

        if (!priority) {
            return res.status(404).json({ message: "Priority not found" });
        }

        return res.json(priority);

    } catch (error) {
        next(error);
    }
}

export async function createPriority(req: Request, res: Response, next: NextFunction){
    try {
        
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ message: "Name is required" });
        }

        const priorityExist = await Prioridad.findOneBy({ name });

        if (priorityExist) {
            return res.status(400).json({ message: "Priority already exists" });
        }

        const priority = new Prioridad();
        priority.name = name;

        await priority.save();

        return res.json(priority);

    } catch (error) {
        next(error);
    }
}

export async function updatePriority(req: Request, res: Response, next: NextFunction){
    try {
        
        const { id } = req.params;
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ message: "Name is required" });
        }

        const priority = await Prioridad.findOneBy({ id: parseInt(id) });

        if (!priority) {
            return res.status(404).json({ message: "Priority not found" });
        }

        priority.name = name;

        await priority.save();

        return res.json(priority);

    } catch (error) {
        next(error);
    }
}

export async function deletePriority(req: Request, res: Response, next: NextFunction){
    try {
        
        const { id } = req.params;

        const priority = await Prioridad.findOneBy({ id: parseInt(id) });

        if (!priority) {
            return res.status(404).json({ message: "Priority not found" });
        }

        await priority.remove();

        return res.json({ message: "Priority deleted" });

    } catch (error) {
        next(error);
    }
}