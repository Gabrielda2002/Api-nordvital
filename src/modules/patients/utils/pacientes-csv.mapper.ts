import { TipoDocumento } from "../../catalog/entities/tipo-documento";
import { Convenio } from "../../catalog/entities/convenio";
import { IpsPrimaria } from "../../catalog/entities/ips-primaria";
import { CatalogMaps, CsvRowInput, CsvRowError } from "../dto/carga-masiva-pacientes.dto";
import { Regime } from "../entities/pacientes";

export async function loadCatalogMaps(): Promise<CatalogMaps> {
  const [tiposDocumento, convenios, ipsPrimarias] = await Promise.all([
    TipoDocumento.find({ where: { status: true } }),
    Convenio.find({ where: { status: true } }),
    IpsPrimaria.find({ where: { status: true } }),
  ]);

  const tipoDocumentoMap = new Map<string, number>();
  for (const t of tiposDocumento) {
    tipoDocumentoMap.set(t.name.toUpperCase().trim(), t.id);
  }

  const convenioMap = new Map<string, number>();
  for (const c of convenios) {
    convenioMap.set(c.name.toUpperCase().trim(), c.id);
  }

  const ipsPrimariaMap = new Map<string, number>();
  for (const i of ipsPrimarias) {
    ipsPrimariaMap.set(i.name.toUpperCase().trim(), i.id);
  }

  return {
    tipoDocumento: tipoDocumentoMap,
    convenio: convenioMap,
    ipsPrimaria: ipsPrimariaMap,
  };
}

export function validateRow(
  row: CsvRowInput,
  rowIndex: number,
  catalogMaps: CatalogMaps
): CsvRowError[] {
  const errors: CsvRowError[] = [];

  const tipoDocNormalized = (row.tipo_documento ?? "").toUpperCase().trim();
  if (!tipoDocNormalized) {
    errors.push({ column: "tipo_documento", message: "El tipo de documento es obligatorio" });
  } else if (!catalogMaps.tipoDocumento.has(tipoDocNormalized)) {
    errors.push({
      column: "tipo_documento",
      message: `Tipo de documento "${row.tipo_documento}" no encontrado en el sistema`,
    });
  }

  const docNumber = String(row.numero_documento ?? "").trim();
  if (!docNumber) {
    errors.push({ column: "numero_documento", message: "El número de documento es obligatorio" });
  } else if (!/^\d+$/.test(docNumber)) {
    errors.push({ column: "numero_documento", message: "El número de documento solo permite números" });
  } else if (docNumber.length < 5 || docNumber.length > 20) {
    errors.push({ column: "numero_documento", message: "El número de documento debe tener entre 5 y 20 dígitos" });
  }

  const nombre = (row.nombre_completo ?? "").trim();
  if (!nombre) {
    errors.push({ column: "nombre_completo", message: "El nombre completo es obligatorio" });
  } else if (nombre.length < 3 || nombre.length > 250) {
    errors.push({ column: "nombre_completo", message: "El nombre completo debe tener entre 3 y 250 caracteres" });
  }

  const celular = (row.celular ?? "").trim();
  if (!celular) {
    errors.push({ column: "celular", message: "El celular es obligatorio" });
  } else if (celular.length > 10) {
    errors.push({ column: "celular", message: "El celular no debe exceder los 10 dígitos" });
  }

  const celular2 = (row.celular_2 ?? "").trim();
  if (celular2 && (celular2.length < 1 || celular2.length > 10)) {
    errors.push({ column: "celular_2", message: "El celular 2 debe tener entre 1 y 10 dígitos" });
  }

  const telefonoFijo = (row.telefono_fijo ?? "").trim();
  if (telefonoFijo && telefonoFijo.length > 10) {
    errors.push({ column: "telefono_fijo", message: "El teléfono fijo no debe exceder los 10 dígitos" });
  }

  const email = (row.email ?? "").trim().toLowerCase();
  if (!email) {
    errors.push({ column: "email", message: "El email es obligatorio" });
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push({ column: "email", message: "El email no tiene un formato válido" });
  }

  const direccion = (row.direccion ?? "").trim();
  if (!direccion) {
    errors.push({ column: "direccion", message: "La dirección es obligatoria" });
  }

  const convenioNormalized = (row.convenio ?? "").toUpperCase().trim();
  if (!convenioNormalized) {
    errors.push({ column: "convenio", message: "El convenio es obligatorio" });
  } else if (!catalogMaps.convenio.has(convenioNormalized)) {
    errors.push({
      column: "convenio",
      message: `Convenio "${row.convenio}" no encontrado en el sistema`,
    });
  }

  const ipsNormalized = (row.ips_primaria ?? "").toUpperCase().trim();
  if (!ipsNormalized) {
    errors.push({ column: "ips_primaria", message: "La IPS primaria es obligatoria" });
  } else if (!catalogMaps.ipsPrimaria.has(ipsNormalized)) {
    errors.push({
      column: "ips_primaria",
      message: `IPS primaria "${row.ips_primaria}" no encontrada en el sistema`,
    });
  }

  const phones = [celular, celular2, telefonoFijo].filter((p) => p !== "");
  const uniquePhones = new Set(phones);
  if (phones.length > 0 && uniquePhones.size !== phones.length) {
    errors.push({
      column: "celular",
      message: "Los números de contacto no pueden ser iguales entre sí",
    });
  }

  const regime = (row.regimen ?? "").trim();
  if (!regime) {
    errors.push({ column: "regimen", message: "El regimen es obligatorio"})
  }else if (!Object.values(Regime).includes(regime as Regime)){
    errors.push({ column: "regimen", message: "El regimen debe ser igual a Contributivo | Subsidiado"})
  }

  return errors;
}

export function checkDuplicateDocuments(rows: CsvRowInput[]): string[] {
  const docNumbers = rows.map((r) => String(r.numero_documento ?? "").trim());
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  for (const doc of docNumbers) {
    if (seen.has(doc)) {
      duplicates.add(doc);
    } else {
      seen.add(doc);
    }
  }
  return [...duplicates];
}
