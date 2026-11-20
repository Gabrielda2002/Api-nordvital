import { describe, it, type TestContext } from "node:test";
import assert from "node:assert/strict";
import { Module } from "node:module";
import { NextFunction, Request, Response } from "express";
import { EntityManager, Repository } from "typeorm";
import { ModuloAtencion } from "../entities/ModuloAtencion";
import { TurnoSedeServicio } from "../entities/TurnoSedeServicio";
import { ServicioAtencion } from "../../catalog/entities/servicio-atencion";
import { Sedes } from "../../catalog/entities/sedes";
import { BadRequestError, ConflictError, NotFoundError } from "@core/utils/custom-errors";
import { TurnoSiteServiceService } from "../services/turno-site-service.service";
import { TurnoServiceCatalogService } from "../services/turno-service-catalog.service";
import { SesionAtencionServicio } from "../entities/SesionAtencionServicio";
import { Turno, TurnoStatus } from "../entities/Turno";

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

describe("Administración de servicios por sede y módulos", () => {
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

  it("actualiza nombre y estado del módulo y notifica a la sede", async (t) => {
    const module = Object.assign(new ModuloAtencion(), {
      id: 4, headquarterId: 1, code: "M4", name: "Módulo 4", isActive: true,
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
      { params: { id: "4" }, body: { name: "Módulo 4B", isActive: false } } as unknown as Request,
      harness.response,
      harness.next,
    );

    assert.deepEqual(harness.errors, []);
    assert.equal((harness.body.modulo as ModuloAtencion).name, "Módulo 4B");
    assert.equal((harness.body.modulo as ModuloAtencion).isActive, false);
    assert.deepEqual(notifiedHeadquarters, [1]);
  });

  it("rechaza actualizar un módulo inexistente", async (t) => {
    t.mock.method(ModuloAtencion, "findOne", async () => null);

    const harness = responseHarness();
    await TurnosAdminController.updateModulo(
      { params: { id: "404" }, body: { name: "Módulo X" } } as unknown as Request,
      harness.response,
      harness.next,
    );

    assert.ok(harness.errors[0] instanceof NotFoundError);
  });
});

describe("Catálogo administrativo de servicios de turnos", () => {
  it("crea un servicio activo con el nombre limpio y rechaza nombres inválidos", async (t) => {
    t.mock.method(ServicioAtencion, "create", (data: unknown) => data);
    t.mock.method(ServicioAtencion, "save", async (data: unknown) => data);
    assert.deepEqual(await TurnoServiceCatalogService.create("  Medicina  "), {
      name: "Medicina", status: true,
    });
    assert.throws(() => TurnoServiceCatalogService.create("  ab  "), BadRequestError);
  });

  function mockCatalogTransaction(
    t: TestContext,
    blockedBy?: typeof SesionAtencionServicio | typeof Turno,
  ) {
    const service = Object.assign(new ServicioAtencion(), { id: 7, name: "Medicina", status: true });
    const manager = {
      findOne: async (entity: unknown, options: { lock: { mode: string } }) => {
        assert.equal(entity, ServicioAtencion);
        assert.equal(options.lock.mode, "pessimistic_write");
        return service;
      },
      exists: async (entity: unknown, { where }: { where: Record<string, unknown> }) => {
        assert.equal(where.serviceId, 7);
        assert.equal("headquarterId" in where, false);
        if (entity === SesionAtencionServicio) assert.deepEqual(where.sesion, { isActive: true });
        if (entity === Turno) {
          assert.deepEqual((where.status as { value: TurnoStatus[] }).value, [
            TurnoStatus.PENDIENTE, TurnoStatus.LLAMADO, TurnoStatus.EN_ATENCION,
          ]);
        }
        return entity === blockedBy;
      },
      save: async (item: ServicioAtencion) => item,
    };
    t.mock.method(ServicioAtencion, "getRepository", () => ({ manager: {
      transaction: async (_isolation: string, work: (manager: unknown) => unknown) => work(manager),
    } }));
    return service;
  }

  it("renombra, desactiva y reactiva un servicio sin modificar su identidad", async (t) => {
    mockCatalogTransaction(t);
    const updated = await TurnoServiceCatalogService.update(7, "  Medicina general  ", "0");
    assert.equal(updated.id, 7);
    assert.equal(updated.name, "Medicina general");
    assert.equal(updated.status, false);
    assert.equal((await TurnoServiceCatalogService.update(7, updated.name, "1")).status, true);
  });

  for (const blocker of [SesionAtencionServicio, Turno] as const) {
    it(`rechaza la desactivación si hay registros de ${blocker.name} sin resolver`, async (t) => {
      const service = mockCatalogTransaction(t, blocker);
      await assert.rejects(() => TurnoServiceCatalogService.update(7, "Otro nombre", false), ConflictError);
      assert.equal(service.status, true);
      assert.equal(service.name, "Medicina");
    });
  }
});
