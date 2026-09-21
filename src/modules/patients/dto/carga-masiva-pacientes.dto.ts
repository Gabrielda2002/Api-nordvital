import { Regime } from "../entities/pacientes";

export type CargaAccion = "crear" | "actualizar";

export const CARGA_ACCIONES: readonly CargaAccion[] = ["crear", "actualizar"];

export interface CsvRowInput {
  tipo_documento: string;
  numero_documento: string;
  nombre_completo: string;
  celular: string;
  celular_2: string;
  telefono_fijo: string;
  email: string;
  direccion: string;
  convenio: string;
  ips_primaria: string;
  regimen: Regime
}

export interface CsvUpdateRowInput {
  numero_documento: string;
  tipo_documento?: string;
  nombre_completo?: string;
  celular?: string;
  celular_2?: string;
  telefono_fijo?: string;
  email?: string;
  direccion?: string;
  convenio?: string;
  ips_primaria?: string;
  regimen?: Regime;
}

export interface CsvRowError {
  column: string;
  message: string;
}

export interface ValidatedCsvRow {
  row: number;
  data: CsvRowInput;
  valid: boolean;
  errors: CsvRowError[];
}

export interface ValidationResult {
  ok: boolean;
  totalRows: number;
  validRows: number;
  invalidRows: number;
  duplicateRows: string[];
  alreadyExistsRows: string[];
  rows: ValidatedCsvRow[];
}

export interface ConfirmResult {
  ok: boolean;
  message: string;
  inserted?: number;
  alreadyExists?: string[];
  duplicates?: string[];
}

export interface ValidatedUpdateCsvRow {
  row: number;
  data: CsvUpdateRowInput;
  valid: boolean;
  errors: CsvRowError[];
}

export interface UpdateValidationResult {
  ok: boolean;
  totalRows: number;
  validRows: number;
  invalidRows: number;
  duplicateRows: string[];
  notFoundRows: string[];
  ambiguousRows: string[];
  columns: UpdateColumn[];
  rows: ValidatedUpdateCsvRow[];
}

export interface UpdateConfirmResult {
  ok: boolean;
  message: string;
  updated?: number;
  notFound?: string[];
  duplicates?: string[];
  ambiguous?: string[];
}

export interface CatalogMaps {
  tipoDocumento: Map<string, number>;
  convenio: Map<string, number>;
  ipsPrimaria: Map<string, number>;
}

export const CSV_HEADERS = [
  "tipo_documento",
  "numero_documento",
  "nombre_completo",
  "celular",
  "celular_2",
  "telefono_fijo",
  "email",
  "direccion",
  "convenio",
  "ips_primaria",
  "regimen"
] as const;

export const UPDATE_MANDATORY_HEADER = "numero_documento" as const;

export const UPDATE_OPTIONAL_HEADERS = [
  "tipo_documento",
  "nombre_completo",
  "celular",
  "celular_2",
  "telefono_fijo",
  "email",
  "direccion",
  "convenio",
  "ips_primaria",
  "regimen"
] as const;

export type UpdateColumn = (typeof UPDATE_OPTIONAL_HEADERS)[number];

export const UPDATE_CSV_HEADERS = [
  UPDATE_MANDATORY_HEADER,
  ...UPDATE_OPTIONAL_HEADERS
] as const;

export const MAX_ROWS = 500;
