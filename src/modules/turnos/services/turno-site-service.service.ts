import { EntityManager, In } from "typeorm";
import { BadRequestError, ConflictError, NotFoundError } from "@core/utils/custom-errors";
import { Sedes } from "../../catalog/entities/sedes";
import { ServicioAtencion } from "../../catalog/entities/servicio-atencion";
import { Turno, TurnoStatus } from "../entities/Turno";
import { SesionAtencion } from "../entities/SesionAtencion";
import { SesionAtencionServicio } from "../entities/SesionAtencionServicio";
import { TurnoSedeServicio } from "../entities/TurnoSedeServicio";

const UNRESOLVED_STATUSES = [
  TurnoStatus.PENDIENTE,
  TurnoStatus.LLAMADO,
  TurnoStatus.EN_ATENCION,
];

export class TurnoSiteServiceService {
  static async getAssignment(headquarterId: number) {
    
    const [headquarter, services, assignments] = await Promise.all([
      Sedes.findOne({ where: { id: headquarterId }, select: ["id", "name"] }),
      ServicioAtencion.find({ where: { status: true }, order: { name: "ASC" } }),
      TurnoSedeServicio.find({ where: { headquarterId }, order: { serviceId: "ASC" } }),
    ]);
    if (!headquarter) throw new NotFoundError("Sede no encontrada");

    const assignedIds = new Set(assignments.map(({ serviceId }) => serviceId));
    return {
      headquarterId,
      assignedServiceIds: assignments.map(({ serviceId }) => serviceId),
      services: services.map(({ id, name }) => ({ id, name, isAssigned: assignedIds.has(id) })),
    };
  }

  static async replaceAssignment(headquarterId: number, serviceIds: unknown) {
    if (!Array.isArray(serviceIds)) {
      throw new BadRequestError("La lista de servicios debe ser un arreglo");
    }

    const normalizedIds = serviceIds.map(Number);
    if (normalizedIds.some((id) => !Number.isInteger(id) || id <= 0)) {
      throw new BadRequestError("Los servicios seleccionados no son válidos");
    }
    if (new Set(normalizedIds).size !== normalizedIds.length) {
      throw new BadRequestError("La lista contiene servicios duplicados");
    }

    return TurnoSedeServicio.getRepository().manager.transaction("READ COMMITTED", async (manager) => {
      const headquarter = await manager.findOne(Sedes, {
        where: { id: headquarterId },
        lock: { mode: "pessimistic_write" },
      });
      if (!headquarter) throw new NotFoundError("Sede no encontrada");

      const currentAssignments = await manager.find(TurnoSedeServicio, { where: { headquarterId } });
      const requestedServices = normalizedIds.length > 0
        ? await manager.find(ServicioAtencion, { where: { id: In(normalizedIds), status: true } })
        : [];
      if (requestedServices.length !== normalizedIds.length) {
        throw new BadRequestError("Uno o varios servicios no existen o están inactivos");
      }

      const requestedIds = new Set(normalizedIds);
      const removedIds = currentAssignments
        .map(({ serviceId }) => serviceId)
        .filter((serviceId) => !requestedIds.has(serviceId));

      if (removedIds.length > 0) {
        const activeSessions = await manager.find(SesionAtencion, {
          where: { headquarterId, isActive: true },
          relations: ["serviciosAsignados"],
        });
        const sessionUsesRemovedService = activeSessions.some((session) =>
          session.serviciosAsignados.some(({ serviceId }) => removedIds.includes(serviceId)),
        );
        if (sessionUsesRemovedService) {
          throw new ConflictError("No se puede retirar un servicio utilizado por una sesión activa");
        }

        const unresolvedTurn = await manager.findOne(Turno, {
          where: {
            headquarterId,
            serviceId: In(removedIds),
            status: In(UNRESOLVED_STATUSES),
          },
          select: ["id"],
        });
        if (unresolvedTurn) {
          throw new ConflictError("No se puede retirar un servicio que tiene turnos sin resolver");
        }
      }

      await manager.delete(TurnoSedeServicio, { headquarterId });
      if (normalizedIds.length > 0) {
        await manager.save(TurnoSedeServicio, normalizedIds.map((serviceId) => ({ headquarterId, serviceId })));
      }

      return {
        headquarterId,
        serviceIds: normalizedIds,
      };
    });
  }
}
