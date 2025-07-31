import { NextFunction, Request, Response } from "express";
import { ProgramaMetaHistorico } from "../entities/programa-meta-historico";
import { validate } from "class-validator";
import { ProgramaMetaService } from "../services/ProgramaMetaService";
import { Usuarios } from "../entities/usuarios";
import { LugarRadicacion } from "../entities/lugar-radicacion";
import { Programa } from "../entities/programa";

export const getGoalsByPrograms = async (req: Request, res: Response, next: NextFunction) => {
    try {
        
        const yearNow = new Date().getFullYear();
        const monthNow = new Date().getMonth() + 1;

        const rolCurrentUser = req.user?.rol;

        const idCurrentUser = req.user?.id;

        const headquartersCurrentUser = await Usuarios.createQueryBuilder("usuario")
            .where("usuario.id = :id", { id: idCurrentUser })
            .getOne();

        const programs = await ProgramaMetaHistorico.createQueryBuilder("goal")
        .leftJoinAndSelect("goal.programaRelation", "program")
        .leftJoinAndSelect("goal.headquartersRelation", "sede")
        .where("goal.activo = true")
        .andWhere("goal.año = :year", { year: yearNow })
        .andWhere("goal.mes = :month", { month: monthNow })
        .orderBy("program.name", "ASC")

        if (rolCurrentUser == "19" || rolCurrentUser == "21") {
            programs.andWhere("goal.headquartersId = :headquartersId", { headquartersId: headquartersCurrentUser?.headquarters });
        }

        const programsList = await programs.getMany();

        const programsFormatted = programsList.map(g => ({
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

        const headquartersExist = await LugarRadicacion.findOneBy({ name: headquarters });

        const headquartersId = headquartersExist?.id;

        const programExists = await Programa.findOneBy({ name: program });

        const programId = programExists?.id;

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

        if (!programId || !goal) {
            return res.status(400).json({ message: "Program and goal not found." });
        }

        const savedGoal = await ProgramaMetaService.setGoalMonth(
            programId,
            goal,
            targetYear,
            targetMonth,
            professional,
            headquartersId
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