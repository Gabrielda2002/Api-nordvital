import { NextFunction, Request, Response } from "express";
import { ProgramaMetaHistorico } from "../entities/programa-meta-historico";
import { validate } from "class-validator";
import { ProgramaMetaService } from "../services/ProgramaMetaService";

export const getGoalsByPrograms = async (req: Request, res: Response, next: NextFunction) => {
    try {
        
        const programs = await ProgramaMetaHistorico.createQueryBuilder("goal")
        .leftJoinAndSelect("goal.programaRelation", "program")
        .where("goal.activo = true")
        .select([
            "goal.id",
            "goal.meta",
            "goal.año",
            "goal.mes",
            "program.id",
            "program.name",
            "goal.createdAt",
        ])
        .orderBy("program.name", "ASC")
        .getMany();
        
        if (!programs || programs.length === 0) {
            return res.status(404).json({ message: "No se encontraron metas activas." });
        }

        return res.status(200).json(programs);

    } catch (error) {
        next(error);
    }
}

export const createGoal = async (req: Request, res: Response, next: NextFunction) => {
    try {
        
        const { programId, goal } = req.body;

        const yearNow = new Date().getFullYear();
        const monthNow = new Date().getMonth() + 1;

        if (!programId || !goal) {
            return res.status(400).json({ message: "Program and goal not found." });
        }

        // const newGoal = new ProgramaMetaHistorico();
        // newGoal.programaId = programId;
        // newGoal.meta = goal;
        // newGoal.año = yearNow;
        // newGoal.mes = monthNow;
        // newGoal.activo = true;

        // const errors = await validate(newGoal);
        // if (errors.length > 0) {
        //     const message = errors.map(err => ({
        //         property: err.property,
        //         constraints: err.constraints
        //     }));
        //     return res.status(400).json({ message: "Validation failed", errors: message });
        // }

        const savedGoal = ProgramaMetaService.setGoalMonth(
            programId,
            goal,
            yearNow,
            monthNow  
        );
        
        return res.status(201).json(savedGoal);

    } catch (error) {
        next(error);
    }
}