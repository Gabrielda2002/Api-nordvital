import { ServicioAtencion } from "../../catalog/entities/servicio-atencion";
import { ModuloAtencion } from "../entities/ModuloAtencion";
import { SesionAtencion } from "../entities/SesionAtencion";
import { TurnoQueueService } from "./turno-queue.service";

export class TurnoServiceCoverageService {
  static async hasCompleteCoverage(headquarterId: number): Promise<boolean> {
    const [activeServices, activeModules, activeSessions] = await Promise.all([
      ServicioAtencion.find({ where: { status: true }, select: ["id"] }),
      ModuloAtencion.find({
        where: { headquarterId, isActive: true },
        select: ["id"],
      }),
      SesionAtencion.find({
        where: { headquarterId, isActive: true },
        relations: ["serviciosAsignados"],
      }),
    ]);

    return TurnoQueueService.hasCompleteServiceCoverage(
      activeServices.map(({ id }) => id),
      activeModules.map(({ id }) => id),
      activeSessions.map((session) => ({
        moduloId: session.moduloId,
        serviceIds: session.serviciosAsignados.map(({ serviceId }) => serviceId),
      }))
    );
  }
}
