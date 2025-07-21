import { NextFunction, Request, Response } from "express";
import { ProgramaMetaHistorico } from "../entities/programa-meta-historico";
import { validate } from "class-validator";
import { ProgramaMetaService } from "../services/ProgramaMetaService";

export const getGoalsByPrograms = async (req: Request, res: Response, next: NextFunction) => {
    try {
        
        const yearNow = new Date().getFullYear();
        const monthNow = new Date().getMonth() + 1;

        const programs = await ProgramaMetaHistorico.createQueryBuilder("goal")
        .leftJoinAndSelect("goal.programaRelation", "program")
        .where("goal.activo = true")
        .andWhere("goal.año = :year", { year: yearNow })
        .andWhere("goal.mes = :month", { month: monthNow })
        .orderBy("program.name", "ASC")
        .getMany();
        
        const programsFormatted = programs.map(g => ({
            id: g.id,
            program: g.programaRelation?.name || "N/A",
            goal: g.meta,
            year: g.año,
            month: g.mes,
            professional: g.professional,
        }))

        return res.status(200).json(programsFormatted);

    } catch (error) {
        next(error);
    }
}

export const createGoal = async (req: Request, res: Response, next: NextFunction) => {
    try {
        
        const {id, goal, professional } = req.body;

        const yearNow = new Date().getFullYear();
        const monthNow = new Date().getMonth() + 1;

        if (!id || !goal) {
            return res.status(400).json({ message: "Program and goal not found." });
        }

        const savedGoal = await ProgramaMetaService.setGoalMonth(
            id,
            goal,
            yearNow,
            monthNow,
            professional
        );
        
        return res.status(201).json(savedGoal);

    } catch (error) {
        next(error);
    }
}