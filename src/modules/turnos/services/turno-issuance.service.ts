import { randomUUID } from "node:crypto";
import { Between, EntityManager, In } from "typeorm";
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
} from "@core/utils/custom-errors";
import { validateEntity } from "@core/utils/validation-helper";
import { Pacientes } from "../../patients/entities/pacientes";
import { TipoDocumento } from "../../catalog/entities/tipo-documento";
import { ServicioAtencion } from "../../catalog/entities/servicio-atencion";
import { Sedes } from "../../catalog/entities/sedes";
import { Turno, TurnoClassification, TurnoPriority, TurnoStatus } from "../entities/Turno";
import { TurnoSedeConfig } from "../entities/TurnoSedeConfig";
import { TurnoTracking } from "../entities/TurnoTracking";
import { TurnoSedeServicio } from "../entities/TurnoSedeServicio";
import { TurnoDayService } from "./turno-day.service";
import { TurnoQueueService } from "./turno-queue.service";

interface IssueTurnInput {
  headquarterId: number;
  serviceId: number;
  priority: TurnoPriority;
  classification: TurnoClassification;
  documentNumber: string;
  documentTypeId: number;
  name: string;
  phoneNumber: string;
}
export class TurnoIssuanceService {
  static resolveDocumentTypeId(documentTypeId: unknown): number {
    const id = Number(documentTypeId);
    if (!Number.isInteger(id) || id <= 0) {
      throw new BadRequestError(
        "El tipo de documento es requerido y debe ser un ID válido",
      );
    }
    return id;
  }

  static resolveClassification(classification: unknown): TurnoClassification {
    const value = typeof classification === "string" ? classification.trim() : "";
    if (!Object.values(TurnoClassification).includes(value as TurnoClassification)) {
      throw new BadRequestError(
        "La clasificación del trámite es requerida y debe ser válida",
      );
    }
    return value as TurnoClassification;
  }

  private static async findPatient(
    manager: EntityManager,
    input: IssueTurnInput,
  ): Promise<Pacientes> {
    const where = {
      documentNumber: input.documentNumber.trim(),
      documentTypeId: input.documentTypeId,
    };
    let patient = await manager.findOne(Pacientes, {
      where,
      lock: { mode: "pessimistic_write" },
    });
    if (patient) return patient;

    // Una identidad nueva aún no tiene fila para bloquear; serializar su alta por tipo.
    const documentType = await manager.findOne(TipoDocumento, {
      where: { id: input.documentTypeId, status: true },
      lock: { mode: "pessimistic_write" },
    });
    if (!documentType)
      throw new NotFoundError("El tipo de documento no existe o está inactivo");
    patient = await manager.findOne(Pacientes, {
      where,
      lock: { mode: "pessimistic_write" },
    });
    if (patient) return patient;

    patient = manager.create(Pacientes, {
      ...where,
      name: input.name.trim(),
      phoneNumber: input.phoneNumber.trim(),
      email: null,
      address: null,
      agreementId: null,
      ipsPrimaryId: null,
      status: true,
    });
    // Solo turnos permite posponer el perfil; las altas y ediciones habituales siguen completas.
    await validateEntity(patient, { groups: ["turno-registration"] });
    return manager.save(patient);
  }

  // El método issue() crea un turno para un paciente, validando que no tenga turnos activos en el día y que la sede esté habilitada para turnos. Si el paciente no existe, se crea uno nuevo. Se utiliza una transacción para garantizar la consistencia de los datos.
  static async issue(
    input: IssueTurnInput,
  ): Promise<{ created: boolean; turno: Turno }> {
    return Turno.getRepository().manager.transaction(
      "READ COMMITTED",
      async (manager) => {
        const patient = await this.findPatient(manager, input);
        const { start, end } = TurnoDayService.getRange();
        const config = await manager.findOne(TurnoSedeConfig, {
          where: { headquarterId: input.headquarterId, isEnabled: true },
          lock: { mode: "pessimistic_write" },
        });
        if (!config)
          throw new NotFoundError("La sede no está habilitada para turnos");
        const headquarter = await manager.findOne(Sedes, {
          where: { id: input.headquarterId },
          lock: { mode: "pessimistic_write" },
        });
        if (!headquarter) throw new NotFoundError("La sede no está habilitada para turnos");

        const siteAssignments = await manager.find(TurnoSedeServicio, {
          where: { headquarterId: input.headquarterId },
          select: ["serviceId"],
        });
        if (siteAssignments.length === 0) {
          throw new BadRequestError("La sede no tiene servicios de atención configurados");
        }
        if (!siteAssignments.some(({ serviceId }) => serviceId === input.serviceId)) {
          throw new BadRequestError("El servicio seleccionado no está habilitado para esta sede");
        }
        const service = await manager.findOne(ServicioAtencion, {
          where: { id: input.serviceId, status: true },
        });
        if (!service) throw new BadRequestError("El servicio seleccionado no existe o está inactivo");

        const activeTurn = await manager.findOne(Turno, {
          where: {
            patientId: patient.id,
            status: In([
              TurnoStatus.PENDIENTE,
              TurnoStatus.LLAMADO,
              TurnoStatus.EN_ATENCION,
            ]),
            createdAt: Between(start, end),
          },
          relations: ["service", "headquarter"],
        });
        if (activeTurn) return { created: false, turno: activeTurn };

        const dailyNumber = await TurnoQueueService.getNextDailyNumber(
          input.headquarterId,
          start,
          manager,
        );
        const turno = manager.create(Turno, {
          headquarterId: input.headquarterId,
          serviceId: input.serviceId,
          patientId: patient.id,
          ticketToken: randomUUID(),
          ticketCode: TurnoQueueService.generateTicketCode(
            input.priority,
            dailyNumber,
          ),
          dailyNumber,
          priority: input.priority,
          classification: input.classification,
          status: TurnoStatus.PENDIENTE,
          callCount: 0,
        });
        await validateEntity(turno);
        await manager.save(turno);
        await manager.save(
          manager.create(TurnoTracking, {
            turnoId: turno.id,
            status: turno.status,
            notes: "Turno creado por paciente móvil",
          }),
        );
        return { created: true, turno };
      },
    );
  }

  static async cancel(token: string, reason?: string): Promise<Turno> {
    return Turno.getRepository().manager.transaction(async (manager) => {
      const turno = await manager.findOne(Turno, {
        where: { ticketToken: token },
        lock: { mode: "pessimistic_write" },
      });
      if (!turno) throw new NotFoundError("Ticket no encontrado");
      if (
        turno.status !== TurnoStatus.PENDIENTE &&
        turno.status !== TurnoStatus.LLAMADO
      ) {
        throw new ConflictError(
          "Solo puedes cancelar un turno pendiente o llamado",
        );
      }
      turno.status = TurnoStatus.CANCELADO;
      turno.finishedAt = new Date();
      await manager.save(turno);
      await manager.save(
        manager.create(TurnoTracking, {
          turnoId: turno.id,
          status: turno.status,
          moduloId: turno.currentModuloId,
          userId: turno.currentUserId,
          notes: reason?.trim()
            ? `Cancelado por el paciente: ${reason.trim()}`
            : "Cancelado voluntariamente por el paciente",
        }),
      );
      return turno;
    });
  }
}
