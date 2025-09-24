import { Between } from "typeorm";
import { DemandaInducida } from "../entities/demanda-inducida";
import { ProgramaMetaHistorico } from "../entities/programa-meta-historico";
import { validate } from "class-validator";
import { Professional } from "../types/Professional.type";

export class ProgramaMetaService {
  static async setGoalMonth(
    programId: number,
    goal: number,
    year: number,
    month: number,
    professional: string,
    headquarter?: number
  ): Promise<ProgramaMetaHistorico> {

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    const currentDay = currentDate.getDate();

    const lastDayOfCurrentMonth = new Date(currentYear, currentMonth, 0).getDate();
    const isLastDayOfMonth = currentDay === lastDayOfCurrentMonth;

    let nextMonth = currentMonth + 1;
    let nextYear = currentYear;
    if (nextMonth > 12) {
      nextMonth = 1;
      nextYear = currentYear + 1;
    }

    const isCreatingNextMonthGoal = (year === nextYear && month === nextMonth);

    const goalExist = await ProgramaMetaHistorico.createQueryBuilder("goal")
      .where("goal.programaId = :programId", { programId })
      .andWhere("goal.año = :year", { year })
      .andWhere("goal.mes = :month", { month })
      .andWhere("goal.professional = :professional", { professional })
      .andWhere("goal.headquartersId = :headquartersId", { headquartersId: headquarter })
      .getOne();

    if (goalExist) {
      throw new Error("Goal for this month already exists.");
    }

    const isCurrentMonth = (year === currentYear && month === currentMonth);

    if (!isCurrentMonth && !(isCreatingNextMonthGoal && isLastDayOfMonth)) {
      throw new Error("Goals can only be created for the current month or the next month on the last day of the current month.");
    }
    console.log(headquarter, "sede del usuario");
    const newGoal = new ProgramaMetaHistorico();
    newGoal.programaId = programId;
    newGoal.meta = Number(goal);
    newGoal.año = year;
    newGoal.mes = month;
    newGoal.activo = true;
    newGoal.professional = professional as Professional;
    newGoal.headquartersId = Number(headquarter);

    const errors = await validate(newGoal);

    if (errors.length > 0) {
      const message = errors.map((err) => ({
        property: err.property,
        constraints: err.constraints,
      }));
      throw new Error(`Validation failed: ${JSON.stringify(message)}`);
    }

    return await newGoal.save();
  }

  static async updateGoalMonth(
    programId: number,
    goal: number,
    year: number,
    month: number,
    professional: string
  ): Promise<ProgramaMetaHistorico> {
    const goalExist = await ProgramaMetaHistorico.createQueryBuilder("goal")
      .where("goal.programaId = :programId", { programId })
      .andWhere("goal.año = :year", { year })
      .andWhere("goal.mes = :month", { month })
      .andWhere("goal.professional = :professional", { professional })
      .andWhere("goal.activo = true")
      .getOne();

    if (!goalExist) {
      throw new Error("Goal for this month does not exist.");
    }

    goalExist.meta = goal;

    const errors = await validate(goalExist);
    if (errors.length > 0) {
      const message = errors.map((err) => ({
        property: err.property,
        constraints: err.constraints,
      }));
      throw new Error(`Validation failed: ${JSON.stringify(message)}`);
    }

    return await goalExist.save();
  }

  static async getGoalMonth(
    programId: number,
    year: number,
    month: number,
    headquartersId?: number,
    rolCurrentUser?: string | number
  ): Promise<ProgramaMetaHistorico | null> {

    const query =  await ProgramaMetaHistorico.createQueryBuilder("goal")
      .where("goal.programaId = :programId", { programId })
      .andWhere("goal.año = :year", { year })
      .andWhere("goal.mes = :month", { month })
      .andWhere("goal.activo = true")

      if (rolCurrentUser == "19" || rolCurrentUser == "21" || rolCurrentUser == "1") {
          query.andWhere("goal.headquartersId = :headquartersId", { headquartersId })
      }

    return await query.getOne();
  }

  static async getHistoryGoals(
    programId: number
  ): Promise<ProgramaMetaHistorico[]> {
    const dateNow = new Date();
    const yearNow = dateNow.getFullYear();
    const monthNow = dateNow.getMonth() + 1;

    let yearStart = yearNow;
    let monthStart = monthNow;

    if (monthStart <= 0) {
      yearStart = yearNow - 1;
      monthStart = 12 + monthStart;
    }

    return await ProgramaMetaHistorico.createQueryBuilder("goal")
      .where("goal.programaId = :programId", { programId })
      .andWhere("goal.activo = true")
      .andWhere(
        "(goal.año > :yearStart OR (goal.año = :yearStart AND goal.mes >= :monthStart))",
        { yearStart, monthStart }
      )
      .andWhere(
        "(goal.año < :yearNow OR (goal.año = :yearNow AND goal.mes <= :monthNow))",
        { yearNow, monthNow }
      )
      .orderBy("goal.año", "ASC")
      .addOrderBy("goal.mes", "ASC")
      .getMany();
  }

  static async getCompleteGoals(
    programaId: number,
    year: number,
    month: number
  ): Promise<{
    goal: number;
    register: number;
    achieved: number;
    percentage: number;
  } | null> {
    const goal = await this.getGoalMonth(programaId, year, month);

    if (!goal) return null;

    const dateStart = new Date(year, month - 1, 1);
    const dateEnd = new Date(year, month, 0, 23, 59, 59);

    const register = await DemandaInducida.count({
      where: {
        programaId,
        createdAt: Between(dateStart, dateEnd),
      },
    });

    const achieved = register - goal.meta;
    const porcentage = (achieved / goal.meta) * 100;

    return {
      goal: goal.meta,
      register,
      achieved,
      percentage: Math.round(porcentage * 100),
    };
  }
}
