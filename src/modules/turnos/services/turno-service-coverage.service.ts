import { ModuloAtencion } from "../entities/ModuloAtencion";
import { SesionAtencion } from "../entities/SesionAtencion";
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

  static async hasCompleteCoverage(headquarterId: number): Promise<boolean> {
    const [activeServiceIds, activeModules, activeSessions] = await Promise.all([
      this.getActiveAssignedServiceIds(headquarterId),
      ModuloAtencion.find({
        where: { headquarterId, isActive: true },
        select: ["id"],
      }),
      SesionAtencion.find({
        where: {
          headquarterId,
          isActive: true,
          modulo: { isActive: true },
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
  ): Promise<number[]> {
    if (!(await this.hasCompleteCoverage(headquarterId))) {
      return [serviceId];
    }
    return this.getActiveAssignedServiceIds(headquarterId);
  }
}
