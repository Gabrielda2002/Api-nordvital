import "reflect-metadata";
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { getMetadataArgsStorage } from "typeorm";
import type { ColumnMetadata } from "typeorm/metadata/ColumnMetadata";
import { MysqlDriver } from "typeorm/driver/mysql/MysqlDriver";
import { validateEntity } from "@core/utils/validation-helper";
import { ModuloAtencion } from "../entities/ModuloAtencion";
import { TurnoSedeConfig } from "../entities/TurnoSedeConfig";
import { SesionAtencion } from "../entities/SesionAtencion";

const driver = new MysqlDriver({
  type: "mysql",
  host: "localhost",
  username: "test",
  password: "test",
  database: "test",
} as never);

const hydrateWithDeclaredType = (
  target: Function,
  propertyName: string,
  value: unknown,
): unknown => {
  const column = getMetadataArgsStorage().columns.find(
    (candidate) =>
      candidate.target === target && candidate.propertyName === propertyName,
  );
  assert.ok(column, `La columna ${propertyName} no está declarada`);

  return driver.prepareHydratedValue(
    value,
    { type: column.options.type as string } as ColumnMetadata,
  );
};

describe("Indicadores booleanos de turnos", () => {
  it("hidrata los indicadores como true/false y no como 0/1", () => {
    assert.equal(
      hydrateWithDeclaredType(ModuloAtencion, "isPriority", 1),
      true,
    );
    assert.equal(
      hydrateWithDeclaredType(ModuloAtencion, "isPriority", 0),
      false,
    );
    assert.equal(hydrateWithDeclaredType(ModuloAtencion, "isActive", 1), true);
    assert.equal(
      hydrateWithDeclaredType(TurnoSedeConfig, "isEnabled", 0),
      false,
    );
    assert.equal(hydrateWithDeclaredType(SesionAtencion, "isActive", 1), true);
  });

  it("acepta la validación de entidades cargadas desde la base de datos", async () => {
    const modulo = Object.assign(new ModuloAtencion(), {
      id: 1,
      headquarterId: 1,
      code: "25",
      name: "Módulo de prueba",
      isActive: hydrateWithDeclaredType(ModuloAtencion, "isActive", 1),
      isPriority: hydrateWithDeclaredType(ModuloAtencion, "isPriority", 0),
    });

    await assert.doesNotReject(() => validateEntity(modulo));
  });
});
