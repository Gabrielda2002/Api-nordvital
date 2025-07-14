import { Between } from "typeorm";
import { DemandaInducida } from "../entities/demanda-inducida";
import { ProgramaMetaHistorico } from "../entities/programa-meta-historico";
import { validate } from "class-validator";

export class ProgramaMetaService {
  static async setGoalMonth(
    programId: number,
    goal: number,
    year: number,
    month: number
  ): Promise<ProgramaMetaHistorico> {
    const goalExist = await ProgramaMetaHistorico.createQueryBuilder("goal")
      .where("goal.programaId = :programId", { programId })
      .andWhere("goal.año = :year", { year })
      .andWhere("goal.mes = :month", { month })
      .getOne();

    if (goalExist) {
      goalExist.meta = goal;
      goalExist.activo = true;
      return await goalExist.save();
    } else {
      const newGoal = new ProgramaMetaHistorico();
      newGoal.programaId = programId;
      newGoal.meta = goal;
      newGoal.año = year;
      newGoal.mes = month;
      newGoal.activo = true;

        const errors = await validate(newGoal);

    if (errors.length > 0) {
        const message = errors.map(err => ({
            property: err.property,
            constraints: err.constraints
        }));
        throw new Error(`Validation failed: ${message}`);
    }

      return await newGoal.save();
    }
  }

  static async getGoalMonth(
    programId: number,
    year: number,
    month: number
  ): Promise<ProgramaMetaHistorico | null> {
    return await ProgramaMetaHistorico.createQueryBuilder("goal")
      .where("goal.programaId = :programId", { programId })
      .andWhere("goal.año = :year", { year })
      .andWhere("goal.mes = :month", { month })
      .andWhere("goal.activo = true")
      .getOne();
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
