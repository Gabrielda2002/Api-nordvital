import { NextFunction, Request, Response } from "express";
import { PausasActivas } from "../entities/pausas-activas";
import { validate } from "class-validator";

export async function getAllActiveBrakes(
    req: Request,
    res: Response,
    next: NextFunction
){
    try {
        
        const activeBrakes = await PausasActivas.createQueryBuilder("pausas_activas")
        .getMany();

        return res.json(activeBrakes);
    } catch (error) {
        next(error);
    }
}

export async function getActiveBrakeById(
    req: Request,
    res: Response,
    next: NextFunction
){
    try {
        const { id } = req.params;

        const activeBrake = await PausasActivas.createQueryBuilder("pausas_activas")
        .where({ id: parseInt(id) })
        .getOne();

        if (!activeBrake) {
            return res.status(404).json({ message: "Active brake not found" });
        }

        return res.json(activeBrake);
    } catch (error) {
        next(error);
    }
}   

export async function createActiveBrake(
    req: Request,
    res: Response,
    next: NextFunction
){
    try {
        const { observation, userId } = req.body;

        const activeBrake = new PausasActivas();
        activeBrake.observation = observation || null;
        activeBrake.userId = parseInt(userId);

        const errors = await validate(activeBrake);

        if (errors.length > 0) {
            const messages = errors.map((err) => ({
                property: err.property,
                constraints: err.constraints,
            }));

            return res
                .status(400)
                .json({ message: "Error creating active brake", messages });
        }

        await activeBrake.save();

        return res.json(activeBrake);
    } catch (error) {
        next(error);
    }
}

export async function updateActiveBrake(
    req: Request,
    res: Response,
    next: NextFunction
){
    try {
        const { id } = req.params;
        const { observation, userId } = req.body;

        const activeBrake = await PausasActivas.createQueryBuilder("pausas_activas")
        .where({ id: parseInt(id) })
        .getOne();

        if (!activeBrake) {
            return res.status(404).json({ message: "Active brake not found" });
        }

        activeBrake.observation = observation;
        activeBrake.userId = parseInt(userId);

        const errors = await validate(activeBrake);

        if (errors.length > 0) {
            const messages = errors.map((err) => ({
                property: err.property,
                constraints: err.constraints,
            }));

            return res
                .status(400)
                .json({ message: "Error updating active brake", messages });
        }

        await activeBrake.save();

        return res.json(activeBrake);
    } catch (error) {
        next(error);
    }
}

export async function deleteActiveBrake(
    req: Request,
    res: Response,
    next: NextFunction
){
    try {
        const { id } = req.params;

        const activeBrake = await PausasActivas.createQueryBuilder("pausas_activas")
        .where({ id: parseInt(id) })
        .getOne();

        if (!activeBrake) {
            return res.status(404).json({ message: "Active brake not found" });
        }

        await activeBrake.remove();

        return res.json({ message: "Active brake deleted" });
    } catch (error) {
        next(error);
    }
}