import { EntityManager, In, MoreThanOrEqual } from "typeorm";
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
} from "@core/utils/custom-errors";
import { ServicioAtencion } from "../../catalog/entities/servicio-atencion";
import { SesionAtencionServicio } from "../entities/SesionAtencionServicio";
import { Turno, TurnoStatus } from "../entities/Turno";
import Logger from "@core/utils/logger-wrapper";

function validateName(value: unknown): string {
  const name = typeof value === "string" ? value.trim() : "";

  if (name.length < 3 || name.length > 150) {
    throw new BadRequestError(
      "El nombre del servicio debe tener entre 3 y 150 caracteres",
    );
  }

  return name;
}

async function assertCanDeactivate(
  manager: EntityManager,
  serviceId: number,
): Promise<void> {

  const activeSession = await manager.exists(SesionAtencionServicio, {
    where: { serviceId, sesion: { isActive: true } },
  });

  if (activeSession) {
    throw new ConflictError(
      "No se puede desactivar un servicio utilizado por una sesión activa",
    );
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const unresolvedTurn = await manager.exists(Turno, {
    where: {
      serviceId,
      status: In([
        TurnoStatus.PENDIENTE,
        TurnoStatus.LLAMADO,
        TurnoStatus.EN_ATENCION,
      ]),
      createdAt: MoreThanOrEqual(today),
    },
  });

  if (unresolvedTurn) {
    throw new ConflictError(
      "No se puede desactivar un servicio que tiene turnos sin resolver",
    );
  }
}

export class TurnoServiceCatalogService {
  static list() {
    return ServicioAtencion.find({ order: { name: "ASC", id: "ASC" } });
  }

  static create(value: unknown) {
    const name = validateName(value);
    return ServicioAtencion.save(
      ServicioAtencion.create({ name, status: true }),
    );
  }

  static update(id: number, value: unknown, status: unknown) {
    const name = validateName(value);
    const isActive = status === true || status === 1 || status === "1";

    if (!isActive && status !== false && status !== 0 && status !== "0") {
      throw new BadRequestError("El estado del servicio no es válido");
    }

    return ServicioAtencion.getRepository().manager.transaction(
      "READ COMMITTED",
      async (manager) => {

        const service = await manager.findOne(ServicioAtencion, {
          where: { id },
          lock: { mode: "pessimistic_write" },
        });

        if (!service)
          throw new NotFoundError("El servicio de atención no existe");

        if (service.status && !isActive) await assertCanDeactivate(manager, id);

        service.name = name;
        service.status = isActive;
        return manager.save(service);
      },
    );
  }
}
