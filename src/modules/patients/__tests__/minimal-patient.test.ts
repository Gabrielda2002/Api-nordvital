import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { validate } from "class-validator";
import type { Request, Response, NextFunction } from "express";
import { getMetadataArgsStorage, QueryRunner, Table } from "typeorm";
import { Pacientes } from "../entities/pacientes";
import { createPatient, updatePacienteTable } from "../controllers/pacientes.controller";
import { AllowMinimalPatientRegistration1794927748837 } from "../../../migrations/1794927748837-allow-minimal-patient-registration";
import { getReportRadicacionRows } from "../../radicacion/services/report-radicacion.service";
import { Radicacion } from "../../radicacion/entities/radicacion";

const pendingPatient = () => Object.assign(new Pacientes(), {
  id: 7, documentTypeId: 1, documentNumber: "123456", name: "Paciente nuevo",
  phoneNumber: "3000000000", status: true,
  email: null, address: null, agreementId: null, ipsPrimaryId: null,
});

const completeBody = {
  documentType: 1, documentNumber: "123456", name: "Paciente completo",
  phoneNumber: "3000000000", email: "paciente@example.com", address: "Calle 10",
  agreement: 2, ipsPrimaria: 3,
};

function responseHarness() {
  let status = 200;
  let body: unknown;
  const errors: unknown[] = [];
  const response = {
    status: (code: number) => { status = code; return response; },
    json: (value: unknown) => { body = value; return response; },
  } as unknown as Response;
  return {
    response, next: ((error: unknown) => errors.push(error)) as NextFunction,
    errors, get status() { return status; }, get body() { return body; },
  };
}

describe("Alta mínima y finalización de pacientes", () => {
  it("la validación normal sigue exigiendo los cuatro datos pendientes", async () => {
    const errors = await validate(pendingPatient());
    assert.deepEqual(errors.map(({ property }) => property).sort(),
      ["email", "address", "agreementId", "ipsPrimaryId"].sort());
  });

  it("el perfil completo sigue validando formatos de correo y catálogos", async () => {
    const errors = await validate(Object.assign(pendingPatient(), {
      email: "no-es-correo", address: "Calle 10", agreementId: "2", ipsPrimaryId: "3",
    }));
    assert.deepEqual(errors.map(({ property }) => property).sort(),
      ["email", "agreementId", "ipsPrimaryId"].sort());
  });

  it("el grupo mínimo no permite omitir identidad, nombre, celular ni estado", async () => {
    for (const property of ["documentTypeId", "documentNumber", "name", "phoneNumber", "status"]) {
      const patient = Object.assign(pendingPatient(), { [property]: null });
      const errors = await validate(patient, { groups: ["turno-registration"] });
      assert.ok(errors.some((error) => error.property === property), property);
    }
  });

  it("rechaza el registro habitual con correo o dirección nulos sin guardar", async (t) => {
    t.mock.method(Pacientes, "findOneBy", async () => null);
    t.mock.method(Pacientes.prototype, "save", async () => assert.fail("No debe guardar un perfil incompleto"));
    const harness = responseHarness();
    await createPatient({ body: { ...completeBody, email: null, address: null } } as Request,
      harness.response, harness.next);
    assert.deepEqual(harness.errors, []);
    assert.equal(harness.status, 400);
  });

  it("completa un registro mínimo desde la edición habitual sin teléfono fijo", async (t) => {
    const patient = pendingPatient();
    t.mock.method(Pacientes, "findOneBy", async () => patient);
    const save = t.mock.method(patient, "save", async () => patient);
    const harness = responseHarness();
    await updatePacienteTable({ params: { id: "7" }, body: completeBody } as unknown as Request,
      harness.response, harness.next);
    assert.deepEqual(harness.errors, []);
    assert.equal(harness.status, 200);
    assert.equal(save.mock.callCount(), 1);
    assert.equal(patient.id, 7);
    assert.equal(patient.email, completeBody.email);
    assert.equal(patient.address, completeBody.address);
    assert.equal(patient.agreementId, 2);
    assert.equal(patient.ipsPrimaryId, 3);
    assert.equal(patient.landline, null);
  });

  it("la edición completa rechaza un perfil que conserva datos pendientes", async (t) => {
    const patient = pendingPatient();
    t.mock.method(Pacientes, "findOneBy", async () => patient);
    t.mock.method(patient, "save", async () => assert.fail("No debe guardar"));
    const harness = responseHarness();
    await updatePacienteTable({
      params: { id: "7" }, body: { ...completeBody, agreement: null, ipsPrimaria: null },
    } as unknown as Request, harness.response, harness.next);
    assert.deepEqual(harness.errors, []);
    assert.equal(harness.status, 400);
  });

  it("el reporte muestra N/A si el paciente no tiene convenio ni IPS", async (t) => {
    const query = {
      leftJoinAndSelect: () => query,
      getMany: async () => [{
        id: 1, patientRelation: { ...pendingPatient(), documentRelation: { name: "CC" },
          convenioRelation: null, ipsPrimariaRelation: null },
        cupsRadicadosRelation: [],
      }],
    };
    t.mock.method(Radicacion, "createQueryBuilder", () => query);
    const [row] = await getReportRadicacionRows({});
    assert.equal(row.Convenio, "N/A");
    assert.equal(row.IPS_Primaria, "N/A");
    assert.equal(row.Correo_electronico, "N/A");
    assert.equal(row.Direccion, "N/A");
  });
});

describe("Migración de datos pendientes de pacientes", () => {
  const columnNames = ["email", "address", "agreement_id", "ips_primary_id"];
  const makeTable = (isNullable: boolean) => new Table({
    name: "patients",
    columns: columnNames.map((name) => ({
      name, type: name.endsWith("_id") ? "int" : "varchar",
      length: name.endsWith("_id") ? undefined : "250", isNullable,
    })),
    foreignKeys: [{
      name: "fk_patient_agreement", columnNames: ["agreement_id"],
      referencedTableName: "agreements", referencedColumnNames: ["id"],
    }],
  });

  it("hace anulables solo los cuatro campos, conservando sus metadatos", async () => {
    const table = makeTable(false);
    const queryRunner = {
      getTable: async () => table,
      changeColumns: async (current: Table, changes: { oldColumn: Table["columns"][number]; newColumn: Table["columns"][number] }[]) => {
        assert.equal(current, table);
        assert.deepEqual(current.foreignKeys.map(({ name }) => name), ["fk_patient_agreement"]);
        assert.deepEqual(changes.map(({ oldColumn }) => oldColumn.name), columnNames);
        for (const { oldColumn, newColumn } of changes) {
          assert.deepEqual(newColumn, Object.assign(oldColumn.clone(), { isNullable: true }));
          assert.equal(oldColumn.isNullable, false);
        }
      },
    } as unknown as QueryRunner;
    await new AllowMinimalPatientRegistration1794927748837().up(queryRunner);
    for (const name of columnNames) {
      const column = getMetadataArgsStorage().columns.find((column) =>
        column.target === Pacientes && column.options.name === name);
      assert.equal(column?.options.nullable, true);
    }
  });

  it("bloquea down antes de cambiar columnas si queda un solo dato pendiente", async () => {
    const queryRunner = {
      query: async (sql: string) => {
        for (const name of columnNames) assert.ok(sql.includes(`\`${name}\` IS NULL`));
        return [{ incompleteCount: "1" }];
      },
      getTable: async () => assert.fail("No debe modificar el esquema"),
    } as unknown as QueryRunner;
    await assert.rejects(new AllowMinimalPatientRegistration1794927748837().down(queryRunner),
      /Completa los datos pendientes/);
  });

  it("restaura NOT NULL sin tocar registros cuando no quedan datos pendientes", async () => {
    let changed = false;
    const queryRunner = {
      query: async () => [{ incompleteCount: "0" }],
      getTable: async () => makeTable(true),
      changeColumns: async (_table: Table, changes: { newColumn: { isNullable: boolean } }[]) => {
        assert.equal(changes.length, 4);
        assert.ok(changes.every(({ newColumn }) => !newColumn.isNullable));
        changed = true;
      },
    } as unknown as QueryRunner;
    await new AllowMinimalPatientRegistration1794927748837().down(queryRunner);
    assert.equal(changed, true);
  });
});
