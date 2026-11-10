import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { Module } from "node:module";
import { Request, Response, NextFunction } from "express";
import { Turno, TurnoPriority, TurnoStatus } from "../entities/Turno";
import { TurnoSedeConfig } from "../entities/TurnoSedeConfig";
import { SesionAtencion } from "../entities/SesionAtencion";
import { SesionAtencionServicio } from "../entities/SesionAtencionServicio";
import { ModuloAtencion } from "../entities/ModuloAtencion";
import { ServicioAtencion } from "../../catalog/entities/servicio-atencion";
import { TurnoTracking } from "../entities/TurnoTracking";
import { TurnoIssuanceService } from "../services/turno-issuance.service";
import { TurnoQueueService } from "../services/turno-queue.service";
import { ConflictError } from "@core/utils/custom-errors";

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

describe("Eventos de integración pública", () => {
  it("actualiza posiciones al ingresar un prioritario y publica métricas de sede", async (t) => {
    events.length = 0;
    const earlier = Object.assign(new Turno(), { id: 1, priority: TurnoPriority.GENERAL, createdAt: new Date(), ticketToken: "general", ticketCode: "G-001", status: TurnoStatus.PENDIENTE });
    const priority = Object.assign(new Turno(), { id: 2, priority: TurnoPriority.PRIORITARIO, createdAt: new Date(), ticketToken: "priority", ticketCode: "P-002", status: TurnoStatus.PENDIENTE });
    t.mock.method(Turno, "find", async (options: { where: { createdAt?: unknown } }) => {
      assert.ok(options.where.createdAt);
      return [earlier, priority];
    });
    t.mock.method(Turno, "count", async () => 2);
    t.mock.method(TurnoSedeConfig, "findOne", async () => ({ averageServiceMinutes: 10 }));
    t.mock.method(SesionAtencion, "count", async () => 1);
    await TurnoSocketService.notificarAvanceCola(1, 2);
    assert.ok(events.some((entry) => entry.room === "sede_1" && entry.event === "cola:actualizada"));
    const general = events.find((entry) => entry.room === "ticket_general");
    const preferential = events.find((entry) => entry.room === "ticket_priority");
    assert.equal(general?.payload.aheadCount, 1);
    assert.equal(general?.payload.estimatedWaitMinutes, 10);
    assert.equal(preferential?.payload.aheadCount, 0);
  });

  it("publica la cola vacía sin inventar actualizaciones de tickets", async (t) => {
    events.length = 0;
    t.mock.method(Turno, "count", async () => 0);
    t.mock.method(Turno, "find", async () => []);
    await TurnoSocketService.notificarAvanceCola(1, 2);
    assert.equal(events.length, 1);
    assert.equal(events[0].payload.pendingCount, 0);
  });

  it("la emisión dispara el recálculo después de persistir", async (t) => {
    const calls: string[] = [];
    const turno = Object.assign(new Turno(), { id: 3, priority: TurnoPriority.GENERAL, status: TurnoStatus.PENDIENTE, ticketToken: "new-ticket", createdAt: new Date() });
    t.mock.method(TurnoSedeConfig, "findOne", async () => ({ headquarterId: 1, latitude: 7.9, longitude: -72.5, geoRadiusMeters: 150, averageServiceMinutes: 10 }));
    t.mock.method(ServicioAtencion, "findOne", async () => ({ id: 2, name: "Servicio" }));
    t.mock.method(TurnoIssuanceService, "issue", async () => { calls.push("commit"); return { created: true, turno }; });
    t.mock.method(Turno, "find", async () => [turno]);
    t.mock.method(SesionAtencion, "count", async () => 1);
    t.mock.method(TurnoSocketService, "notificarAvanceCola", async () => { calls.push("notify"); });
    const harness = responseHarness();
    await TurnosPublicController.emitirTicket({ body: {
      slug: "sede", serviceId: 2, documentNumber: "123456", documentTypeId: 1,
      name: "Paciente", phoneNumber: "3000000000", userLatitude: 7.9, userLongitude: -72.5,
    } } as Request, harness.response, harness.next);
    assert.deepEqual(harness.errors, []);
    assert.equal(harness.status, 201);
    assert.equal(harness.body.token, "new-ticket");
    assert.deepEqual(calls, ["commit", "notify"]);
  });

  for (const affected of [1, 0]) {
    it(`inicio de atención actualiza TV solo si la transición gana (affected=${affected})`, async (t) => {
      events.length = 0;
      t.mock.method(SesionAtencion, "findOne", async () => ({ headquarterId: 1, moduloId: 2, modulo: { code: "M2", name: "Módulo 2" }, serviciosAsignados: [] }));
      t.mock.method(Turno, "findOne", async () => Object.assign(new Turno(), { id: 3, status: TurnoStatus.LLAMADO, ticketCode: "G-003", ticketToken: "ticket" }));
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
    const queues: string[] = [];
    t.mock.method(ModuloAtencion, "findOne", async () => ({ id: 2, headquarterId: 1, code: "M2", name: "Módulo 2" }));
    t.mock.method(SesionAtencion, "findOne", async () => null);
    t.mock.method(SesionAtencion, "find", async () => [{ headquarterId: 8, serviciosAsignados: [{ serviceId: 9 }] }]);
    t.mock.method(SesionAtencion, "update", async () => ({ affected: 1 }));
    t.mock.method(SesionAtencion.prototype, "save", async function (this: SesionAtencion) { this.id = 4; return this; });
    t.mock.method(SesionAtencionServicio.prototype, "save", async function (this: SesionAtencionServicio) { return this; });
    t.mock.method(TurnoSocketService, "notificarAvanceCola", async (sede: number, service: number) => { queues.push(`${sede}:${service}`); });
    const harness = responseHarness();
    await TurnosAtencionController.iniciarSesion({ user: { id: 1 }, body: { moduloId: 2, serviceIds: [3] } } as unknown as Request, harness.response, harness.next);
    assert.deepEqual(harness.errors, []);
    assert.deepEqual(queues.sort(), ["1:3", "8:9"]);
  });

  it("cerrar sesión recalcula las estimaciones de sus servicios", async (t) => {
    const queues: string[] = [];
    const session = Object.assign(new SesionAtencion(), { headquarterId: 1, isActive: true, serviciosAsignados: [{ serviceId: 2 }] });
    t.mock.method(SesionAtencion, "findOne", async () => session);
    t.mock.method(Turno, "findOne", async () => null);
    t.mock.method(session, "save", async () => session);
    t.mock.method(TurnoSocketService, "notificarAvanceCola", async (sede: number, service: number) => { assert.equal(session.isActive, false); queues.push(`${sede}:${service}`); });
    const harness = responseHarness();
    await TurnosAtencionController.cerrarSesion({ user: { id: 1 } } as unknown as Request, harness.response, harness.next);
    assert.deepEqual(harness.errors, []);
    assert.deepEqual(queues, ["1:2"]);
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
