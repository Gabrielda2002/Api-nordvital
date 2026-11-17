import { ModuloAtencion } from "../entities/ModuloAtencion";
import { SesionAtencion } from "../entities/SesionAtencion";
import { TurnoPriority } from "../entities/Turno";
import { TurnoSedeServicio } from "../entities/TurnoSedeServicio";
import { TurnoQueueService } from "./turno-queue.service";

export class TurnoServiceCoverageService {
  static async getActiveAssignedServiceIds(headquarterId: number): Promise<number[]> {
    const assignments = await TurnoSedeServicio.find({
      where: { headquarterId },
      relations: ["service"],
    });
    return assignments
      .filter(({ service }) => service?.status)
      .map(({ serviceId }) => serviceId);
  }

  static async hasCompleteCoverage(
    headquarterId: number,
    priority: TurnoPriority,
  ): Promise<boolean> {
    const isPriorityModule = priority === TurnoPriority.PRIORITARIO;
    const [activeServiceIds, activeModules, activeSessions] = await Promise.all([
      this.getActiveAssignedServiceIds(headquarterId),
      ModuloAtencion.find({
        where: { headquarterId, isActive: true, isPriority: isPriorityModule },
        select: ["id"],
      }),
      SesionAtencion.find({
        where: {
          headquarterId,
          isActive: true,
          modulo: { isActive: true, isPriority: isPriorityModule },
        },
        relations: ["modulo", "serviciosAsignados"],
      }),
    ]);

    return TurnoQueueService.hasCompleteServiceCoverage(
      activeServiceIds,
      activeModules.map(({ id }) => id),
      activeSessions.map((session) => ({
        moduloId: session.moduloId,
        serviceIds: session.serviciosAsignados.map(({ serviceId }) => serviceId),
      }))
    );
  }

  static async getQueueServiceIds(
    headquarterId: number,
    serviceId: number,
    priority: TurnoPriority,
  ): Promise<number[]> {
    if (!(await this.hasCompleteCoverage(headquarterId, priority))) {
      return [serviceId];
    }
    return this.getActiveAssignedServiceIds(headquarterId);
  }
}
