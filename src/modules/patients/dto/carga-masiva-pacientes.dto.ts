import { Regime } from "../entities/pacientes";

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

export const MAX_ROWS = 500;
