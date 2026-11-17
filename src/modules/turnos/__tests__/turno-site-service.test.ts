import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { EntityManager, Repository } from "typeorm";
import { Sedes } from "../../catalog/entities/sedes";
import { ServicioAtencion } from "../../catalog/entities/servicio-atencion";
import { Turno, TurnoStatus } from "../entities/Turno";
import { SesionAtencion } from "../entities/SesionAtencion";
import { TurnoSedeServicio } from "../entities/TurnoSedeServicio";
import { TurnoSiteServiceService } from "../services/turno-site-service.service";
import { ConflictError, BadRequestError } from "@core/utils/custom-errors";

function managerHarness(options?: {
  assignments?: Array<{ serviceId: number }>;
  activeSessions?: Array<{ serviciosAsignados: Array<{ serviceId: number }> }>;
  unresolvedTurn?: object | null;
  activeServices?: Array<{ id: number }>;
}) {
  let deleted = false;
  let saved: Array<{ headquarterId: number; serviceId: number }> = [];
  let lock: unknown;
  const manager = {
    findOne: async (entity: unknown, findOptions: { lock?: unknown }) => {
      if (entity === Sedes) {
        lock = findOptions.lock;
        return { id: 1 };
      }
      assert.equal(entity, Turno);
      return options?.unresolvedTurn ?? null;
    },
    find: async (entity: unknown) => {
      if (entity === TurnoSedeServicio) return options?.assignments ?? [];
      if (entity === ServicioAtencion) return options?.activeServices ?? [];
      assert.equal(entity, SesionAtencion);
      return options?.activeSessions ?? [];
    },
    delete: async () => { deleted = true; },
    save: async (_entity: unknown, records: Array<{ headquarterId: number; serviceId: number }>) => { saved = records; },
  } as unknown as EntityManager;
  const transaction = async (_isolation: string, work: (transactionManager: EntityManager) => unknown) => work(manager);
  return {
    manager,
    transaction,
    get deleted() { return deleted; },
    get saved() { return saved; },
    get lock() { return lock; },
  };
}

describe("Asignación de servicios por sede", () => {
  it("reemplaza asignaciones válidas dentro de una transacción bloqueada", async (t) => {
    const harness = managerHarness({
      assignments: [{ serviceId: 2 }],
      activeServices: [{ id: 1 }, { id: 3 }],
    });
    t.mock.method(TurnoSedeServicio, "getRepository", () => ({ manager: { transaction: harness.transaction } } as unknown as Repository<TurnoSedeServicio>));

    const result = await TurnoSiteServiceService.replaceAssignment(1, [1, 3]);

    assert.deepEqual(result, { headquarterId: 1, serviceIds: [1, 3] });
    assert.deepEqual(harness.saved, [{ headquarterId: 1, serviceId: 1 }, { headquarterId: 1, serviceId: 3 }]);
    assert.equal(harness.deleted, true);
    assert.deepEqual(harness.lock, { mode: "pessimistic_write" });
  });

  it("rechaza IDs repetidos antes de abrir una transacción", async () => {
    await assert.rejects(TurnoSiteServiceService.replaceAssignment(1, [2, 2]), BadRequestError);
  });

  it("impide retirar un servicio utilizado por una sesión activa sin borrar asignaciones", async (t) => {
    const harness = managerHarness({
      assignments: [{ serviceId: 2 }],
      activeSessions: [{ serviciosAsignados: [{ serviceId: 2 }] }],
    });
    t.mock.method(TurnoSedeServicio, "getRepository", () => ({ manager: { transaction: harness.transaction } } as unknown as Repository<TurnoSedeServicio>));

    await assert.rejects(TurnoSiteServiceService.replaceAssignment(1, []), ConflictError);
    assert.equal(harness.deleted, false);
  });

  it("impide retirar un servicio con turnos sin resolver de cualquier fecha", async (t) => {
    const harness = managerHarness({
      assignments: [{ serviceId: 2 }],
      unresolvedTurn: { id: 8, status: TurnoStatus.PENDIENTE },
    });
    t.mock.method(TurnoSedeServicio, "getRepository", () => ({ manager: { transaction: harness.transaction } } as unknown as Repository<TurnoSedeServicio>));

    await assert.rejects(TurnoSiteServiceService.replaceAssignment(1, []), ConflictError);
    assert.equal(harness.deleted, false);
  });

  it("no modifica asignaciones si un servicio solicitado no está activo", async (t) => {
    const harness = managerHarness({ activeServices: [] });
    t.mock.method(TurnoSedeServicio, "getRepository", () => ({ manager: { transaction: harness.transaction } } as unknown as Repository<TurnoSedeServicio>));

    await assert.rejects(TurnoSiteServiceService.replaceAssignment(1, [7]), BadRequestError);
    assert.equal(harness.deleted, false);
  });
});
