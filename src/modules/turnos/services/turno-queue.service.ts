import { Turno, TurnoPriority, TurnoStatus } from "../entities/Turno";
import { TurnoTracking } from "../entities/TurnoTracking";
import { BadRequestError, ConflictError, NotFoundError } from "@core/utils/custom-errors";
import { EntityManager } from "typeorm";
import { TurnoDayService } from "./turno-day.service";

export type TurnoAction =
  | "LLAMAR"
  | "RELLAMAR"
  | "INICIAR"
  | "FINALIZAR"
  | "NO_ASISTIO"
  | "TRANSFERIR"
  | "CANCELAR";

export interface QueuePositionResult {
  aheadCount: number;
  estimatedWaitMinutes: number | null;
}

export interface QueueServiceCoverageSession {
  moduloId: number;
  serviceIds: number[];
}

export class TurnoQueueService {
  static hasCompleteServiceCoverage(
    activeServiceIds: number[],
    activeModuleIds: number[],
    sessions: QueueServiceCoverageSession[]
  ): boolean {
    if (activeServiceIds.length === 0 || activeModuleIds.length === 0) return false;

    const servicesByModule = new Map<number, Set<number>>();
    for (const session of sessions) {
      const assignedServices = servicesByModule.get(session.moduloId) ?? new Set<number>();
      for (const serviceId of session.serviceIds) assignedServices.add(serviceId);
      servicesByModule.set(session.moduloId, assignedServices);
    }

    return activeModuleIds.every((moduleId) => {
      const assignedServices = servicesByModule.get(moduleId);
      if (!assignedServices) return false;
      return activeServiceIds.every((serviceId) => assignedServices.has(serviceId));
    });
  }

  /**
   * Genera el código alfanumérico visible del ticket según la prioridad y correlativo
   * Ej: Prioritario número 5 -> P-005, General número 12 -> G-012
   */
  static generateTicketCode(priority: TurnoPriority, dailyNumber: number): string {
    const prefix = priority === TurnoPriority.PRIORITARIO ? "P" : "G";
    const formattedNumber = String(dailyNumber).padStart(3, "0");
    return `${prefix}-${formattedNumber}`;
  }

  /**
   * Comparador determinista de prioridad según la Ley 1171 de Colombia:
   * 1. Turno PRIORITARIO precede a GENERAL sin importar hora de llegada.
   * 2. Misma prioridad desempata por orden de llegada (FIFO / createdAt más antiguo primero).
   */
  static compareQueueOrder(
    a: { id: number; priority: TurnoPriority; createdAt: Date },
    b: { id: number; priority: TurnoPriority; createdAt: Date }
  ): number {
    if (a.priority !== b.priority) {
      return a.priority === TurnoPriority.PRIORITARIO ? -1 : 1;
    }

    const timeDiff = a.createdAt.getTime() - b.createdAt.getTime();
    if (timeDiff !== 0) {
      return timeDiff;
    }

    return a.id - b.id;
  }

  /**
   * Calcula cuántos turnos en estado PENDIENTE están por delante del turno consultado.
   */
  static calculateAheadCount(
    myTurn: { id: number; priority: TurnoPriority; createdAt: Date },
    pendingTurns: Array<{ id: number; priority: TurnoPriority; createdAt: Date }>
  ): number {
    return pendingTurns.filter((turn) => {
      if (turn.id === myTurn.id) return false;
      return this.compareQueueOrder(turn, myTurn) < 0;
    }).length;
  }

  /**
   * Calcula el tiempo estimado de espera en minutos basado en los turnos precedentes
   * y la cantidad de asesores atendiendo activamente.
   */
  static calculateEstimatedWaitMinutes(
    aheadCount: number,
    averageServiceMinutes: number = 10,
    activeAdvisorsCount: number = 1
  ): number | null {
    if (activeAdvisorsCount <= 0) return null;
    if (aheadCount <= 0) return 0;
    return Math.ceil((aheadCount * averageServiceMinutes) / activeAdvisorsCount);
  }

  /**
   * Validador de la máquina de estados del ciclo de vida del turno.
   * Garantiza que solo ocurran transiciones legales.
   */
  static validateTransition(
    currentStatus: TurnoStatus,
    action: TurnoAction
  ): TurnoStatus {
    switch (action) {
      case "LLAMAR":
        if (currentStatus !== TurnoStatus.PENDIENTE) {
          throw new ConflictError(
            `No se puede llamar un turno que está en estado "${currentStatus}". Solo aplica para turnos en "PENDIENTE".`
          );
        }
        return TurnoStatus.LLAMADO;

      case "RELLAMAR":
        if (currentStatus !== TurnoStatus.LLAMADO) {
          throw new ConflictError(
            `Solo se puede rellamar un turno en estado "LLAMADO". El estado actual es "${currentStatus}".`
          );
        }
        return TurnoStatus.LLAMADO;

      case "INICIAR":
        if (currentStatus !== TurnoStatus.LLAMADO) {
          throw new ConflictError(
            `Para iniciar atención el turno debe estar en estado "LLAMADO". El estado actual es "${currentStatus}".`
          );
        }
        return TurnoStatus.EN_ATENCION;

      case "FINALIZAR":
        if (currentStatus !== TurnoStatus.EN_ATENCION) {
          throw new ConflictError(
            `Solo se puede finalizar un turno que se encuentra "EN_ATENCION". El estado actual es "${currentStatus}".`
          );
        }
        return TurnoStatus.FINALIZADO;

      case "NO_ASISTIO":
        if (currentStatus !== TurnoStatus.LLAMADO) {
          throw new ConflictError(
            `Solo se puede marcar no asistió sobre un turno que ha sido "LLAMADO". El estado actual es "${currentStatus}".`
          );
        }
        return TurnoStatus.NO_ASISTIO;

      case "TRANSFERIR":
        if (currentStatus !== TurnoStatus.EN_ATENCION) {
          throw new ConflictError(
            `Solo se puede transferir un turno que está "EN_ATENCION". El estado actual es "${currentStatus}".`
          );
        }
        return TurnoStatus.TRANSFERIDO;

      case "CANCELAR":
        if (currentStatus !== TurnoStatus.LLAMADO && currentStatus !== TurnoStatus.EN_ATENCION) {
          throw new ConflictError(
            `Solo se puede cancelar un turno llamado o en atención. El estado actual es "${currentStatus}".`
          );
        }
        return TurnoStatus.CANCELADO;

      default:
        throw new BadRequestError(`Acción de turno desconocida: "${action}"`);
    }
  }

  /**
   * Obtiene el siguiente número correlativo diario para la sede actual.
   * Se reinicia automáticamente a las 00:00 de cada día.
   */
  static async getNextDailyNumber(
    headquarterId: number,
    targetDate: Date = new Date(),
    manager: EntityManager = Turno.getRepository().manager
  ): Promise<number> {
    const { start: dayStart, end: dayEnd } = TurnoDayService.getRange(targetDate);

    const lastTurno = await manager.createQueryBuilder(Turno, "turno")
      .where("turno.headquarter_id = :headquarterId", { headquarterId })
      .andWhere("turno.created_at BETWEEN :dayStart AND :dayEnd", {
        dayStart,
        dayEnd,
      })
      .orderBy("turno.daily_number", "DESC")
      .getOne();

    return (lastTurno?.dailyNumber || 0) + 1;
  }

  /**
   * Selecciona y despacha el siguiente turno en cola para la sesión del asesor
   * respetando la prioridad legal (PRIORITARIO > GENERAL) y orden FIFO.
   */
  static async getNextInQueue(
    manager: EntityManager,
    headquarterId: number,
    serviceIds: number[],
  ): Promise<Turno | null> {
    if (!serviceIds || serviceIds.length === 0) {
      return null;
    }

    const { start, end } = TurnoDayService.getRange();
    const nextTurno = await manager.createQueryBuilder(Turno, "turno")
      .where("turno.headquarter_id = :headquarterId", { headquarterId })
      .andWhere("turno.service_id IN (:...serviceIds)", { serviceIds })
      .andWhere("turno.status = :status", { status: TurnoStatus.PENDIENTE })
      .andWhere("turno.created_at BETWEEN :start AND :end", { start, end })
      .orderBy("CASE WHEN turno.priority = 'PRIORITARIO' THEN 1 ELSE 2 END", "ASC")
      .addOrderBy("turno.created_at", "ASC")
      .addOrderBy("turno.id", "ASC")
      .setLock("pessimistic_write")
      .getOne();

    return nextTurno;
  }

  /**
   * Registra una transición de estado inmutable en el historial de trazabilidad.
   */
  static async recordTracking(
    turnoId: number,
    status: string,
    moduloId?: number | null,
    userId?: number | null,
    notes?: string | null
  ): Promise<TurnoTracking> {
    const tracking = new TurnoTracking();
    tracking.turnoId = turnoId;
    tracking.status = status;
    tracking.moduloId = moduloId || null;
    tracking.userId = userId || null;
    tracking.notes = notes || null;

    return await tracking.save();
  }
}
