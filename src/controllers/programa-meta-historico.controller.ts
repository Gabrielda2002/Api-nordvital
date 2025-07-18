import { NextFunction, Request, Response } from "express";
import { ProgramaMetaHistorico } from "../entities/programa-meta-historico";
import { validate } from "class-validator";
import { ProgramaMetaService } from "../services/ProgramaMetaService";

export const getGoalsByPrograms = async (req: Request, res: Response, next: NextFunction) => {
    try {
        
        const programs = await ProgramaMetaHistorico.createQueryBuilder("goal")
        .leftJoinAndSelect("goal.programaRelation", "program")
        .where("goal.activo = true")
        .orderBy("program.name", "ASC")
        .getMany();
        
        if (!programs || programs.length === 0) {
            return res.status(404).json({ message: "No se encontraron metas activas." });
        }
        
        const programsFormatted = programs.map(g => ({
            id: g.id,
            program: g.programaRelation?.name || "N/A",
            goal: g.meta,
            year: g.año,
            month: g.mes,
        }))

        return res.status(200).json(programsFormatted);

    } catch (error) {
        next(error);
    }
}

export const createGoal = async (req: Request, res: Response, next: NextFunction) => {
    try {
        
        const { program :id, goal } = req.body;

        const yearNow = new Date().getFullYear();
        const monthNow = new Date().getMonth() + 1;

        if (!id || !goal) {
            return res.status(400).json({ message: "Program and goal not found." });
        }

        const savedGoal = await ProgramaMetaService.setGoalMonth(
            id,
            goal,
            yearNow,
            monthNow
        );
        
        return res.status(201).json(savedGoal);

    } catch (error) {
        next(error);
    }
}