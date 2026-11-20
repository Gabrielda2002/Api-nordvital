import { NextFunction, Request, Response } from "express";
import { TurnoSedeConfig } from "../entities/TurnoSedeConfig";
import { ModuloAtencion } from "../entities/ModuloAtencion";
import { Turno, TurnoPriority, TurnoStatus } from "../entities/Turno";
import { TurnoEncuesta } from "../entities/TurnoEncuesta";
import { BadRequestError, NotFoundError } from "@core/utils/custom-errors";
import { validateEntity } from "@core/utils/validation-helper";
import { startOfDay, endOfDay, parseISO } from "date-fns";
import { TurnoSiteServiceService } from "../services/turno-site-service.service";
import { Sedes } from "../../catalog/entities/sedes";
import { TurnoServiceCatalogService } from "../services/turno-service-catalog.service";

async function notificarCambioSesiones(headquarterId: number): Promise<void> {
  const { TurnoSocketService } = await import("../services/turno-socket.service");
  await TurnoSocketService.notificarCambioSesiones(headquarterId);
}

export class TurnosAdminController {
  static async listServicios(_req: Request, res: Response, next: NextFunction) {
    try {
      return res.json(await TurnoServiceCatalogService.list());
    } catch (error) {
      next(error);
    }
  }

  static async createServicio(req: Request, res: Response, next: NextFunction) {
    try {
      const service = await TurnoServiceCatalogService.create(req.body?.name);
      return res.status(201).json(service);
    } catch (error) {
      next(error);
    }
  }

  static async updateServicio(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      if (!Number.isSafeInteger(id) || id <= 0) {
        throw new BadRequestError("El ID del servicio no es válido");
      }
      const service = await TurnoServiceCatalogService.update(id, req.body?.name, req.body?.status);
      return res.json(service);
    } catch (error) {
      next(error);
    }
  }

  static async getServiciosSede(req: Request, res: Response, next: NextFunction) {
    try {
      const headquarterId = Number(req.params.headquarterId);
      if (!Number.isInteger(headquarterId) || headquarterId <= 0) {
        throw new BadRequestError("El ID de sede no es válido");
      }
      return res.json(await TurnoSiteServiceService.getAssignment(headquarterId));
    } catch (error) {
      next(error);
    }
  }

  static async saveServiciosSede(req: Request, res: Response, next: NextFunction) {
    try {
      const headquarterId = Number(req.params.headquarterId);
      if (!Number.isInteger(headquarterId) || headquarterId <= 0) {
        throw new BadRequestError("El ID de sede no es válido");
      }
      const result = await TurnoSiteServiceService.replaceAssignment(headquarterId, req.body.serviceIds);
      await notificarCambioSesiones(headquarterId);
      return res.json({ message: "Servicios de sede actualizados con éxito", ...result });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtiene la lista de configuraciones de sedes para turnos.
   */
  static async getSedesConfig(req: Request, res: Response, next: NextFunction) {
    try {
      const configs = await TurnoSedeConfig.find({
        relations: ["headquarter"],
        order: { id: "ASC" },
      });

      return res.json(
        configs.map((c) => ({
          id: c.id,
          headquarterId: c.headquarterId,
          headquarterName: c.headquarter?.name,
          slug: c.slug,
          latitude: Number(c.latitude),
          longitude: Number(c.longitude),
          geoRadiusMeters: c.geoRadiusMeters,
          isEnabled: c.isEnabled,
          averageServiceMinutes: c.averageServiceMinutes,
          updatedAt: c.updatedAt,
        }))
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Crea o actualiza la configuración de geocercas y slug de una sede.
   */
  static async saveSedeConfig(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        headquarterId,
        slug,
        latitude,
        longitude,
        geoRadiusMeters = 150,
        isEnabled = true,
        averageServiceMinutes = 10,
      } = req.body;

      if (!headquarterId) throw new BadRequestError("El ID de sede es requerido");
      if (!slug) throw new BadRequestError("El slug de la sede es requerido");
      if (latitude === undefined || longitude === undefined) {
        throw new BadRequestError("La latitud y longitud son requeridas");
      }

      let config = await TurnoSedeConfig.findOne({
        where: { headquarterId: Number(headquarterId) },
      });

      if (!config) {
        config = new TurnoSedeConfig();
        config.headquarterId = Number(headquarterId);
      }

      config.slug = String(slug).trim().toLowerCase();
      config.latitude = Number(latitude);
      config.longitude = Number(longitude);
      config.geoRadiusMeters = Number(geoRadiusMeters);
      config.isEnabled = Boolean(isEnabled);
      config.averageServiceMinutes = Number(averageServiceMinutes);

      await validateEntity(config);
      await config.save();
      await notificarCambioSesiones(config.headquarterId);

      return res.status(201).json({
        message: "Configuración de sede guardada con éxito",
        config,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtiene los módulos físicos de una sede.
   */
  static async getModulos(req: Request, res: Response, next: NextFunction) {
    try {
      const { headquarterId } = req.query;

      const whereClause: Record<string, unknown> = {};
      if (headquarterId) {
        whereClause.headquarterId = Number(headquarterId);
      }

      const modulos = await ModuloAtencion.find({
        where: whereClause,
        relations: ["headquarter"],
        order: { code: "ASC" },
      });

      return res.json(
        modulos.map((m) => ({
          id: m.id,
          headquarterId: m.headquarterId,
          headquarterName: m.headquarter?.name,
          code: m.code,
          name: m.name,
          isActive: m.isActive,
        }))
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Crea un nuevo módulo físico de atención.
   */
  static async createModulo(req: Request, res: Response, next: NextFunction) {
    try {
      const { headquarterId, code, name, isActive = true } = req.body;

      if (!headquarterId) throw new BadRequestError("La sede es requerida");
      if (!code) throw new BadRequestError("El código de ventanilla es requerido");
      if (!name) throw new BadRequestError("El nombre de ventanilla es requerido");

      const modulo = new ModuloAtencion();
      modulo.headquarterId = Number(headquarterId);
      modulo.code = String(code).trim().toUpperCase();
      modulo.name = String(name).trim();
      modulo.isActive = Boolean(isActive);

      await validateEntity(modulo);
      await modulo.save();
      await notificarCambioSesiones(modulo.headquarterId);

      return res.status(201).json({
        message: "Módulo creado con éxito",
        modulo,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Actualiza un módulo físico de atención.
   */
  static async updateModulo(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const { code, name, isActive } = req.body;

      const existingModulo = await ModuloAtencion.findOne({ where: { id } });
      if (!existingModulo) throw new NotFoundError("Módulo no encontrado");

      const modulo = await ModuloAtencion.getRepository().manager.transaction("READ COMMITTED", async (manager) => {
        await manager.findOne(Sedes, {
          where: { id: existingModulo.headquarterId },
          lock: { mode: "pessimistic_write" },
        });
        const currentModulo = await manager.findOne(ModuloAtencion, {
          where: { id },
          lock: { mode: "pessimistic_write" },
        });
        if (!currentModulo) throw new NotFoundError("Módulo no encontrado");

        if (code) currentModulo.code = String(code).trim().toUpperCase();
        if (name) currentModulo.name = String(name).trim();
        if (isActive !== undefined) currentModulo.isActive = Boolean(isActive);

        await validateEntity(currentModulo);
        return manager.save(currentModulo);
      });
      await notificarCambioSesiones(modulo.headquarterId);

      return res.json({
        message: "Módulo actualizado con éxito",
        modulo,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Genera el panel de métricas y KPIs de la operación de turnos.
   */
  static async getKpis(req: Request, res: Response, next: NextFunction) {
    try {
      const { headquarterId, startDate, endDate } = req.query;

      const fechaInicio = startDate ? startOfDay(parseISO(String(startDate))) : startOfDay(new Date());
      const fechaFin = endDate ? endOfDay(parseISO(String(endDate))) : endOfDay(new Date());

      const queryBuilder = Turno.createQueryBuilder("turno")
        .where("turno.created_at BETWEEN :fechaInicio AND :fechaFin", {
          fechaInicio,
          fechaFin,
        });

      if (headquarterId) {
        queryBuilder.andWhere("turno.headquarter_id = :headquarterId", {
          headquarterId: Number(headquarterId),
        });
      }

      const turnos = await queryBuilder.getMany();

      const total = turnos.length;
      const finalizados = turnos.filter((t) => t.status === TurnoStatus.FINALIZADO).length;
      const noAsistio = turnos.filter((t) => t.status === TurnoStatus.NO_ASISTIO).length;
      const cancelados = turnos.filter((t) => t.status === TurnoStatus.CANCELADO).length;
      const pendientes = turnos.filter((t) => t.status === TurnoStatus.PENDIENTE).length;
      const enAtencion = turnos.filter((t) => t.status === TurnoStatus.EN_ATENCION).length;

      // Calcular tiempo promedio de espera (minutos entre created_at y called_at)
      const turnosLlamados = turnos.filter((t) => t.calledAt && t.createdAt);
      const totalWaitSeconds = turnosLlamados.reduce((acc, t) => {
        const diffMs = (t.calledAt?.getTime() || 0) - t.createdAt.getTime();
        return acc + Math.max(0, diffMs / 1000);
      }, 0);
      const avgWaitMinutes = turnosLlamados.length > 0 ? Math.round(totalWaitSeconds / turnosLlamados.length / 60) : 0;

      // Calcular tiempo promedio de atención (minutos entre started_at y finished_at)
      const turnosAtendidos = turnos.filter((t) => t.startedAt && t.finishedAt);
      const totalAttentionSeconds = turnosAtendidos.reduce((acc, t) => {
        const diffMs = (t.finishedAt?.getTime() || 0) - (t.startedAt?.getTime() || 0);
        return acc + Math.max(0, diffMs / 1000);
      }, 0);
      const avgAttentionMinutes =
        turnosAtendidos.length > 0 ? Math.round(totalAttentionSeconds / turnosAtendidos.length / 60) : 0;

      // Calcular promedio NPS
      const turnoIds = turnos.map((t) => t.id);
      let avgNps = 0;
      if (turnoIds.length > 0) {
        const encuestaStats = await TurnoEncuesta.createQueryBuilder("encuesta")
          .select("AVG(encuesta.rating)", "avgRating")
          .where("encuesta.turno_id IN (:...turnoIds)", { turnoIds })
          .getRawOne();

        avgNps = encuestaStats?.avgRating ? Math.round(Number(encuestaStats.avgRating) * 10) / 10 : 0;
      }

      return res.json({
        period: {
          startDate: fechaInicio,
          endDate: fechaFin,
        },
        counts: {
          total,
          finalizados,
          noAsistio,
          cancelados,
          pendientes,
          enAtencion,
        },
        percentages: {
          atendidosPct: total > 0 ? Math.round((finalizados / total) * 100) : 0,
          abandonoPct: total > 0 ? Math.round((noAsistio / total) * 100) : 0,
        },
        averages: {
          avgWaitMinutes,
          avgAttentionMinutes,
          avgNpsRating: avgNps,
        },
        byPriority: {
          general: turnos.filter((t) => t.priority === TurnoPriority.GENERAL).length,
          prioritario: turnos.filter((t) => t.priority === TurnoPriority.PRIORITARIO).length,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
