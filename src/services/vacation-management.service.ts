import { DataSource } from "typeorm";
import { AppDataSource } from "../db/conexion";
import { VacationBalance } from "../entities/vacation-balance";
import { VacationInitialSetup } from "../entities/vacation-initial-setup";
import { Usuarios } from "../entities/usuarios";
import { PermissionRequest } from "../entities/permission-request";
import { Notification } from "../entities/notificaciones";
import { NotificationService } from "./notification.service";
import { 
  differenceInYears, 
  addYears, 
  subDays, 
  differenceInDays, 
  format,
  parseISO,
  isAfter,
  isBefore
} from "date-fns";

// Tipos de notificaciones de vacaciones para usar con referenceType
export const VACATION_NOTIFICATION_TYPES = {
  PERIODO_DISPONIBLE: "vacation_period_available",
  PROXIMO_VENCIMIENTO: "vacation_expiring_soon",
  VENCIMIENTO_CRITICO: "vacation_expiring_critical",
  PERIODO_VENCIDO: "vacation_period_expired",
  CONFIGURACION_PENDIENTE: "vacation_config_pending",
  CONFIGURACION_COMPLETA: "vacation_config_complete",
} as const;

type Result<T> = 
  | { success: true; data: T } 
  | { success: false; error: string; statusCode: number };

export type ConfigureBalanceDto = {
  balanceId: number;
  diasTomados: number;
  notas?: string;
};

export class VacationManagementService {
  constructor(private readonly ds: DataSource = AppDataSource) {}

  /**
   * Inicializar el sistema de vacaciones para todos los usuarios activos
   * Se ejecuta una sola vez al implementar el sistema
   */
  async initializeVacationSystem(): Promise<Result<{ processed: number; errors: string[] }>> {
    try {
      const allUsers = await this.ds.getRepository(Usuarios).find({
        where: { status: true },
        relations: { cargoRelation: { areaRelation: true } },
      });

      const errors: string[] = [];
      let processed = 0;

      for (const user of allUsers) {
        try {
          await this.setupUserVacations(user);
          processed++;
        } catch (error: any) {
          errors.push(`Usuario ${user.id} (${user.name}): ${error.message}`);
        }
      }

      return {
        success: true,
        data: { processed, errors },
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
        statusCode: 500,
      };
    }
  }

  /**
   * Configurar vacaciones para un usuario específico
   */
  async setupUserVacations(user: Usuarios): Promise<void> {
    if (!user.dateStartContract) {
      throw new Error(`Usuario sin fecha de contrato`);
    }

    const yearsWorked = differenceInYears(new Date(), user.dateStartContract);

    if (yearsWorked < 1) {
      // Aún no cumple el primer año, no aplica
      return;
    }

    // Verificar si ya fue configurado
    const existingSetup = await this.ds.getRepository(VacationInitialSetup).findOne({
      where: { usuarioId: user.id },
    });

    if (existingSetup) {
      throw new Error(`Usuario ya tiene configuración inicial`);
    }

    const totalPeriods = Math.floor(yearsWorked);

    // Crear registro de setup inicial
    const setup = this.ds.getRepository(VacationInitialSetup).create({
      usuarioId: user.id,
      usuarioRelation: user,
      fechaCorte: new Date(),
      periodosGeneradosHastaCorte: totalPeriods,
      periodosConfigurados: 0,
      diasTotalesDisponibles: 0,
      requiereRevisionRRHH: totalPeriods > 3,
      observaciones:
        totalPeriods > 3
          ? `Empleado con ${totalPeriods} períodos generados. Solo se pueden acumular 3. RRHH debe verificar historial y configurar manualmente.`
          : totalPeriods === 0
          ? `Empleado sin períodos generados aún.`
          : `Empleado con ${totalPeriods} período(s). RRHH debe configurar balance inicial.`,
      configuracionCompleta: false,
    });

    await this.ds.getRepository(VacationInitialSetup).save(setup);

    // Generar períodos pendientes de configurar
    await this.generatePendingPeriods(user, totalPeriods);

    // Notificar a RRHH para configuración
    await this.notifyHRForSetup(user, totalPeriods);
  }

  /**
   * Generar períodos de vacaciones pendientes de configuración
   */
  private async generatePendingPeriods(user: Usuarios, totalPeriods: number): Promise<void> {
    const contractStart = user.dateStartContract!;
    const balances: VacationBalance[] = [];

    for (let i = 0; i < totalPeriods; i++) {
      const periodStart = addYears(contractStart, i);
      const periodEnd = subDays(addYears(periodStart, 1), 1);
      const expiryDate = addYears(periodEnd, 3);
      const isExpired = isAfter(new Date(), expiryDate);

      const balance = this.ds.getRepository(VacationBalance).create({
        usuarioId: user.id,
        usuarioRelation: user,
        numeroPeriodo: i + 1,
        periodoInicio: periodStart,
        periodoFin: periodEnd,
        diasAsignados: 15,
        diasTomados: 0,
        diasDisponibles: isExpired ? 0 : 15,
        fechaVencimiento: expiryDate,
        vencido: isExpired,
        configuradoManualmente: false,
        notasAdmin: isExpired
          ? "Período vencido - Pendiente configuración RRHH"
          : "Pendiente de configuración por RRHH",
      });

      balances.push(balance);
    }

    await this.ds.getRepository(VacationBalance).save(balances);
  }

  /**
   * Notificar a RRHH sobre usuario pendiente de configuración
   */
  private async notifyHRForSetup(user: Usuarios, totalPeriods: number): Promise<void> {
    // Notificar a todos los usuarios con rol RRHH (rol 3)
    await NotificationService.createNotificationForRole(
      [3], // Rol RRHH
      "Configuración de vacaciones pendiente",
      `El usuario ${user.name} ${user.lastName} requiere configuración inicial de vacaciones. Períodos generados: ${totalPeriods}`,
      user.id,
      VACATION_NOTIFICATION_TYPES.CONFIGURACION_PENDIENTE
    );
  }

  /**
   * Configurar balance de vacaciones para un usuario (usado por RRHH)
   */
  async configureUserVacationBalance(
    userId: number,
    adminId: number,
    configuration: ConfigureBalanceDto[]
  ): Promise<Result<VacationInitialSetup>> {
    return await this.ds.transaction(async (manager) => {
      // Verificar que el usuario existe
      const user = await manager.getRepository(Usuarios).findOne({
        where: { id: userId },
      });

      if (!user) {
        return {
          success: false,
          error: "Usuario no encontrado",
          statusCode: 404,
        };
      }

      // Verificar setup inicial
      const setup = await manager.getRepository(VacationInitialSetup).findOne({
        where: { usuarioId: userId },
      });

      if (!setup) {
        return {
          success: false,
          error: "Usuario no tiene configuración inicial. Ejecute setupUserVacations primero.",
          statusCode: 400,
        };
      }

      if (setup.configuracionCompleta) {
        return {
          success: false,
          error: "Usuario ya tiene configuración completa",
          statusCode: 400,
        };
      }

      let totalDiasDisponibles = 0;

      // Configurar cada balance
      for (const config of configuration) {
        const balance = await manager.getRepository(VacationBalance).findOne({
          where: { id: config.balanceId, usuarioId: userId },
        });

        if (!balance) {
          return {
            success: false,
            error: `Balance ${config.balanceId} no encontrado para el usuario`,
            statusCode: 404,
          };
        }

        if (config.diasTomados < 0 || config.diasTomados > balance.diasAsignados) {
          return {
            success: false,
            error: `Días tomados inválidos para balance ${config.balanceId}. Debe estar entre 0 y ${balance.diasAsignados}`,
            statusCode: 400,
          };
        }

        balance.diasTomados = config.diasTomados;
        balance.diasDisponibles = balance.diasAsignados - config.diasTomados;
        balance.configuradoManualmente = true;
        balance.notasAdmin = config.notas || "Configurado por RRHH";

        await manager.getRepository(VacationBalance).save(balance);

        // Solo contar días disponibles de períodos no vencidos
        if (!balance.vencido) {
          totalDiasDisponibles += balance.diasDisponibles;
        }
      }

      // Actualizar setup
      setup.configuracionCompleta = true;
      setup.periodosConfigurados = configuration.length;
      setup.diasTotalesDisponibles = totalDiasDisponibles;

      await manager.getRepository(VacationInitialSetup).save(setup);

      // Notificar al usuario que su configuración está completa
      await this.notifyUserConfigurationComplete(userId, totalDiasDisponibles);

      return {
        success: true,
        data: setup,
      };
    });
  }

  /**
   * Notificar al usuario que su configuración está completa
   */
  private async notifyUserConfigurationComplete(
    userId: number,
    diasDisponibles: number,
  ): Promise<void> {
    await NotificationService.createNotification(
      userId,
      "Balance de vacaciones configurado",
      `Tu balance de vacaciones ha sido configurado. Tienes ${diasDisponibles} días disponibles.`,
      userId,
      VACATION_NOTIFICATION_TYPES.CONFIGURACION_COMPLETA
    );
  }

  /**
   * Obtener usuarios pendientes de configuración (para RRHH)
   */
  async getUsersPendingSetup(): Promise<
    Array<{
      setupId: number;
      userId: number;
      userName: string;
      fechaContrato: string;
      periodosGenerados: number;
      requiereRevision: boolean;
      observaciones: string;
      balances: Array<{
        balanceId: number;
        periodo: number;
        fechaInicio: string;
        fechaFin: string;
        fechaVencimiento: string;
        vencido: boolean;
        diasAsignados: number;
      }>;
    }>
  > {
    const pendingSetups = await this.ds.getRepository(VacationInitialSetup).find({
      where: { configuracionCompleta: false },
      relations: { usuarioRelation: true },
      order: { requiereRevisionRRHH: "DESC", periodosGeneradosHastaCorte: "DESC" },
    });

    const result = [];

    for (const setup of pendingSetups) {
      const balances = await this.ds.getRepository(VacationBalance).find({
        where: { usuarioId: setup.usuarioId },
        order: { numeroPeriodo: "ASC" },
      });

      result.push({
        setupId: setup.id,
        userId: setup.usuarioId,
        userName: `${setup.usuarioRelation.name} ${setup.usuarioRelation.lastName}`,
        fechaContrato: format(setup.usuarioRelation.dateStartContract!, "yyyy-MM-dd"),
        periodosGenerados: setup.periodosGeneradosHastaCorte,
        requiereRevision: setup.requiereRevisionRRHH,
        observaciones: setup.observaciones || "",
        balances: balances.map((b) => ({
          balanceId: b.id,
          periodo: b.numeroPeriodo,
          fechaInicio: format(b.periodoInicio, "yyyy-MM-dd"),
          fechaFin: format(b.periodoFin, "yyyy-MM-dd"),
          fechaVencimiento: format(b.fechaVencimiento, "yyyy-MM-dd"),
          vencido: b.vencido,
          diasAsignados: b.diasAsignados,
        })),
      });
    }

    return result;
  }

  /**
   * Obtener balance de vacaciones de un usuario
   */
  async getUserVacationBalance(userId: number): Promise<Result<{
    configuracionCompleta: boolean;
    totalDiasDisponibles: number;
    periodos: Array<{
      balanceId: number;
      periodo: number;
      fechaInicio: string;
      fechaFin: string;
      fechaVencimiento: string;
      diasAsignados: number;
      diasTomados: number;
      diasDisponibles: number;
      vencido: boolean;
      configurado: boolean;
    }>;
  }>> {
    const setup = await this.ds.getRepository(VacationInitialSetup).findOne({
      where: { usuarioId: userId },
    });

    if (!setup) {
      return {
        success: false,
        error: "Usuario no tiene configuración de vacaciones",
        statusCode: 404,
      };
    }

    const balances = await this.ds.getRepository(VacationBalance).find({
      where: { usuarioId: userId },
      order: { numeroPeriodo: "ASC" },
    });

    return {
      success: true,
      data: {
        configuracionCompleta: setup.configuracionCompleta,
        totalDiasDisponibles: setup.diasTotalesDisponibles,
        periodos: balances.map((b) => ({
          balanceId: b.id,
          periodo: b.numeroPeriodo,
          fechaInicio: format(b.periodoInicio, "yyyy-MM-dd"),
          fechaFin: format(b.periodoFin, "yyyy-MM-dd"),
          fechaVencimiento: format(b.fechaVencimiento, "yyyy-MM-dd"),
          diasAsignados: b.diasAsignados,
          diasTomados: b.diasTomados,
          diasDisponibles: b.diasDisponibles,
          vencido: b.vencido,
          configurado: b.configuradoManualmente,
        })),
      },
    };
  }

  /**
   * Actualizar balance después de aprobar una solicitud de vacaciones
   * Se llama desde PermissionService cuando se aprueba una solicitud de VACACIONES
   */
  async deductVacationDays(userId: number, days: number, startDate: Date): Promise<Result<void>> {
    return await this.ds.transaction(async (manager) => {
      // Obtener períodos activos (no vencidos) ordenados por antigüedad
      const activeBalances = await manager.getRepository(VacationBalance).find({
        where: { usuarioId: userId, vencido: false },
        order: { periodoInicio: "ASC" }, // Descontar de los más antiguos primero
      });

      if (activeBalances.length === 0) {
        return {
          success: false,
          error: "Usuario no tiene períodos de vacaciones disponibles",
          statusCode: 400,
        };
      }

      let remainingDays = days;

      for (const balance of activeBalances) {
        if (remainingDays <= 0) break;

        const availableDays = balance.diasDisponibles;

        if (availableDays > 0) {
          const daysToDeduct = Math.min(remainingDays, availableDays);

          balance.diasTomados += daysToDeduct;
          balance.diasDisponibles -= daysToDeduct;

          await manager.getRepository(VacationBalance).save(balance);

          remainingDays -= daysToDeduct;
        }
      }

      if (remainingDays > 0) {
        return {
          success: false,
          error: `No hay suficientes días disponibles. Faltan ${remainingDays} días.`,
          statusCode: 400,
        };
      }

      // Recalcular total disponible
      const setup = await manager.getRepository(VacationInitialSetup).findOne({
        where: { usuarioId: userId },
      });

      if (setup) {
        const allBalances = await manager.getRepository(VacationBalance).find({
          where: { usuarioId: userId, vencido: false },
        });

        setup.diasTotalesDisponibles = allBalances.reduce(
          (sum, b) => sum + b.diasDisponibles,
          0
        );

        await manager.getRepository(VacationInitialSetup).save(setup);
      }

      return {
        success: true,
        data: undefined,
      };
    });
  }

  /**
   * Job que se ejecuta diariamente para verificar vencimientos y generar notificaciones
   */
  async checkVacationExpirations(): Promise<void> {
    const now = new Date();

    // Obtener todos los balances activos
    const activeBalances = await this.ds.getRepository(VacationBalance).find({
      where: { vencido: false },
      relations: { usuarioRelation: true },
    });

    for (const balance of activeBalances) {
      const daysUntilExpiry = differenceInDays(balance.fechaVencimiento, now);

      // Verificar si ya venció
      if (daysUntilExpiry < 0) {
        const diasPerdidos = balance.diasDisponibles;
        balance.vencido = true;
        balance.diasDisponibles = 0;
        await this.ds.getRepository(VacationBalance).save(balance);

        // Notificar vencimiento
        await NotificationService.createNotification(
          balance.usuarioId,
          "Período de vacaciones vencido",
          `Tu período ${balance.numeroPeriodo} de vacaciones ha vencido. Se perdieron ${diasPerdidos} días.`,
          balance.id,
          VACATION_NOTIFICATION_TYPES.PERIODO_VENCIDO
        );

        continue;
      }

      // Si tiene días pendientes
      if (balance.diasDisponibles > 0) {
        // Notificar 1 mes antes (crítico)
        if (daysUntilExpiry <= 30) {
          const shouldNotify = await this.shouldCreateNotification(
            balance.usuarioId,
            VACATION_NOTIFICATION_TYPES.VENCIMIENTO_CRITICO,
            balance.id
          );

          if (shouldNotify) {
            await NotificationService.createNotification(
              balance.usuarioId,
              "¡URGENTE! Vacaciones por vencer",
              `Tu período ${balance.numeroPeriodo} de vacaciones vence en ${daysUntilExpiry} días. Tienes ${balance.diasDisponibles} días por tomar.`,
              balance.id,
              VACATION_NOTIFICATION_TYPES.VENCIMIENTO_CRITICO
            );
          }
        }
        // Notificar 6 meses antes
        else if (daysUntilExpiry <= 180) {
          const shouldNotify = await this.shouldCreateNotification(
            balance.usuarioId,
            VACATION_NOTIFICATION_TYPES.PROXIMO_VENCIMIENTO,
            balance.id
          );

          if (shouldNotify) {
            await NotificationService.createNotification(
              balance.usuarioId,
              "Vacaciones próximas a vencer",
              `Tu período ${balance.numeroPeriodo} de vacaciones vence el ${format(
                balance.fechaVencimiento,
                "dd/MM/yyyy"
              )}. Tienes ${balance.diasDisponibles} días disponibles.`,
              balance.id,
              VACATION_NOTIFICATION_TYPES.PROXIMO_VENCIMIENTO
            );
          }
        }
      }
    }
  }

  /**
   * Verificar si se debe crear una notificación (evitar duplicados en 7 días)
   */
  private async shouldCreateNotification(
    userId: number,
    referenceType: string,
    referenceId: number
  ): Promise<boolean> {
    const sevenDaysAgo = subDays(new Date(), 7);

    const recentNotification = await this.ds
      .getRepository(Notification)
      .createQueryBuilder("n")
      .where("n.user_id = :userId", { userId })
      .andWhere("n.reference_type = :referenceType", { referenceType })
      .andWhere("n.reference_id = :referenceId", { referenceId })
      .andWhere("n.created_at >= :sevenDaysAgo", { sevenDaysAgo })
      .getOne();

    return !recentNotification;
  }

  /**
   * Obtener notificaciones de vacaciones de un usuario
   */
  async getUserVacationNotifications(userId: number, onlyUnread: boolean = false) {
    const query = this.ds
      .getRepository(Notification)
      .createQueryBuilder("n")
      .where("n.user_id = :userId", { userId })
      .andWhere("n.reference_type LIKE :prefix", { prefix: "vacation_%" });

    if (onlyUnread) {
      query.andWhere("n.is_read = :isRead", { isRead: false });
    }

    return await query.orderBy("n.created_at", "DESC").getMany();
  }

  /**
   * Marcar notificación como leída (delegamos a NotificationService)
   */
  async markNotificationAsRead(notificationId: number, userId: number): Promise<Result<void>> {
    const notification = await NotificationService.markAsRead(notificationId);

    if (!notification) {
      return {
        success: false,
        error: "Notificación no encontrada",
        statusCode: 404,
      };
    }

    // Validar que la notificación pertenece al usuario
    if (notification.userId !== userId) {
      return {
        success: false,
        error: "No autorizado",
        statusCode: 403,
      };
    }

    return {
      success: true,
      data: undefined,
    };
  }
}
