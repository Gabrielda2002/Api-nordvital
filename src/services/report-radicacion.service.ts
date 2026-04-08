import { format } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import { Radicacion } from "../entities/radicacion";

export type ReportRadicacionFilters = {
  statusCups?: number | string;
  dateStart?: string;
  dateEnd?: string;
  cupsCode?: string;
  specialty?: number | string;
};

/** Filas planas con las mismas claves que las columnas del Excel de radicación/CUPS */
export type ReportRadicacionRow = Record<
  string,
  string | number | Date | null | undefined
>;

export async function getReportRadicacionRows(
  filters: ReportRadicacionFilters,
  limit?: number
): Promise<ReportRadicacionRow[]> {
  const { statusCups, dateStart, dateEnd, cupsCode, specialty } = filters;

  console.log('llega specialty', specialty)

  const query = Radicacion.createQueryBuilder("radicacion")
    .leftJoinAndSelect("radicacion.profesionalesRelation", "profesionales")
    .leftJoinAndSelect("radicacion.auditUserRelation", "auditUser")
    .leftJoinAndSelect("radicacion.patientRelation", "pacientes")
    .leftJoinAndSelect("pacientes.documentRelation", "tipo_documento")
    .leftJoinAndSelect("pacientes.convenioRelation", "convenio")
    .leftJoinAndSelect("pacientes.ipsPrimariaRelation", "ips_primaria")
    .leftJoinAndSelect("radicacion.placeRelation", "lugar_radicacion")
    .leftJoinAndSelect("radicacion.ipsRemiteRelation", "ips_remitente")
    .leftJoinAndSelect("radicacion.servicesGroupRelation", "grupo_servicios")
    .leftJoinAndSelect("radicacion.servicesRelation", "servicios")
    .leftJoinAndSelect("radicacion.diagnosticoRelation", "diagnostico")
    .leftJoinAndSelect("radicacion.usuarioRelation", "radicador")
    .leftJoinAndSelect("radicacion.specialtyRelation", "especialidad")
    .leftJoinAndSelect("radicacion.cupsRadicadosRelation", "cups")
    .leftJoinAndSelect("cups.functionalUnitRelation", "unidad_funcional")
    .leftJoinAndSelect("cups.statusRelation", "estado_cups")
    .leftJoinAndSelect(
      "cups.seguimientoAuxiliarRelation",
      "seguimiento_auxiliar"
    )
    .leftJoinAndSelect("cups.servicioRelation", "services");

  if (statusCups) {
    query.andWhere("estado_cups.id = :statusCups", { statusCups });
  }

  if (specialty) {
    console.log('llega specialty en el if', specialty)
    query.andWhere("especialidad.id = :specialty", { specialty });
  }

  if (dateStart && dateEnd) {
    query.andWhere("radicacion.createdAt BETWEEN :dateStart AND :dateEnd", {
      dateStart,
      dateEnd,
    });
  }

  if (cupsCode) {
    query.andWhere("cups.code = :cupsCode", { cupsCode });
  }

  if (limit) {
    query.limit(limit);
  }

  const data = await query.getMany();
  const rows: ReportRadicacionRow[] = [];

  data.forEach((radicado) => {
    const row = {
      Id: radicado.id || "N/A",
      Tipo_de_documento:
        radicado.patientRelation?.documentRelation.name || "N/A",
      Nombre_del_paciente: radicado.patientRelation?.name || "N/A",
      Numero_documento: radicado.patientRelation?.documentNumber || "N/A",
      Telefono_celular: radicado.patientRelation?.phoneNumber || "N/A",
      Telefono_fijo: radicado.patientRelation?.landline || "N/A",
      Correo_electronico: radicado.patientRelation?.email || "N/A",
      Direccion: radicado.patientRelation?.address || "N/A",
      Convenio: radicado.patientRelation?.convenioRelation.name || "N/A",
      IPS_Primaria: radicado.patientRelation?.ipsPrimariaRelation.name || "N/A",
      Fecha_de_orden: radicado.orderDate || "N/A",
      Lugar_de_radicacion: radicado.placeRelation?.name || "N/A",
      IPS_Remitente: radicado.ipsRemiteRelation?.name || "N/A",
      Profesional: radicado.profesionalesRelation?.name || "N/A",
      Especialidad: radicado.specialtyRelation?.name || "N/A",
      codigo_diagnostico: radicado.diagnosticoRelation?.code || "N/A",
      descripcion_diagnostico:
        radicado.diagnosticoRelation?.description || "N/A",
      Grupo_de_servicios: radicado.servicesGroupRelation?.name || "N/A",
      Servicios: radicado.servicesRelation?.name || "N/A",
      Radicador: radicado.usuarioRelation?.name || "N/A",
      Auditora:
        radicado.auditNotes !== "Pendiente"
          ? radicado.auditNotes
          : radicado.auditUserRelation?.name || "N/A",
      Fecha_de_auditoria:
        radicado.auditDate !== null
          ? radicado.auditDate
          : radicado.updatedAt || "N/A",
    };

    if (radicado.cupsRadicadosRelation?.length > 0) {
      radicado.cupsRadicadosRelation.forEach((cups) => {
        const observations =
          cups.seguimientoAuxiliarRelation
            .map(
              (s) =>
                `${s.observation}, ${format(
                  new Date(s.createdAt),
                  "yyyy-MM-dd HH:mm:ss"
                )}`
            )
            .join(" || ") || "N/A";

        rows.push({
          ...row,
          radicadoDate: cups.createdAt
            ? formatInTimeZone(
                new Date(cups.createdAt),
                "America/Bogota",
                "yyyy-MM-dd HH:mm:ss"
              )
            : "N/A",
          Codigo_cups: cups.servicioRelation?.code || "N/A",
          Descripcion_cups: cups.servicioRelation?.name || "N/A",
          Estado_cups: cups.statusRelation?.name || "N/A",
          Unidad_funcional: cups.functionalUnitRelation?.name || "N/A",
          Fecha_actualizacion: cups.updatedAt || "N/A",
          Observacion_seguimiento_auxiliar: observations,
        });
      });
    } else {
      rows.push(row);
    }
  });

  return rows;
}
