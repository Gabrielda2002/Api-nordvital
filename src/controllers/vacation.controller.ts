import { NextFunction, Request, Response } from "express";
import { VacationManagementService } from "../services/vacation-management.service";
import { ValidationError, validate } from "class-validator";

const vacationService = new VacationManagementService();

/**
 * Inicializar el sistema de vacaciones para todos los usuarios
 * Solo debe ejecutarse una vez
 * POST /api/vacations/initialize
 */
export const initializeVacationSystem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await vacationService.initializeVacationSystem();

    if (!result.success) {
      return res.status(result.statusCode).json({
        ok: false,
        message: result.error,
      });
    }

    return res.status(200).json({
      ok: true,
      message: "Sistema de vacaciones inicializado correctamente",
      data: result.data,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtener usuarios pendientes de configuración (solo RRHH)
 * GET /api/vacations/pending-setup
 */
export const getUsersPendingSetup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await vacationService.getUsersPendingSetup();

    return res.status(200).json({
      ok: true,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Configurar balance de vacaciones de un usuario (solo RRHH)
 * POST /api/vacations/configure/:userId
 * Body: {
 *   configuration: [
 *     { balanceId: number, diasTomados: number, notas?: string }
 *   ]
 * }
 */
export const configureUserVacationBalance = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = parseInt(req.params.userId);
    const adminId = (req as any).user?.id; // Del middleware de autenticación
    const { configuration } = req.body;

    if (!configuration || !Array.isArray(configuration)) {
      return res.status(400).json({
        ok: false,
        message: "Se requiere un array de configuración",
      });
    }

    // Validar estructura de cada configuración
    for (const config of configuration) {
      if (
        typeof config.balanceId !== "number" ||
        typeof config.diasTomados !== "number"
      ) {
        return res.status(400).json({
          ok: false,
          message:
            "Cada configuración debe tener balanceId y diasTomados como números",
        });
      }

      if (config.diasTomados < 0) {
        return res.status(400).json({
          ok: false,
          message: "Los días tomados no pueden ser negativos",
        });
      }
    }

    const result = await vacationService.configureUserVacationBalance(
      userId,
      adminId,
      configuration
    );

    if (!result.success) {
      return res.status(result.statusCode).json({
        ok: false,
        message: result.error,
      });
    }

    return res.status(200).json({
      ok: true,
      message: "Balance de vacaciones configurado correctamente",
      data: result.data,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtener balance de vacaciones de un usuario
 * GET /api/vacations/balance/:userId
 */
export const getUserVacationBalance = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = parseInt(req.params.userId);

    const result = await vacationService.getUserVacationBalance(userId);

    if (!result.success) {
      return res.status(result.statusCode).json({
        ok: false,
        message: result.error,
      });
    }

    return res.status(200).json({
      ok: true,
      data: result.data,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtener balance de vacaciones del usuario autenticado
 * GET /api/vacations/my-balance
 */
export const getMyVacationBalance = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as any).user?.id; // Del middleware de autenticación

    if (!userId) {
      return res.status(401).json({
        ok: false,
        message: "No autenticado",
      });
    }

    const result = await vacationService.getUserVacationBalance(userId);

    if (!result.success) {
      return res.status(result.statusCode).json({
        ok: false,
        message: result.error,
      });
    }

    return res.status(200).json({
      ok: true,
      data: result.data,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtener notificaciones de vacaciones del usuario
 * GET /api/vacations/notifications
 * Query params: ?unreadOnly=true
 */
export const getUserVacationNotifications = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as any).user?.id;
    const unreadOnly = req.query.unreadOnly === "true";

    if (!userId) {
      return res.status(401).json({
        ok: false,
        message: "No autenticado",
      });
    }

    const notifications = await vacationService.getUserVacationNotifications(
      userId,
      unreadOnly
    );

    return res.status(200).json({
      ok: true,
      data: notifications,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Marcar notificación como leída
 * PATCH /api/vacations/notifications/:notificationId/read
 */
export const markNotificationAsRead = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const notificationId = parseInt(req.params.notificationId);
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({
        ok: false,
        message: "No autenticado",
      });
    }

    const result = await vacationService.markNotificationAsRead(
      notificationId,
      userId
    );

    if (!result.success) {
      return res.status(result.statusCode).json({
        ok: false,
        message: result.error,
      });
    }

    return res.status(200).json({
      ok: true,
      message: "Notificación marcada como leída",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Ejecutar job de verificación de vencimientos
 * POST /api/vacations/check-expirations
 * Solo para testing o ejecución manual (normalmente se ejecuta vía cron)
 */
export const checkVacationExpirations = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await vacationService.checkVacationExpirations();

    return res.status(200).json({
      ok: true,
      message: "Verificación de vencimientos ejecutada correctamente",
    });
  } catch (error) {
    next(error);
  }
};
