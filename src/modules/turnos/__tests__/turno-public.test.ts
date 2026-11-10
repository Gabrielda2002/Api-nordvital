import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { EntityManager, Repository } from "typeorm";
import { TurnoIssuanceService } from "../services/turno-issuance.service";
import { TurnoDayService } from "../services/turno-day.service";
import { TurnoGeoService } from "../services/turno-geo.service";
import { TurnoQueueService } from "../services/turno-queue.service";
import { Turno, TurnoPriority, TurnoStatus } from "../entities/Turno";
import { TurnoSedeConfig } from "../entities/TurnoSedeConfig";
import { TurnoTracking } from "../entities/TurnoTracking";
import { Pacientes } from "../../patients/entities/pacientes";
import { TipoDocumento } from "../../catalog/entities/tipo-documento";
import { BadRequestError, ConflictError, ForbiddenError, NotFoundError } from "@core/utils/custom-errors";

const input = {
  headquarterId: 1, serviceId: 2, priority: TurnoPriority.GENERAL,
  documentNumber: "123456", documentTypeId: 1, name: "Nombre recibido", phoneNumber: "3000000000",
};

describe("Integración pública de turnos", () => {
  it("mantiene el mismo día operativo aunque el proceso esté en otra zona", () => {
    const before = TurnoDayService.getRange(new Date("2026-11-10T04:59:59Z"));
    const after = TurnoDayService.getRange(new Date("2026-11-10T05:00:00Z"));
    assert.equal(before.start.toISOString(), "2026-11-09T05:00:00.000Z");
    assert.equal(before.end.toISOString(), "2026-11-10T04:59:59.999Z");
    assert.equal(after.start.toISOString(), "2026-11-10T05:00:00.000Z");
  });

  it("valida IDs documentales enteros y positivos", () => {
    assert.equal(TurnoIssuanceService.resolveDocumentTypeId("2"), 2);
    for (const value of [undefined, null, "", "abc", 0, -1, 1.2, Infinity]) {
      assert.throws(() => TurnoIssuanceService.resolveDocumentTypeId(value), BadRequestError);
    }
  });

  const target = { latitude: 7.9, longitude: -72.5, geoRadiusMeters: 150 };
  it("permite omitir ubicación únicamente con flag explícito en desarrollo", () => {
    assert.doesNotThrow(() => TurnoGeoService.validateRequest({ skipGeolocation: true }, target, true));
    assert.throws(() => TurnoGeoService.validateRequest({}, target, true), BadRequestError);
    assert.throws(() => TurnoGeoService.validateRequest({ skipGeolocation: "true" }, target, true), BadRequestError);
  });

  it("rechaza la omisión fuera de desarrollo", () => {
    assert.throws(() => TurnoGeoService.validateRequest({ skipGeolocation: true }, target, false), ForbiddenError);
    assert.throws(() => TurnoGeoService.validateRequest({}, target, false), BadRequestError);
  });

  it("valida coordenadas y geocerca también en desarrollo sin omisión", () => {
    for (const development of [true, false]) {
      assert.doesNotThrow(() => TurnoGeoService.validateRequest({ userLatitude: 7.9, userLongitude: -72.5 }, target, development));
      assert.throws(() => TurnoGeoService.validateRequest({ userLatitude: 0, userLongitude: 0 }, target, development), ForbiddenError);
      assert.throws(() => TurnoGeoService.validateRequest({ userLatitude: NaN, userLongitude: -72.5 }, target, development), BadRequestError);
      assert.throws(() => TurnoGeoService.validateRequest({ userLatitude: "7.9", userLongitude: -72.5 }, target, development), BadRequestError);
    }
  });

  it("serializa emisiones simultáneas y conserva los datos del paciente", async (t) => {
    const patient = Object.assign(new Pacientes(), { id: 7, documentNumber: "123456", documentTypeId: 1, name: "Nombre original", phoneNumber: "3111111111" });
    const turns: Turno[] = [];
    const saved: object[] = [];
    let gate = Promise.resolve();
    const transaction = async (_isolation: string, work: (manager: EntityManager) => Promise<unknown>) => {
      assert.equal(_isolation, "READ COMMITTED");
      let unlock = () => {};
      let acquired = false;
      const manager = {
        findOne: async (entity: unknown, options: { where: Record<string, unknown>; lock?: { mode: string } }) => {
          if (entity === Pacientes) {
            assert.deepEqual(options.where, { documentNumber: "123456", documentTypeId: 1 });
            assert.equal(options.lock?.mode, "pessimistic_write");
            const previous = gate;
            gate = new Promise<void>((resolve) => { unlock = resolve; });
            await previous;
            acquired = true;
            return patient;
          }
          if (entity === Turno) {
            assert.equal("serviceId" in options.where, false);
            assert.equal("headquarterId" in options.where, false);
            return turns[0] ?? null;
          }
          assert.equal(entity, TurnoSedeConfig);
          assert.equal(options.lock?.mode, "pessimistic_write");
          return { headquarterId: input.headquarterId };
        },
        create: (entity: new () => object, values: object) => Object.assign(new entity(), values),
        save: async (entity: object) => {
          saved.push(entity);
          if (entity instanceof Turno) {
            entity.id = 9;
            entity.createdAt = new Date();
            turns.push(entity);
          }
          return entity;
        },
      } as unknown as EntityManager;
      try { return await work(manager); } finally { if (acquired) unlock(); }
    };
    t.mock.method(Turno, "getRepository", () => ({ manager: { transaction } } as unknown as Repository<Turno>));
    t.mock.method(TurnoQueueService, "getNextDailyNumber", async (_sede: number, _day: Date, manager: EntityManager) => {
      assert.ok(manager);
      return 1;
    });
    const result = await Promise.all([
      TurnoIssuanceService.issue(input),
      TurnoIssuanceService.issue({ ...input, headquarterId: 8, serviceId: 10 }),
    ]);
    assert.deepEqual(result.map((entry) => entry.created), [true, false]);
    assert.equal(result[0].turno.ticketToken, result[1].turno.ticketToken);
    assert.equal(turns.length, 1);
    assert.equal(patient.name, "Nombre original");
    assert.equal(patient.phoneNumber, "3111111111");
    assert.equal(saved.some((entry) => entry instanceof Pacientes), false);
    assert.equal(saved.filter((entry) => entry instanceof TurnoTracking).length, 1);
  });

  it("no reutiliza pacientes con otro tipo de documento ni fabrica datos faltantes", async (t) => {
    const lookups: unknown[] = [];
    const manager = {
      findOne: async (entity: unknown, options: unknown) => {
        lookups.push({ entity, options });
        return entity === TipoDocumento ? { id: 2 } : null;
      },
      create: (entity: new () => object, values: object) => Object.assign(new entity(), values),
      save: async () => { assert.fail("No debe guardar un paciente incompleto"); },
    } as unknown as EntityManager;
    t.mock.method(Turno, "getRepository", () => ({ manager: { transaction: async (_level: string, work: (em: EntityManager) => unknown) => work(manager) } } as unknown as Repository<Turno>));
    await assert.rejects(TurnoIssuanceService.issue({ ...input, documentTypeId: 2 }), /Email|Direccion|Convenio|ipsPrimaria|Estado/);
    assert.equal(lookups.length, 3);
  });

  it("la consulta diaria no incluye turnos anteriores", async (t) => {
    let range: { _value: Date[] } | undefined;
    const manager = {
      findOne: async (entity: unknown, options: { where: { createdAt?: { _value: Date[] } } }) => {
        if (entity === Pacientes) return { id: 4 };
        if (entity === Turno) { range = options.where.createdAt; return { id: 1 }; }
        throw new Error("No debe crear otro turno");
      },
    } as unknown as EntityManager;
    t.mock.method(Turno, "getRepository", () => ({ manager: { transaction: async (_level: string, work: (em: EntityManager) => unknown) => work(manager) } } as unknown as Repository<Turno>));
    const result = await TurnoIssuanceService.issue(input);
    assert.equal(result.created, false);
    assert.deepEqual(range?._value, Object.values(TurnoDayService.getRange()));
  });

  for (const status of Object.values(TurnoStatus)) {
    it(`cancelación pública desde ${status}`, async (t) => {
      const turno = Object.assign(new Turno(), { id: 3, status, ticketToken: "ticket" });
      const saved: object[] = [];
      const manager = {
        findOne: async (_entity: unknown, options: { lock: { mode: string } }) => {
          assert.equal(options.lock.mode, "pessimistic_write");
          return turno;
        },
        create: (entity: new () => object, values: object) => Object.assign(new entity(), values),
        save: async (entity: object) => { saved.push(entity); return entity; },
      } as unknown as EntityManager;
      t.mock.method(Turno, "getRepository", () => ({ manager: { transaction: async (work: (em: EntityManager) => unknown) => work(manager) } } as unknown as Repository<Turno>));
      if (status === TurnoStatus.PENDIENTE || status === TurnoStatus.LLAMADO) {
        await TurnoIssuanceService.cancel("ticket", "Ya no necesito atención");
        assert.equal(turno.status, TurnoStatus.CANCELADO);
        assert.equal(saved.length, 2);
      } else {
        await assert.rejects(TurnoIssuanceService.cancel("ticket"), ConflictError);
        assert.equal(saved.length, 0);
      }
    });
  }

  it("rechaza cancelar un ticket inexistente", async (t) => {
    const manager = { findOne: async () => null } as unknown as EntityManager;
    t.mock.method(Turno, "getRepository", () => ({ manager: { transaction: async (work: (em: EntityManager) => unknown) => work(manager) } } as unknown as Repository<Turno>));
    await assert.rejects(TurnoIssuanceService.cancel("inexistente"), NotFoundError);
  });
});
