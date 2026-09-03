import * as csv from "fast-csv";
import { In } from "typeorm";
import { AppDataSource } from "@core/db/conexion";
import Logger from "@core/utils/logger-wrapper";
import {
  CsvRowInput,
  ValidatedCsvRow,
  ValidationResult,
  ConfirmResult,
  CSV_HEADERS,
  MAX_ROWS,
} from "../dto/carga-masiva-pacientes.dto";
import {
  loadCatalogMaps,
  validateRow,
  checkDuplicateDocuments,
} from "../utils/pacientes-csv.mapper";
import { Pacientes, Regime } from "../entities/pacientes";

const EXPECTED_HEADERS = [...CSV_HEADERS];

export class PacientesCsvService {

  private static stripBom(str: string): string {
    if (str.charCodeAt(0) === 0xfeff) {
      return str.slice(1);
    }
    return str;
  }

  private static decodeBuffer(buffer: Buffer): string {
    let str = buffer.toString("utf-8");
    str = this.stripBom(str);
    if (!str.includes("\uFFFD")) {
      return str;
    }

    str = buffer.toString("latin1");
    str = this.stripBom(str);

    if (str.includes("\uFFFD")) {
      str = buffer.toString("utf-16le");
      str = this.stripBom(str);
    }

    return str;
  }

  static async parseCsv(buffer: Buffer): Promise<CsvRowInput[]> {
    const csvString = this.decodeBuffer(buffer);

    return new Promise<CsvRowInput[]>((resolve, reject) => {
      const results: CsvRowInput[] = [];
      csv
        .parseString(csvString, {
          headers: true,
          delimiter: ";",
          trim: true,
          ignoreEmpty: true,
        })
        .on("data", (data: CsvRowInput) => results.push(data))
        .on("error", (error: Error) =>
          reject(new Error(`Error al parsear el archivo CSV: ${error.message}`))
        )
        .on("end", () => resolve(results));
    });
  }

  static validateHeaders(headers: string[]): string | null {
    const normalizedHeaders = headers.map((h) => h.toLowerCase().trim());

    if (normalizedHeaders.length !== EXPECTED_HEADERS.length) {
      return `El archivo debe tener ${EXPECTED_HEADERS.length} columnas: ${EXPECTED_HEADERS.join(", ")}. Se recibieron ${normalizedHeaders.length} columnas.`;
    }

    for (let i = 0; i < EXPECTED_HEADERS.length; i++) {
      if (normalizedHeaders[i] !== EXPECTED_HEADERS[i]) {
        return `Columna "${headers[i]}" no válida. Se esperaba "${EXPECTED_HEADERS[i]}". Verifique que los encabezados del CSV coincidan con la plantilla.`;
      }
    }

    return null;
  }

  static async validate(buffer: Buffer): Promise<ValidationResult> {
    const rows = await this.parseCsv(buffer);

    const emptyResult: ValidationResult = {
      ok: false,
      totalRows: rows.length,
      validRows: 0,
      invalidRows: rows.length,
      duplicateRows: [],
      alreadyExistsRows: [],
      rows: [],
    };

    if (rows.length === 0) {
      return emptyResult;
    }

    if (rows.length > MAX_ROWS) {
      return emptyResult;
    }

    const headerValidation = this.validateHeaders(Object.keys(rows[0]));
    if (headerValidation) {
      return emptyResult;
    }

    const catalogMaps = await loadCatalogMaps();

    const validatedRows: ValidatedCsvRow[] = rows.map((row, index) => {
      const errors = validateRow(row, index + 1, catalogMaps);
      return {
        row: index + 1,
        data: row,
        valid: errors.length === 0,
        errors,
      };
    });

    const validCount = validatedRows.filter((r) => r.valid).length;
    const duplicateDocs = checkDuplicateDocuments(rows);

    const allDocNumbers = rows
      .map((r) => String(r.numero_documento ?? "").trim())
      .filter((d) => d !== "");

    const existingPatients = allDocNumbers.length
      ? await Pacientes.find({
          where: { documentNumber: In(allDocNumbers) },
          select: ["documentNumber"] as any,
        })
      : [];
    const alreadyExistsDocs = existingPatients.map((p) => p.documentNumber);

    return {
      ok: true,
      totalRows: rows.length,
      validRows: validCount,
      invalidRows: rows.length - validCount,
      duplicateRows: duplicateDocs,
      alreadyExistsRows: alreadyExistsDocs,
      rows: validatedRows,
    };
  }

  static async confirmInsert(
    buffer: Buffer,
    userId?: number
  ): Promise<ConfirmResult> {
    const validation = await this.validate(buffer);

    if (validation.totalRows === 0) {
      return { ok: false, message: "El archivo CSV está vacío." };
    }

    if (validation.totalRows > MAX_ROWS) {
      return {
        ok: false,
        message: `El archivo excede el límite de ${MAX_ROWS} filas. Tiene ${validation.totalRows} filas.`,
      };
    }

    if (validation.invalidRows > 0) {
      return {
        ok: false,
        message: `El archivo contiene ${validation.invalidRows} filas inválidas. Corrija los errores antes de confirmar.`,
      };
    }

    if (validation.duplicateRows.length > 0) {
      const docs = validation.duplicateRows.join(", ");
      return {
        ok: false,
        message: `No se pudo cargar el archivo porque los siguientes documentos están duplicados dentro del CSV: ${docs}`,
        duplicates: validation.duplicateRows,
      };
    }

    if (validation.alreadyExistsRows.length > 0) {
      const docs = validation.alreadyExistsRows.join(", ");
      return {
        ok: false,
        message: `No se pudo cargar el archivo porque los siguientes pacientes ya existen en el sistema: ${docs}`,
        alreadyExists: validation.alreadyExistsRows,
      };
    }

    const catalogMaps = await loadCatalogMaps();

    try {
      await AppDataSource.transaction(async (manager) => {
        const pacientes = validation.rows.map((validatedRow) => {
          const row = validatedRow.data;
          const paciente = new Pacientes();

          paciente.documentTypeId = catalogMaps.tipoDocumento.get(
            row.tipo_documento.toUpperCase().trim()
          )!;
          paciente.documentNumber = String(row.numero_documento).trim();
          paciente.name = row.nombre_completo.toUpperCase().trim();
          paciente.phoneNumber = (row.celular ?? "").trim();
          paciente.phoneNumber2 =
            (row.celular_2 ?? "").trim() || (null as any);
          paciente.landline =
            (row.telefono_fijo ?? "").trim() || undefined;
          paciente.email = (row.email ?? "").trim().toLowerCase();
          paciente.address = (row.direccion ?? "").trim();
          paciente.agreementId = catalogMaps.convenio.get(
            row.convenio.toUpperCase().trim()
          )!;
          paciente.ipsPrimaryId = catalogMaps.ipsPrimaria.get(
            row.ips_primaria.toUpperCase().trim()
          )!;
          paciente.status = true;
          paciente.regime = row.regimen.trim() as Regime;

          return paciente;
        });

        await manager.save(pacientes);
      });

      Logger.info("Carga masiva de pacientes completada", {
        userId: userId ?? "desconocido",
        inserted: validation.rows.length,
        totalRows: validation.totalRows,
      });

      return {
        ok: true,
        message: `${validation.rows.length} pacientes cargados exitosamente.`,
        inserted: validation.rows.length,
      };
    } catch (error: any) {
      Logger.error("Error en carga masiva de pacientes", error, {
        userId: userId ?? "desconocido",
      });

      return {
        ok: false,
        message: `Error al insertar los pacientes: ${error.message}`,
      };
    }
  }
}
