import * as csv from "fast-csv";
import { In } from "typeorm";
import { validate } from "class-validator";
import { AppDataSource } from "@core/db/conexion";
import Logger from "@core/utils/logger-wrapper";
import {
  CargaAccion,
  CatalogMaps,
  CsvRowError,
  CsvRowInput,
  CsvUpdateRowInput,
  ConfirmResult,
  CSV_HEADERS,
  MAX_ROWS,
  UpdateColumn,
  UpdateConfirmResult,
  UpdateValidationResult,
  ValidatedCsvRow,
  ValidatedUpdateCsvRow,
  ValidationResult,
} from "../dto/carga-masiva-pacientes.dto";
import {
  applyUpdateToPatient,
  checkDuplicateDocuments,
  checkMergedContactNumbers,
  loadCatalogMaps,
  UPDATE_COLUMN_ENTITY_PROPERTY,
  validateRow,
  validateUpdateHeaders,
  validateUpdateRow,
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

  static async validate(
    buffer: Buffer,
    accion: CargaAccion = "crear"
  ): Promise<ValidationResult | UpdateValidationResult> {
    return accion === "actualizar"
      ? this.validateUpdate(buffer)
      : this.validateInsert(buffer);
  }

  static async confirm(
    buffer: Buffer,
    accion: CargaAccion = "crear",
    userId?: number
  ): Promise<ConfirmResult | UpdateConfirmResult> {
    return accion === "actualizar"
      ? this.confirmUpdate(buffer, userId)
      : this.confirmInsert(buffer, userId);
  }

  private static async validateInsert(buffer: Buffer): Promise<ValidationResult> {
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

  private static async confirmInsert(
    buffer: Buffer,
    userId?: number
  ): Promise<ConfirmResult> {
    const validation = await this.validateInsert(buffer);

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

  private static normalizeUpdateRowKeys(rows: CsvRowInput[]): CsvUpdateRowInput[] {
    return rows.map((row) => {
      const entries = Object.entries(row).map(([key, value]) => [
        key.toLowerCase().trim(),
        value,
      ]);
      return Object.fromEntries(entries) as CsvUpdateRowInput;
    });
  }

  private static async validateUpdate(
    buffer: Buffer
  ): Promise<UpdateValidationResult> {
    const rawRows = await this.parseCsv(buffer);

    const emptyResult: UpdateValidationResult = {
      ok: false,
      totalRows: rawRows.length,
      validRows: 0,
      invalidRows: rawRows.length,
      duplicateRows: [],
      notFoundRows: [],
      ambiguousRows: [],
      columns: [],
      rows: [],
    };

    if (rawRows.length === 0) {
      return emptyResult;
    }

    if (rawRows.length > MAX_ROWS) {
      return emptyResult;
    }

    const headerValidation = validateUpdateHeaders(Object.keys(rawRows[0]));
    if (headerValidation.error) {
      return emptyResult;
    }

    const rows = this.normalizeUpdateRowKeys(rawRows);
    const columns = headerValidation.columns;
    const catalogMaps = await loadCatalogMaps();

    const duplicateDocs = checkDuplicateDocuments(rows);
    const duplicateSet = new Set(duplicateDocs);

    const allDocNumbers = [
      ...new Set(
        rows
          .map((r) => String(r.numero_documento ?? "").trim())
          .filter((d) => d !== "")
      ),
    ];

    const existingPatients = allDocNumbers.length
      ? await Pacientes.find({ where: { documentNumber: In(allDocNumbers) } })
      : [];

    const patientsByDoc = new Map<string, Pacientes>();
    const occurrencesByDoc = new Map<string, number>();
    for (const patient of existingPatients) {
      const doc = String(patient.documentNumber).trim();
      occurrencesByDoc.set(doc, (occurrencesByDoc.get(doc) ?? 0) + 1);
      if (!patientsByDoc.has(doc)) {
        patientsByDoc.set(doc, patient);
      }
    }

    const notFoundSet = new Set<string>();
    const ambiguousSet = new Set<string>();
    const validatedRows: ValidatedUpdateCsvRow[] = [];

    for (let index = 0; index < rows.length; index++) {
      const row = rows[index];
      const doc = String(row.numero_documento ?? "").trim();
      const errors: CsvRowError[] = validateUpdateRow(row, columns, catalogMaps);

      if (doc && !duplicateSet.has(doc)) {
        const occurrences = occurrencesByDoc.get(doc) ?? 0;

        if (occurrences === 0) {
          notFoundSet.add(doc);
          errors.push({
            column: "numero_documento",
            message: `El paciente con documento "${doc}" no existe en el sistema`,
          });
        } else if (occurrences > 1) {
          ambiguousSet.add(doc);
          errors.push({
            column: "numero_documento",
            message: `El documento "${doc}" coincide con más de un paciente en el sistema`,
          });
        } else {
          const existing = patientsByDoc.get(doc)!;
          errors.push(...checkMergedContactNumbers(existing, row, columns));
          errors.push(
            ...(await this.validateMergedPatient(
              existing,
              row,
              columns,
              catalogMaps
            ))
          );
        }
      }

      validatedRows.push({
        row: index + 1,
        data: row,
        valid: errors.length === 0,
        errors,
      });
    }

    const validCount = validatedRows.filter((r) => r.valid).length;

    return {
      ok: true,
      totalRows: rows.length,
      validRows: validCount,
      invalidRows: rows.length - validCount,
      duplicateRows: duplicateDocs,
      notFoundRows: [...notFoundSet],
      ambiguousRows: [...ambiguousSet],
      columns,
      rows: validatedRows,
    };
  }

  private static async validateMergedPatient(
    existing: Pacientes,
    row: CsvUpdateRowInput,
    columns: UpdateColumn[],
    catalogMaps: CatalogMaps
  ): Promise<CsvRowError[]> {
    const candidate = new Pacientes();

    candidate.documentTypeId = existing.documentTypeId;
    candidate.documentNumber = String(existing.documentNumber);
    candidate.name = existing.name;
    candidate.phoneNumber = existing.phoneNumber;
    candidate.phoneNumber2 = existing.phoneNumber2;
    candidate.landline = existing.landline;
    candidate.email = existing.email;
    candidate.address = existing.address;
    candidate.agreementId = existing.agreementId;
    candidate.ipsPrimaryId = existing.ipsPrimaryId;
    candidate.regime = existing.regime;
    candidate.status = existing.status;

    applyUpdateToPatient(candidate, row, columns, catalogMaps);

    const changedProperties = new Set<string>(
      columns.map((column) => String(UPDATE_COLUMN_ENTITY_PROPERTY[column]))
    );

    const validationErrors = await validate(candidate);

    return validationErrors
      .filter((error) => changedProperties.has(error.property))
      .map((error) => ({
        column: error.property,
        message: Object.values(error.constraints || {}).join(", "),
      }));
  }

  private static async confirmUpdate(
    buffer: Buffer,
    userId?: number
  ): Promise<UpdateConfirmResult> {
    const validation = await this.validateUpdate(buffer);

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
        message: `No se pudo actualizar el archivo porque los siguientes documentos están duplicados dentro del CSV: ${docs}`,
        duplicates: validation.duplicateRows,
      };
    }

    if (validation.notFoundRows.length > 0) {
      const docs = validation.notFoundRows.join(", ");
      return {
        ok: false,
        message: `No se pudo actualizar el archivo porque los siguientes pacientes no existen en el sistema: ${docs}`,
        notFound: validation.notFoundRows,
      };
    }

    if (validation.ambiguousRows.length > 0) {
      const docs = validation.ambiguousRows.join(", ");
      return {
        ok: false,
        message: `No se pudo actualizar el archivo porque los siguientes documentos coinciden con más de un paciente en el sistema: ${docs}`,
        ambiguous: validation.ambiguousRows,
      };
    }

    const catalogMaps = await loadCatalogMaps();

    try {
      await AppDataSource.transaction(async (manager) => {
        const docNumbers = validation.rows.map((validatedRow) =>
          String(validatedRow.data.numero_documento).trim()
        );

        const patients = await manager.find(Pacientes, {
          where: { documentNumber: In(docNumbers) },
        });

        const patientsByDoc = new Map<string, Pacientes>();
        for (const patient of patients) {
          const doc = String(patient.documentNumber).trim();
          if (!patientsByDoc.has(doc)) {
            patientsByDoc.set(doc, patient);
          }
        }

        for (const validatedRow of validation.rows) {
          const doc = String(validatedRow.data.numero_documento).trim();
          const patient = patientsByDoc.get(doc)!;
          applyUpdateToPatient(
            patient,
            validatedRow.data,
            validation.columns,
            catalogMaps
          );
        }

        await manager.save(patients);
      });

      Logger.info("Actualizacion masiva de pacientes completada", {
        userId: userId ?? "desconocido",
        updated: validation.rows.length,
        columns: validation.columns,
        totalRows: validation.totalRows,
      });

      return {
        ok: true,
        message: `${validation.rows.length} pacientes actualizados exitosamente.`,
        updated: validation.rows.length,
      };
    } catch (error: any) {
      Logger.error("Error en actualizacion masiva de pacientes", error, {
        userId: userId ?? "desconocido",
      });

      return {
        ok: false,
        message: `Error al actualizar los pacientes: ${error.message}`,
      };
    }
  }
}
