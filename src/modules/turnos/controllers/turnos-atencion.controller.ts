import { NextFunction, Request, Response } from "express";
import { SesionAtencion } from "../entities/SesionAtencion";
import { SesionAtencionServicio } from "../entities/SesionAtencionServicio";
import { ModuloAtencion } from "../entities/ModuloAtencion";
import { Turno, TurnoStatus } from "../entities/Turno";
import {
  TurnoQueueService,
  TurnoAction,
} from "../services/turno-queue.service";
import { TurnoSocketService } from "../services/turno-socket.service";
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from "@core/utils/custom-errors";
import { validateEntity } from "@core/utils/validation-helper";
import { Between, In } from "typeorm";
import { TurnoDayService } from "../services/turno-day.service";
import { ServicioAtencion } from "../../catalog/entities/servicio-atencion";
import { Sedes } from "../../catalog/entities/sedes";
import { TurnoSedeServicio } from "../entities/TurnoSedeServicio";
import { TurnoTracking } from "../entities/TurnoTracking";

export class TurnosAtencionController {
  static async getOpcionesSesion(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const userId = Number(req.user?.id);
      if (!userId) throw new UnauthorizedError("Usuario no autenticado");

      const [modules, services, siteAssignments] = await Promise.all([
        ModuloAtencion.find({
          where: { isActive: true },
          relations: ["headquarter"],
          order: { headquarterId: "ASC", code: "ASC" },
        }),
        ServicioAtencion.find({
          where: { status: true },
          order: { name: "ASC" },
        }),
        TurnoSedeServicio.find({ select: ["headquarterId", "serviceId"] }),
      ]);
      const activeSessions = await SesionAtencion.find({
        where: { isActive: true },
      });
      const occupiedModuleIds = new Set(
        activeSessions
          .filter((session) => session.userId !== userId)
          .map((session) => session.moduloId),
      );

      return res.json({
        modules: modules.map((module) => ({
          id: module.id,
          headquarterId: module.headquarterId,
          headquarterName: module.headquarter?.name,
          code: module.code,
          name: module.name,
          isAvailable: !occupiedModuleIds.has(module.id),
        })),
        services: services.map(({ id, name }) => ({ id, name })),
        servicesByHeadquarter: [...new Set(modules.map(({ headquarterId }) => headquarterId))].map((headquarterId) => {
          const assignedIds = new Set(siteAssignments
            .filter((assignment) => assignment.headquarterId === headquarterId)
            .map(({ serviceId }) => serviceId));
          return {
            headquarterId,
            services: services
              .filter(({ id }) => assignedIds.has(id))
              .map(({ id, name }) => ({ id, name })),
          };
        }),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Inicia la sesión de atención de un asesor en un módulo físico con servicios asignados.
   */
  static async iniciarSesion(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = Number(req.user?.id);
      if (!userId) throw new UnauthorizedError("Usuario no autenticado");

      const { moduloId, serviceIds } = req.body;

      if (!moduloId) throw new BadRequestError("El ID de módulo es requerido");
      if (
        !serviceIds ||
        !Array.isArray(serviceIds) ||
        serviceIds.length === 0
      ) {
        throw new BadRequestError(
          "Debe seleccionar al menos un servicio de atención",
        );
      }
      const normalizedServiceIds = [...new Set(serviceIds.map(Number))];
      if (
        normalizedServiceIds.some(
          (serviceId) => !Number.isInteger(serviceId) || serviceId <= 0,
        )
      ) {
        throw new BadRequestError("Los servicios seleccionados no son válidos");
      }

      // 1. Validar existencia del módulo
      const modulo = await ModuloAtencion.findOne({
        where: { id: Number(moduloId), isActive: true },
      });
      if (!modulo) {
        throw new NotFoundError(
          "El módulo de atención no existe o está inactivo",
        );
      }

      const { sesion, previousSessions, activeModulo } =
        await SesionAtencion.getRepository().manager.transaction(
          "READ COMMITTED",
          async (manager) => {
            await manager.findOne(Sedes, {
              where: { id: modulo.headquarterId },
              lock: { mode: "pessimistic_write" },
            });
            const activeModulo = await manager.findOne(ModuloAtencion, {
              where: { id: modulo.id, isActive: true },
            });
            if (!activeModulo) {
              throw new NotFoundError(
                "El módulo de atención no existe o está inactivo",
              );
            }

            const activeTurn = await manager.findOne(Turno, {
              where: {
                currentUserId: userId,
                status: In([TurnoStatus.LLAMADO, TurnoStatus.EN_ATENCION]),
              },
            });
            if (activeTurn) {
              throw new ConflictError(
                `Debes resolver el turno ${activeTurn.ticketCode} antes de iniciar otra sesión`,
              );
            }

            for (const serviceId of [...normalizedServiceIds].sort((a, b) => a - b)) {
              const service = await manager.findOne(ServicioAtencion, {
                where: { id: serviceId, status: true },
                lock: { mode: "pessimistic_read" },
              });
              if (!service) {
                throw new BadRequestError("Uno o varios servicios seleccionados no existen o están inactivos");
              }
            }

          const siteAssignments = await manager.find(TurnoSedeServicio, {
            where: {
              headquarterId: activeModulo.headquarterId,
              serviceId: In(normalizedServiceIds),
            },
            select: ["serviceId"],
          });
          if (siteAssignments.length !== normalizedServiceIds.length) {
            throw new BadRequestError("Uno o varios servicios no están habilitados para la sede del módulo");
          }

            const moduloOcupado = await manager.findOne(SesionAtencion, {
              where: { moduloId: activeModulo.id, isActive: true },
            });
            if (moduloOcupado && moduloOcupado.userId !== userId) {
              throw new ConflictError(
                "El módulo seleccionado ya está ocupado por otro asesor",
              );
            }

            const previousSessions = await manager.find(SesionAtencion, {
              where: { userId, isActive: true },
              relations: ["serviciosAsignados"],
            });
            await manager.update(
              SesionAtencion,
              { userId, isActive: true },
              { isActive: false, endedAt: new Date() },
            );

            const sesion = manager.create(SesionAtencion, {
              userId,
              moduloId: activeModulo.id,
              headquarterId: activeModulo.headquarterId,
              startedAt: new Date(),
              isActive: true,
            });
            await validateEntity(sesion);
            await manager.save(sesion);

            await manager.save(
              SesionAtencionServicio,
              normalizedServiceIds.map((serviceId) => ({
                sesionId: sesion.id,
                serviceId,
              })),
            );
            return { sesion, previousSessions, activeModulo };
          },
        );

      const affectedHeadquarterIds = new Set([
        activeModulo.headquarterId,
        ...previousSessions.map(({ headquarterId }) => headquarterId),
      ]);
    await Promise.all(
        [...affectedHeadquarterIds].map((headquarterId) =>
          TurnoSocketService.notificarCambioSesiones(headquarterId),
        ),
      );

      return res.status(201).json({
        message: "Sesión de atención iniciada con éxito",
        sesionId: sesion.id,
        modulo: {
          id: activeModulo.id,
          code: activeModulo.code,
          name: activeModulo.name,
        },
        headquarterId: activeModulo.headquarterId,
        serviceIds: normalizedServiceIds,
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
        throw new BadRequestError(
          "No tienes una sesión de atención activa para cerrar",
        );
      }

      // Validar si tiene un turno pendiente en atención
      const turnoEnCurso = await Turno.findOne({
        where: {
          currentUserId: userId,
          status: In([TurnoStatus.LLAMADO, TurnoStatus.EN_ATENCION]),
        },
      });

      if (turnoEnCurso) {
        throw new ConflictError(
          `Tienes un turno activo (${turnoEnCurso.ticketCode}). Debes resolverlo antes de cerrar tu sesión.`,
        );
      }

      sesionActiva.isActive = false;
      sesionActiva.endedAt = new Date();
      await sesionActiva.save();

      await TurnoSocketService.notificarCambioSesiones(
        sesionActiva.headquarterId,
      );

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
  static async getEstadoActual(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const userId = Number(req.user?.id);
      if (!userId) throw new UnauthorizedError("Usuario no autenticado");

      const sesion = await SesionAtencion.findOne({
        where: { userId, isActive: true },
        relations: [
          "modulo",
          "serviciosAsignados",
          "serviciosAsignados.service",
        ],
      });

      if (!sesion) {
        return res.json({
          hasActiveSession: false,
          session: null,
          activeTurn: null,
          pendingQueue: [],
          pendingQueueCount: 0,
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

      const serviceIds = sesion.serviciosAsignados.map((s) => s.serviceId);
      const { start, end } = TurnoDayService.getRange();
      const pendingTurns =
        serviceIds.length > 0
          ? await Turno.find({
              where: {
                headquarterId: sesion.headquarterId,
                serviceId: In(serviceIds),
                status: TurnoStatus.PENDIENTE,
                createdAt: Between(start, end),
              },
              relations: ["patient", "service"],
            })
          : [];
      pendingTurns.sort(TurnoQueueService.compareQueueOrder);
      const pendingCount = pendingTurns.length;

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
              priority: activeTurn.priority,
              status: activeTurn.status,
              callCount: activeTurn.callCount,
              patient: {
                name: activeTurn.patient?.name,
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
        pendingQueue: pendingTurns.map((turn) => ({
          ticketCode: turn.ticketCode,
          patientName: turn.patient?.name,
          serviceName: turn.service?.name,
          priority: turn.priority,
          waitingMinutes: Math.max(
            0,
            Math.floor((Date.now() - turn.createdAt.getTime()) / 60000),
          ),
        })),
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

      if (!action)
        throw new BadRequestError("La acción a ejecutar es requerida");

      // 1. Obtener la sesión activa del asesor
      const sesion = await SesionAtencion.findOne({
        where: { userId, isActive: true },
        relations: ["modulo", "serviciosAsignados", "user"],
      });

      if (!sesion) {
        throw new ConflictError(
          "Debes tener una sesión de atención activa para ejecutar acciones sobre turnos",
        );
      }

      const serviceIds = sesion.serviciosAsignados.map((s) => s.serviceId);

      // ACCIÓN: LLAMAR SIGUIENTE
      if (action === "LLAMAR") {
        const claimed = await Turno.getRepository().manager.transaction(
          "READ COMMITTED",
          async (manager) => {
            const headquarter = await manager.findOne(Sedes, {
              where: { id: sesion.headquarterId },
              lock: { mode: "pessimistic_write" },
            });
            if (!headquarter) {
              throw new NotFoundError("La sede de la sesión ya no existe");
            }

            const activeSession = await manager.findOne(SesionAtencion, {
              where: { id: sesion.id, userId, isActive: true },
              lock: { mode: "pessimistic_write" },
            });
            if (!activeSession) {
              throw new ConflictError("Tu sesión de atención ya no está activa");
            }

            const currentTurn = await manager.findOne(Turno, {
              where: {
                currentUserId: userId,
                status: In([TurnoStatus.LLAMADO, TurnoStatus.EN_ATENCION]),
              },
              lock: { mode: "pessimistic_write" },
            });
            if (currentTurn?.status === TurnoStatus.EN_ATENCION) {
              throw new ConflictError(
                `Ya tienes un paciente en atención (${currentTurn.ticketCode}). Finaliza la atención actual antes de llamar al siguiente.`,
              );
            }
            if (currentTurn?.status === TurnoStatus.LLAMADO) {
              throw new ConflictError(
                `El turno ${currentTurn.ticketCode} sigue en llamado. Debes iniciar su atención o marcar 'No asistió' antes de llamar al siguiente.`,
              );
            }

            const activeModule = await manager.findOne(ModuloAtencion, {
              where: { id: activeSession.moduloId },
            });
            if (!activeModule) {
              throw new ConflictError("El módulo de tu sesión ya no está disponible");
            }
            const activeServices = await manager.find(SesionAtencionServicio, {
              where: { sesionId: activeSession.id },
              select: ["serviceId"],
            });
            const activeServiceIds = activeServices.map(({ serviceId }) => serviceId);
            const selectedTurn = await TurnoQueueService.getNextInQueue(
              manager,
              activeSession.headquarterId,
              activeServiceIds,
            );
            if (!selectedTurn) return null;

            const nextTurn = await manager.findOne(Turno, {
              where: { id: selectedTurn.id },
              relations: ["patient", "service"],
            });
            if (!nextTurn || nextTurn.status !== TurnoStatus.PENDIENTE) {
              throw new ConflictError("El turno cambió mientras se procesaba el llamado");
            }

            TurnoQueueService.validateTransition(nextTurn.status, "LLAMAR");
            nextTurn.status = TurnoStatus.LLAMADO;
            nextTurn.currentUserId = userId;
            nextTurn.currentModuloId = activeSession.moduloId;
            nextTurn.calledAt = new Date();
            nextTurn.callCount = 1;
            await manager.save(nextTurn);
            await manager.save(manager.create(TurnoTracking, {
              turnoId: nextTurn.id,
              status: TurnoStatus.LLAMADO,
              moduloId: activeSession.moduloId,
              userId,
              notes: notes || "Llamado a ventanilla",
            }));
            return nextTurn;
          },
        );

        if (!claimed) {
          return res.json({
            message:
              "No hay turnos pendientes compatibles con los servicios de tu sesión",
            action: "LLAMAR",
            turno: null,
          });
        }

        // Los eventos y recálculos solo se ejecutan después del commit del reclamo.
        TurnoSocketService.emitTurnoLlamado(sesion.headquarterId, {
          turnoId: claimed.id,
          ticketCode: claimed.ticketCode,
          ticketToken: claimed.ticketToken,
          priority: claimed.priority,
          moduloCode: sesion.modulo?.code || "",
          moduloName: sesion.modulo?.name || "",
          userName: sesion.user?.name || "",
          serviceName: claimed.service?.name || "",
          callCount: claimed.callCount,
          calledAt: claimed.calledAt ?? new Date(),
        });

        // Notificar en tiempo real a los turnos que siguen en espera (avanzó la cola)
        await TurnoSocketService.notificarAvanceCola(
          sesion.headquarterId,
          claimed.serviceId,
        );

        return res.json({
          message: `Turno ${claimed.ticketCode} llamado con éxito`,
          action: "LLAMAR",
          turno: {
            id: claimed.id,
            ticketCode: claimed.ticketCode,
            ticketToken: claimed.ticketToken,
            priority: claimed.priority,
            status: claimed.status,
            patientName: claimed.patient?.name,
            serviceName: claimed.service?.name,
            callCount: claimed.callCount,
            calledAt: claimed.calledAt,
          },
        });
      }

      // Para las demás acciones, obtener el turno objetivo
      let turno: Turno | null = null;
      if (turnoId) {
        turno = await Turno.findOne({
          where: {
            id: Number(turnoId),
            currentUserId: userId,
            status: In([TurnoStatus.LLAMADO, TurnoStatus.EN_ATENCION]),
          },
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
        throw new NotFoundError(
          "No se encontró el turno especificado o no tienes un turno activo en atención",
        );
      }

      if (turno.headquarterId !== sesion.headquarterId) {
        throw new ConflictError(
          "El turno activo no pertenece a la sede de tu sesión",
        );
      }
      if (!serviceIds.includes(turno.serviceId)) {
        throw new ConflictError(
          "El servicio del turno no está asignado a tu sesión activa",
        );
      }

      // Validar transición en la máquina de estados
      const nextStatus = TurnoQueueService.validateTransition(
        turno.status,
        action,
      );

      // ACCIÓN: RELLAMAR
      if (action === "RELLAMAR") {
        turno.callCount += 1;
        turno.calledAt = new Date();
        await turno.save();

        await TurnoQueueService.recordTracking(
          turno.id,
          TurnoStatus.LLAMADO,
          sesion.moduloId,
          userId,
          `Rellamado número ${turno.callCount}`,
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

      // ACCIÓN: INICIAR ATENCIÓN
      if (action === "INICIAR") {
        const startedAt = new Date();
        const result = await Turno.update(
          { id: turno.id, status: TurnoStatus.LLAMADO },
          { status: nextStatus, startedAt },
        );
        if (result.affected !== 1)
          throw new ConflictError(
            "El turno cambió de estado. Actualiza el panel antes de iniciar la atención",
          );
        turno.status = nextStatus;
        turno.startedAt = startedAt;

        await TurnoQueueService.recordTracking(
          turno.id,
          nextStatus,
          sesion.moduloId,
          userId,
          notes || "Inicio de atención presencial",
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
          turnoId: turno.id,
          ticketCode: turno.ticketCode,
          status: turno.status,
          headquarterId: sesion.headquarterId,
          moduloCode: sesion.modulo?.code,
          moduloName: sesion.modulo?.name,
          updatedAt: new Date(),
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
          notes || "Atención finalizada con éxito",
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
          notes || `Paciente ausente tras ${turno.callCount} llamados`,
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

      // ACCIÓN: TRANSFERIR DE SERVICIO
      if (action === "TRANSFERIR") {
        if (!newServiceId) {
          throw new BadRequestError(
            "El ID del nuevo servicio es requerido para la transferencia",
          );
        }
        if (Number(newServiceId) === turno.serviceId) {
          throw new BadRequestError(
            "El servicio de destino debe ser diferente al servicio actual",
          );
        }
        const previousServiceId = turno.serviceId;
        const { destinationService, transferredTurn } = await Turno.getRepository().manager.transaction(
          "READ COMMITTED",
          async (manager) => {
            await manager.findOne(Sedes, {
              where: { id: turno.headquarterId },
              lock: { mode: "pessimistic_write" },
            });
            const assignment = await manager.findOne(TurnoSedeServicio, {
              where: { headquarterId: turno.headquarterId, serviceId: Number(newServiceId) },
            });
            if (!assignment) {
              throw new BadRequestError("El servicio de destino no está habilitado para la sede del turno");
            }

            const destinationService = await manager.findOne(ServicioAtencion, {
              where: { id: Number(newServiceId), status: true },
              lock: { mode: "pessimistic_read" },
            });
            if (!destinationService) {
              throw new BadRequestError("El servicio de destino no existe o está inactivo");
            }

            const transferredTurn = await manager.findOne(Turno, {
              where: {
                id: turno.id,
                currentUserId: userId,
                headquarterId: turno.headquarterId,
                status: TurnoStatus.EN_ATENCION,
              },
              lock: { mode: "pessimistic_write" },
            });
            if (!transferredTurn) {
              throw new ConflictError("El turno ya no está activo en tu sesión");
            }

            transferredTurn.service = destinationService;
            transferredTurn.serviceId = destinationService.id;
            transferredTurn.status = TurnoStatus.PENDIENTE;
            transferredTurn.currentModuloId = null;
            transferredTurn.currentUserId = null;
            transferredTurn.calledAt = null;
            transferredTurn.startedAt = null;
            await manager.save(transferredTurn);
            await manager.save(manager.create(TurnoTracking, {
              turnoId: transferredTurn.id,
              status: TurnoStatus.TRANSFERIDO,
              moduloId: sesion.moduloId,
              userId,
              notes: notes || `Transferido al servicio ID ${newServiceId}`,
            }));
            await manager.save(manager.create(TurnoTracking, {
              turnoId: transferredTurn.id,
              status: TurnoStatus.PENDIENTE,
              notes: `Reingreso a cola en nuevo servicio (${newServiceId})`,
            }));
            return { destinationService, transferredTurn };
          },
        );
        Object.assign(turno, transferredTurn);

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

        // Recalcular tanto la cola que pierde el turno como aquella que lo recibe.
        await Promise.all([previousServiceId, destinationService.id].map((serviceId) =>
          TurnoSocketService.notificarAvanceCola(
            sesion.headquarterId,
            serviceId,
          ),
        ));

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
        const reason = typeof notes === "string" ? notes.trim() : "";
        if (!reason)
          throw new BadRequestError("Debes indicar el motivo de cancelación");
        turno.status = nextStatus;
        turno.finishedAt = new Date();
        await turno.save();

        await TurnoQueueService.recordTracking(
          turno.id,
          nextStatus,
          sesion.moduloId,
          userId,
          reason,
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

        await TurnoSocketService.notificarAvanceCola(
          sesion.headquarterId,
          turno.serviceId,
        );

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
