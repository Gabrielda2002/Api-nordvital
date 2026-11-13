import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { TurnoQueueService } from "../services/turno-queue.service";
import { TurnoPriority, TurnoStatus } from "../entities/Turno";
import { ConflictError } from "@core/utils/custom-errors";

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

  describe("compareQueueOrder (Ley 1171 y FIFO)", () => {
    it("turno prioritario debe tener precedencia sobre general aunque haya llegado después", () => {
      const generalTemprano = {
        id: 1,
        priority: TurnoPriority.GENERAL,
        createdAt: new Date("2026-11-04T08:00:00Z"),
      };
      const prioritarioTardio = {
        id: 2,
        priority: TurnoPriority.PRIORITARIO,
        createdAt: new Date("2026-11-04T08:15:00Z"),
      };

      const cmp = TurnoQueueService.compareQueueOrder(prioritarioTardio, generalTemprano);
      assert.ok(cmp < 0, "El prioritario debe ubicarse antes (cmp < 0)");

      const cmpInverso = TurnoQueueService.compareQueueOrder(generalTemprano, prioritarioTardio);
      assert.ok(cmpInverso > 0, "El general debe ubicarse después (cmp > 0)");
    });

    it("entre dos turnos de igual prioridad debe ordenar en estricto FIFO", () => {
      const primerGeneral = {
        id: 10,
        priority: TurnoPriority.GENERAL,
        createdAt: new Date("2026-11-04T08:00:00Z"),
      };
      const segundoGeneral = {
        id: 11,
        priority: TurnoPriority.GENERAL,
        createdAt: new Date("2026-11-04T08:05:00Z"),
      };

      const cmp = TurnoQueueService.compareQueueOrder(primerGeneral, segundoGeneral);
      assert.ok(cmp < 0, "El primer general llegado debe preceder al segundo");
    });

    it("si tienen exactamente el mismo timestamp, desempata por ID menor", () => {
      const fecha = new Date("2026-11-04T08:00:00Z");
      const turnoA = { id: 5, priority: TurnoPriority.GENERAL, createdAt: fecha };
      const turnoB = { id: 8, priority: TurnoPriority.GENERAL, createdAt: fecha };

      assert.ok(TurnoQueueService.compareQueueOrder(turnoA, turnoB) < 0);
    });
  });

  describe("calculateAheadCount", () => {
    it("debe calcular correctamente los turnos precedentes considerando prioridad", () => {
      const t1General = { id: 1, priority: TurnoPriority.GENERAL, createdAt: new Date("2026-11-04T08:00:00Z") };
      const t2General = { id: 2, priority: TurnoPriority.GENERAL, createdAt: new Date("2026-11-04T08:05:00Z") };
      const t3Prioritario = { id: 3, priority: TurnoPriority.PRIORITARIO, createdAt: new Date("2026-11-04T08:10:00Z") };

      const cola = [t1General, t2General, t3Prioritario];

      // El prioritario no tiene a nadie por delante (precede a t1 y t2)
      assert.equal(TurnoQueueService.calculateAheadCount(t3Prioritario, cola), 0);

      // t1General tiene 1 por delante (t3Prioritario)
      assert.equal(TurnoQueueService.calculateAheadCount(t1General, cola), 1);

      // t2General tiene 2 por delante (t3Prioritario y t1General)
      assert.equal(TurnoQueueService.calculateAheadCount(t2General, cola), 2);
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
