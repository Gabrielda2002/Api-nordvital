import { TurnoStatus } from "../entities/Turno";
import { TurnoTracking } from "../entities/TurnoTracking";

export class TurnoTvService {
  static async getRecentCalls(
    headquarterId: number,
    { start, end }: { start: Date; end: Date },
  ) {
    const calls = await TurnoTracking.createQueryBuilder("tracking")
      .innerJoin("tracking.turno", "turno")
      .leftJoin("tracking.modulo", "modulo")
      .select([
        "tracking.id",
        "tracking.createdAt",
        "turno.id",
        "turno.ticketCode",
        "modulo.id",
        "modulo.code",
        "modulo.name",
      ])
      .where("turno.headquarterId = :headquarterId", { headquarterId })
      .andWhere("tracking.status = :calledStatus", { calledStatus: TurnoStatus.LLAMADO })
      .andWhere("tracking.createdAt BETWEEN :start AND :end", { start, end })
      .andWhere((query) => {
        const latestCall = query.subQuery()
          .select("recent.id")
          .from(TurnoTracking, "recent")
          .where("recent.turnoId = tracking.turnoId")
          .andWhere("recent.status = :calledStatus")
          .andWhere("recent.createdAt BETWEEN :start AND :end")
          .orderBy("recent.createdAt", "DESC")
          .addOrderBy("recent.id", "DESC")
          .limit(1)
          .getQuery();

        return `tracking.id = ${latestCall}`;
      })
      .orderBy("tracking.createdAt", "DESC")
      .addOrderBy("tracking.id", "DESC")
      // Ambos joins son muchos-a-uno: no multiplican las filas del historial.
      .limit(5)
      .getMany();

    return calls.map(({ turno, modulo, createdAt }) => ({
      ticketCode: turno.ticketCode,
      moduloCode: modulo?.code ?? "",
      moduloName: modulo?.name ?? "",
      calledAt: createdAt,
    }));
  }
}
