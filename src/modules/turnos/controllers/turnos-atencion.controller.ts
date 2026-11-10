import { NextFunction, Request, Response } from "express";
import { SesionAtencion } from "../entities/SesionAtencion";
import { SesionAtencionServicio } from "../entities/SesionAtencionServicio";
import { ModuloAtencion } from "../entities/ModuloAtencion";
import { Turno, TurnoPriority, TurnoStatus } from "../entities/Turno";
import { TurnoQueueService, TurnoAction } from "../services/turno-queue.service";
import { TurnoSocketService } from "../services/turno-socket.service";
import { BadRequestError, ConflictError, NotFoundError, UnauthorizedError } from "@core/utils/custom-errors";
import { validateEntity } from "@core/utils/validation-helper";
import { Between, In } from "typeorm";
import { TurnoDayService } from "../services/turno-day.service";

export class TurnosAtencionController {
  /**
   * Inicia la sesión de atención de un asesor en un módulo físico con servicios asignados.
   */
  static async iniciarSesion(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = Number(req.user?.id);
      if (!userId) throw new UnauthorizedError("Usuario no autenticado");

      const { moduloId, serviceIds } = req.body;

      if (!moduloId) throw new BadRequestError("El ID de módulo es requerido");
      if (!serviceIds || !Array.isArray(serviceIds) || serviceIds.length === 0) {
        throw new BadRequestError("Debe seleccionar al menos un servicio de atención");
      }

      // 1. Validar existencia del módulo
      const modulo = await ModuloAtencion.findOne({
        where: { id: Number(moduloId), isActive: true },
      });
      if (!modulo) {
        throw new NotFoundError("El módulo de atención no existe o está inactivo");
      }

      // 2. Validar que no haya otro asesor con sesión activa en este módulo
      const moduloOcupado = await SesionAtencion.findOne({
        where: { moduloId: modulo.id, isActive: true },
      });

      if (moduloOcupado && moduloOcupado.userId !== userId) {
        throw new ConflictError("El módulo seleccionado ya está ocupado por otro asesor");
      }

      // 3. Cerrar cualquier sesión activa previa de este mismo usuario
      const previousSessions = await SesionAtencion.find({
        where: { userId, isActive: true }, relations: ["serviciosAsignados"],
      });
      await SesionAtencion.update(
        { userId, isActive: true },
        { isActive: false, endedAt: new Date() }
      );

      // 4. Crear nueva sesión activa
      const sesion = new SesionAtencion();
      sesion.userId = userId;
      sesion.moduloId = modulo.id;
      sesion.headquarterId = modulo.headquarterId;
      sesion.startedAt = new Date();
      sesion.isActive = true;

      await validateEntity(sesion);
      await sesion.save();

      // 5. Vincular servicios asignados
      for (const serviceId of serviceIds) {
        const sesionServicio = new SesionAtencionServicio();
        sesionServicio.sesionId = sesion.id;
        sesionServicio.serviceId = Number(serviceId);
        await sesionServicio.save();
      }

      const affectedHeadquarterIds = new Set([
        modulo.headquarterId,
        ...previousSessions.map(({ headquarterId }) => headquarterId),
      ]);
      await Promise.all([...affectedHeadquarterIds].map((headquarterId) =>
        TurnoSocketService.notificarCambioSesiones(headquarterId)
      ));

      return res.status(201).json({
        message: "Sesión de atención iniciada con éxito",
        sesionId: sesion.id,
        modulo: {
          id: modulo.id,
          code: modulo.code,
          name: modulo.name,
        },
        headquarterId: modulo.headquarterId,
        serviceIds,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Cierra la sesión activa del asesor y libera la ventanilla.
   */
  static async cerrarSesion(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = Number(req.user?.id);
      if (!userId) throw new UnauthorizedError("Usuario no autenticado");

      const sesionActiva = await SesionAtencion.findOne({
        where: { userId, isActive: true },
        relations: ["serviciosAsignados"],
      });

      if (!sesionActiva) {
        throw new BadRequestError("No tienes una sesión de atención activa para cerrar");
      }

      // Validar si tiene un turno pendiente en atención
      const turnoEnCurso = await Turno.findOne({
        where: {
          currentUserId: userId,
          status: TurnoStatus.EN_ATENCION,
        },
      });

      if (turnoEnCurso) {
        throw new ConflictError(
          `Tienes un turno en atención (${turnoEnCurso.ticketCode}). Debes finalizarlo antes de cerrar tu sesión.`
        );
      }

      sesionActiva.isActive = false;
      sesionActiva.endedAt = new Date();
      await sesionActiva.save();

      await TurnoSocketService.notificarCambioSesiones(sesionActiva.headquarterId);

      return res.json({
        message: "Sesión de atención cerrada correctamente",
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtiene el estado de la sesión actual del asesor y el turno en curso.
   */
  static async getEstadoActual(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = Number(req.user?.id);
      if (!userId) throw new UnauthorizedError("Usuario no autenticado");

      const sesion = await SesionAtencion.findOne({
        where: { userId, isActive: true },
        relations: ["modulo", "serviciosAsignados", "serviciosAsignados.service"],
      });

      if (!sesion) {
        return res.json({
          hasActiveSession: false,
          session: null,
          activeTurn: null,
        });
      }

      // Buscar turno actual del asesor
      const activeTurn = await Turno.findOne({
        where: {
          currentUserId: userId,
          status: In([TurnoStatus.LLAMADO, TurnoStatus.EN_ATENCION]),
        },
        relations: ["patient", "service", "currentModulo"],
      });

      // Contar turnos pendientes en la cola para sus servicios
      const serviceIds = sesion.serviciosAsignados.map((s) => s.serviceId);
      const { start, end } = TurnoDayService.getRange();
      const pendingCount = serviceIds.length > 0
        ? await Turno.count({
            where: {
              headquarterId: sesion.headquarterId,
              serviceId: In(serviceIds),
              status: TurnoStatus.PENDIENTE,
              createdAt: Between(start, end),
            },
          })
        : 0;

      return res.json({
        hasActiveSession: true,
        session: {
          id: sesion.id,
          startedAt: sesion.startedAt,
          modulo: {
            id: sesion.modulo?.id,
            code: sesion.modulo?.code,
            name: sesion.modulo?.name,
          },
          services: sesion.serviciosAsignados.map((s) => ({
            id: s.serviceId,
            name: s.service?.name,
          })),
        },
        activeTurn: activeTurn
          ? {
              id: activeTurn.id,
              ticketCode: activeTurn.ticketCode,
              ticketToken: activeTurn.ticketToken,
              priority: activeTurn.priority,
              status: activeTurn.status,
              callCount: activeTurn.callCount,
              patient: {
                name: activeTurn.patient?.name,
                documentNumber: activeTurn.patient?.documentNumber,
              },
              service: {
                id: activeTurn.service?.id,
                name: activeTurn.service?.name,
              },
              calledAt: activeTurn.calledAt,
              startedAt: activeTurn.startedAt,
            }
          : null,
        pendingQueueCount: pendingCount,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Ejecuta una acción de la máquina de estados sobre los turnos.
   * Acciones: LLAMAR, RELLAMAR, INICIAR, FINALIZAR, NO_ASISTIO, TRANSFERIR, CANCELAR
   */
  static async ejecutarAccion(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = Number(req.user?.id);
      if (!userId) throw new UnauthorizedError("Usuario no autenticado");

      const { action, turnoId, newServiceId, notes } = req.body as {
        action: TurnoAction;
        turnoId?: number;
        newServiceId?: number;
        notes?: string;
      };

      if (!action) throw new BadRequestError("La acción a ejecutar es requerida");

      // 1. Obtener la sesión activa del asesor
      const sesion = await SesionAtencion.findOne({
        where: { userId, isActive: true },
        relations: ["modulo", "serviciosAsignados", "user"],
      });

      if (!sesion) {
        throw new ConflictError("Debes tener una sesión de atención activa para ejecutar acciones sobre turnos");
      }

      const serviceIds = sesion.serviciosAsignados.map((s) => s.serviceId);

      // ==========================================
      // ACCIÓN: LLAMAR SIGUIENTE
      // ==========================================
      if (action === "LLAMAR") {
        // Verificar que no tenga un turno en atención activo
        const turnoEnAtencion = await Turno.findOne({
          where: { currentUserId: userId, status: TurnoStatus.EN_ATENCION },
        });

        if (turnoEnAtencion) {
          throw new ConflictError(
            `Ya tienes un paciente en atención (${turnoEnAtencion.ticketCode}). Finaliza la atención actual antes de llamar al siguiente.`
          );
        }

        // Si tenía un turno en LLAMADO que no se inició, marcarlo automáticamente como no asistió o requerir acción
        const turnoLlamadoPrevio = await Turno.findOne({
          where: { currentUserId: userId, status: TurnoStatus.LLAMADO },
        });

        if (turnoLlamadoPrevio) {
          throw new ConflictError(
            `El turno ${turnoLlamadoPrevio.ticketCode} sigue en llamado. Debes iniciar su atención o marcar 'No asistió' antes de llamar al siguiente.`
          );
        }

        // Buscar siguiente turno en cola
        const nextTurno = await TurnoQueueService.getNextInQueue(sesion.headquarterId, serviceIds);

        if (!nextTurno) {
          return res.json({
            message: "No hay turnos pendientes en cola para los servicios asignados",
            action: "LLAMAR",
            turno: null,
          });
        }

        // Transición a LLAMADO
        TurnoQueueService.validateTransition(nextTurno.status, "LLAMAR");

        nextTurno.status = TurnoStatus.LLAMADO;
        nextTurno.currentUserId = userId;
        nextTurno.currentModuloId = sesion.moduloId;
        nextTurno.calledAt = new Date();
        nextTurno.callCount = 1;

        await nextTurno.save();
        await TurnoQueueService.recordTracking(
          nextTurno.id,
          TurnoStatus.LLAMADO,
          sesion.moduloId,
          userId,
          notes || "Llamado a ventanilla"
        );

        // Emitir eventos Socket.IO a salas de TV y sede
        TurnoSocketService.emitTurnoLlamado(sesion.headquarterId, {
          turnoId: nextTurno.id,
          ticketCode: nextTurno.ticketCode,
          ticketToken: nextTurno.ticketToken,
          priority: nextTurno.priority,
          moduloCode: sesion.modulo?.code || "",
          moduloName: sesion.modulo?.name || "",
          userName: sesion.user?.name || "",
          serviceName: nextTurno.service?.name || "",
          callCount: 1,
          calledAt: nextTurno.calledAt,
        });

        // Notificar en tiempo real a los turnos que siguen en espera (avanzó la cola)
        await TurnoSocketService.notificarAvanceCola(sesion.headquarterId, nextTurno.serviceId);

        return res.json({
          message: `Turno ${nextTurno.ticketCode} llamado con éxito`,
          action: "LLAMAR",
          turno: {
            id: nextTurno.id,
            ticketCode: nextTurno.ticketCode,
            ticketToken: nextTurno.ticketToken,
            priority: nextTurno.priority,
            status: nextTurno.status,
            patientName: nextTurno.patient?.name,
            serviceName: nextTurno.service?.name,
            callCount: nextTurno.callCount,
            calledAt: nextTurno.calledAt,
          },
        });
      }

      // Para las demás acciones, obtener el turno objetivo
      let turno: Turno | null = null;
      if (turnoId) {
        turno = await Turno.findOne({
          where: { id: Number(turnoId) },
          relations: ["patient", "service", "currentModulo", "currentUser"],
        });
      } else {
        // Si no se envía ID, buscar el turno activo del asesor
        turno = await Turno.findOne({
          where: {
            currentUserId: userId,
            status: In([TurnoStatus.LLAMADO, TurnoStatus.EN_ATENCION]),
          },
          relations: ["patient", "service", "currentModulo", "currentUser"],
        });
      }

      if (!turno) {
        throw new NotFoundError("No se encontró el turno especificado o no tienes un turno activo en atención");
      }

      // Validar transición en la máquina de estados
      const nextStatus = TurnoQueueService.validateTransition(turno.status, action);

      // ==========================================
      // ACCIÓN: RELLAMAR
      // ==========================================
      if (action === "RELLAMAR") {
        turno.callCount += 1;
        turno.calledAt = new Date();
        await turno.save();

        await TurnoQueueService.recordTracking(
          turno.id,
          TurnoStatus.LLAMADO,
          sesion.moduloId,
          userId,
          `Rellamado número ${turno.callCount}`
        );

        TurnoSocketService.emitTurnoRellamado(sesion.headquarterId, {
          turnoId: turno.id,
          ticketCode: turno.ticketCode,
          ticketToken: turno.ticketToken,
          priority: turno.priority,
          moduloCode: sesion.modulo?.code || "",
          moduloName: sesion.modulo?.name || "",
          userName: sesion.user?.name || "",
          serviceName: turno.service?.name || "",
          callCount: turno.callCount,
          calledAt: turno.calledAt,
        });

        return res.json({
          message: `Rellamado (${turno.callCount}) ejecutado para ${turno.ticketCode}`,
          action: "RELLAMAR",
          turno: {
            id: turno.id,
            ticketCode: turno.ticketCode,
            status: turno.status,
            callCount: turno.callCount,
          },
        });
      }

      // ==========================================
      // ACCIÓN: INICIAR ATENCIÓN
      // ==========================================
      if (action === "INICIAR") {
        const startedAt = new Date();
        const result = await Turno.update(
          { id: turno.id, status: TurnoStatus.LLAMADO },
          { status: nextStatus, startedAt }
        );
        if (result.affected !== 1) throw new ConflictError("El turno cambió de estado. Actualiza el panel antes de iniciar la atención");
        turno.status = nextStatus;
        turno.startedAt = startedAt;

        await TurnoQueueService.recordTracking(
          turno.id,
          nextStatus,
          sesion.moduloId,
          userId,
          notes || "Inicio de atención presencial"
        );

        TurnoSocketService.emitTicketEstado({
          turnoId: turno.id,
          ticketToken: turno.ticketToken,
          ticketCode: turno.ticketCode,
          status: turno.status,
          moduloCode: sesion.modulo?.code,
          moduloName: sesion.modulo?.name,
          updatedAt: new Date(),
        });

        TurnoSocketService.emitTurnoActualizado(sesion.headquarterId, {
          turnoId: turno.id, ticketCode: turno.ticketCode, status: turno.status,
          headquarterId: sesion.headquarterId, moduloCode: sesion.modulo?.code,
          moduloName: sesion.modulo?.name, updatedAt: new Date(),
        });

        return res.json({
          message: `Atención iniciada para ${turno.ticketCode}`,
          action: "INICIAR",
          turno: {
            id: turno.id,
            ticketCode: turno.ticketCode,
            status: turno.status,
            startedAt: turno.startedAt,
          },
        });
      }

      // ==========================================
      // ACCIÓN: FINALIZAR ATENCIÓN
      // ==========================================
      if (action === "FINALIZAR") {
        turno.status = nextStatus;
        turno.finishedAt = new Date();
        await turno.save();

        await TurnoQueueService.recordTracking(
          turno.id,
          nextStatus,
          sesion.moduloId,
          userId,
          notes || "Atención finalizada con éxito"
        );

        TurnoSocketService.emitTicketEstado({
          turnoId: turno.id,
          ticketToken: turno.ticketToken,
          ticketCode: turno.ticketCode,
          status: turno.status,
          updatedAt: new Date(),
        });

        // Notificar a la TV que retire el turno llamado
        TurnoSocketService.emitTurnoRetirado(sesion.headquarterId, {
          turnoId: turno.id,
          ticketCode: turno.ticketCode,
          status: turno.status,
          headquarterId: sesion.headquarterId,
          moduloCode: sesion.modulo?.code,
          moduloName: sesion.modulo?.name,
          updatedAt: new Date(),
        });

        return res.json({
          message: `Atención finalizada para ${turno.ticketCode}. Se habilitó la encuesta de satisfacción.`,
          action: "FINALIZAR",
          turno: {
            id: turno.id,
            ticketCode: turno.ticketCode,
            status: turno.status,
            finishedAt: turno.finishedAt,
          },
        });
      }

      // ==========================================
      // ACCIÓN: NO ASISTIÓ
      // ==========================================
      if (action === "NO_ASISTIO") {
        turno.status = nextStatus;
        turno.finishedAt = new Date();
        await turno.save();

        await TurnoQueueService.recordTracking(
          turno.id,
          nextStatus,
          sesion.moduloId,
          userId,
          notes || `Paciente ausente tras ${turno.callCount} llamados`
        );

        TurnoSocketService.emitTicketEstado({
          turnoId: turno.id,
          ticketToken: turno.ticketToken,
          ticketCode: turno.ticketCode,
          status: turno.status,
          updatedAt: new Date(),
        });

        // Notificar a la TV que retire el turno llamado
        TurnoSocketService.emitTurnoRetirado(sesion.headquarterId, {
          turnoId: turno.id,
          ticketCode: turno.ticketCode,
          status: turno.status,
          headquarterId: sesion.headquarterId,
          moduloCode: sesion.modulo?.code,
          moduloName: sesion.modulo?.name,
          updatedAt: new Date(),
        });

        return res.json({
          message: `Turno ${turno.ticketCode} marcado como no asistió`,
          action: "NO_ASISTIO",
          turno: {
            id: turno.id,
            ticketCode: turno.ticketCode,
            status: turno.status,
          },
        });
      }

      // ==========================================
      // ACCIÓN: TRANSFERIR DE SERVICIO
      // ==========================================
      if (action === "TRANSFERIR") {
        if (!newServiceId) {
          throw new BadRequestError("El ID del nuevo servicio es requerido para la transferencia");
        }

        // Trazar que fue transferido desde el servicio anterior
        await TurnoQueueService.recordTracking(
          turno.id,
          TurnoStatus.TRANSFERIDO,
          sesion.moduloId,
          userId,
          notes || `Transferido al servicio ID ${newServiceId}`
        );

        // Reubicar el turno en la cola del nuevo servicio en estado PENDIENTE conservando prioridad
        turno.serviceId = Number(newServiceId);
        turno.status = TurnoStatus.PENDIENTE;
        turno.currentModuloId = null;
        turno.currentUserId = null;
        turno.calledAt = null;
        turno.startedAt = null;
        await turno.save();

        await TurnoQueueService.recordTracking(
          turno.id,
          TurnoStatus.PENDIENTE,
          null,
          null,
          `Reingreso a cola en nuevo servicio (${newServiceId})`
        );

        TurnoSocketService.emitTicketEstado({
          turnoId: turno.id,
          ticketToken: turno.ticketToken,
          ticketCode: turno.ticketCode,
          status: turno.status,
          updatedAt: new Date(),
        });

        // Notificar a la TV que retire el turno llamado
        TurnoSocketService.emitTurnoRetirado(sesion.headquarterId, {
          turnoId: turno.id,
          ticketCode: turno.ticketCode,
          status: turno.status,
          headquarterId: sesion.headquarterId,
          moduloCode: sesion.modulo?.code,
          moduloName: sesion.modulo?.name,
          updatedAt: new Date(),
        });

        // Notificar avance de cola al nuevo servicio
        await TurnoSocketService.notificarAvanceCola(sesion.headquarterId, Number(newServiceId));

        return res.json({
          message: `Turno ${turno.ticketCode} transferido con éxito al nuevo servicio`,
          action: "TRANSFERIR",
          turno: {
            id: turno.id,
            ticketCode: turno.ticketCode,
            newServiceId: turno.serviceId,
            status: turno.status,
          },
        });
      }

      // ==========================================
      // ACCIÓN: CANCELAR
      // ==========================================
      if (action === "CANCELAR") {
        turno.status = nextStatus;
        turno.finishedAt = new Date();
        await turno.save();

        await TurnoQueueService.recordTracking(
          turno.id,
          nextStatus,
          sesion.moduloId,
          userId,
          notes || "Turno cancelado administrativamente"
        );

        TurnoSocketService.emitTicketEstado({
          turnoId: turno.id,
          ticketToken: turno.ticketToken,
          ticketCode: turno.ticketCode,
          status: turno.status,
          updatedAt: new Date(),
        });

        TurnoSocketService.emitTurnoRetirado(sesion.headquarterId, {
          turnoId: turno.id,
          ticketCode: turno.ticketCode,
          status: turno.status,
          headquarterId: sesion.headquarterId,
          moduloCode: sesion.modulo?.code,
          moduloName: sesion.modulo?.name,
          updatedAt: new Date(),
        });

        await TurnoSocketService.notificarAvanceCola(sesion.headquarterId, turno.serviceId);

        return res.json({
          message: `Turno ${turno.ticketCode} cancelado`,
          action: "CANCELAR",
          turno: {
            id: turno.id,
            ticketCode: turno.ticketCode,
            status: turno.status,
          },
        });
      }
    } catch (error) {
      next(error);
    }
  }
}
