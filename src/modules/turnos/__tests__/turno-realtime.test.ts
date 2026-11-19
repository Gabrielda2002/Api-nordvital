import { describe, it, type TestContext } from "node:test";
import assert from "node:assert/strict";
import { Module } from "node:module";
import { Request, Response, NextFunction } from "express";
import { EntityManager } from "typeorm";
import { Turno, TurnoClassification, TurnoPriority, TurnoStatus } from "../entities/Turno";
import { TurnoSedeConfig } from "../entities/TurnoSedeConfig";
import { SesionAtencion } from "../entities/SesionAtencion";
import { SesionAtencionServicio } from "../entities/SesionAtencionServicio";
import { ModuloAtencion } from "../entities/ModuloAtencion";
import { ServicioAtencion } from "../../catalog/entities/servicio-atencion";
import { Sedes } from "../../catalog/entities/sedes";
import { TipoDocumento } from "../../catalog/entities/tipo-documento";
import { TurnoTracking } from "../entities/TurnoTracking";
import { TurnoSedeServicio } from "../entities/TurnoSedeServicio";
import { TurnoIssuanceService } from "../services/turno-issuance.service";
import { TurnoQueueService } from "../services/turno-queue.service";
import { TurnoServiceCoverageService } from "../services/turno-service-coverage.service";
import { BadRequestError, ConflictError } from "@core/utils/custom-errors";

// Aislar el servidor HTTP: estas pruebas no abren puertos ni conectan a la base de datos.
const events: Array<{ room: string; event: string; payload: Record<string, unknown> }> = [];
const appPath = require.resolve("../../../app");
const previousApp = require.cache[appPath];
const appStub = new Module(appPath);
appStub.exports = { io: { to: (room: string) => ({
  emit: (event: string, payload: Record<string, unknown>) => events.push({ room, event, payload }),
}) } };
require.cache[appPath] = appStub;
const { TurnoSocketService } = require("../services/turno-socket.service") as typeof import("../services/turno-socket.service");
const { TurnosPublicController } = require("../controllers/turnos-public.controller") as typeof import("../controllers/turnos-public.controller");
const { TurnosAtencionController } = require("../controllers/turnos-atencion.controller") as typeof import("../controllers/turnos-atencion.controller");
if (previousApp) require.cache[appPath] = previousApp;
else delete require.cache[appPath];

function responseHarness() {
  let status = 200;
  let body: Record<string, unknown> = {};
  const errors: unknown[] = [];
  const response = {
    status: (value: number) => { status = value; return response; },
    json: (value: Record<string, unknown>) => { body = value; return response; },
  } as Response;
  return { response, next: ((error: unknown) => errors.push(error)) as NextFunction,
    errors, get status() { return status; }, get body() { return body; } };
}

async function runConcurrentTurnCalls(
  t: TestContext,
  sessions: SesionAtencion[],
  turns: Turno[],
  requestedUserIds: number[] = sessions.map(({ userId }) => userId),
) {
  let transactionQueue = Promise.resolve();
  const manager = {
    findOne: async (entity: unknown, options: { where: Record<string, unknown> }) => {
      if (entity === Sedes) return { id: options.where.id };
      if (entity === SesionAtencion) return sessions.find(({ id }) => id === options.where.id) ?? null;
      if (entity === ModuloAtencion) {
        return sessions.find(({ moduloId }) => moduloId === options.where.id)?.modulo ?? null;
      }
      if (entity === Turno && options.where.currentUserId !== undefined) {
        return turns.find((turn) => turn.currentUserId === options.where.currentUserId &&
          [TurnoStatus.LLAMADO, TurnoStatus.EN_ATENCION].includes(turn.status)) ?? null;
      }
      if (entity === Turno && options.where.id !== undefined) {
        return turns.find(({ id }) => id === options.where.id) ?? null;
      }
      return null;
    },
    find: async (entity: unknown, options: { where: { sesionId: number } }) => entity === SesionAtencionServicio
      ? sessions.find(({ id }) => id === options.where.sesionId)?.serviciosAsignados ?? []
      : [],
    create: (entity: new () => object, values: object) => Object.assign(new entity(), values),
    save: async (entity: object) => entity,
  };
  t.mock.method(SesionAtencion, "findOne", async (options: { where: { userId: number } }) =>
    sessions.find(({ userId }) => userId === options.where.userId) ?? null,
  );
  t.mock.method(Turno, "getRepository", () => ({ manager: {
    transaction: async (_isolation: string, work: (transactionManager: typeof manager) => unknown) => {
      const previous = transactionQueue;
      let release = () => {};
      transactionQueue = new Promise<void>((resolve) => { release = resolve; });
      await previous;
      try {
        return await work(manager);
      } finally {
        release();
      }
    },
  } }));
  t.mock.method(TurnoQueueService, "getNextInQueue", async (
    _manager: EntityManager,
    headquarterId: number,
    serviceIds: number[],
  ) => turns
    .filter((turn) => turn.headquarterId === headquarterId &&
      serviceIds.includes(turn.serviceId) &&
      turn.status === TurnoStatus.PENDIENTE)
    .sort(TurnoQueueService.compareQueueOrder)[0] ?? null,
  );
  t.mock.method(TurnoSocketService, "emitTurnoLlamado", () => undefined);
  t.mock.method(TurnoSocketService, "notificarAvanceCola", async () => undefined);

  return Promise.all(requestedUserIds.map(async (userId) => {
    const harness = responseHarness();
    await TurnosAtencionController.ejecutarAccion(
      { user: { id: userId }, body: { action: "LLAMAR" } } as unknown as Request,
      harness.response,
      harness.next,
    );
    return harness;
  }));
}

describe("Eventos de integración pública", () => {
  it("la configuración pública solo incluye servicios asignados y activos", async (t) => {
    t.mock.method(TurnoSedeConfig, "findOne", async () => ({ headquarterId: 1, slug: "sede", headquarter: { name: "Sede" } }));
    t.mock.method(TurnoSedeServicio, "find", async () => [{ serviceId: 2 }, { serviceId: 8 }]);
    t.mock.method(ServicioAtencion, "find", async (options: { where: { id?: unknown; status: boolean } }) => {
      assert.ok(options.where.id);
      assert.equal(options.where.status, true);
      return [{ id: 2, name: "Medicina" }];
    });
    t.mock.method(TipoDocumento, "find", async () => []);
    const harness = responseHarness();

    await TurnosPublicController.getSedeConfig({ params: { slug: "sede" } } as unknown as Request, harness.response, harness.next);

    assert.deepEqual(harness.errors, []);
    assert.deepEqual(harness.body.services, [{ id: 2, name: "Medicina" }]);
  });

  it("devuelve una lista pública vacía cuando no hay asignaciones para la sede", async (t) => {
    t.mock.method(TurnoSedeConfig, "findOne", async () => ({ headquarterId: 1, slug: "sede", headquarter: { name: "Sede" } }));
    t.mock.method(TurnoSedeServicio, "find", async () => []);
    t.mock.method(ServicioAtencion, "find", async () => assert.fail("No debe consultar el catálogo global sin asignaciones"));
    t.mock.method(TipoDocumento, "find", async () => []);
    const harness = responseHarness();

    await TurnosPublicController.getSedeConfig({ params: { slug: "sede" } } as unknown as Request, harness.response, harness.next);

    assert.deepEqual(harness.errors, []);
    assert.deepEqual(harness.body.services, []);
  });

  it("devuelve hasta cinco próximos por antigüedad sin atribuir orden global de despacho", async (t) => {
    const now = new Date();
    const pending = [
      Object.assign(new Turno(), { id: 1, ticketCode: "G-001", priority: TurnoPriority.GENERAL, status: TurnoStatus.PENDIENTE, serviceId: 2, createdAt: new Date(now.getTime() - 5000) }),
      Object.assign(new Turno(), { id: 2, ticketCode: "G-002", priority: TurnoPriority.GENERAL, status: TurnoStatus.PENDIENTE, serviceId: 2, createdAt: new Date(now.getTime() - 4000) }),
      Object.assign(new Turno(), { id: 3, ticketCode: "P-003", priority: TurnoPriority.PRIORITARIO, status: TurnoStatus.PENDIENTE, serviceId: 2, createdAt: new Date(now.getTime() - 3000) }),
      Object.assign(new Turno(), { id: 4, ticketCode: "G-004", priority: TurnoPriority.GENERAL, status: TurnoStatus.PENDIENTE, serviceId: 2, createdAt: new Date(now.getTime() - 2000) }),
      Object.assign(new Turno(), { id: 5, ticketCode: "G-005", priority: TurnoPriority.GENERAL, status: TurnoStatus.PENDIENTE, serviceId: 2, createdAt: new Date(now.getTime() - 1000) }),
      Object.assign(new Turno(), { id: 6, ticketCode: "G-006", priority: TurnoPriority.GENERAL, status: TurnoStatus.PENDIENTE, serviceId: 2, createdAt: now }),
    ];
    t.mock.method(TurnoSedeConfig, "findOne", async () => ({ headquarterId: 1, slug: "sede", headquarter: { name: "Sede" } }));
    t.mock.method(Turno, "find", async (options: { where: { status?: unknown } }) =>
      options.where.status === TurnoStatus.PENDIENTE ? pending : []
    );
    const harness = responseHarness();
    await TurnosPublicController.getTvEstado({ params: { slug: "sede" } } as unknown as Request, harness.response, harness.next);
    assert.deepEqual(harness.errors, []);
    const upcoming = harness.body.upcomingTurns as Array<Record<string, unknown>>;
    assert.deepEqual(upcoming.map(({ ticketCode }) => ticketCode), ["G-001", "G-002", "P-003", "G-004", "G-005"]);
    assert.deepEqual(Object.keys(upcoming[0]).sort(), ["ticketCode", "turnoId"]);
  });

  it("calcula cobertura con servicios asignados a sede y módulos activos", async (t) => {
    t.mock.method(TurnoSedeServicio, "find", async () => [
      { serviceId: 1, service: { status: true } },
      { serviceId: 2, service: { status: true } },
      { serviceId: 99, service: { status: false } },
    ]);
    t.mock.method(ModuloAtencion, "find", async () => [{ id: 10 }, { id: 11 }]);
    t.mock.method(SesionAtencion, "find", async () => [
      { moduloId: 10, modulo: { isActive: true }, serviciosAsignados: [{ serviceId: 1 }, { serviceId: 2 }] },
      { moduloId: 11, modulo: { isActive: true }, serviciosAsignados: [{ serviceId: 1 }, { serviceId: 2 }] },
    ]);

    assert.equal(await TurnoServiceCoverageService.hasCompleteCoverage(4), true);
  });

  it("no considera cobertura completa si un módulo no atiende todos los servicios", async (t) => {
    t.mock.method(TurnoSedeServicio, "find", async () => [
      { serviceId: 1, service: { status: true } },
      { serviceId: 2, service: { status: true } },
    ]);
    t.mock.method(ModuloAtencion, "find", async () => [{ id: 10 }]);
    t.mock.method(SesionAtencion, "find", async () => [
      { moduloId: 10, serviciosAsignados: [{ serviceId: 1 }] },
    ]);

    assert.equal(await TurnoServiceCoverageService.hasCompleteCoverage(4), false);
  });

  it("consulta posición de otros servicios cuando hay cobertura completa", async (t) => {
    const now = new Date();
    const ticket = Object.assign(new Turno(), {
      id: 2, ticketToken: "ticket", ticketCode: "G-002", priority: TurnoPriority.GENERAL,
      classification: TurnoClassification.ASIGNACION_CITAS,
      status: TurnoStatus.PENDIENTE, headquarterId: 1, serviceId: 2, createdAt: now,
      callCount: 0, headquarter: { name: "Sede" }, service: { name: "Servicio B" },
      patient: { name: "Paciente", documentNumber: "123456" }, currentModulo: null,
      currentUser: null, encuesta: null,
    });
    const priorityAhead = Object.assign(new Turno(), {
      id: 1, priority: TurnoPriority.PRIORITARIO, status: TurnoStatus.PENDIENTE,
      serviceId: 1, createdAt: new Date(now.getTime() + 1000),
    });
    t.mock.method(Turno, "findOne", async () => ticket);
    t.mock.method(TurnoServiceCoverageService, "getQueueServiceIds", async (_headquarterId: number, _serviceId: number) => {
      return [1, 2];
    });
    t.mock.method(Turno, "find", async (options: { where: { serviceId?: unknown; priority?: TurnoPriority } }) => {
      assert.ok(options.where.serviceId);
      assert.equal(options.where.priority, undefined);
      return [priorityAhead, ticket];
    });
    t.mock.method(TurnoSedeConfig, "findOne", async () => ({ averageServiceMinutes: 10 }));
    t.mock.method(SesionAtencion, "count", async () => 1);
    const harness = responseHarness();

    await TurnosPublicController.getTicketEstado({ params: { token: "ticket" } } as unknown as Request, harness.response, harness.next);

    assert.deepEqual(harness.errors, []);
    assert.equal(harness.body.aheadCount, 1);
    assert.equal(harness.body.estimatedWaitMinutes, 10);
    assert.equal(harness.body.classification, TurnoClassification.ASIGNACION_CITAS);
  });

  it("no publica espera estimada cuando no hay asesor activo para el servicio", async (t) => {
    const ticket = Object.assign(new Turno(), {
      id: 2, ticketToken: "ticket", ticketCode: "P-002", priority: TurnoPriority.PRIORITARIO,
      status: TurnoStatus.PENDIENTE, headquarterId: 1, serviceId: 2, createdAt: new Date(),
      callCount: 0, headquarter: { name: "Sede" }, service: { name: "Servicio" },
      patient: { name: "Paciente", documentNumber: "123456" }, currentModulo: null,
      currentUser: null, encuesta: null,
    });
    t.mock.method(Turno, "findOne", async () => ticket);
    t.mock.method(TurnoServiceCoverageService, "getQueueServiceIds", async () => [2]);
    t.mock.method(Turno, "find", async (options: { where: { priority?: TurnoPriority } }) => {
      assert.equal(options.where.priority, undefined);
      return [ticket];
    });
    t.mock.method(TurnoSedeConfig, "findOne", async () => ({ averageServiceMinutes: 10 }));
    t.mock.method(SesionAtencion, "count", async () => 0);
    const harness = responseHarness();

    await TurnosPublicController.getTicketEstado({ params: { token: "ticket" } } as unknown as Request, harness.response, harness.next);

    assert.deepEqual(harness.errors, []);
    assert.equal(harness.body.aheadCount, 0);
    assert.equal(harness.body.estimatedWaitMinutes, null);
  });

  it("recalcula el avance de toda la cola con prioritarios primero y conserva métricas agregadas de sede", async (t) => {
    events.length = 0;
    const earlierGeneral = Object.assign(new Turno(), { id: 1, priority: TurnoPriority.GENERAL, createdAt: new Date(), ticketToken: "general", ticketCode: "G-001", status: TurnoStatus.PENDIENTE });
    const priority = Object.assign(new Turno(), { id: 2, priority: TurnoPriority.PRIORITARIO, createdAt: new Date(), ticketToken: "priority", ticketCode: "P-002", status: TurnoStatus.PENDIENTE });
    t.mock.method(TurnoServiceCoverageService, "getQueueServiceIds", async (_headquarterId: number, serviceId: number) => [serviceId]);
    t.mock.method(Turno, "find", async (options: { where: { createdAt?: unknown; priority?: TurnoPriority } }) => {
      assert.ok(options.where.createdAt);
      assert.equal(options.where.priority, undefined);
      return [earlierGeneral, priority];
    });
    t.mock.method(Turno, "count", async () => 2);
    t.mock.method(TurnoSedeConfig, "findOne", async () => ({ averageServiceMinutes: 10 }));
    t.mock.method(SesionAtencion, "count", async () => 1);
    await TurnoSocketService.notificarAvanceCola(1, 2);
    assert.ok(events.some((entry) => entry.room === "sede_1" && entry.event === "cola:actualizada"));
    assert.ok(events.some((entry) => entry.room === "sede_1_tv" && entry.event === "cola:actualizada"));
    const preferential = events.find((entry) => entry.room === "ticket_priority");
    const general = events.find((entry) => entry.room === "ticket_general");
    assert.equal(preferential?.payload.aheadCount, 0);
    assert.equal(general?.payload.aheadCount, 1);
  });

  it("publica la cola vacía sin inventar actualizaciones de tickets", async (t) => {
    events.length = 0;
    t.mock.method(TurnoServiceCoverageService, "getQueueServiceIds", async (_headquarterId: number, serviceId: number) => [serviceId]);
    t.mock.method(Turno, "count", async () => 0);
    t.mock.method(Turno, "find", async () => []);
    await TurnoSocketService.notificarAvanceCola(1, 2);
    assert.equal(events.length, 2);
    assert.ok(events.every((entry) => entry.payload.pendingCount === 0));
  });

  it("recalcula juntos los servicios con cobertura total y conserva la espera por servicio", async (t) => {
    events.length = 0;
    const now = new Date();
    const turns = [
      Object.assign(new Turno(), { id: 1, ticketToken: "service-a", ticketCode: "G-001", serviceId: 1, priority: TurnoPriority.GENERAL, status: TurnoStatus.PENDIENTE, createdAt: new Date(now.getTime() - 1000) }),
      Object.assign(new Turno(), { id: 2, ticketToken: "service-b", ticketCode: "G-002", serviceId: 2, priority: TurnoPriority.GENERAL, status: TurnoStatus.PENDIENTE, createdAt: now }),
    ];
    t.mock.method(Turno, "count", async () => 2);
    t.mock.method(TurnoServiceCoverageService, "getQueueServiceIds", async () => [1, 2]);
    t.mock.method(Turno, "find", async (options: { where: { serviceId?: unknown } }) => {
      assert.ok(options.where.serviceId, "la cola debe incluir todos los servicios activos");
      return turns;
    });
    t.mock.method(TurnoSedeConfig, "findOne", async () => ({ averageServiceMinutes: 10 }));
    t.mock.method(SesionAtencion, "count", async () => 1);

    await TurnoSocketService.notificarAvanceCola(1, 1);

    assert.equal(events.find((entry) => entry.room === "ticket_service-a")?.payload.aheadCount, 0);
    assert.equal(events.find((entry) => entry.room === "ticket_service-b")?.payload.aheadCount, 1);
    assert.equal(events.find((entry) => entry.room === "ticket_service-b")?.payload.estimatedWaitMinutes, 10);
  });

  it("recalcula todas las colas si una sesión cambia la cobertura entre servicios", async (t) => {
    const refreshed: Array<[number, number]> = [];
    t.mock.method(TurnoServiceCoverageService, "getActiveAssignedServiceIds", async () => [1, 2, 3]);
    t.mock.method(TurnoServiceCoverageService, "hasCompleteCoverage", async () => false);
    t.mock.method(TurnoSocketService, "notificarAvanceCola", async (headquarterId: number, serviceId: number) => {
      refreshed.push([headquarterId, serviceId]);
    });

    await TurnoSocketService.notificarCambioSesiones(7);

    assert.equal(refreshed.length, 3);
    assert.deepEqual([...new Set(refreshed.map(([, serviceId]) => serviceId))].sort(), [1, 2, 3]);
  });

  it("la emisión dispara el recálculo después de persistir", async (t) => {
    const calls: string[] = [];
    const turno = Object.assign(new Turno(), { id: 3, priority: TurnoPriority.GENERAL, status: TurnoStatus.PENDIENTE, ticketToken: "new-ticket", createdAt: new Date() });
    t.mock.method(TurnoSedeConfig, "findOne", async () => ({ headquarterId: 1, latitude: 7.9, longitude: -72.5, geoRadiusMeters: 150, averageServiceMinutes: 10 }));
    t.mock.method(TurnoServiceCoverageService, "getQueueServiceIds", async (_headquarterId: number, serviceId: number) => [serviceId]);
    t.mock.method(ServicioAtencion, "findOne", async () => ({ id: 2, name: "Servicio" }));
    t.mock.method(TurnoIssuanceService, "issue", async (input: { classification: TurnoClassification }) => {
      assert.equal(input.classification, TurnoClassification.ASIGNACION_CITAS);
      calls.push("commit");
      return { created: true, turno };
    });
    t.mock.method(Turno, "find", async () => [turno]);
    t.mock.method(SesionAtencion, "count", async () => 1);
    t.mock.method(TurnoSocketService, "notificarAvanceCola", async () => { calls.push("notify"); });
    const harness = responseHarness();
    await TurnosPublicController.emitirTicket({ body: {
      slug: "sede", serviceId: 2, classification: "ASIGNACION_CITAS",
      documentNumber: "123456", documentTypeId: 1,
      name: "Paciente", phoneNumber: "3000000000", userLatitude: 7.9, userLongitude: -72.5,
    } } as Request, harness.response, harness.next);
    assert.deepEqual(harness.errors, []);
    assert.equal(harness.status, 201);
    assert.equal(harness.body.token, "new-ticket");
    assert.deepEqual(calls, ["commit", "notify"]);
  });

  for (const classification of [undefined, null, "", "OTRA"]) {
    it(`rechaza emisión pública sin clasificación válida (${String(classification)}) antes de guardar`, async (t) => {
      const issue = t.mock.method(TurnoIssuanceService, "issue", async () => assert.fail("No debe emitir"));
      t.mock.method(TurnoSedeConfig, "findOne", async () => assert.fail("Debe validar antes de consultar la sede"));
      const harness = responseHarness();

      await TurnosPublicController.emitirTicket({ body: {
        slug: "sede", serviceId: 2, classification, documentNumber: "123456",
        documentTypeId: 1, name: "Paciente", phoneNumber: "3000000000",
      } } as Request, harness.response, harness.next);

      assert.ok(harness.errors[0] instanceof BadRequestError);
      assert.equal(issue.mock.callCount(), 0);
    });
  }

  for (const affected of [1, 0]) {
    it(`inicio de atención actualiza TV solo si la transición gana (affected=${affected})`, async (t) => {
      events.length = 0;
      t.mock.method(SesionAtencion, "findOne", async () => ({ headquarterId: 1, moduloId: 2, modulo: { code: "M2", name: "Módulo 2" }, serviciosAsignados: [{ serviceId: 3 }] }));
      t.mock.method(Turno, "findOne", async () => Object.assign(new Turno(), { id: 3, headquarterId: 1, serviceId: 3, status: TurnoStatus.LLAMADO, ticketCode: "G-003", ticketToken: "ticket" }));
      t.mock.method(Turno, "update", async (criteria: unknown) => {
        assert.deepEqual(criteria, { id: 3, status: TurnoStatus.LLAMADO });
        return { affected };
      });
      t.mock.method(TurnoQueueService, "recordTracking", async () => new TurnoTracking());
      const harness = responseHarness();
      await TurnosAtencionController.ejecutarAccion({ user: { id: 1 }, body: { action: "INICIAR", turnoId: 3 } } as unknown as Request, harness.response, harness.next);
      if (affected) {
        assert.deepEqual(harness.errors, []);
        assert.ok(events.some((entry) => entry.room === "sede_1_tv" && entry.event === "turno:actualizado" && entry.payload.status === TurnoStatus.EN_ATENCION));
      } else {
        assert.ok(harness.errors[0] instanceof ConflictError);
        assert.equal(events.length, 0);
      }
    });
  }

  it("reemplazar sesión recalcula los servicios anteriores y nuevos", async (t) => {
    const headquarters: number[] = [];
    t.mock.method(ModuloAtencion, "findOne", async () => ({ id: 2, headquarterId: 1, code: "M2", name: "Módulo 2" }));
    const transactionManager = {
      findOne: async (entity: unknown) => entity === Sedes
        ? { id: 1 }
        : entity === ModuloAtencion
          ? { id: 2, headquarterId: 1, code: "M2", name: "Módulo 2", isActive: true }
          : null,
      find: async (entity: unknown) => entity === ServicioAtencion
        ? [{ id: 3, name: "Medicina" }]
        : entity === TurnoSedeServicio
          ? [{ serviceId: 3 }]
          : [{ headquarterId: 8, serviciosAsignados: [{ serviceId: 9 }] }],
      update: async () => ({ affected: 1 }),
      create: (entity: new () => object, values: object) => Object.assign(new entity(), values),
      save: async (entity: object | (new () => object), values?: unknown) => {
        if (typeof entity === "function") return values;
        if (entity instanceof SesionAtencion) { entity.id = 4; return entity; }
        return values;
      },
    };
    t.mock.method(SesionAtencion, "getRepository", () => ({ manager: {
      transaction: async (_isolation: string, work: (manager: typeof transactionManager) => unknown) => work(transactionManager),
    } }));
    t.mock.method(TurnoSocketService, "notificarCambioSesiones", async (headquarterId: number) => { headquarters.push(headquarterId); });
    const harness = responseHarness();
    await TurnosAtencionController.iniciarSesion({ user: { id: 1 }, body: { moduloId: 2, serviceIds: [3] } } as unknown as Request, harness.response, harness.next);
    assert.deepEqual(harness.errors, []);
    assert.deepEqual(headquarters.sort(), [1, 8]);
  });

  it("rechaza iniciar sesión con un servicio activo que no está asignado a la sede del módulo", async (t) => {
    const module = { id: 2, headquarterId: 1, isActive: true };
    const manager = {
      findOne: async (entity: unknown) => entity === Sedes ? { id: 1 } : entity === ModuloAtencion ? module : null,
      find: async (entity: unknown) => entity === ServicioAtencion ? [{ id: 3 }] : [],
    } as unknown as EntityManager;
    t.mock.method(ModuloAtencion, "findOne", async () => module);
    t.mock.method(SesionAtencion, "getRepository", () => ({ manager: {
      transaction: async (_isolation: string, work: (transactionManager: EntityManager) => unknown) => work(manager),
    } }));
    const harness = responseHarness();

    await TurnosAtencionController.iniciarSesion(
      { user: { id: 1 }, body: { moduloId: 2, serviceIds: [3] } } as unknown as Request,
      harness.response,
      harness.next,
    );

    assert.equal((harness.errors[0] as Error).message, "Uno o varios servicios no están habilitados para la sede del módulo");
  });

  it("cerrar sesión recalcula las estimaciones de sus servicios", async (t) => {
    const headquarters: number[] = [];
    const session = Object.assign(new SesionAtencion(), { headquarterId: 1, isActive: true, serviciosAsignados: [{ serviceId: 2 }] });
    t.mock.method(SesionAtencion, "findOne", async () => session);
    t.mock.method(Turno, "findOne", async () => null);
    t.mock.method(session, "save", async () => session);
    t.mock.method(TurnoSocketService, "notificarCambioSesiones", async (headquarterId: number) => { assert.equal(session.isActive, false); headquarters.push(headquarterId); });
    const harness = responseHarness();
    await TurnosAtencionController.cerrarSesion({ user: { id: 1 } } as unknown as Request, harness.response, harness.next);
    assert.deepEqual(harness.errors, []);
    assert.deepEqual(headquarters, [1]);
  });

  it("devuelve la cola pendiente con prioritarios primero y sin datos sensibles", async (t) => {
    const now = new Date();
    const session = Object.assign(new SesionAtencion(), {
      headquarterId: 4,
      modulo: { id: 8, code: "M8", name: "Módulo 8" },
      serviciosAsignados: [{ serviceId: 2, service: { name: "Medicina" } }],
    });
    const turns = [
      Object.assign(new Turno(), { id: 2, ticketToken: "private-2", ticketCode: "G-002", headquarterId: 4, serviceId: 2, status: TurnoStatus.PENDIENTE, priority: TurnoPriority.GENERAL, createdAt: new Date(now.getTime() - 120000), patient: { name: "Paciente general", documentNumber: "secret" }, service: { name: "Medicina" } }),
      Object.assign(new Turno(), { id: 1, ticketToken: "private-1", ticketCode: "P-001", headquarterId: 4, serviceId: 2, status: TurnoStatus.PENDIENTE, priority: TurnoPriority.PRIORITARIO, createdAt: new Date(now.getTime() - 60000), patient: { name: "Paciente prioritario", documentNumber: "secret" }, service: { name: "Medicina" } }),
      Object.assign(new Turno(), { id: 3, ticketToken: "private-3", ticketCode: "G-003", headquarterId: 4, serviceId: 2, status: TurnoStatus.PENDIENTE, priority: TurnoPriority.GENERAL, createdAt: new Date(now.getTime() - 30000), patient: { name: "Paciente general dos", documentNumber: "secret" }, service: { name: "Medicina" } }),
    ];
    const expectedCodes = ["P-001", "G-002", "G-003"];
    t.mock.method(SesionAtencion, "findOne", async () => session);
    t.mock.method(Turno, "findOne", async () => null);
    t.mock.method(Turno, "find", async (options: { where: { headquarterId: number; serviceId: unknown; priority?: unknown } }) => {
      assert.equal(options.where.headquarterId, 4);
      assert.ok(options.where.serviceId);
      assert.equal(options.where.priority, undefined);
      return turns;
    });
    const harness = responseHarness();

    await TurnosAtencionController.getEstadoActual({ user: { id: 12 } } as unknown as Request, harness.response, harness.next);

    assert.deepEqual(harness.errors, []);
    const queue = harness.body.pendingQueue as Array<Record<string, unknown>>;
    assert.deepEqual(queue.map((item) => item.ticketCode), expectedCodes);
    assert.equal(harness.body.pendingQueueCount, expectedCodes.length);
    assert.deepEqual(Object.keys(queue[0]).sort(), ["patientName", "priority", "serviceName", "ticketCode", "waitingMinutes"]);
    assert.equal(queue[0].serviceName, "Medicina");
  });

  it("expone solo módulos disponibles y servicios activos como opciones", async (t) => {
    t.mock.method(ModuloAtencion, "find", async () => [
      { id: 1, headquarterId: 4, code: "M1", name: "Módulo 1", isActive: true, headquarter: { name: "Sede Norte" } },
      { id: 2, headquarterId: 4, code: "M2", name: "Módulo 2", isActive: true, headquarter: { name: "Sede Norte" } },
    ]);
    t.mock.method(ServicioAtencion, "find", async () => [{ id: 8, name: "Medicina", status: true }]);
    t.mock.method(SesionAtencion, "find", async () => [{ userId: 9, moduloId: 2, isActive: true }]);
    t.mock.method(TurnoSedeServicio, "find", async () => [{ headquarterId: 4, serviceId: 8 }]);
    const harness = responseHarness();

    await TurnosAtencionController.getOpcionesSesion({ user: { id: 3 } } as unknown as Request, harness.response, harness.next);

    assert.deepEqual(harness.errors, []);
    const modules = harness.body.modules as Array<Record<string, unknown>>;
    assert.equal(modules[0].isAvailable, true);
    assert.equal(modules[1].isAvailable, false);
    assert.equal("isPriority" in modules[0], false);
    assert.deepEqual(harness.body.services, [{ id: 8, name: "Medicina" }]);
    assert.deepEqual(harness.body.servicesByHeadquarter, [{ headquarterId: 4, services: [{ id: 8, name: "Medicina" }] }]);
  });

  for (const priority of [TurnoPriority.GENERAL, TurnoPriority.PRIORITARIO]) {
    it(`reclama transaccionalmente el siguiente turno ${priority} compatible`, async (t) => {
      const session = Object.assign(new SesionAtencion(), {
        id: 9, userId: 12, moduloId: 8, headquarterId: 4, isActive: true,
        modulo: { id: 8, code: "M8", name: "Módulo 8" },
        serviciosAsignados: [{ serviceId: 2 }],
        user: { name: "Asesor" },
      });
      const turn = Object.assign(new Turno(), {
        id: 31, headquarterId: 4, serviceId: 2, status: TurnoStatus.PENDIENTE,
        priority, ticketCode: priority === TurnoPriority.PRIORITARIO ? "P-031" : "G-031", ticketToken: "ticket-31",
        patient: { name: "Paciente" }, service: { name: "Medicina" },
      });
      let committed = false;
      const transactionManager = {
        findOne: async (entity: unknown, options: { where: Record<string, unknown>; lock?: { mode: string } }) => {
          if (entity === Sedes) {
            assert.equal(options.lock?.mode, "pessimistic_write");
            return { id: 4 };
          }
          if (entity === SesionAtencion) {
            assert.equal(options.lock?.mode, "pessimistic_write");
            return session;
          }
          if (entity === ModuloAtencion) return { id: 8 };
          if (entity === Turno && options.where.id === undefined) return null;
          if (entity === Turno) return turn;
          return null;
        },
        find: async (entity: unknown) => entity === SesionAtencionServicio ? [{ serviceId: 2 }] : [],
        create: (entity: new () => object, values: object) => Object.assign(new entity(), values),
        save: async (entity: object) => entity,
      };
      t.mock.method(SesionAtencion, "findOne", async () => session);
      t.mock.method(Turno, "getRepository", () => ({ manager: {
        transaction: async (_isolation: string, work: (manager: typeof transactionManager) => unknown) => {
          const result = await work(transactionManager);
          committed = true;
          return result;
        },
      } }));
      t.mock.method(TurnoQueueService, "getNextInQueue", async (_manager: EntityManager, headquarterId: number, serviceIds: number[]) => {
        assert.equal(headquarterId, 4);
        assert.deepEqual(serviceIds, [2]);
        return turn;
      });
      t.mock.method(TurnoSocketService, "emitTurnoLlamado", () => {
        assert.equal(committed, true, "el evento debe emitirse después del commit");
      });
      t.mock.method(TurnoSocketService, "notificarAvanceCola", async () => {
        assert.equal(committed, true, "el recálculo debe ejecutarse después del commit");
      });
      const harness = responseHarness();

      await TurnosAtencionController.ejecutarAccion(
        { user: { id: 12 }, body: { action: "LLAMAR" } } as unknown as Request,
        harness.response,
        harness.next,
      );

      assert.deepEqual(harness.errors, []);
      assert.equal(turn.status, TurnoStatus.LLAMADO);
      assert.equal(turn.currentUserId, 12);
      assert.equal(turn.currentModuloId, 8);
      assert.equal((harness.body.turno as Record<string, unknown>).priority, priority);
    });
  }

  it("no anuncia ni asigna turnos cuando la cola compatible está vacía", async (t) => {
    const session = Object.assign(new SesionAtencion(), {
      id: 9, userId: 12, moduloId: 8, headquarterId: 4, isActive: true,
      modulo: { id: 8, code: "M8", name: "Módulo 8" },
      serviciosAsignados: [{ serviceId: 2 }],
    });
    const transactionManager = {
      findOne: async (entity: unknown, options: { where: Record<string, unknown> }) => {
        if (entity === Sedes) return { id: 4 };
        if (entity === SesionAtencion) return session;
        if (entity === ModuloAtencion) return { id: 8 };
        if (entity === Turno) return null;
        return null;
      },
      find: async (entity: unknown) => entity === SesionAtencionServicio ? [{ serviceId: 2 }] : [],
    };
    t.mock.method(SesionAtencion, "findOne", async () => session);
    t.mock.method(Turno, "getRepository", () => ({ manager: {
      transaction: async (_isolation: string, work: (manager: typeof transactionManager) => unknown) => work(transactionManager),
    } }));
    t.mock.method(TurnoQueueService, "getNextInQueue", async () => null);
    const emit = t.mock.method(TurnoSocketService, "emitTurnoLlamado", () => undefined);
    const notify = t.mock.method(TurnoSocketService, "notificarAvanceCola", async () => undefined);
    const harness = responseHarness();

    await TurnosAtencionController.ejecutarAccion(
      { user: { id: 12 }, body: { action: "LLAMAR" } } as unknown as Request,
      harness.response,
      harness.next,
    );

    assert.deepEqual(harness.errors, []);
    assert.equal(harness.body.turno, null);
    assert.match(String(harness.body.message), /servicios de tu sesión/);
    assert.equal(emit.mock.callCount(), 0);
    assert.equal(notify.mock.callCount(), 0);
  });

  it("serializa dos llamados simultáneos de una sesión para no dejar dos turnos llamados", async (t) => {
    const session = Object.assign(new SesionAtencion(), {
      id: 9, userId: 12, moduloId: 8, headquarterId: 4, isActive: true,
      modulo: { id: 8, code: "M8", name: "Módulo 8" },
      serviciosAsignados: [{ serviceId: 2 }],
    });
    const turns = [
      Object.assign(new Turno(), { id: 31, headquarterId: 4, serviceId: 2, status: TurnoStatus.PENDIENTE, priority: TurnoPriority.GENERAL, createdAt: new Date("2026-11-13T10:00:00Z"), ticketCode: "G-031", ticketToken: "ticket-31" }),
      Object.assign(new Turno(), { id: 32, headquarterId: 4, serviceId: 2, status: TurnoStatus.PENDIENTE, priority: TurnoPriority.GENERAL, createdAt: new Date("2026-11-13T10:01:00Z"), ticketCode: "G-032", ticketToken: "ticket-32" }),
    ];

    const results = await runConcurrentTurnCalls(t, [session], turns, [12, 12]);

    assert.equal(results.filter(({ errors }) => errors.length === 0).length, 1);
    assert.equal(results.filter(({ errors }) => errors[0] instanceof ConflictError).length, 1);
    assert.equal(turns.filter(({ status }) => status === TurnoStatus.LLAMADO).length, 1);
    assert.equal(turns.filter(({ status }) => status === TurnoStatus.PENDIENTE).length, 1);
  });

  it("serializa llamados de módulos distintos para reclamar turnos diferentes", async (t) => {
    const sessions = [
      Object.assign(new SesionAtencion(), {
        id: 9, userId: 12, moduloId: 8, headquarterId: 4, isActive: true,
        modulo: { id: 8, code: "M8", name: "Módulo 8" },
        serviciosAsignados: [{ serviceId: 2 }],
      }),
      Object.assign(new SesionAtencion(), {
        id: 10, userId: 13, moduloId: 9, headquarterId: 4, isActive: true,
        modulo: { id: 9, code: "M9", name: "Módulo 9" },
        serviciosAsignados: [{ serviceId: 2 }],
      }),
    ];
    const turns = [
      Object.assign(new Turno(), { id: 41, headquarterId: 4, serviceId: 2, status: TurnoStatus.PENDIENTE, priority: TurnoPriority.GENERAL, createdAt: new Date("2026-11-13T10:00:00Z"), ticketCode: "G-041", ticketToken: "ticket-41" }),
      Object.assign(new Turno(), { id: 42, headquarterId: 4, serviceId: 2, status: TurnoStatus.PENDIENTE, priority: TurnoPriority.GENERAL, createdAt: new Date("2026-11-13T10:01:00Z"), ticketCode: "G-042", ticketToken: "ticket-42" }),
    ];

    const results = await runConcurrentTurnCalls(t, sessions, turns);

    assert.ok(results.every(({ errors }) => errors.length === 0));
    const claimedTurnIds = turns
      .filter(({ status }) => status === TurnoStatus.LLAMADO)
      .map(({ id }) => id);
    assert.equal(claimedTurnIds.length, 2);
    assert.equal(new Set(claimedTurnIds).size, 2);
    assert.deepEqual(turns.map(({ currentUserId }) => currentUserId), [12, 13]);
  });

  it("impide cerrar la sesión si el turno sigue llamado", async (t) => {
    const session = Object.assign(new SesionAtencion(), { headquarterId: 1, isActive: true });
    t.mock.method(SesionAtencion, "findOne", async () => session);
    t.mock.method(Turno, "findOne", async () => Object.assign(new Turno(), { ticketCode: "G-010", status: TurnoStatus.LLAMADO }));
    const harness = responseHarness();

    await TurnosAtencionController.cerrarSesion({ user: { id: 1 } } as unknown as Request, harness.response, harness.next);

    assert.ok(harness.errors[0] instanceof ConflictError);
    assert.equal(session.isActive, true);
  });

  it("no permite operar un turno que pertenece a otro usuario", async (t) => {
    t.mock.method(SesionAtencion, "findOne", async () => Object.assign(new SesionAtencion(), {
      headquarterId: 1,
      moduloId: 2,
      serviciosAsignados: [{ serviceId: 3 }],
      modulo: { code: "M2", name: "Módulo 2" },
    }));
    t.mock.method(Turno, "findOne", async (_options: { where: { id: number; currentUserId: number } }) => null);
    const harness = responseHarness();

    await TurnosAtencionController.ejecutarAccion({ user: { id: 7 }, body: { action: "RELLAMAR", turnoId: 99 } } as unknown as Request, harness.response, harness.next);

    assert.equal((harness.errors[0] as Error).message, "No se encontró el turno especificado o no tienes un turno activo en atención");
  });

  it("rechaza cancelar desde atención si falta el motivo", async (t) => {
    t.mock.method(SesionAtencion, "findOne", async () => Object.assign(new SesionAtencion(), {
      headquarterId: 1,
      moduloId: 2,
      serviciosAsignados: [{ serviceId: 3 }],
      modulo: { code: "M2", name: "Módulo 2" },
    }));
    const turn = Object.assign(new Turno(), {
      id: 6, currentUserId: 7, headquarterId: 1, serviceId: 3,
      status: TurnoStatus.EN_ATENCION, ticketCode: "G-006",
    });
    t.mock.method(Turno, "findOne", async () => turn);
    const save = t.mock.method(turn, "save", async () => turn);
    const harness = responseHarness();

    await TurnosAtencionController.ejecutarAccion({ user: { id: 7 }, body: { action: "CANCELAR" } } as unknown as Request, harness.response, harness.next);

    assert.equal((harness.errors[0] as Error).message, "Debes indicar el motivo de cancelación");
    assert.equal(save.mock.callCount(), 0);
    assert.equal(turn.status, TurnoStatus.EN_ATENCION);
  });

  it("rechaza transferir a un servicio inactivo sin modificar el turno", async (t) => {
    t.mock.method(SesionAtencion, "findOne", async () => Object.assign(new SesionAtencion(), {
      headquarterId: 1,
      moduloId: 2,
      serviciosAsignados: [{ serviceId: 3 }],
      modulo: { code: "M2", name: "Módulo 2" },
    }));
    const turn = Object.assign(new Turno(), {
      id: 6, currentUserId: 7, headquarterId: 1, serviceId: 3,
      status: TurnoStatus.EN_ATENCION, ticketCode: "G-006",
    });
    t.mock.method(Turno, "findOne", async () => turn);
    t.mock.method(Turno, "getRepository", () => ({ manager: { transaction: async (_isolation: string, work: (manager: object) => unknown) => work({
      findOne: async (entity: unknown) => entity === Sedes || entity === TurnoSedeServicio ? { id: 1 } : null,
    }) } }));
    const save = t.mock.method(turn, "save", async () => turn);
    const harness = responseHarness();

    await TurnosAtencionController.ejecutarAccion({ user: { id: 7 }, body: { action: "TRANSFERIR", newServiceId: 8 } } as unknown as Request, harness.response, harness.next);

    assert.equal((harness.errors[0] as Error).message, "El servicio de destino no existe o está inactivo");
    assert.equal(save.mock.callCount(), 0);
    assert.equal(turn.serviceId, 3);
  });

  it("rechaza transferir a un servicio que no está asignado a la sede", async (t) => {
    t.mock.method(SesionAtencion, "findOne", async () => Object.assign(new SesionAtencion(), {
      headquarterId: 1,
      moduloId: 2,
      serviciosAsignados: [{ serviceId: 3 }],
      modulo: { code: "M2", name: "Módulo 2" },
    }));
    const turn = Object.assign(new Turno(), {
      id: 6, currentUserId: 7, headquarterId: 1, serviceId: 3,
      status: TurnoStatus.EN_ATENCION, ticketCode: "G-006",
    });
    t.mock.method(Turno, "findOne", async () => turn);
    t.mock.method(Turno, "getRepository", () => ({ manager: { transaction: async (_isolation: string, work: (manager: object) => unknown) => work({
      findOne: async (entity: unknown) => entity === Sedes ? { id: 1 } : null,
    }) } }));
    const save = t.mock.method(turn, "save", async () => turn);
    const harness = responseHarness();

    await TurnosAtencionController.ejecutarAccion(
      { user: { id: 7 }, body: { action: "TRANSFERIR", newServiceId: 8 } } as unknown as Request,
      harness.response,
      harness.next,
    );

    assert.equal((harness.errors[0] as Error).message, "El servicio de destino no está habilitado para la sede del turno");
    assert.equal(save.mock.callCount(), 0);
    assert.equal(turn.serviceId, 3);
    assert.equal(turn.status, TurnoStatus.EN_ATENCION);
  });

  it("transfiere el turno actualizando también la relación del servicio cargada", async (t) => {
    t.mock.method(SesionAtencion, "findOne", async () => Object.assign(new SesionAtencion(), {
      headquarterId: 1,
      moduloId: 2,
      serviciosAsignados: [{ serviceId: 3 }],
      modulo: { code: "M2", name: "Módulo 2" },
    }));
    const sourceService = { id: 3, name: "Medicina" };
    const destinationService = { id: 8, name: "Odontología", status: true };
    const turn = Object.assign(new Turno(), {
      id: 6,
      currentUserId: 7,
      headquarterId: 1,
      serviceId: sourceService.id,
      service: sourceService,
      status: TurnoStatus.EN_ATENCION,
      ticketCode: "G-006",
      ticketToken: "token-6",
      priority: TurnoPriority.GENERAL,
    });
    t.mock.method(Turno, "findOne", async () => turn);
    t.mock.method(Turno, "getRepository", () => ({ manager: { transaction: async (_isolation: string, work: (manager: object) => unknown) => work({
      findOne: async (entity: unknown) => entity === Sedes
        ? { id: 1 }
        : entity === TurnoSedeServicio
          ? { id: 2 }
          : entity === ServicioAtencion
            ? destinationService
            : turn,
      create: (entity: new () => object, values: object) => Object.assign(new entity(), values),
      save: async (entity: object) => entity,
    }) } }));
    t.mock.method(TurnoQueueService, "recordTracking", async () => new TurnoTracking());
    const refreshedQueues: number[] = [];
    t.mock.method(TurnoSocketService, "notificarAvanceCola", async (_headquarterId: number, serviceId: number) => {
      refreshedQueues.push(serviceId);
    });
    t.mock.method(turn, "save", async () => turn);
    const harness = responseHarness();

    await TurnosAtencionController.ejecutarAccion({
      user: { id: 7 },
      body: { action: "TRANSFERIR", newServiceId: destinationService.id },
    } as unknown as Request, harness.response, harness.next);

    assert.deepEqual(harness.errors, []);
    assert.equal(turn.serviceId, destinationService.id);
    assert.equal(turn.service, destinationService);
    assert.equal(turn.status, TurnoStatus.PENDIENTE);
    assert.equal((harness.body.turno as Record<string, unknown>).newServiceId, destinationService.id);
    assert.deepEqual(refreshedQueues, [sourceService.id, destinationService.id]);
  });

  it("cancelar informa retiro a TV y recalcula la cola", async (t) => {
    events.length = 0;
    const queues: string[] = [];
    t.mock.method(TurnoIssuanceService, "cancel", async () => Object.assign(new Turno(), { id: 3, headquarterId: 1, serviceId: 2, ticketToken: "ticket", ticketCode: "G-003", status: TurnoStatus.CANCELADO }));
    t.mock.method(TurnoSocketService, "notificarAvanceCola", async (sede: number, service: number) => { queues.push(`${sede}:${service}`); });
    const harness = responseHarness();
    await TurnosPublicController.cancelarTicket({ params: { token: "ticket" }, body: {} } as unknown as Request, harness.response, harness.next);
    assert.deepEqual(harness.errors, []);
    assert.ok(events.some((entry) => entry.event === "turno:retirado" && entry.room === "sede_1_tv"));
    assert.ok(events.some((entry) => entry.event === "ticket:actualizado" && entry.room === "ticket_ticket"));
    assert.deepEqual(queues, ["1:2"]);
  });
});
