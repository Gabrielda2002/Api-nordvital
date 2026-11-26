import { NextFunction, Request, Response } from "express";
import { TurnoSedeConfig } from "../entities/TurnoSedeConfig";
import { Turno, TurnoPriority, TurnoStatus } from "../entities/Turno";
import { TurnoEncuesta } from "../entities/TurnoEncuesta";
import { TurnoGeoService } from "../services/turno-geo.service";
import { TurnoQueueService } from "../services/turno-queue.service";
import { TurnoSocketService } from "../services/turno-socket.service";
import { Pacientes } from "../../patients/entities/pacientes";
import { ServicioAtencion } from "../../catalog/entities/servicio-atencion";
import { TipoDocumento } from "../../catalog/entities/tipo-documento";
import { SesionAtencion } from "../entities/SesionAtencion";
import { BadRequestError, ConflictError, NotFoundError } from "@core/utils/custom-errors";
import { validateEntity } from "@core/utils/validation-helper";
import { Between, In } from "typeorm";
import { config as configEnv } from "@core/config/environment.config";
import { TurnoDayService } from "../services/turno-day.service";
import { TurnoSedeServicio } from "../entities/TurnoSedeServicio";
import { TurnoIssuanceService } from "../services/turno-issuance.service";
import { TurnoServiceCoverageService } from "../services/turno-service-coverage.service";
import { TurnoTvService } from "../services/turno-tv.service";

export class TurnosPublicController {
  /**
   * Obtiene la configuración pública de una sede por su slug.
   * Usado por el frontend móvil tras escanear el QR.
   */
  static async getSedeConfig(req: Request, res: Response, next: NextFunction) {
    try {
      const slug = String(req.params.slug);

      const config = await TurnoSedeConfig.findOne({
        where: { slug, isEnabled: true },
        relations: ["headquarter"],
      });

      if (!config) {
        throw new NotFoundError(`No se encontró la configuración para la sede "${slug}" o no está habilitada`);
      }

      const assignments = await TurnoSedeServicio.find({
        where: { headquarterId: config.headquarterId },
        select: ["serviceId"],
      });
      const assignedServiceIds = assignments.map(({ serviceId }) => serviceId);
      const activeServices = assignedServiceIds.length > 0
        ? await ServicioAtencion.find({
            where: { id: In(assignedServiceIds), status: true },
            order: { name: "ASC" },
          })
        : [];

      const activeDocumentTypes = await TipoDocumento.find({
        where: { status: true },
        order: { id: "ASC" },
      });

      return res.json({
        headquarter: {
          id: config.headquarterId,
          name: config.headquarter?.name || "Nordvital IPS",
          slug: config.slug,
          address: config.headquarter?.address || "",
        },
        geo: {
          latitude: Number(config.latitude),
          longitude: Number(config.longitude),
          geoRadiusMeters: config.geoRadiusMeters,
        },
        averageServiceMinutes: config.averageServiceMinutes,
        services: activeServices.map((s) => ({
          id: s.id,
          name: s.name,
        })),
        documentTypes: activeDocumentTypes.map((d) => ({
          id: d.id,
          name: d.name,
        })),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Verifica si un paciente existe en el sistema por su documento y tipo de documento.
   */
  static async verificarPaciente(req: Request, res: Response, next: NextFunction) {
    try {
      const { documentNumber, documentType } = req.body;

      if (!documentNumber || String(documentNumber).trim().length === 0) {
        throw new BadRequestError("El número de documento es requerido");
      }
      const resolvedDocTypeId = TurnoIssuanceService.resolveDocumentTypeId(documentType);

      const paciente = await Pacientes.findOne({
        relations: ["documentRelation"],
        where: {
          documentNumber: String(documentNumber).trim(),
          documentTypeId: resolvedDocTypeId,
        },
      });

      if (!paciente) {
        return res.json({
          exists: false,
          patient: null,
          activeTurn: null,
        });
      }

      // Verificar si el paciente ya tiene un turno activo hoy
      const { start: hoyInicio, end: hoyFin } = TurnoDayService.getRange();

      const activeTurn = await Turno.findOne({
        where: {
          patientId: paciente.id,
          status: In([TurnoStatus.PENDIENTE, TurnoStatus.LLAMADO, TurnoStatus.EN_ATENCION]),
          createdAt: Between(hoyInicio, hoyFin),
        },
        relations: ["service", "headquarter"],
      });

      return res.json({
        exists: true,
        patient: {
          id: paciente.id,
          fullName: paciente.name,
          documentNumber: paciente.documentNumber,
          phoneNumber: paciente.phoneNumber,
          documentTypeId: paciente.documentTypeId,
          documentType: paciente?.documentRelation?.name,
        },
        activeTurn: activeTurn
          ? {
              ticketToken: activeTurn.ticketToken,
              ticketCode: activeTurn.ticketCode,
              status: activeTurn.status,
              serviceName: activeTurn.service?.name,
              headquarterName: activeTurn.headquarter?.name,
            }
          : null,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Emite un nuevo ticket digital tras validar geolocalización física.
   */
  static async emitirTicket(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        slug,
        serviceId,
        priority = TurnoPriority.GENERAL,
        classification,
        userLatitude,
        userLongitude,
        documentNumber,
        documentTypeId,
        name,
        phoneNumber,
        skipGeolocation,
      } = req.body;

      if (!slug) throw new BadRequestError("El slug de la sede es requerido");
      if (!serviceId) throw new BadRequestError("El servicio de atención es requerido");
      if (!documentNumber) throw new BadRequestError("El número de documento es requerido");
      if (!name) throw new BadRequestError("El nombre del paciente es requerido");
      if (!phoneNumber) throw new BadRequestError("El número celular es requerido");
      const resolvedDocTypeId = TurnoIssuanceService.resolveDocumentTypeId(documentTypeId);
      const resolvedClassification = TurnoIssuanceService.resolveClassification(classification);

      // 1. Obtener configuración de sede
      const config = await TurnoSedeConfig.findOne({
        where: { slug, isEnabled: true },
        relations: ["headquarter"],
      });

      if (!config) {
        throw new NotFoundError("La sede especificada no está configurada o no está habilitada para turnos");
      }

      TurnoGeoService.validateRequest(
        { userLatitude, userLongitude, skipGeolocation },
        { latitude: Number(config.latitude), longitude: Number(config.longitude), geoRadiusMeters: config.geoRadiusMeters },
        configEnv.server.isDevelopment
      );

      // 3. Validar existencia del servicio
      const service = await ServicioAtencion.findOne({
        where: { id: Number(serviceId), status: true },
      });
      
      if (!service) {
        throw new NotFoundError("El servicio seleccionado no existe o no está activo");
      }

      const { created, turno } = await TurnoIssuanceService.issue({
        headquarterId: config.headquarterId,
        serviceId: service.id,
        priority: priority === TurnoPriority.PRIORITARIO ? TurnoPriority.PRIORITARIO : TurnoPriority.GENERAL,
        classification: resolvedClassification,
        documentNumber: String(documentNumber).trim(),
        documentTypeId: resolvedDocTypeId,
        name: String(name),
        phoneNumber: String(phoneNumber),
      });

      if (!created) {
        return res.status(409).json({
          message: `Ya tienes un turno activo (${turno.ticketCode}). Te redirigiremos a tu ticket.`,
          activeTicket: {
            ticketToken: turno.ticketToken,
            ticketCode: turno.ticketCode,
            status: turno.status,
            serviceName: turno.service?.name,
            headquarterName: turno.headquarter?.name,
          },
        });
      }

      const { start, end } = TurnoDayService.getRange();
      const queueServiceIds = await TurnoServiceCoverageService.getQueueServiceIds(
        config.headquarterId,
        service.id,
      );
      const pendingWhere = {
        headquarterId: config.headquarterId,
        serviceId: In(queueServiceIds),
        status: TurnoStatus.PENDIENTE,
        createdAt: Between(start, end),
      };
      const pendingTurns = await Turno.find({
        where: pendingWhere,
        select: ["id", "priority", "createdAt"],
      });

      const aheadCount = TurnoQueueService.calculateAheadCount(turno, pendingTurns);

      // Contar los asesores activos que atienden el servicio, sin filtrar por tipo de módulo.
      const activeSessionsCount = await SesionAtencion.count({
        where: {
          headquarterId: config.headquarterId,
          isActive: true,
          modulo: {
            isActive: true,
          },
          serviciosAsignados: {
            serviceId: Number(serviceId),
          },
        },
      });

      const estimatedWaitMinutes = TurnoQueueService.calculateEstimatedWaitMinutes(
        aheadCount,
        config.averageServiceMinutes,
        activeSessionsCount
      );

      await TurnoSocketService.notificarAvanceCola(config.headquarterId, service.id);

      return res.status(201).json({
        token: turno.ticketToken,
        ticketCode: turno.ticketCode,
        priority: turno.priority,
        dailyNumber: turno.dailyNumber,
        status: turno.status,
        aheadCount,
        estimatedWaitMinutes,
        headquarter: {
          id: config.headquarterId,
          name: config.headquarter?.name,
        },
        service: {
          id: service.id,
          name: service.name,
        },
        createdAt: turno.createdAt,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Consulta el estado en vivo del ticket del paciente mediante su token seguro.
   */
  static async getTicketEstado(req: Request, res: Response, next: NextFunction) {
    try {
      const token = String(req.params.token);

      const turno = await Turno.findOne({
        where: { ticketToken: token },
        relations: ["headquarter", "service", "patient", "currentModulo", "currentUser", "encuesta"],
      });

      if (!turno) {
        throw new NotFoundError("Ticket no encontrado");
      }

      let aheadCount = 0;
      let estimatedWaitMinutes: number | null = 0;

      if (turno.status === TurnoStatus.PENDIENTE) {
        const { start, end } = TurnoDayService.getRange(turno.createdAt);
        const queueServiceIds = await TurnoServiceCoverageService.getQueueServiceIds(
          turno.headquarterId,
          turno.serviceId,
        );
        const pendingTurns = await Turno.find({
          where: {
            headquarterId: turno.headquarterId,
            serviceId: In(queueServiceIds),
            status: TurnoStatus.PENDIENTE,
            createdAt: Between(start, end),
          },
          select: ["id", "priority", "createdAt"],
        });

        aheadCount = TurnoQueueService.calculateAheadCount(turno, pendingTurns);

        const config = await TurnoSedeConfig.findOne({
          where: { headquarterId: turno.headquarterId },
        });

        const activeSessionsCount = await SesionAtencion.count({
          where: {
            headquarterId: turno.headquarterId,
            isActive: true,
            modulo: {
              isActive: true,
            },
            serviciosAsignados: {
              serviceId: turno.serviceId,
            },
          },
        });

        estimatedWaitMinutes = TurnoQueueService.calculateEstimatedWaitMinutes(
          aheadCount,
          config?.averageServiceMinutes || 10,
          activeSessionsCount
        );
      }

      return res.json({
        ticketCode: turno.ticketCode,
        ticketToken: turno.ticketToken,
        status: turno.status,
        priority: turno.priority,
        classification: turno.classification,
        dailyNumber: turno.dailyNumber,
        callCount: turno.callCount,
        headquarter: {
          id: turno.headquarterId,
          name: turno.headquarter?.name,
        },
        service: {
          id: turno.serviceId,
          name: turno.service?.name,
        },
        patient: {
          name: turno.patient?.name,
          documentNumber: turno.patient?.documentNumber,
        },
        modulo: turno.currentModulo
          ? {
              id: turno.currentModulo.id,
              code: turno.currentModulo.code,
              name: turno.currentModulo.name,
            }
          : null,
        advisorName: turno.currentUser?.name || null,
        aheadCount,
        estimatedWaitMinutes,
        calledAt: turno.calledAt,
        startedAt: turno.startedAt,
        finishedAt: turno.finishedAt,
        hasSurvey: !!turno.encuesta,
        createdAt: turno.createdAt,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Registra la encuesta NPS de 1 a 5 estrellas una vez finalizada la atención.
   */
  static async registrarEncuesta(req: Request, res: Response, next: NextFunction) {
    try {
      const token = String(req.params.token);
      const { rating, comment } = req.body;

      if (!rating || Number(rating) < 1 || Number(rating) > 5) {
        throw new BadRequestError("La calificación es requerida y debe estar entre 1 y 5 estrellas");
      }

      const turno = await Turno.findOne({
        where: { ticketToken: token },
        relations: ["encuesta"],
      });

      if (!turno) {
        throw new NotFoundError("Ticket no encontrado");
      }

      if (turno.status !== TurnoStatus.FINALIZADO) {
        throw new BadRequestError(
          `Solo se puede responder la encuesta de un turno finalizado. El estado actual es "${turno.status}".`
        );
      }

      if (turno.encuesta) {
        throw new ConflictError("Ya se ha registrado una encuesta para este turno");
      }

      const encuesta = new TurnoEncuesta();
      encuesta.turnoId = turno.id;
      encuesta.rating = Number(rating);
      encuesta.comment = comment ? String(comment).trim() : null;

      await validateEntity(encuesta);
      await encuesta.save();

      return res.status(201).json({
        message: "Encuesta de satisfacción registrada con éxito",
        rating: encuesta.rating,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Cancela voluntariamente un turno por parte del paciente desde su ticket móvil.
   */
  static async cancelarTicket(req: Request, res: Response, next: NextFunction) {
    try {
      const token = String(req.params.token);
      const { reason } = req.body || {};

      const turno = await TurnoIssuanceService.cancel(token, reason === undefined ? undefined : String(reason));

      // Notificar a la sala privada del ticket
      TurnoSocketService.emitTicketEstado({
        turnoId: turno.id,
        ticketToken: turno.ticketToken,
        ticketCode: turno.ticketCode,
        status: turno.status,
        updatedAt: new Date(),
      });

      // Notificar a la pantalla TV para que retire el turno si estaba llamado
      TurnoSocketService.emitTurnoRetirado(turno.headquarterId, {
        turnoId: turno.id,
        ticketCode: turno.ticketCode,
        status: turno.status,
        headquarterId: turno.headquarterId,
        moduloCode: turno.currentModulo?.code,
        moduloName: turno.currentModulo?.name,
        updatedAt: new Date(),
      });

      // Recalcular posición en cola para los pacientes que siguen esperando
      await TurnoSocketService.notificarAvanceCola(turno.headquarterId, turno.serviceId);

      return res.json({
        message: `El turno ${turno.ticketCode} fue cancelado exitosamente`,
        ticketCode: turno.ticketCode,
        status: turno.status,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Devuelve el estado actual de la pantalla de sala (TV) para una sede.
   */
  static async getTvEstado(req: Request, res: Response, next: NextFunction) {
    try {
      const slug = String(req.params.slug);

      const config = await TurnoSedeConfig.findOne({
        where: { slug, isEnabled: true },
        relations: ["headquarter"],
      });

      if (!config) {
        throw new NotFoundError("Sede no encontrada o no habilitada para turnos");
      }

      const activeTurns = await Turno.find({
        where: {
          headquarterId: config.headquarterId,
          status: In([TurnoStatus.LLAMADO, TurnoStatus.EN_ATENCION]),
        },
        relations: { currentModulo: true, currentUser: true, service: true, patient: true },
        select: {
          id: true,
          ticketCode: true,
          priority: true,
          status: true,
          calledAt: true,
          currentModulo: { id: true, code: true, name: true },
          currentUser: { id: true, name: true },
          service: { id: true, name: true },
          patient: { id: true, name: true },
        },
        order: { calledAt: "DESC" },
        take: 10,
      });

      const range = TurnoDayService.getRange();
      const [upcomingTurns, recentCalls] = await Promise.all([
        Turno.find({
          where: {
            headquarterId: config.headquarterId,
            status: TurnoStatus.PENDIENTE,
            createdAt: Between(range.start, range.end),
          },
          select: ["id", "ticketCode", "priority", "createdAt"],
        }),
        TurnoTvService.getRecentCalls(config.headquarterId, range),
      ]);
      // Es una vista cronológica para TV, no un orden global de despacho entre colas.
      upcomingTurns.sort((a, b) =>
        a.createdAt.getTime() - b.createdAt.getTime() || a.id - b.id,
      );

      return res.json({
        headquarter: {
          id: config.headquarterId,
          name: config.headquarter?.name,
          slug: config.slug,
        },
        activeTurns: activeTurns.map((t) => ({
          turnoId: t.id,
          ticketCode: t.ticketCode,
          patientDisplayName: TurnoTvService.getPatientDisplayName(t.patient?.name),
          priority: t.priority,
          status: t.status,
          moduloCode: t.currentModulo?.code || "",
          moduloName: t.currentModulo?.name || "",
          advisorName: t.currentUser?.name || "",
          serviceName: t.service?.name || "",
          calledAt: t.calledAt,
        })),
        upcomingTurns: upcomingTurns.slice(0, 5).map(({ id, ticketCode }) => ({
          turnoId: id,
          ticketCode,
        })),
        recentCalls,
      });
    } catch (error) {
      next(error);
    }
  }
}
