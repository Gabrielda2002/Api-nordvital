import { NextFunction, Request, Response } from "express";
import { Programa } from "../entities/programa";

export const getProgramByName = async (req: Request, res: Response, next: NextFunction) => {
    try {
        
        const { name } = req.body;

        const program = await Programa.createQueryBuilder("program")
            .where("program.name LIKE :name", { name: `%${name}%` })
            .getMany();

        if (!program || program.length === 0) {
            return res.status(404).json({
                message: "Program not found",
            });
        }

        return res.status(200).json(program);

    } catch (error) {
        next(error);
    }
}

export const getAllPrograms = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const programs = await Programa.find();

        if (!programs || programs.length === 0) {
            return res.status(404).json({
                message: "Programs not found",
            });
        }

        return res.status(200).json(programs);
    } catch (error) {
        next(error);
    }
}