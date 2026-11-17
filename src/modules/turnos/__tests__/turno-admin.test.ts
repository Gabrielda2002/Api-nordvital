import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { Module } from "node:module";
import { NextFunction, Request, Response } from "express";
import { EntityManager, Repository } from "typeorm";
import { ModuloAtencion } from "../entities/ModuloAtencion";
import { TurnoSedeServicio } from "../entities/TurnoSedeServicio";
import { ServicioAtencion } from "../../catalog/entities/servicio-atencion";
import { Sedes } from "../../catalog/entities/sedes";
import { ConflictError } from "@core/utils/custom-errors";
import { TurnoSiteServiceService } from "../services/turno-site-service.service";

const appPath = require.resolve("../../../app");
const previousApp = require.cache[appPath];
const appStub = new Module(appPath);
appStub.exports = { io: null };
require.cache[appPath] = appStub;
const { TurnoSocketService } = require("../services/turno-socket.service") as typeof import("../services/turno-socket.service");
const { TurnosAdminController } = require("../controllers/turnos-admin.controller") as typeof import("../controllers/turnos-admin.controller");
if (previousApp) require.cache[appPath] = previousApp;
else delete require.cache[appPath];

function responseHarness() {
  let body: Record<string, unknown> = {};
  const errors: unknown[] = [];
  const response = {
    status: () => response,
    json: (value: Record<string, unknown>) => { body = value; return response; },
  } as unknown as Response;
  return { response, next: ((error: unknown) => errors.push(error)) as NextFunction, errors, get body() { return body; } };
}

describe("Administración de servicios por sede y tipo de módulo", () => {
  it("devuelve catálogo activo indicando cuáles servicios están asignados", async (t) => {
    t.mock.method(Sedes, "findOne", async () => ({ id: 1, name: "Sede" }));
    t.mock.method(ServicioAtencion, "find", async () => [{ id: 2, name: "Medicina" }, { id: 3, name: "Odontología" }]);
    t.mock.method(TurnoSedeServicio, "find", async () => [{ serviceId: 3 }, { serviceId: 9 }]);

    const result = await TurnoSiteServiceService.getAssignment(1);
    assert.deepEqual(result.assignedServiceIds, [3, 9]);
    assert.deepEqual(result.services, [
      { id: 2, name: "Medicina", isAssigned: false },
      { id: 3, name: "Odontología", isAssigned: true },
    ]);
  });

  it("persiste el cambio de tipo del módulo cuando no tiene sesión activa", async (t) => {
    const module = Object.assign(new ModuloAtencion(), {
      id: 4, headquarterId: 1, code: "M4", name: "Módulo 4", isActive: true, isPriority: false,
    });
    t.mock.method(ModuloAtencion, "findOne", async () => module);
    const manager = {
      findOne: async (entity: unknown) => entity === Sedes ? { id: 1 } : entity === ModuloAtencion ? module : null,
      save: async (entity: object) => entity,
    } as unknown as EntityManager;
    t.mock.method(ModuloAtencion, "getRepository", () => ({ manager: {
      transaction: async (_isolation: string, work: (transactionManager: EntityManager) => unknown) => work(manager),
    } } as unknown as Repository<ModuloAtencion>));
    const notifiedHeadquarters: number[] = [];
    t.mock.method(TurnoSocketService, "notificarCambioSesiones", async (headquarterId: number) => {
      notifiedHeadquarters.push(headquarterId);
    });

    const harness = responseHarness();
    await TurnosAdminController.updateModulo(
      { params: { id: "4" }, body: { isPriority: true } } as unknown as Request,
      harness.response,
      harness.next,
    );

    assert.deepEqual(harness.errors, []);
    assert.equal((harness.body.modulo as ModuloAtencion).isPriority, true);
    assert.deepEqual(notifiedHeadquarters, [1]);
  });

  it("rechaza cambiar el tipo de un módulo con sesión activa", async (t) => {
    const module = Object.assign(new ModuloAtencion(), {
      id: 4, headquarterId: 1, code: "M4", name: "Módulo 4", isActive: true, isPriority: false,
    });
    t.mock.method(ModuloAtencion, "findOne", async () => module);
    const manager = {
      findOne: async (entity: unknown) => entity === Sedes ? { id: 1 } : entity === ModuloAtencion ? module : { id: 7 },
      save: async () => assert.fail("No debe guardar el módulo"),
    } as unknown as EntityManager;
    t.mock.method(ModuloAtencion, "getRepository", () => ({ manager: {
      transaction: async (_isolation: string, work: (transactionManager: EntityManager) => unknown) => work(manager),
    } } as unknown as Repository<ModuloAtencion>));

    const harness = responseHarness();
    await TurnosAdminController.updateModulo(
      { params: { id: "4" }, body: { isPriority: true } } as unknown as Request,
      harness.response,
      harness.next,
    );

    assert.ok(harness.errors[0] instanceof ConflictError);
    assert.equal(module.isPriority, false);
  });

  it("rechaza tipos de prioridad que no sean booleanos", async (t) => {
    const harness = responseHarness();
    await TurnosAdminController.createModulo(
      { body: { headquarterId: 1, code: "M1", name: "Módulo 1", isPriority: "true" } } as unknown as Request,
      harness.response,
      harness.next,
    );
    assert.match(String(harness.errors[0]), /debe ser booleano/);
  });
});
