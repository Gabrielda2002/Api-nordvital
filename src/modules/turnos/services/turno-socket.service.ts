import { io } from "../../../app";
import Logger from "@core/utils/logger-wrapper";
import { Turno, TurnoPriority, TurnoStatus } from "../entities/Turno";
import { TurnoSedeConfig } from "../entities/TurnoSedeConfig";
import { SesionAtencion } from "../entities/SesionAtencion";
import { TurnoQueueService } from "./turno-queue.service";
import { Between, In } from "typeorm";
import { TurnoDayService } from "./turno-day.service";
import { TurnoServiceCoverageService } from "./turno-service-coverage.service";

export interface TurnoLlamadoEventPayload {
  turnoId: number;
  ticketCode: string;
  ticketToken: string;
  priority: TurnoPriority;
  moduloCode: string;
  moduloName: string;
  userName: string;
  serviceName: string;
  callCount: number;
  calledAt: Date;
}

export interface TurnoEstadoEventPayload {
  turnoId: number;
  ticketToken: string;
  ticketCode: string;
  status: TurnoStatus;
  moduloCode?: string | null;
  moduloName?: string | null;
  aheadCount?: number;
  estimatedWaitMinutes?: number | null;
  updatedAt: Date;
}

export interface TurnoRetiradoEventPayload {
  turnoId: number;
  ticketCode: string;
  status: TurnoStatus;
  headquarterId: number;
  moduloCode?: string | null;
  moduloName?: string | null;
  updatedAt: Date;
}

export interface ColaActualizadaEventPayload {
  headquarterId: number;
  pendingCount: number;
  priorityPendingCount: number;
  lastCalledCode?: string | null;
  updatedAt: Date;
}

export class TurnoSocketService {
  static async notificarCambioSesiones(headquarterId: number): Promise<void> {
    const activeServiceIds = await TurnoServiceCoverageService.getActiveAssignedServiceIds(headquarterId);
    if (activeServiceIds.length === 0) return;

    const hasCompleteCoverage = await TurnoServiceCoverageService.hasCompleteCoverage(headquarterId);
    const servicesToRefresh = hasCompleteCoverage
      ? activeServiceIds.slice(0, 1)
      : activeServiceIds;
    await Promise.all(servicesToRefresh.map((serviceId) =>
      this.notificarAvanceCola(headquarterId, serviceId)
    ));
  }

  /**
   * Emite el evento de llamado de turno a la sala general de la sede
   * y a la sala dedicada de pantallas TV (para que la TV reproduzca el anuncio por voz).
   */
  static emitTurnoLlamado(headquarterId: number, payload: TurnoLlamadoEventPayload): void {
    if (!io) {
      Logger.warn("[TurnoSocketService] Socket.io no inicializado al emitir turno:llamado");
      return;
    }

    const sedeRoom = `sede_${headquarterId}`;
    const tvRoom = `sede_${headquarterId}_tv`;
    const ticketRoom = `ticket_${payload.ticketToken}`;

    io.to(sedeRoom).emit("turno:llamado", payload);
    io.to(tvRoom).emit("turno:llamado", payload);
    io.to(ticketRoom).emit("ticket:llamado", payload);

    Logger.info(
      `[TurnoSocketService] Evento turno:llamado emitido para ${payload.ticketCode} a salas ${sedeRoom}, ${tvRoom} y ${ticketRoom}`
    );
  }

  /**
   * Emite el evento de rellamado a las pantallas de sala y al ticket individual.
   */
  static emitTurnoRellamado(headquarterId: number, payload: TurnoLlamadoEventPayload): void {
    if (!io) {
      Logger.warn("[TurnoSocketService] Socket.io no inicializado al emitir turno:rellamado");
      return;
    }

    const sedeRoom = `sede_${headquarterId}`;
    const tvRoom = `sede_${headquarterId}_tv`;
    const ticketRoom = `ticket_${payload.ticketToken}`;

    io.to(sedeRoom).emit("turno:rellamado", payload);
    io.to(tvRoom).emit("turno:rellamado", payload);
    io.to(ticketRoom).emit("ticket:rellamado", payload);

    Logger.info(
      `[TurnoSocketService] Evento turno:rellamado (${payload.callCount}) emitido para ${payload.ticketCode}`
    );
  }

  /**
   * Emite la actualización de estado a la sala personal del ticket del paciente
   * (mantiene la vista móvil sincronizada).
   */
  static emitTicketEstado(payload: TurnoEstadoEventPayload): void {
    if (!io) {
      Logger.warn("[TurnoSocketService] Socket.io no inicializado al emitir ticket:actualizado");
      return;
    }

    const ticketRoom = `ticket_${payload.ticketToken}`;
    io.to(ticketRoom).emit("ticket:actualizado", payload);

    Logger.info(
      `[TurnoSocketService] Evento ticket:actualizado emitido a sala ${ticketRoom} (estado: ${payload.status})`
    );
  }

  /**
   * Emite actualización general de métricas de la cola a la sede
   */
  static emitColaActualizada(payload: ColaActualizadaEventPayload): void {
    if (!io) {
      Logger.warn("[TurnoSocketService] Socket.io no inicializado al emitir cola:actualizada");
      return;
    }

    const sedeRoom = `sede_${payload.headquarterId}`;
    io.to(sedeRoom).emit("cola:actualizada", payload);
    io.to(`${sedeRoom}_tv`).emit("cola:actualizada", payload);

    Logger.info(
      `[TurnoSocketService] Evento cola:actualizada emitido a ${sedeRoom} (pendientes: ${payload.pendingCount})`
    );
  }

  /**
   * Notifica a la pantalla TV y a la sede que un turno en pantalla ya no está activo
   * (fue FINALIZADO, NO_ASISTIO o CANCELADO) para que la TV lo retire de su panel de llamados.
   */
  static emitTurnoRetirado(headquarterId: number, payload: TurnoRetiradoEventPayload): void {
    if (!io) {
      Logger.warn("[TurnoSocketService] Socket.io no inicializado al emitir turno:retirado");
      return;
    }

    const sedeRoom = `sede_${headquarterId}`;
    const tvRoom = `sede_${headquarterId}_tv`;

    io.to(sedeRoom).emit("turno:retirado", payload);
    io.to(tvRoom).emit("turno:retirado", payload);

    Logger.info(
      `[TurnoSocketService] Evento turno:retirado emitido para ${payload.ticketCode} (${payload.status}) a salas ${sedeRoom} y ${tvRoom}`
    );
  }

  static emitTurnoActualizado(headquarterId: number, payload: TurnoRetiradoEventPayload): void {
    if (!io) return;
    io.to(`sede_${headquarterId}`).emit("turno:actualizado", payload);
    io.to(`sede_${headquarterId}_tv`).emit("turno:actualizado", payload);
  }

  /**
   * Recalcula la posición en cola y tiempo estimado para todos los turnos PENDIENTES
   * de un servicio y emite 'ticket:actualizado' a la sala privada de cada paciente.
   */
  static async notificarAvanceCola(
    headquarterId: number,
    serviceId: number,
  ): Promise<void> {
    try {
      if (!io) return;

      const { start: hoyInicio, end: hoyFin } = TurnoDayService.getRange();

      const pendingBySede = {
        headquarterId, status: TurnoStatus.PENDIENTE, createdAt: Between(hoyInicio, hoyFin),
      };
      const [pendingCount, priorityPendingCount] = await Promise.all([
        Turno.count({ where: pendingBySede }),
        Turno.count({ where: { ...pendingBySede, priority: TurnoPriority.PRIORITARIO } }),
      ]);
      this.emitColaActualizada({ headquarterId, pendingCount, priorityPendingCount, updatedAt: new Date() });

      const queueServiceIds = await TurnoServiceCoverageService.getQueueServiceIds(
        headquarterId,
        serviceId,
      );
      const pendingTurns = queueServiceIds.length === 0 ? [] : await Turno.find({
        where: {
          headquarterId,
          serviceId: In(queueServiceIds),
          status: TurnoStatus.PENDIENTE,
          createdAt: Between(hoyInicio, hoyFin),
        },
        order: { createdAt: "ASC", id: "ASC" },
      });
      if (pendingTurns.length === 0) return;

      const config = await TurnoSedeConfig.findOne({
        where: { headquarterId, isEnabled: true },
      });
      const avgMinutes = config?.averageServiceMinutes || 10;

      const sortedQueue = [...pendingTurns].sort(TurnoQueueService.compareQueueOrder);
      const activeSessionsByService = new Map<number, number>(await Promise.all(
        [...new Set(sortedQueue.map(({ serviceId: turnServiceId }) => turnServiceId))].map(async (turnServiceId) => [
          turnServiceId,
          await SesionAtencion.count({
            where: {
              headquarterId,
              isActive: true,
              modulo: { isActive: true },
              serviciosAsignados: { serviceId: turnServiceId },
            },
          }),
        ] as const)
      ));

      for (const turno of sortedQueue) {
        const aheadCount = TurnoQueueService.calculateAheadCount(turno, sortedQueue);
        const estimatedWaitMinutes = TurnoQueueService.calculateEstimatedWaitMinutes(
          aheadCount,
          avgMinutes,
          activeSessionsByService.get(turno.serviceId) ?? 0
        );

        this.emitTicketEstado({
          turnoId: turno.id,
          ticketToken: turno.ticketToken,
          ticketCode: turno.ticketCode,
          status: turno.status,
          aheadCount,
          estimatedWaitMinutes,
          updatedAt: new Date(),
        });
      }
    } catch (error) {
      Logger.error(`[TurnoSocketService] Error al notificar avance de cola: ${error}`);
    }
  }
}
