import { NextFunction, query, Request, Response } from "express";
import { Radicacion } from "../entities/radicacion";
import ExcelJS from "exceljs";
import { randomBytes } from "crypto";
import { Cirugias } from "../entities/cirugias";
import { PausasActivas } from "../entities/pausas-activas";
import { format } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import { RegistroEntrada } from "../entities/registro-entrada";
import { Tickets } from "../entities/tickets";
import { DemandaInducida } from "../entities/demanda-inducida";

export async function downloadReportExcel(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const dataRadicacion = await Radicacion.createQueryBuilder("radicacion")
      .leftJoinAndSelect("radicacion.patientRelation", "pacientes")
      .leftJoinAndSelect("pacientes.documentRelation", "tipo_documento")
      .leftJoinAndSelect("pacientes.convenioRelation", "convenio")
      .leftJoinAndSelect("pacientes.ipsPrimariaRelation", "ips_primaria")
      .leftJoinAndSelect("radicacion.placeRelation", "lugar_radicacion")
      .leftJoinAndSelect("radicacion.ipsRemiteRelation", "ips_remitente")
      .leftJoinAndSelect("radicacion.servicesGroupRelation", "grupo_servicios")
      .leftJoinAndSelect("radicacion.servicesRelation", "servicios")
      .leftJoinAndSelect("radicacion.usuarioRelation", "radicador")
      .leftJoinAndSelect("radicacion.specialtyRelation", "especialidad")
      .leftJoinAndSelect("radicacion.cupsRadicadosRelation", "cups")
      .leftJoinAndSelect(
        "cups.seguimientoAuxiliarRelation",
        "seguimiento_auxiliar"
      )
      .leftJoinAndSelect("cups.functionalUnitRelation", "unidad_funcional")
      .leftJoinAndSelect("cups.statusRelation", "estado_cups")
      .orderBy("radicacion.createdAt", "DESC")
      .getMany();

    // Crear un nuevo libro de Excel y una hoja
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Reporte radicacion");

    // Definir las columnas en la hoja de Excel
    worksheet.columns = [
      { header: "Fecha de Radicado", key: "radicadoDate", width: 20 },
      { header: "ID", key: "Id", width: 10 },
      { header: "Tipo de Documento", key: "Tipo_de_documento", width: 20 },
      { header: "Nombre del Paciente", key: "Nombre_del_paciente", width: 30 },
      { header: "Teléfono Celular", key: "Telefono_celular", width: 20 },
      { header: "Teléfono Fijo", key: "Telefono_fijo", width: 20 },
      { header: "Correo Electrónico", key: "Correo_electronico", width: 30 },
      { header: "Dirección", key: "Direccion", width: 30 },
      { header: "Convenio", key: "Convenio", width: 20 },
      { header: "IPS Primaria", key: "IPS_Primaria", width: 20 },
      { header: "Fecha de Orden", key: "Fecha_de_orden", width: 20 },
      { header: "Lugar de Radicación", key: "Lugar_de_radicacion", width: 30 },
      { header: "IPS Remitente", key: "IPS_Remitente", width: 30 },
      { header: "Profesional", key: "Profesional", width: 30 },
      { header: "Especialidad", key: "Especialidad", width: 30 },
      { header: "Grupo de Servicios", key: "Grupo_de_servicios", width: 20 },
      { header: "Servicios", key: "Servicios", width: 20 },
      { header: "Radicador", key: "Radicador", width: 20 },
      { header: "Auditora", key: "Auditora", width: 20 },
      { header: "Fecha de Auditoría", key: "Fecha_de_auditoria", width: 20 },
      { header: "Código CUPS", key: "Codigo_cups", width: 30 },
      { header: "Descripción CUPS", key: "Descripcion_cups", width: 30 },
      { header: "Estado CUPS", key: "Estado_cups", width: 20 },
      { header: "Unidad Funcional", key: "Unidad_funcional", width: 30 },
      {
        header: "Fecha Actualización CUPS",
        key: "Fecha_actualizacion",
        width: 20,
      },
      {
        header: "Observación Seguimiento Auxiliar",
        key: "Observacion_seguimiento_auxiliar",
        width: 30,
      },
      {
        header: "Fecha Registro Seguimiento",
        key: "Fecha_registro",
        width: 20,
      },
    ];

    dataRadicacion.forEach((data) => {
      const row = {
        radicadoDate: data.createdAt || "N/A",
        Id: data.id || "N/A",
        Tipo_de_documento: data.patientRelation?.documentRelation.name || "N/A",
        Nombre_del_paciente: data.patientRelation?.name || "N/A",
        Telefono_celular: data.patientRelation?.phoneNumber || "N/A",
        Telefono_fijo: data.patientRelation?.landline || "N/A",
        Correo_electronico: data.patientRelation?.email || "N/A",
        Direccion: data.patientRelation?.address || "N/A",
        Convenio: data.patientRelation?.convenioRelation.name || "N/A",
        IPS_Primaria: data.patientRelation?.ipsPrimariaRelation.name || "N/A",
        Fecha_de_orden: data.orderDate || "N/A",
        Lugar_de_radicacion: data.placeRelation?.name || "N/A",
        IPS_Remitente: data.ipsRemiteRelation?.name || "N/A",
        Profesional: data.idProfesional === 0 ? data.profetional : data.profesionalesRelation?.name,
        Especialidad: data.specialtyRelation?.name || "N/A",
        Grupo_de_servicios: data.servicesGroupRelation?.name || "N/A",
        Servicios: data.servicesRelation?.name || "N/A",
        Radicador: data.usuarioRelation?.name || "N/A",
        Auditora: data.auditora || "N/A",
        Fecha_de_auditoria: data.auditDate || "N/A",
      };

      // * agregar filas por cada CUPS
      if (data.cupsRadicadosRelation?.length > 0) {
        data.cupsRadicadosRelation.forEach((cups) => {
          worksheet.addRow({
            ...row,
            Codigo_cups: cups.code || "N/A",
            Descripcion_cups: cups.DescriptionCode || "N/A",
            Estado_cups: cups.statusRelation?.name || "N/A",
            Unidad_funcional: cups.functionalUnitRelation?.name || "N/A",
            Fecha_actualizacion: cups.updatedAt || "N/A",
          });
        });
      } else {
        worksheet.addRow(row);
      }

      // * agregar filas por cada seguimiento auxiliar de CUPS
      if (data.cupsRadicadosRelation?.length > 0) {
        data.cupsRadicadosRelation.forEach((cups) => {
          if (cups.seguimientoAuxiliarRelation?.length > 0) {
            cups.seguimientoAuxiliarRelation.forEach((seguimiento) => {
              worksheet.addRow({
                ...row,
                Observacion_seguimiento_auxiliar:
                  seguimiento.observation || "N/A",
                Fecha_registro: seguimiento.createdAt || "N/A",
              });
            });
          }
        });
      }
    });

    // const dateStr = format(new Date(), "yyyyMMdd_HHmmss");

    const randomStr = randomBytes(4).toString("hex");

    const fileName = `Reporte_Radicacion_${randomStr}.xlsx`;

    // Configurar la respuesta para enviar el archivo Excel
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    // *  colocarle como nombre al archivo la fecha actual

    const date = new Date();

    res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);

    // Escribir el archivo en la respuesta
    await workbook.xlsx.write(res);

    res.end();
  } catch (error) {
    next(error);
  }
}

export async function downloadReportExcelFilter(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { auditDateStart, auditDateEnd, dateStart, dateEnd, cupsCode } =
      req.body;

    const query = await Radicacion.createQueryBuilder("radicacion")
      .leftJoinAndSelect("radicacion.profesionalesRelation", "profesionales")
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
      .leftJoinAndSelect(
        "cups.seguimientoAuxiliarRelation",
        "seguimiento_auxiliar"
      )
      .leftJoinAndSelect("cups.functionalUnitRelation", "unidad_funcional")
      .leftJoinAndSelect("cups.statusRelation", "estado_cups");
    // .orderBy("radicacion.createdAt", "DESC")
    // .getMany();

    // * filtro por fecha de auditoria
    if (auditDateStart && auditDateEnd) {
      query.andWhere(
        "radicacion.auditDate BETWEEN :auditDateStart AND :auditDateEnd",
        { auditDateStart, auditDateEnd }
      );
    }
    // * filtro por fecha de radicado
    if (dateStart && dateEnd) {
      query.andWhere("radicacion.createdAt BETWEEN :dateStart AND :dateEnd", {
        dateStart,
        dateEnd,
      });
    }

    // * filtro por codigo cups
    if (cupsCode) {
      query.andWhere("cups.code = :cupsCode", { cupsCode });
    }

    query.orderBy("radicacion.createdAt", "DESC");

    const dataRadicacion = await query.getMany();

    // Crear un nuevo libro de Excel y una hoja
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Reporte radicacion");

    // Definir las columnas en la hoja de Excel
    worksheet.columns = [
      { header: "Fecha-hora", key: "radicadoDate", width: 20 },
      { header: "Numero Radicado", key: "Id", width: 10 },
      { header: "Tipo Documento", key: "Tipo_de_documento", width: 20 },
      { header: "Nombre Paciente", key: "Nombre_del_paciente", width: 30 },
      { header: "Número Documento", key: "Numero_documento", width: 30 },
      { header: "Número Celular", key: "Telefono_celular", width: 20 },
      { header: "Telefono Fijo", key: "Telefono_fijo", width: 20 },
      { header: "Email", key: "Correo_electronico", width: 30 },
      { header: "Direccion", key: "Direccion", width: 30 },
      { header: "Convenio", key: "Convenio", width: 20 },
      { header: "IPS Primaria", key: "IPS_Primaria", width: 20 },
      { header: "Fecha Orden", key: "Fecha_de_orden", width: 20 },
      { header: "Lugar Radicación", key: "Lugar_de_radicacion", width: 30 },
      { header: "IPS Remite", key: "IPS_Remitente", width: 30 },
      { header: "Profesional", key: "Profesional", width: 30 },
      { header: "Especialidad", key: "Especialidad", width: 30 },
      { header: "Cod Diagnostico", key: "codigo_diagnostico", width: 20 },
      {
        header: "Descripcion Diagnostico",
        key: "descripcion_diagnostico",
        width: 30,
      },
      { header: "Grupo Servicio", key: "Grupo_de_servicios", width: 20 },
      { header: "Tipo Servicio", key: "Servicios", width: 20 },
      { header: "Auxiliar Radicador", key: "Radicador", width: 20 },
      { header: "Nombre Auditora", key: "Auditora", width: 20 },
      { header: "Fecha Auditoria", key: "Fecha_de_auditoria", width: 20 },
      { header: "Codigo CUPS", key: "Codigo_cups", width: 30 },
      { header: "Descripcion CUPS", key: "Descripcion_cups", width: 30 },
      { header: "Estado CUPS", key: "Estado_cups", width: 20 },
      { header: "Unidad Funcional", key: "Unidad_funcional", width: 30 },
      {
        header: "Ultima Modificacion",
        key: "Fecha_actualizacion",
        width: 20,
      },
      {
        header: "Seguimiento Auxiliar",
        key: "Observacion_seguimiento_auxiliar",
        width: 30,
      },
      {
        header: "Fecha Seguimiento",
        key: "Fecha_registro",
        width: 20,
      },
    ];

    dataRadicacion.forEach((data) => {
      const row = {
        radicadoDate: data.createdAt || "N/A",
        Id: data.id || "N/A",
        Tipo_de_documento: data.patientRelation?.documentRelation.name || "N/A",
        Nombre_del_paciente: data.patientRelation?.name || "N/A",
        Numero_documento: data.patientRelation?.documentNumber || "N/A",
        Telefono_celular: data.patientRelation?.phoneNumber || "N/A",
        Telefono_fijo: data.patientRelation?.landline || "N/A",
        Correo_electronico: data.patientRelation?.email || "N/A",
        Direccion: data.patientRelation?.address || "N/A",
        Convenio: data.patientRelation?.convenioRelation.name || "N/A",
        IPS_Primaria: data.patientRelation?.ipsPrimariaRelation.name || "N/A",
        Fecha_de_orden: data.orderDate || "N/A",
        Lugar_de_radicacion: data.placeRelation?.name || "N/A",
        IPS_Remitente: data.ipsRemiteRelation?.name || "N/A",
        Profesional: data.idProfesional === 0 ? data.profetional : data.profesionalesRelation?.name,
        Especialidad: data.specialtyRelation?.name || "N/A",
        codigo_diagnostico: data.diagnosticoRelation?.code || "N/A",
        descripcion_diagnostico: data.diagnosticoRelation?.description || "N/A",
        Grupo_de_servicios: data.servicesGroupRelation?.name || "N/A",
        Servicios: data.servicesRelation?.name || "N/A",
        Radicador: data.usuarioRelation?.name || "N/A",
        Auditora: data.auditora || "N/A",
        Fecha_de_auditoria: data.auditDate || "N/A",
      };

      // * agregar filas por cada CUPS
      if (data.cupsRadicadosRelation?.length > 0) {
        data.cupsRadicadosRelation.forEach((cups) => {
          worksheet.addRow({
            ...row,
            Codigo_cups: cups.code || "N/A",
            Descripcion_cups: cups.DescriptionCode || "N/A",
            Estado_cups: cups.statusRelation?.name || "N/A",
            Unidad_funcional: cups.functionalUnitRelation?.name || "N/A",
            Fecha_actualizacion: cups.updatedAt || "N/A",
          });
        });
      } else {
        worksheet.addRow(row);
      }

      // * agregar filas por cada seguimiento auxiliar de CUPS radicacion
      if (data.cupsRadicadosRelation.length > 0) {
        data.cupsRadicadosRelation.forEach((cups) => {
          if (cups.seguimientoAuxiliarRelation?.length > 0) {
            cups.seguimientoAuxiliarRelation.forEach((seguimiento) => {
              worksheet.addRow({
                ...row,
                Observacion_seguimiento_auxiliar:
                  seguimiento.observation || "N/A",
                Fecha_registro: seguimiento.createdAt || "N/A",
              });
            });
          }
        });
      }
    });

    // const dateStr = format(new Date(), "yyyyMMdd_HHmmss");

    console.log(dataRadicacion);
    const randomStr = randomBytes(4).toString("hex");

    const fileName = `Reporte_Radicacion_${randomStr}.xlsx`;

    // Configurar la respuesta para enviar el archivo Excel
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    // *  colocarle como nombre al archivo la fecha actual

    const date = new Date();

    res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);

    // Escribir el archivo en la respuesta
    await workbook.xlsx.write(res);

    res.end();
  } catch (error) {
    next(error);
  }
}

export async function reportExcelCirugias(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const dataCirugias = await Cirugias.createQueryBuilder("cirugias")
      .leftJoinAndSelect("cirugias.ipsRemiteRelation", "ipsRemite")
      .leftJoinAndSelect("cirugias.radicacionRelation", "radicacion")
      .leftJoinAndSelect("cirugias.gestionCirugiasRelation", "gestionCirugias")
      .leftJoinAndSelect(
        "gestionCirugias.estadoSeguimientoRelation",
        "estadoSeguimiento"
      )
      .leftJoinAndSelect("radicacion.cupsRadicadosRelation", "cups")
      .leftJoinAndSelect("radicacion.diagnosticoRelation", "diagnostico")
      .getMany();

    const worjbook = new ExcelJS.Workbook();
    const worksheet = worjbook.addWorksheet("Reporte Cirugias");

    worksheet.columns = [
      { header: "Fecha de Ordenamiento", key: "Fecha_ordenamiento", width: 20 },
      { header: "Fecha de Cirugia", key: "Fecha_cirugia", width: 20 },
      { header: "Hora Programada", key: "Hora_programada", width: 20 },
      { header: "IPS Remitente", key: "IPS_Remitente", width: 30 },
      { header: "Observaciones", key: "Observaciones", width: 30 },
      { header: "Codigo CUPS", key: "Codigo_cups", width: 30 },
      { header: "Descripcion CUPS", key: "Descripcion_cups", width: 30 },
      { header: "Diagnostico", key: "diagnostico_name", width: 30 },
      { header: "Codigo Diagnostico", key: "diagnostico_code", width: 30 },
      { header: "Especialista", key: "especialista", width: 30 },
      { header: "Fecha paraclinico", key: "fecha_paraclinico", width: 30 },
      {
        header: "Fecha anesteciologia",
        key: "fecha_anesteciologia",
        width: 30,
      },
      { header: "Estado", key: "Estado", width: 20 },
      { header: "Observaciones", key: "Observaciones", width: 30 },
      { header: "Fecha de Registro", key: "Fecha_registro", width: 20 },
    ];

    dataCirugias.forEach((data) => {
      const row = {
        Fecha_ordenamiento: data.radicacionRelation.orderDate || "N/A",
        Fecha_cirugia: data.surgeryDate || "N/A",
        Hora_programada: data.scheduledTime || "N/A",
        IPS_Remitente: data.ipsRemiteRelation?.name || "N/A",
        Observaciones: data.observation || "N/A",
        diagnostico_name:
          data.radicacionRelation?.diagnosticoRelation.description || "N/A",
        diagnostico_code:
          data.radicacionRelation?.diagnosticoRelation.code || "N/A",
        especialista: data.specialist || "N/A",
        fecha_paraclinico: data.paraclinicalDate || "N/A",
        fecha_anesteciologia: data.anesthesiologyDate || "N/A",
      };

      // agregar gilas por cada cups
      if (data.radicacionRelation?.cupsRadicadosRelation?.length > 0) {
        data.radicacionRelation?.cupsRadicadosRelation.forEach((cups) => {
          worksheet.addRow({
            ...row,
            Codigo_cups: cups.code || "N/A",
            Descripcion_cups: cups.DescriptionCode || "N/A",
          });
        });
      } else {
        worksheet.addRow(row);
      }

      // agregar filas por seguimiento cirugias
      if (data.gestionCirugiasRelation.length > 0) {
        data.gestionCirugiasRelation.forEach((gestion) => {
          worksheet.addRow({
            ...row,
            Estado: gestion.estadoSeguimientoRelation?.name || "N/A",
            Observaciones: gestion.observation || "N/A",
            Fecha_registro: gestion.createdAt || "N/A",
          });
        });
      }
    });

    const randomStr = randomBytes(4).toString("hex");

    const fileName = `Reporte_Cirugias_${randomStr}.xlsx`;

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);

    await worjbook.xlsx.write(res);

    res.end();
  } catch (error) {
    next(error);
  }
}

// reporte cirugias con filtros de Fecha_ordenamiento
export async function reportExcelCirugiasFiltros(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { dateStart, dateEnd } = req.body;

    const query = await Cirugias.createQueryBuilder("cirugias")
      .leftJoinAndSelect("cirugias.ipsRemiteRelation", "ipsRemite")
      .leftJoinAndSelect("cirugias.radicacionRelation", "radicacion")
      .leftJoinAndSelect("cirugias.gestionCirugiasRelation", "gestionCirugias")
      .leftJoinAndSelect(
        "gestionCirugias.estadoSeguimientoRelation",
        "estadoSeguimiento"
      )
      .leftJoinAndSelect("radicacion.cupsRadicadosRelation", "cups")
      .leftJoinAndSelect("radicacion.diagnosticoRelation", "diagnostico");

    if (dateStart && dateEnd) {
      query.andWhere("cirugias.createdAt BETWEEN :dateStart AND :dateEnd", {
        dateStart: dateStart,
        dateEnd: dateEnd,
      });
    } else {
      return res
        .status(400)
        .json({ message: "Debe enviar la fecha de ordenamiento" });
    }

    query.orderBy("cirugias.createdAt", "DESC");

    const dataCirugias = await query.getMany();

    const worjbook = new ExcelJS.Workbook();
    const worksheet = worjbook.addWorksheet("Reporte Cirugias");

    worksheet.columns = [
      { header: "Fecha de Ordenamiento", key: "Fecha_ordenamiento", width: 20 },
      { header: "Fecha de Cirugia", key: "Fecha_cirugia", width: 20 },
      { header: "Hora Programada", key: "Hora_programada", width: 20 },
      { header: "IPS Remitente", key: "IPS_Remitente", width: 30 },
      { header: "Observacion", key: "Observaciones", width: 30 },
      { header: "Codigo Diagnostico", key: "diagnostico_code", width: 30 },
      { header: "Diagnostico", key: "diagnostico_name", width: 30 },
      { header: "Especialista", key: "especialista", width: 30 },
      {
        header: "Fecha anesteciologia",
        key: "fecha_anesteciologia",
        width: 30,
      },
      { header: "Fecha paraclinico", key: "fecha_paraclinico", width: 30 },
      { header: "Codigo CUPS", key: "Codigo_cups", width: 30 },
      { header: "Descripcion CUPS", key: "Descripcion_cups", width: 30 },
      { header: "Observacion Gestion", key: "Observacionesgestion", width: 30 },
      { header: "Estado", key: "Estado", width: 20 },
      { header: "Fecha de Registro", key: "Fecha_registro", width: 20 },
    ];

    dataCirugias.forEach((data) => {
      const fechaCirugia = data.surgeryDate
        ? formatInTimeZone(
            new Date(data.surgeryDate),
            "America/Bogota",
            "yyyy-MM-dd HH:mm:ss"
          )
        : "N/A";
      const fechaOrdenamiento = data.radicacionRelation.orderDate
        ? formatInTimeZone(
            new Date(data.radicacionRelation.orderDate),
            "America/Bogota",
            "yyyy-MM-dd HH:mm:ss"
          )
        : "N/A";
      const fechaParaclinico = data.paraclinicalDate
        ? formatInTimeZone(
            new Date(data.paraclinicalDate),
            "America/Bogota",
            "yyyy-MM-dd HH:mm:ss"
          )
        : "N/A";
      const fechaAnesteciologia = data.anesthesiologyDate
        ? formatInTimeZone(
            new Date(data.anesthesiologyDate),
            "America/Bogota",
            "yyyy-MM-dd HH:mm:ss"
          )
        : "N/A";
      const fechaRegistro = data.createdAt
        ? formatInTimeZone(
            new Date(data.createdAt),
            "America/Bogota",
            "yyyy-MM-dd HH:mm:ss"
          )
        : "N/A";

      const row = {
        Fecha_ordenamiento: fechaOrdenamiento,
        Fecha_cirugia: fechaCirugia,
        Hora_programada: data.scheduledTime || "N/A",
        IPS_Remitente: data.ipsRemiteRelation?.name || "N/A",
        Observaciones: data.observation || "N/A",
        diagnostico_name:
          data.radicacionRelation?.diagnosticoRelation.description || "N/A",
        diagnostico_code:
          data.radicacionRelation?.diagnosticoRelation.code || "N/A",
        especialista: data.specialist || "N/A",
        fecha_paraclinico: fechaParaclinico,
        fecha_anesteciologia: fechaAnesteciologia,
        Fecha_registro: fechaRegistro,
      };

      // agregar gilas por cada cups
      if (data.radicacionRelation?.cupsRadicadosRelation?.length > 0) {
        data.radicacionRelation?.cupsRadicadosRelation.forEach((cups) => {
          worksheet.addRow({
            ...row,
            Codigo_cups: cups.code || "N/A",
            Descripcion_cups: cups.DescriptionCode || "N/A",
            Observacionesgestion: cups.observation || "N/A",
            Estado: cups.statusRelation?.name || "N/A",
          });
        });
      } else {
        worksheet.addRow(row);
      }

      // agregar filas por seguimiento cirugias
      if (data.gestionCirugiasRelation.length > 0) {
        data.gestionCirugiasRelation.forEach((gestion) => {
          worksheet.addRow({
            ...row,
            Estado: gestion.estadoSeguimientoRelation?.name || "N/A",
            Observacionesgestion: gestion.observation || "N/A",
            Fecha_registro: gestion.createdAt || "N/A",
          });
        });
      }
    });

    const randomStr = randomBytes(4).toString("hex");

    const fileName = `Reporte_Cirugias_${randomStr}.xlsx`;

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);

    await worjbook.xlsx.write(res);

    res.end();
  } catch (error) {
    next(error);
  }
}

export async function reportExcelRadicacion(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { statusCups, dateStart, dateEnd, cupsCode } = req.body;

    const query = await Radicacion.createQueryBuilder("radicacion")
      .leftJoinAndSelect("radicacion.profesionalesRelation", "profesionales")
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
      );

    // Filtro por estado de CUPS
    if (statusCups) {
      query.andWhere("estado_cups.id = :statusCups", { statusCups });
    }

    // Filtro por rango de fechas de radicación
    if (dateStart && dateEnd) {
      query.andWhere("radicacion.createdAt BETWEEN :dateStart AND :dateEnd", {
        dateStart,
        dateEnd,
      });
    }

    // Filtro por código CUPS
    if (cupsCode) {
      query.andWhere("cups.code = :cupsCode", { cupsCode });
    }

    const data = await query.getMany();

    // Crear workbook y workshee
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Reporte CUPS");

    // Definir las columnas en la hoja de Excel
    worksheet.columns = [
      { header: "Fecha-hora", key: "radicadoDate", width: 20 },
      { header: "Numero Radicado", key: "Id", width: 10 },
      { header: "Tipo Documento", key: "Tipo_de_documento", width: 20 },
      { header: "Nombre Paciente", key: "Nombre_del_paciente", width: 30 },
      { header: "Número Documento", key: "Numero_documento", width: 30 },
      { header: "Número Celular", key: "Telefono_celular", width: 20 },
      { header: "Telefono Fijo", key: "Telefono_fijo", width: 20 },
      { header: "Email", key: "Correo_electronico", width: 30 },
      { header: "Direccion", key: "Direccion", width: 30 },
      { header: "Convenio", key: "Convenio", width: 20 },
      { header: "IPS Primaria", key: "IPS_Primaria", width: 20 },
      { header: "Fecha Orden", key: "Fecha_de_orden", width: 20 },
      { header: "Lugar Radicación", key: "Lugar_de_radicacion", width: 30 },
      { header: "IPS Remite", key: "IPS_Remitente", width: 30 },
      { header: "Profesional", key: "Profesional", width: 30 },
      { header: "Especialidad", key: "Especialidad", width: 30 },
      { header: "Cod Diagnostico", key: "codigo_diagnostico", width: 20 },
      {
        header: "Descripcion Diagnostico",
        key: "descripcion_diagnostico",
        width: 30,
      },
      { header: "Grupo Servicio", key: "Grupo_de_servicios", width: 20 },
      { header: "Tipo Servicio", key: "Servicios", width: 20 },
      { header: "Auxiliar Radicador", key: "Radicador", width: 20 },
      { header: "Nombre Auditora", key: "Auditora", width: 20 },
      { header: "Fecha Auditoria", key: "Fecha_de_auditoria", width: 20 },
      { header: "Codigo CUPS", key: "Codigo_cups", width: 30 },
      { header: "Descripcion CUPS", key: "Descripcion_cups", width: 30 },
      { header: "Estado CUPS", key: "Estado_cups", width: 20 },
      { header: "Unidad Funcional", key: "Unidad_funcional", width: 30 },
      {
        header: "Ultima Modificacion",
        key: "Fecha_actualizacion",
        width: 20,
      },
      {
        header: "Seguimiento Auxiliar",
        key: "Observacion_seguimiento_auxiliar",
        width: 30,
      },
      // {
      //   header: "Fecha Seguimiento",
      //   key: "Fecha_registro",
      //   width: 20,
      // },
    ];

    data.forEach((data) => {
      const row = {
        radicadoDate: data.createdAt || "N/A",
        Id: data.id || "N/A",
        Tipo_de_documento: data.patientRelation?.documentRelation.name || "N/A",
        Nombre_del_paciente: data.patientRelation?.name || "N/A",
        Numero_documento: data.patientRelation?.documentNumber || "N/A",
        Telefono_celular: data.patientRelation?.phoneNumber || "N/A",
        Telefono_fijo: data.patientRelation?.landline || "N/A",
        Correo_electronico: data.patientRelation?.email || "N/A",
        Direccion: data.patientRelation?.address || "N/A",
        Convenio: data.patientRelation?.convenioRelation.name || "N/A",
        IPS_Primaria: data.patientRelation?.ipsPrimariaRelation.name || "N/A",
        Fecha_de_orden: data.orderDate || "N/A",
        Lugar_de_radicacion: data.placeRelation?.name || "N/A",
        IPS_Remitente: data.ipsRemiteRelation?.name || "N/A",
        Profesional: data.idProfesional === null ? data.profetional : data.profesionalesRelation?.name,
        Especialidad: data.specialtyRelation?.name || "N/A",
        codigo_diagnostico: data.diagnosticoRelation?.code || "N/A",
        descripcion_diagnostico: data.diagnosticoRelation?.description || "N/A",
        Grupo_de_servicios: data.servicesGroupRelation?.name || "N/A",
        Servicios: data.servicesRelation?.name || "N/A",
        Radicador: data.usuarioRelation?.name || "N/A",
        Auditora: data.auditora || "N/A",
        Fecha_de_auditoria: data.auditDate || "N/A",
      };

      // * agregar filas por cada CUPS
      if (data.cupsRadicadosRelation?.length > 0) {
        data.cupsRadicadosRelation.forEach((cups) => {
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

          worksheet.addRow({
            ...row,
            Codigo_cups: cups.code || "N/A",
            Descripcion_cups: cups.DescriptionCode || "N/A",
            Estado_cups: cups.statusRelation?.name || "N/A",
            Unidad_funcional: cups.functionalUnitRelation?.name || "N/A",
            Fecha_actualizacion: cups.updatedAt || "N/A",
            Observacion_seguimiento_auxiliar: observations,
          });
        });
      } else {
        worksheet.addRow(row);
      }

      // * agregar filas por cada seguimiento auxiliar de CUPS radicacion
      // if (data.cupsRadicadosRelation.length > 0) {
      //   data.cupsRadicadosRelation.forEach((cups) => {
      //     if (cups.seguimientoAuxiliarRelation?.length > 0) {
      //       cups.seguimientoAuxiliarRelation.forEach((seguimiento) => {
      //         worksheet.addRow({
      //           ...row,
      //           Observacion_seguimiento_auxiliar: seguimiento.observation || "N/A",
      //           Fecha_registro: seguimiento.createdAt || "N/A",
      //         });
      //       });
      //     }
      //   });
      // }
    });

    // Configurar respuesta
    const fileName = `Reporte_CUPS_${randomBytes(4).toString("hex")}.xlsx`;
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    next(error);
  }
}

export async function reporteGestionAuxiliar(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { dateStart, dateEnd } = req.body;

    const query = await Radicacion.createQueryBuilder("radicacion")
      .leftJoinAndSelect("radicacion.patientRelation", "pacientes")
      .leftJoinAndSelect("radicacion.cupsRadicadosRelation", "cups")
      .leftJoinAndSelect(
        "cups.seguimientoAuxiliarRelation",
        "seguimiento_auxiliar"
      )
      .leftJoinAndSelect(
        "seguimiento_auxiliar.estadoSeguimientoRelation",
        "estado_seguimiento"
      )
      .leftJoinAndSelect("seguimiento_auxiliar.usuarioRelation", "usuario")
      .orderBy("radicacion.createdAt", "DESC");

    // Aplicar filtro de fechas si se proporcionan
    if (dateStart && dateEnd) {
      query.andWhere("radicacion.createdAt BETWEEN :dateStart AND :dateEnd", {
        dateStart,
        dateEnd,
      });
    }

    const data = await query.getMany();

    // Crear workbook y worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Reporte Gestion Auxiliar");

    // Definir columnas
    worksheet.columns = [
      { header: "ID Radicado", key: "id_radicado", width: 15 },
      { header: "Fecha-hora", key: "radicadoDate", width: 20 },
      { header: "Número Documento", key: "numero_documento", width: 20 },
      { header: "Nombre Paciente", key: "nombre_paciente", width: 30 },
      { header: "Código CUPS", key: "codigo_cups", width: 15 },
      { header: "Descripción CUPS", key: "descripcion_cups", width: 40 },
      { header: "Estado Gestión", key: "estado_gestion", width: 20 },
      { header: "Observación", key: "observacion", width: 30 },
      { header: "Fecha Registro", key: "fecha_registro", width: 20 },
      { header: "Usuario Registro", key: "usuario_registro", width: 20 },
    ];

    // Agregar datos
    data.forEach((radicado) => {
      if (radicado.cupsRadicadosRelation.length > 0) {
        radicado.cupsRadicadosRelation.forEach((cups) => {
          if (cups.seguimientoAuxiliarRelation?.length > 0) {
            cups.seguimientoAuxiliarRelation.forEach((seguimiento) => {
              worksheet.addRow({
                id_radicado: radicado.id,
                radicadoDate: radicado.createdAt || "N/A",
                numero_documento:
                  radicado.patientRelation?.documentNumber || "N/A",
                nombre_paciente: radicado.patientRelation?.name || "N/A",
                codigo_cups: cups.code || "N/A",
                descripcion_cups: cups.DescriptionCode || "N/A",
                estado_gestion:
                  seguimiento.estadoSeguimientoRelation?.name || "N/A",
                observacion: seguimiento.observation || "N/A",
                fecha_registro: seguimiento.createdAt || "N/A",
                usuario_registro: seguimiento.usuarioRelation?.name || "N/A",
              });
            });
          }
        });
      }
    });

    // Configurar respuesta
    const fileName = `Reporte_Gestion_Auxiliar_${randomBytes(4).toString(
      "hex"
    )}.xlsx`;
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    next(error);
  }
}

// controlador para reporte de pausas activas.
export async function getReportBreakesActive(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { dateStart, dateEnd } = req.body;

    const query = await PausasActivas.createQueryBuilder("pausas_activas")
      .leftJoinAndSelect("pausas_activas.userRelation", "usuario")
      .leftJoinAndSelect("usuario.sedeRelation", "sede")
      .orderBy("pausas_activas.createdAt", "DESC");

    // Aplicar filtro de fechas si se proporcionan
    if (dateStart && dateEnd) {
      query.andWhere(
        "pausas_activas.createdAt BETWEEN :dateStart AND :dateEnd",
        {
          dateStart,
          dateEnd,
        }
      );
    }

    const data = await query.getMany();

    // Crear workbook y worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Reporte Pausas Activas");

    // Definir columnas
    worksheet.columns = [
      { header: "Fecha Registro", key: "fecha_creacion", width: 20 },
      { header: "Número Documento", key: "numero_documento", width: 20 },
      { header: "Nombre del Usuario", key: "nombre_usuario", width: 30 },
      { header: "Apellidos", key: "apellidos_usuario", width: 30 },
      { header: "Área", key: "area", width: 20 },
      { header: "Cargo", key: "cargo", width: 20 },
      { header: "Sede", key: "sede", width: 20 },
      { header: "Observación", key: "observacion", width: 30 },
    ];

    // Agregar datos
    data.forEach((pausa) => {
      const fechaCreacion = pausa.createdAt
        ? formatInTimeZone(
            new Date(pausa.createdAt),
            "America/Bogota",
            "yyyy-MM-dd HH:mm:ss"
          )
        : "N/A";

      worksheet.addRow({
        fecha_creacion: fechaCreacion,
        observacion: pausa.observation || "N/A",
        nombre_usuario: pausa.userRelation?.name || "N/A",
        apellidos_usuario: pausa.userRelation?.lastName || "N/A",
        area: pausa.userRelation?.area || "N/A",
        cargo: pausa.userRelation?.position || "N/A",
        sede: pausa.userRelation?.sedeRelation?.name || "N/A",
        numero_documento: pausa.userRelation?.dniNumber || "N/A",
      });
    });

    // Configurar respuesta
    const fileName = `Reporte_Pausas_Activas_${randomBytes(4).toString(
      "hex"
    )}.xlsx`;
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    next(error);
  }
}

// controlador reporte registios biometricos
export async function getReportBiometric(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { dateStart, dateEnd } = req.body;

    const query = await RegistroEntrada.createQueryBuilder("registro_entrada")
      .leftJoinAndSelect("registro_entrada.userRelation", "usuario")
      .leftJoinAndSelect("registro_entrada.sedeRelation", "sede")
      .orderBy("registro_entrada.createdAt", "DESC");

    if (dateStart && dateEnd) {
      query.andWhere(
        "registro_entrada.registerDate BETWEEN :dateStart AND :dateEnd",
        { dateStart, dateEnd }
      );
    }

    query.orderBy("registro_entrada.registerDate", "DESC");
    const data = await query.getMany();

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Repore Registros Biometricos");

    worksheet.columns = [
      { header: "Numero Documento", key: "numero_documento", width: 20 },
      { header: "Nombre Usuario", key: "nombre_usuario", width: 30 },
      { header: "Apellidos", key: "apellidos", width: 30 },
      { header: "Fecha Registro", key: "fecha_registro", width: 20 },
      { header: "Hora Registro", key: "hora_registro", width: 20 },
      { header: "Sede", key: "sede", width: 20 },
    ];

    data.forEach((r) => {
      const fechaRegistro = r.registerDate
        ? formatInTimeZone(
            new Date(r.registerDate),
            "America/Bogota",
            "yyyy-MM-dd"
          )
        : "N/A";

      worksheet.addRow({
        numero_documento: r.userRelation?.dniNumber || "N/A",
        nombre_usuario: r.userRelation?.name || "N/A",
        apellidos: r.userRelation?.lastName || "N/A",
        fecha_registro: fechaRegistro,
        hora_registro: r.hourRegister || "N/A",
        sede: r.sedeRelation?.name || "N/A",
      });
    });

    const fileName = `Reporte_Registros_Biometricos_${randomBytes(4).toString(
      "hex"
    )}.xlsx`;
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    next(error);
  }
}

// * reporte excel de tickets mesa de ayuda
export async function getReportTickets(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { dateStart, dateEnd } = req.body;

    const query = await Tickets.createQueryBuilder("tickets")
      .leftJoinAndSelect("tickets.categoryRelation", "categoria")
      .leftJoinAndSelect("tickets.userRelation", "usuario")
      .leftJoinAndSelect("usuario.sedeRelation", "sede")
      .leftJoinAndSelect("tickets.statusRelation", "estado")
      .leftJoinAndSelect("tickets.priorityRelation", "prioridad")
      .leftJoinAndSelect("tickets.commentRelation", "comentarios")
      .leftJoinAndSelect("comentarios.userRelation", "usuario_responsdedor")
      .leftJoinAndSelect("tickets.surveyRelation", "encuesta")
      .orderBy("tickets.createdAt", "DESC");

    if (dateStart && dateEnd) {
      query.where("tickets.createdAt BETWEEN :dateStart AND :dateEnd", {
        dateStart,
        dateEnd,
      });
    }

    const data = await query.getMany();

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Reporte Tickets Mesa de Ayuda");

    worksheet.columns = [
      { header: "Fecha Registro", key: "fecha_registro", width: 20 },
      { header: "Descripcion", key: "descripcion", width: 30 },
      { header: "Categoria", key: "categoria", width: 20 },
      { header: "Titulo", key: "titulo", width: 30 },
      { header: "Usuario Solicitante", key: "usuario_solicitante", width: 30 },
      { header: "Sede Solicitante", key: "sede_solicitante", width: 20 },
      { header: "Usuario Respondedor", key: "usuario_responsable", width: 30 },
      { header: "Ultimo Estado", key: "ultimo_estado", width: 20 },
      { header: "Ultimo Comentario", key: "ultimo_comentario", width: 30 },
      {
        header: "Fecha Ultimo Comentario",
        key: "fecha_ultimo_comentario",
        width: 20,
      },
    ];

    if (!data || data.length === 0) {
      return res
        .status(404)
        .json({
          message:
            "No se encontraron tickets en el rango de fechas especificado.",
        });
    }
    
    data.forEach((t) => {
      const rows = {
        fecha_registro: t.createdAt
          ? formatInTimeZone(
              new Date(t.createdAt),
              "America/Bogota",
              "yyyy-MM-dd HH:mm:ss"
            )
          : "N/A",
        descripcion: t.description || "N/A",
        categoria: t.categoryRelation?.name || "N/A",
        titulo: t.title || "N/A",
        usuario_solicitante:
          `${t.userRelation?.name} ${t.userRelation.lastName}` || "N/A",
        sede_solicitante: t.userRelation?.sedeRelation?.name || "N/A",
        usuario_responsable:
          t.commentRelation?.length > 0
            ? `${t.commentRelation[0]?.userRelation?.name || ""} ${
                t.commentRelation[0]?.userRelation?.lastName || ""
              }`
            : "N/A",
        ultimo_estado: t.statusRelation?.name || "N/A",
        ultimo_comentario:
          t.commentRelation?.length > 0
            ? t.commentRelation[t.commentRelation.length - 1]?.comment || "N/A"
            : "N/A",
        fecha_ultimo_comentario:
          t.commentRelation?.length > 0
            ? formatInTimeZone(
                new Date(
                  t.commentRelation[t.commentRelation.length - 1]?.createdAt
                ),
                "America/Bogota",
                "yyyy-MM-dd HH:mm:ss"
              )
            : "N/A",
      };

      worksheet.addRow({
        ...rows,
      });
    });

    const fileName = `Reporte_Tickets_Mesa_Ayuda_${randomBytes(4).toString(
      "hex"
    )}.xlsx`;

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);

    await workbook.xlsx.write(res);

    res.end();
  } catch (error) {
    next(error);
  }
}

export async function reportDemandInduced(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    
    const { dateStart, dateEnd, headquarter } = req.body;

    const rolUser = req.user?.rol;

    const query = await DemandaInducida.createQueryBuilder("demandas_inducidas")
      .leftJoinAndSelect("demandas_inducidas.pacienteRelation", "paciente")
      .leftJoinAndSelect("paciente.documentRelation", "tipo_documento")
      .leftJoinAndSelect("demandas_inducidas.elementoRelation", "elemento")
      .leftJoinAndSelect("demandas_inducidas.tipoRelation", "tipo_elemento")
      .leftJoinAndSelect("demandas_inducidas.objetivoRelation", "objetivo")
      .leftJoinAndSelect("demandas_inducidas.relacionRelation", "relacion_usuario")
      .leftJoinAndSelect("demandas_inducidas.areaEpsRelation", "area_eps")
      .leftJoinAndSelect("demandas_inducidas.resumenRelation", "resumen_seguimiento")
      .leftJoinAndSelect("demandas_inducidas.resultadoRelation", "resultado_llamada")
      .leftJoinAndSelect("demandas_inducidas.motivoRelation", "motivo")
      .leftJoinAndSelect("demandas_inducidas.areaPersonaRelation", "area_persona")
      .leftJoinAndSelect("demandas_inducidas.personaSeguimientoRelation", "usuario_seguimiento")
      .leftJoinAndSelect("demandas_inducidas.programaRelation", "programa")
      .orderBy("demandas_inducidas.createdAt", "ASC"); // <-- Aquí, ASC para más viejo a más reciente

    if (rolUser == 19)  {
      query.andWhere("demandas_inducidas.personaSeguimientoRelation = :userId", {
        userId: req.user?.id
      })
    }
    
    if (dateStart && dateEnd) {
      query.andWhere("demandas_inducidas.createdAt BETWEEN :start AND :end", {
      start: dateStart,
      end: dateEnd
      });
    }

    if (headquarter) {
      query.andWhere("usuario_seguimiento.headquarters = :headquarter", {
        headquarter
      });
    }

    const data = await query.getMany();

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Reporte Demandas Inducidas");

      // Definir las columnas base (sin headers para empezar)
      worksheet.columns = [
        { header: "", key: "tipo_documento", width: 20 },
        { header: "", key: "numero_identificacion", width: 20 },
        { header: "", key: "fecha_actividad", width: 20 },
        { header: "", key: "elemento_demanda", width: 30 },
        { header: "", key: "tipo_elemento", width: 30 },
        { header: "", key: "objetivo", width: 30 },
        { header: "", key: "numero_telefono_contacto", width: 20 },
        { header: "", key: "clasificacion_seguimiento", width: 30 },
        { header: "", key: "persona_recibe_llamada", width: 30 },
        { header: "", key: "relacion_usuario", width: 30 },
        { header: "", key: "fecha_llamada", width: 20 },
        { header: "", key: "hora_llamada", width: 20 },
        { header: "", key: "texto_llamada", width: 30 },
        { header: "", key: "barreras_acceso", width: 30 },
        { header: "", key: "area_dificultad", width: 30 },
        { header: "", key: "area_eps", width: 30 },
        { header: "", key: "resumen_actividades", width: 30 },
        { header: "", key: "condicion_final_usuario", width: 30 },
        { header: "", key: "soportes_recuperados", width: 30 },
        { header: "", key: "departamento", width: 20 },
        { header: "", key: "municipio", width: 20 },
        { header: "", key: "barrio_vereda", width: 20 },
        { header: "", key: "numero_telefono", width: 20 },
        { header: "", key: "correo_electronico", width: 30 },
        { header: "", key: "resultado_llamada", width: 30 },
        { header: "", key: "fecha_envio", width: 30 },
        { header: "", key: "hora_envio", width: 30 },
        { header: "", key: "texto_mensaje", width: 30 },
        { header: "", key: "fecha_visita", width: 30 },
        { header: "", key: "resumen_visita", width: 30 },
        { header: "", key: "motivo_visita_no_efectiva", width: 30 },
        { header: "", key: "persona_seguimiento", width: 30 },
        { header: "", key: "area_persona", width: 30 },
        { header: "", key: "programa", width: 30 },
        { header: "", key: "fecha_asignacion_cita", width: 30 },
      ];

      // Crear encabezados agrupados que abarcan 2 filas (filas 1 y 2)
      // Grupo 1: Demanda inducida (A1:F2)
      worksheet.mergeCells('A1:F2');
      worksheet.getCell('A1').value = 'DEMANDA INDUCIDA';
      worksheet.getCell('A1').alignment = { horizontal: 'center', vertical: 'middle' };
      worksheet.getCell('A1').font = { bold: true, color: { argb: 'FFFFFFFF' } };
      worksheet.getCell('A1').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '335C81' } };

      // Grupo 2: Llamada telefónica efectiva (G1:S2)
      worksheet.mergeCells('G1:S2');
      worksheet.getCell('G1').value = 'LLAMADA TELEFÓNICA EFECTIVA';
      worksheet.getCell('G1').alignment = { horizontal: 'center', vertical: 'middle' };
      worksheet.getCell('G1').font = { bold: true, color: { argb: 'FFFFFFFF' } };
      worksheet.getCell('G1').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '46B1C9' } };

      // Grupo 3: Actualización de datos de ubicación (T1:X2)
      worksheet.mergeCells('T1:X2');
      worksheet.getCell('T1').value = 'ACTUALIZACIÓN DE DATOS DE UBICACIÓN';
      worksheet.getCell('T1').alignment = { horizontal: 'center', vertical: 'middle' };
      worksheet.getCell('T1').font = { bold: true, color: { argb: 'FFFFFFFF' } };
      worksheet.getCell('T1').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '335C81' } };

      // Grupo 4: Llamada no efectiva (Y1:Y2)
      worksheet.mergeCells('Y1:Y2');
      worksheet.getCell('Y1').value = 'LLAMADA NO EFECTIVA';
      worksheet.getCell('Y1').alignment = { horizontal: 'center', vertical: 'middle' };
      worksheet.getCell('Y1').font = { bold: true, color: { argb: 'FFFFFFFF' } };
      worksheet.getCell('Y1').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '46B1C9' } };

      // Grupo 5: Mensaje de texto (Z1:AB2)
      worksheet.mergeCells('Z1:AB2');
      worksheet.getCell('Z1').value = 'MENSAJE DE TEXTO';
      worksheet.getCell('Z1').alignment = { horizontal: 'center', vertical: 'middle' };
      worksheet.getCell('Z1').font = { bold: true, color: { argb: 'FFFFFFFF' } };
      worksheet.getCell('Z1').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '335C81' } };

      // Grupo 6: Visita preventiva de salud (AC1:AD2)
      worksheet.mergeCells('AC1:AD2');
      worksheet.getCell('AC1').value = 'VISITA PREVENTIVA DE SALUD';
      worksheet.getCell('AC1').alignment = { horizontal: 'center', vertical: 'middle' };
      worksheet.getCell('AC1').font = { bold: true, color: { argb: 'FFFFFFFF' } };
      worksheet.getCell('AC1').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '46B1C9' } };

      // Grupo 7: Persona que realiza el seguimiento (AE1:AI2)
      worksheet.mergeCells('AE1:AI2');
      worksheet.getCell('AE1').value = 'PERSONA QUE REALIZA EL SEGUIMIENTO';
      worksheet.getCell('AE1').alignment = { horizontal: 'center', vertical: 'middle' };
      worksheet.getCell('AE1').font = { bold: true, color: { argb: 'FFFFFFFF' } };
      worksheet.getCell('AE1').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '335C81' } };

      // Agregar los encabezados específicos en la fila 3
      const headers = [
        'TIPO DOC',
        'NUMERO DOC', 
        'Fecha actividad DI',
        'Elemento DI',
        'Tipo elemento',
        'Objetivo',
        'Número de telefono con el que se establece el contacto',
        'Clasificación del seguimiento',
        'Persona que recibe la llamada',
        'Relación con el usuario',
        'Fecha de llamada',
        'hora de llamada',
        'Texto de la llamada',
        'Presenta barreras o dificultades para el acceso al tratamiento?',
        'Area con la que presenta la dificultad?',
        'Area de la EPS',
        'Resumen de las actividades realizadas durante el seguimiento',
        'Condición final usuario',
        'Soportes recuperados',
        'Departamento',
        'Municipio',
        'Barrio o vereda',
        'Número telefono',
        'Correo electronico',
        'Resultado de llamada',
        'Fecha de envío',
        'Hora de envío',
        'Texto del mensaje',
        'Fecha de visita',
        'Resumen de visita',
        'Motivo de visita no efectiva',
        'Persona que realiza el seguimiento',
        'Área',
        'Programa',
        'Fecha de asignacion de cita'
      ];

      headers.forEach((header, index) => {
        const cell = worksheet.getCell(3, index + 1);
        cell.value = header;
        cell.font = { bold: true };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'E0E1E9' } };
        cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      });

      // Ajustar altura de las filas de encabezado
      worksheet.getRow(1).height = 25;
      worksheet.getRow(2).height = 25;
      worksheet.getRow(3).height = 40;

      if (!data || data.length === 0) {
        return res.status(404).json({
          message: "Demand Induced Not Found.",
        });
      }

      data.forEach((d)=> {

        const row = {
          tipo_documento: d.pacienteRelation?.documentRelation?.name || "",
          numero_identificacion: d.pacienteRelation?.documentNumber || "",
          fecha_actividad: d.createdAt ? formatInTimeZone(
            new Date(d.createdAt),
            "America/Bogota",
            "dd/MM/yyyy HH:mm:ss"
          ) : "",
          elemento_demanda: d.elementoRelation?.name || "",
          tipo_elemento: d.tipoRelation?.name || "",
          objetivo: d.objetivoRelation?.name || "",
          numero_telefono_contacto: d.contactNumbers || "",
          clasificacion_seguimiento: d.clasificacion ? "Efectivo" : "No Efectivo",
          persona_recibe_llamada: d.personaRecibe || "",
          relacion_usuario: d.relacionRelation?.name || "",
          fecha_llamada: d.fechaLlamada ? formatInTimeZone(
            new Date(d.fechaLlamada),
            "America/Bogota",
            "dd/MM/yyyy"
          ) : "",
          hora_llamada: d.horaLlamada
            ? d.horaLlamada.slice(0, 5) // formato HH:mm
            : "",
          texto_llamada: d.textoLlamada || "",
          barreras_acceso: d.dificultadAcceso ? "Si" : "No",
          area_dificultad: d.areaDificultad || "",
          area_eps: d.areaEpsRelation?.name || "",
          resumen_actividades: d.resumenRelation?.name || "",
          // condicion_final_usuario: d.condicionPaciente ? "VIVO" : "MUERTO",
          soportes_recuperados: d.soporteRecuperados || "",
          departamento: "",
          municipio: "",
          barrio_vereda: "",
          numero_telefono: "",
          correo_electronico: "",
          resultado_llamada: d.resultadoRelation?.name || "",
          fecha_envio: d.fechaEnvio ? formatInTimeZone(
            new Date(d.fechaEnvio),
            "America/Bogota",
            "dd/MM/yyyy"
          ) : "",
          hora_envio: d.horaEnvio
            ? d.horaEnvio.slice(0, 5) // formato HH:mm
            : "",
          texto_mensaje: d.textEnvio || "",
          fecha_visita: d.fechaVisita ? formatInTimeZone(
            new Date(d.fechaVisita),
            "America/Bogota",
            "dd/MM/yyyy"
          ) : "",
          resumen_visita: d.resumenRelation?.name || "",
          motivo_visita_no_efectiva: d?.motivoRelation?.name || "",
          persona_seguimiento: d.personaSeguimientoRelation?.name || "",
          area_persona: d.areaPersonaRelation?.name || "",
          programa: d.programaRelation?.name || "",
          fecha_asignacion_cita: d.fechaCita ? formatInTimeZone(
            new Date(d.fechaCita),
            "America/Bogota",
            "dd/MM/yyyy"
          ) : "",
        }
        worksheet.addRow(row);
      });

      const fileName = `Reporte_Demandas_Inducidas_${randomBytes(4).toString(
        "hex"
      )}.xlsx`;

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);

      await workbook.xlsx.write(res);

      res.end();
  } catch (error) {
    next(error);
  }
}