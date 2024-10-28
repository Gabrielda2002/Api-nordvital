import { NextFunction, query, Request, Response } from "express";
import { Radicacion } from "../entities/radicacion";
import ExcelJS from "exceljs";
import { format } from "path";
import { randomBytes } from "crypto";
import { Cirugias } from "../entities/cirugias";

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
        Profesional: data.profetional || "N/A",
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

      // * agregar filas por cada seguimiento auxiliar
      if (data.cupsRadicadosRelation?.length > 0) {
        data.cupsRadicadosRelation.forEach((cups) => {
          if (cups.seguimientoAuxiliarRelation?.length > 0) {
            cups.seguimientoAuxiliarRelation.forEach((seguimiento) => {
              worksheet.addRow({
                ...row,
                Observacion_seguimiento_auxiliar: seguimiento.observation || "N/A",
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

// *  reporte excel con filtros de fecha e auditora, fecha de radicado y codigo cups

export async function downloadReportExcelFilter(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const {
      auditDateStart,
      auditDateEnd,
      radicadoDateStart,
      radicadoDateEnd,
      cupsCode,
    } = req.body;

    const query = await Radicacion.createQueryBuilder("radicacion")
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
        "radicacion.seguimientoAuxiliarRelation",
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
    if (radicadoDateStart && radicadoDateEnd) {
      query.andWhere(
        "radicacion.createdAt BETWEEN :radicadoDateStart AND :radicadoDateEnd",
        { radicadoDateStart, radicadoDateEnd }
      );
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
      { header: "Código Diagnóstico", key: "Codigo_diagnostico", width: 20 },
      {
        header: "Descripción Diagnóstico",
        key: "Descripcion_diagnostico",
        width: 30,
      },
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
        Profesional: data.profetional || "N/A",
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

      // * agregar filas por cada seguimiento auxiliar
      if (data.cupsRadicadosRelation?.length > 0) {
        data.cupsRadicadosRelation.forEach((cups) => {
          if (cups.seguimientoAuxiliarRelation?.length > 0) {
            cups.seguimientoAuxiliarRelation.forEach((seguimiento) => {
              worksheet.addRow({
                ...row,
                Observacion_seguimiento_auxiliar: seguimiento.observation || "N/A",
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


export async function reportExcelCirugias(req: Request, res: Response, next: NextFunction){
  try {
    
    const dataCirugias = await Cirugias.createQueryBuilder("cirugias")
    .leftJoinAndSelect("cirugias.ipsRemiteRelation", "ipsRemite")
    .leftJoinAndSelect("cirugias.radicacionRelation", "radicacion")
    .leftJoinAndSelect("cirugias.gestionCirugiasRelation", "gestionCirugias")
    .leftJoinAndSelect("gestionCirugias.estadoSeguimientoRelation", "estadoSeguimiento")
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
      { header: "Fecha anesteciologia", key: "fecha_anesteciologia", width: 30 },
      { header: "Estado", key: "Estado", width: 20 },
      { header: "Observaciones", key: "Observaciones", width: 30 },
      { header: "Fecha de Registro", key: "Fecha_registro", width: 20 },
    ];

    dataCirugias.forEach((data) => {
      const row = {
        Fecha_ordenamiento: data.orderingDate || "N/A",
        Fecha_cirugia: data.surgeryDate || "N/A",
        Hora_programada: data.scheduledTime || "N/A",
        IPS_Remitente: data.ipsRemiteRelation?.name || "N/A",
        Observaciones: data.observation || "N/A",
        diagnostico_name: data.radicacionRelation?.diagnosticoRelation.description || "N/A",
        diagnostico_code: data.radicacionRelation?.diagnosticoRelation.code || "N/A",
        especialista: data.specialist || "N/A",
        fecha_paraclinico: data.paraclinicalDate || "N/A",
        fecha_anesteciologia: data.anesthesiologyDate || "N/A",
      }
      
      // agregar gilas por cada cups
      if (data.radicacionRelation?.cupsRadicadosRelation?.length > 0) {
        data.radicacionRelation?.cupsRadicadosRelation.forEach((cups) => {
          worksheet.addRow({
            ...row,
            Codigo_cups: cups.code || "N/A",
            Descripcion_cups: cups.DescriptionCode || "N/A",
          });
        });
      }else {
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
      



    })


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
export async function reportExcelCirugiasFiltros(req: Request, res: Response, next: NextFunction){
  try {
    
    const { fechaOrdenamientoStart, fechaOrdenamientoEnd   } = req.body;

    const query = await Cirugias.createQueryBuilder("cirugias")
    .leftJoinAndSelect("cirugias.ipsRemiteRelation", "ipsRemite")
    .leftJoinAndSelect("cirugias.radicacionRelation", "radicacion")
    .leftJoinAndSelect("cirugias.gestionCirugiasRelation", "gestionCirugias")
    .leftJoinAndSelect("gestionCirugias.estadoSeguimientoRelation", "estadoSeguimiento")
    .leftJoinAndSelect("radicacion.cupsRadicadosRelation", "cups")
    .leftJoinAndSelect("radicacion.diagnosticoRelation", "diagnostico")
    
    if (fechaOrdenamientoStart && fechaOrdenamientoEnd) {
      query.andWhere("cirugias.orderingDate BETWEEN :dateStart AND :dateEnd", {      dateStart: fechaOrdenamientoStart, dateEnd: fechaOrdenamientoEnd });
    }else{
      return res.status(400).json({ message: "Debe enviar la fecha de ordenamiento" });
    }

    query.orderBy("cirugias.orderingDate", "DESC");

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
      { header: "Fecha anesteciologia", key: "fecha_anesteciologia", width: 30 },
      { header: "Fecha paraclinico", key: "fecha_paraclinico", width: 30 },
      { header: "Codigo CUPS", key: "Codigo_cups", width: 30 },
      { header: "Descripcion CUPS", key: "Descripcion_cups", width: 30 },
      { header: "Observacion Gestion", key: "Observacionesgestion", width: 30 },
      { header: "Estado", key: "Estado", width: 20 },
      { header: "Fecha de Registro", key: "Fecha_registro", width: 20 },
    ];

    dataCirugias.forEach((data) => {
      const row = {
        Fecha_ordenamiento: data.orderingDate || "N/A",
        Fecha_cirugia: data.surgeryDate || "N/A",
        Hora_programada: data.scheduledTime || "N/A",
        IPS_Remitente: data.ipsRemiteRelation?.name || "N/A",
        Observaciones: data.observation || "N/A",
        diagnostico_name: data.radicacionRelation?.diagnosticoRelation.description || "N/A",
        diagnostico_code: data.radicacionRelation?.diagnosticoRelation.code || "N/A",
        especialista: data.specialist || "N/A",
        fecha_paraclinico: data.paraclinicalDate || "N/A",
        fecha_anesteciologia: data.anesthesiologyDate || "N/A",
      }
      
      // agregar gilas por cada cups
      if (data.radicacionRelation?.cupsRadicadosRelation?.length > 0) {
        data.radicacionRelation?.cupsRadicadosRelation.forEach((cups) => {
          worksheet.addRow({
            ...row,
            Codigo_cups: cups.code || "N/A",
            Descripcion_cups: cups.DescriptionCode || "N/A",
          });
        });
      }else {
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
      



    })


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