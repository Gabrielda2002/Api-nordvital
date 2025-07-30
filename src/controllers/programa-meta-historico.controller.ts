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
        .leftJoinAndSelect("goal.headquartersRelation", "sede")
        .where("goal.activo = true")
        .andWhere("goal.año = :year", { year: yearNow })
        .andWhere("goal.mes = :month", { month: monthNow })
        .orderBy("program.name", "ASC")
        .getMany();
        
        const programsFormatted = programs.map(g => ({
            id: g.id,
            program: g.programaRelation?.name,
            goal: g.meta,
            year: g.año,
            month: g.mes,
            professional: g.professional,
            headquarters: g.headquartersRelation?.name,
        }))

        return res.status(200).json(programsFormatted);

    } catch (error) {
        next(error);
    }
}

export const createGoal = async (req: Request, res: Response, next: NextFunction) => {
    try {
        
        const {program, goal, professional, headquarters } = req.body;

        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1;
        const currentDay = currentDate.getDate();

        const lastDayOfCurrentMonth = new Date(currentYear, currentMonth, 0).getDate();
        const isLastDayOfMonth = currentDay === lastDayOfCurrentMonth;

        let targetYear = currentYear;
        let targetMonth = currentMonth;

        if (isLastDayOfMonth) {
            targetMonth = currentMonth + 1;
            if (targetMonth > 12) {
                targetMonth = 1;
                targetYear = currentYear + 1;
            }
        }

        if (!program || !goal) {
            return res.status(400).json({ message: "Program and goal not found." });
        }

        const savedGoal = await ProgramaMetaService.setGoalMonth(
            program,
            goal,
            targetYear,
            targetMonth,
            professional,
            headquarters
        );
        
        return res.status(201).json(savedGoal);

    } catch (error) {
        next(error);
    }
}

export const deleteGoal = async (req: Request, res: Response, next: NextFunction) => {
    try {
        
        const { id } = req.params;

        const goalExists = await ProgramaMetaHistorico.findOneBy({ id: Number(id) });

        if (!goalExists) {
            return res.status(404).json({ message: "Goal not found." });
        }

        await goalExists.remove();

        return res.status(200).json({ message: "Goal deleted successfully." });

    } catch (error) {
        next(error);
    }
}