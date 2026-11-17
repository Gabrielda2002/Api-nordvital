import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { TurnoQueueService } from "../services/turno-queue.service";
import { Turno, TurnoPriority, TurnoStatus } from "../entities/Turno";
import { ConflictError } from "@core/utils/custom-errors";
import { EntityManager } from "typeorm";

describe("TurnoQueueService", () => {
  describe("hasCompleteServiceCoverage", () => {
    it("requiere que cada módulo activo atienda todos los servicios activos", () => {
      assert.equal(TurnoQueueService.hasCompleteServiceCoverage(
        [1, 2], [10, 11], [
          { moduloId: 10, serviceIds: [1, 2] },
          { moduloId: 11, serviceIds: [1, 2] },
        ]
      ), true);
      assert.equal(TurnoQueueService.hasCompleteServiceCoverage(
        [1, 2], [10, 11], [
          { moduloId: 10, serviceIds: [1, 2] },
          { moduloId: 11, serviceIds: [1] },
        ]
      ), false);
      assert.equal(TurnoQueueService.hasCompleteServiceCoverage([1, 2], [10], []), false);
      assert.equal(TurnoQueueService.hasCompleteServiceCoverage([], [10], [{ moduloId: 10, serviceIds: [] }]), false);
    });
  });

  describe("generateTicketCode", () => {
    it("debe anteponer 'G' y formatear a 3 dígitos para turnos generales", () => {
      assert.equal(TurnoQueueService.generateTicketCode(TurnoPriority.GENERAL, 1), "G-001");
      assert.equal(TurnoQueueService.generateTicketCode(TurnoPriority.GENERAL, 42), "G-042");
      assert.equal(TurnoQueueService.generateTicketCode(TurnoPriority.GENERAL, 125), "G-125");
    });

    it("debe anteponer 'P' y formatear a 3 dígitos para turnos prioritarios", () => {
      assert.equal(TurnoQueueService.generateTicketCode(TurnoPriority.PRIORITARIO, 1), "P-001");
      assert.equal(TurnoQueueService.generateTicketCode(TurnoPriority.PRIORITARIO, 7), "P-007");
    });
  });

  describe("calculateAheadCount", () => {
    it("excluye la prioridad opuesta y conserva FIFO con desempate por ID", () => {
      const t1General = { id: 1, priority: TurnoPriority.GENERAL, createdAt: new Date("2026-11-04T08:00:00Z") };
      const t2General = { id: 2, priority: TurnoPriority.GENERAL, createdAt: new Date("2026-11-04T08:05:00Z") };
      const t3Prioritario = { id: 3, priority: TurnoPriority.PRIORITARIO, createdAt: new Date("2026-11-04T07:00:00Z") };
      const t4GeneralSameTime = { id: 4, priority: TurnoPriority.GENERAL, createdAt: t2General.createdAt };

      const cola = [t1General, t2General, t3Prioritario, t4GeneralSameTime];

      assert.equal(TurnoQueueService.calculateAheadCount(t3Prioritario, cola), 0);
      assert.equal(TurnoQueueService.calculateAheadCount(t1General, cola), 0);
      assert.equal(TurnoQueueService.calculateAheadCount(t2General, cola), 1);
      assert.equal(TurnoQueueService.calculateAheadCount(t4GeneralSameTime, cola), 2);
    });
  });

  describe("calculateEstimatedWaitMinutes", () => {
    it("debe retornar 0 si no hay nadie por delante", () => {
      assert.equal(TurnoQueueService.calculateEstimatedWaitMinutes(0, 10, 2), 0);
    });

    it("debe calcular tiempo proporcional con 1 asesor activo", () => {
      // 3 personas por delante * 10 min = 30 min
      assert.equal(TurnoQueueService.calculateEstimatedWaitMinutes(3, 10, 1), 30);
    });

    it("debe distribuir la carga si hay múltiples asesores activos", () => {
      // 4 personas por delante * 10 min / 2 asesores = 20 min
      assert.equal(TurnoQueueService.calculateEstimatedWaitMinutes(4, 10, 2), 20);
    });

    it("no presenta un estimado si no hay asesores compatibles activos", () => {
      assert.equal(TurnoQueueService.calculateEstimatedWaitMinutes(4, 10, 0), null);
      assert.equal(TurnoQueueService.calculateEstimatedWaitMinutes(0, 10, 0), null);
    });
  });

  describe("getNextInQueue", () => {
    for (const priority of [TurnoPriority.GENERAL, TurnoPriority.PRIORITARIO]) {
      it(`consulta solo la cola ${priority} en FIFO y bloquea la fila`, async () => {
        const filters: Array<{ condition: string; parameters?: Record<string, unknown> }> = [];
        const order: Array<[string, string]> = [];
        let lockMode = "";
        const selected = Object.assign(new Turno(), {
          id: 4,
          priority,
          status: TurnoStatus.PENDIENTE,
        });
        const builder = {
          where: (condition: string, parameters?: Record<string, unknown>) => { filters.push({ condition, parameters }); return builder; },
          andWhere: (condition: string, parameters?: Record<string, unknown>) => { filters.push({ condition, parameters }); return builder; },
          orderBy: (column: string, direction: string) => { order.push([column, direction]); return builder; },
          addOrderBy: (column: string, direction: string) => { order.push([column, direction]); return builder; },
          setLock: (mode: string) => { lockMode = mode; return builder; },
          getOne: async () => selected,
        };
        const manager = { createQueryBuilder: () => builder } as unknown as EntityManager;

        const result = await TurnoQueueService.getNextInQueue(manager, 7, [2, 3], priority);

        assert.equal(result, selected);
        assert.ok(filters.some(({ condition, parameters }) => condition === "turno.priority = :priority" && parameters?.priority === priority));
        assert.deepEqual(order, [["turno.created_at", "ASC"], ["turno.id", "ASC"]]);
        assert.equal(lockMode, "pessimistic_write");
      });
    }

    it("no consulta la base cuando la sesión no tiene servicios", async () => {
      const manager = {
        createQueryBuilder: () => assert.fail("No debe consultar una cola sin servicios"),
      } as unknown as EntityManager;

      assert.equal(
        await TurnoQueueService.getNextInQueue(manager, 7, [], TurnoPriority.GENERAL),
        null,
      );
    });
  });

  describe("validateTransition (Máquina de estados)", () => {
    it("permite transición PENDIENTE -> LLAMADO al ejecutar LLAMAR", () => {
      const next = TurnoQueueService.validateTransition(TurnoStatus.PENDIENTE, "LLAMAR");
      assert.equal(next, TurnoStatus.LLAMADO);
    });

    it("permite transición LLAMADO -> LLAMADO al ejecutar RELLAMAR", () => {
      const next = TurnoQueueService.validateTransition(TurnoStatus.LLAMADO, "RELLAMAR");
      assert.equal(next, TurnoStatus.LLAMADO);
    });

    it("permite transición LLAMADO -> EN_ATENCION al ejecutar INICIAR", () => {
      const next = TurnoQueueService.validateTransition(TurnoStatus.LLAMADO, "INICIAR");
      assert.equal(next, TurnoStatus.EN_ATENCION);
    });

    it("permite transición EN_ATENCION -> FINALIZADO al ejecutar FINALIZAR", () => {
      const next = TurnoQueueService.validateTransition(TurnoStatus.EN_ATENCION, "FINALIZAR");
      assert.equal(next, TurnoStatus.FINALIZADO);
    });

    it("permite transición LLAMADO -> NO_ASISTIO al ejecutar NO_ASISTIO", () => {
      const next = TurnoQueueService.validateTransition(TurnoStatus.LLAMADO, "NO_ASISTIO");
      assert.equal(next, TurnoStatus.NO_ASISTIO);
    });

    it("permite transición EN_ATENCION -> TRANSFERIDO al ejecutar TRANSFERIR", () => {
      const next = TurnoQueueService.validateTransition(TurnoStatus.EN_ATENCION, "TRANSFERIR");
      assert.equal(next, TurnoStatus.TRANSFERIDO);
    });

    it("solo permite cancelar turnos llamados o en atención", () => {
      assert.equal(TurnoQueueService.validateTransition(TurnoStatus.LLAMADO, "CANCELAR"), TurnoStatus.CANCELADO);
      assert.equal(TurnoQueueService.validateTransition(TurnoStatus.EN_ATENCION, "CANCELAR"), TurnoStatus.CANCELADO);
      assert.throws(() => TurnoQueueService.validateTransition(TurnoStatus.PENDIENTE, "CANCELAR"), ConflictError);
    });

    it("bloquea FINALIZAR sobre un turno en PENDIENTE lanzando ConflictError", () => {
      assert.throws(
        () => TurnoQueueService.validateTransition(TurnoStatus.PENDIENTE, "FINALIZAR"),
        ConflictError
      );
    });

    it("bloquea INICIAR sobre un turno en PENDIENTE sin antes haberlo llamado", () => {
      assert.throws(
        () => TurnoQueueService.validateTransition(TurnoStatus.PENDIENTE, "INICIAR"),
        ConflictError
      );
    });

    it("bloquea cualquier acción de atención sobre un turno ya FINALIZADO", () => {
      assert.throws(
        () => TurnoQueueService.validateTransition(TurnoStatus.FINALIZADO, "LLAMAR"),
        ConflictError
      );
    });
  });
});
