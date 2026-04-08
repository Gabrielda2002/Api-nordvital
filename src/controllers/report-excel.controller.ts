import { NextFunction, Request, Response } from "express";
import ExcelJS from "exceljs";
import { randomBytes } from "crypto";
import { BadRequestError, NotFoundError } from "@core/utils/custom-errors";
import { getReportRadicacionRows } from "../services/report-radicacion.service";
import { getReportSurgerysRows } from "../modules/surgeries/services/report-surgerys.service";
import { getReportAssistantsRows } from "../services/report-assistants.service";
import { getReportBreakesActiveRows } from "../services/report-breakes-active.service";
import { getReportBiometricRows } from "../services/report-biometric.service";
import { getReportTicketsRows } from "../modules/tickets/services/report-tickets.service";
import { getReportDemandInducedRows } from "../services/report-demand-induced.service";
import { getReportEquipmentsRows } from "../services/report-equipments.service";
import { getReportRedDeviceRows } from "../services/report-red-device.service";
import { getReportGeneralInventoryRows } from "../services/report-general-inventory.service";
import { getReportTVRows } from "../services/report-tv.service";
import { getReportPhonesRows } from "../services/report-phones.service";

// ? reporte cirugias con filtros de Fecha_ordenamiento
export async function getReportSurgerys(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { dateStart, dateEnd } = req.body;

    if (!dateStart || !dateEnd) {
      throw new BadRequestError("Debe enviar la fecha de ordenamiento");
    }

    const rows = await getReportSurgerysRows({ dateStart, dateEnd });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Reporte Cirugias");

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

    rows.forEach((row) => worksheet.addRow(row));

    const randomStr = randomBytes(4).toString("hex");
    const fileName = `Reporte_Cirugias_${randomStr}.xlsx`;

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
// ? preview JSON del reporte de radicación (mismos filtros que Excel)
export async function previewReportServices(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { statusCups, dateStart, dateEnd, cupsCode, specialty } = req.body;
    const data = await getReportRadicacionRows({
      statusCups,
      dateStart,
      dateEnd,
      cupsCode,
      specialty
    }, 20);
    res.status(200).json({ total: data.length ,data });
  } catch (error) {
    next(error);
  }
}

// ? controlador para reporte de servicios (Excel)
export async function getReportServices(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { statusCups, dateStart, dateEnd, cupsCode, specialty } = req.body;

    const rows = await getReportRadicacionRows({
      statusCups,
      dateStart,
      dateEnd,
      cupsCode,
      specialty,
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Reporte CUPS");

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
    ];

    rows.forEach((row) => worksheet.addRow(row));

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
// ? controlador para reporte de asistentes
export async function getReportAssistants(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { dateStart, dateEnd } = req.body;

    const rows = await getReportAssistantsRows({ dateStart, dateEnd });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Reporte Gestion Auxiliar");

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

    rows.forEach((row) => worksheet.addRow(row));

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

// ? controlador para reporte de pausas activas.
export async function getReportBreakesActive(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { dateStart, dateEnd } = req.body;

    const rows = await getReportBreakesActiveRows({ dateStart, dateEnd });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Reporte Pausas Activas");

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

    rows.forEach((row) => worksheet.addRow(row));

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

// ? controlador reporte registios biometricos
export async function getReportBiometric(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { dateStart, dateEnd } = req.body;

    const rows = await getReportBiometricRows({ dateStart, dateEnd });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Repore Registros Biometricos");

    worksheet.columns = [
      { header: "Numero Documento", key: "numero_documento", width: 20 },
      { header: "Nombre Usuario", key: "nombre_usuario", width: 30 },
      { header: "Apellidos", key: "apellidos", width: 30 },
      { header: "Fecha Registro", key: "fecha_registro", width: 20 },
      { header: "Hora Registro", key: "hora_registro", width: 20 },
      { header: "Sede", key: "sede", width: 20 },
      { header: "Area", key: "area", width: 20 },
    ];

    rows.forEach((row) => worksheet.addRow(row));

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

// ? reporte excel de tickets mesa de ayuda
export async function getReportTickets(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { dateStart, dateEnd } = req.body;

    const rows = await getReportTicketsRows({ dateStart, dateEnd });

    if (!rows || rows.length === 0) {
      throw new NotFoundError(
        "No se encontraron tickets en el rango de fechas especificado"
      );
    }

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

    rows.forEach((row) => worksheet.addRow(row));

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
// ? reporte excel de demandas inducidas
export async function getReportDemandInduced(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {

    const { dateStart, dateEnd, headquarter, convenio  } = req.body;

    const rolUser = req.user?.rol;

    const data = await getReportDemandInducedRows({
      dateStart,
      dateEnd,
      headquarter,
      convenio,
      rolUser,
      userId: req.user?.id
    });

    if (!data || data.length === 0) {
      return res.status(404).json({
        "message": "Demanda inducida no encontrada.",
      });
    }

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
      { header: "", key: "Profesional", width: 30 },
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
    worksheet.mergeCells('AE1:AJ2');
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
      'Fecha de asignacion de cita',
      'Profesional'
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

    data.forEach((row) => {
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

// ? reporte excel de inventario de equipos
export async function getReportEquipments(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {

    const { dateStart, dateEnd } = req.body;

    const data = await getReportEquipmentsRows({ dateStart, dateEnd });

    if (!data || data.length === 0) {
      return res.status(404).json({
        message: "Inventory Equipments Not Found.",
      });
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Inventario Equipos");

    worksheet.columns = [
      { header: "", key: "headquarters", width: 20 },
      { header: "", key: "name", width: 30 },
      { header: "", key: "typeEquipment", width: 20 },
      { header: "", key: "brand", width: 20 },
      { header: "", key: "model", width: 20 },
      { header: "", key: "serial", width: 30 },
      { header: "", key: "systemOperating", width: 30 },
      { header: "", key: "mac", width: 30 },
      { header: "", key: "purchaseDate", width: 30 },
      { header: "", key: "warrantyTime", width: 30 },
      { header: "", key: "warranty", width: 30 },
      { header: "", key: "deliveryDate", width: 30 },
      { header: "", key: "inventoryNumber", width: 30 },
      { header: "", key: "dateCreated", width: 30 },
      { header: "", key: "dateUpdate", width: 30 },
      { header: "", key: "dhcp", width: 20 },
      { header: "", key: "ipAddress", width: 30 },
      { header: "", key: "userResponsable", width: 30 },
      { header: "", key: "lock", width: 20 },
      { header: "", key: "lockPassword", width: 30 },
      { header: "", key: "peripheralsName", width: 30 },
      { header: "", key: "peripheralsBrand", width: 30 },
      { header: "", key: "peripheralsModel", width: 30 },
      { header: "", key: "peripheralsSerial", width: 30 },
      { header: "", key: "peripheralsOtherData", width: 30 },
      { header: "", key: "peripheralsStatus", width: 30 },
      { header: "", key: "peripheralsInventoryNumber", width: 30 },
      { header: "", key: "peripheralsDateCreated", width: 30 },
      { header: "", key: "peripheralsDateUpdate", width: 30 },
      { header: "", key: "softwareName", width: 30 },
      { header: "", key: "softwareVersion", width: 30 },
      { header: "", key: "softwareLicense", width: 30 },
      { header: "", key: "softwareOtherData", width: 30 },
      { header: "", key: "softwareInstallationDate", width: 30 },
      { header: "", key: "softwareStatus", width: 30 },
      { header: "", key: "softwareDateCreated", width: 30 },
      { header: "", key: "softwareDateUpdated", width: 30 },
      { header: "", key: "componentName", width: 30 },
      { header: "", key: "componentBrand", width: 30 },
      { header: "", key: "componentCapacity", width: 30 },
      { header: "", key: "componentSpeed", width: 30 },
      { header: "", key: "componentOtherData", width: 30 },
      { header: "", key: "componentModel", width: 30 },
      { header: "", key: "componentDateCreated", width: 30 },
      { header: "", key: "componentDateUpdated", width: 30 }
    ]

    worksheet.mergeCells('A1:T2');
    worksheet.getCell('A1').value = 'DATOS DEL EQUIPO';
    worksheet.getCell("A1").alignment = { horizontal: 'center', vertical: 'middle' };
    worksheet.getCell('A1').font = { bold: true, color: { argb: 'FFFFFFFF' } };
    worksheet.getCell('A1').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '335C81' } };

    // Merge cells for peripherals columns (T1:AC2)
    worksheet.mergeCells('U1:AC2');
    worksheet.getCell('U1').value = 'DATOS DE PERIFÉRICOS';
    worksheet.getCell('U1').alignment = { horizontal: 'center', vertical: 'middle' };
    worksheet.getCell('U1').font = { bold: true, color: { argb: 'FFFFFFFF' } };
    worksheet.getCell('U1').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '335C81' } };

    // merge cells for software columns (AD1:AK2)
    worksheet.mergeCells('AD1:AK2');
    worksheet.getCell('AD1').value = 'DATOS DE SOFTWARE';
    worksheet.getCell('AD1').alignment = { horizontal: 'center', vertical: 'middle' };
    worksheet.getCell('AD1').font = { bold: true, color: { argb: 'FFFFFFFF' } };
    worksheet.getCell('AD1').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '335C81' } };

    // merge cells for components (AL1:AS2)
    worksheet.mergeCells('AL1:AS2');
    worksheet.getCell('AL1').value = 'DATOS DE COMPONENTES';
    worksheet.getCell('AL1').alignment = { horizontal: 'center', vertical: 'middle' };
    worksheet.getCell('AL1').font = { bold: true, color: { argb: 'FFFFFFFF' } };
    worksheet.getCell('AL1').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '335C81' } };

    const headers = [
      "SEDE",
      "NOMBRE EQUIPO",
      "TIPO EQUIPO",
      "MARCA",
      "MODELO",
      "SERIAL",
      "SISTEMA OPERATIVO",
      "MAC",
      "FECHA DE COMPRA",
      "TIEMPO DE GARANTIA",
      "GARANTIA",
      "FECHA DE ENTREGA",
      "NUMERO DE INVENTARIO",
      "FECHA DE CREACION",
      "FECHA DE ACTUALIZACION",
      "DHCP",
      "DIRECCION IP",
      "USUARIO RESPONSABLE",
      "BLOQUEO",
      "CONTRASENA DE BLOQUEO",
      "NOMBRE PERIFERICO",
      "MARCA PERIFERICO",
      "MODELO PERIFERICO",
      "SERIAL PERIFERICO",
      "OTROS DATOS PERIFERICO",
      "ESTADO PERIFERICO",
      "NUMERO INVENTARIO PERIFERICO",
      "FECHA DE REGISTRO PERIFERICO",
      "FECHA DE ULTIMA ACTUALIZACION PERIFERICO",
      "NOMBRE SOFTWARE",
      "VERSION SOFTWARE",
      "LICENCIA SOFTWARE",
      "OTROS DATOS SOFTWARE",
      "FECHA DE INSTALACION SOFTWARE",
      "ESTADO SOFTWARE",
      "FECHA DE REGISTRO SOFTWARE",
      "FECHA DE ULTIMA ACTUALIZACION SOFTWARE",
      "NOMBRE COMPONENTE",
      "MARCA COMPONENTE",
      "CAPACIDAD COMPONENTE",
      "VELOCIDAD COMPONENTE",
      "OTROS DATOS COMPONENTE",
      "MODELO COMPONENTE",
      "FECHA DE REGISTRO COMPONENTE",
      "FECHA DE ULTIMA ACTUALIZACION COMPONENTE",
    ]

    headers.forEach((header, index) => {
      const cell = worksheet.getCell(3, index + 1);
      cell.value = header;
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '335C81' } };
    })

    worksheet.getRow(1).height = 25;
    worksheet.getRow(2).height = 25;

    data.forEach((row) => {
      worksheet.addRow(row);
    });

    const fileName = `inventory_report_${Date.now()}.xlsx`;
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    )
    res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);

    await workbook.xlsx.write(res);
    res.end();

  } catch (error) {
    next(error);
  }
}


// ? reporte dispositivos red
export async function getReportRedDevice(req: Request, res: Response, next: NextFunction) {
  try {

    const { dateStart, dateEnd } = req.body;

    const data = await getReportRedDeviceRows({ dateStart, dateEnd });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Dispositivos de Red");

    // Agregar encabezados
    worksheet.columns = [
      { header: "", key: "createdAt", width: 20 },
      { header: "", key: "name", width: 30 },
      { header: "", key: "brand", width: 20 },
      { header: "", key: "model", width: 20 },
      { header: "", key: "serial", width: 20 },
      { header: "", key: "addressIp", width: 20 },
      { header: "", key: "mac", width: 20 },
      { header: "", key: "otherData", width: 30 },
      { header: "", key: "status", width: 15 },
      { header: "", key: "headquarters", width: 20 },
      { header: "", key: "inventoryNumber", width: 20 },
      { header: "", key: "updatedAt", width: 20 },
    ];

    const headers = [
      "Fecha de Creación",
      "Nombre",
      "Marca",
      "Modelo",
      "Serial",
      "Dirección IP",
      "MAC",
      "Otros Datos",
      "Estado",
      "Sede",
      "Número de Inventario",
      "Fecha de Actualización",
    ];

    headers.forEach((header, index) => {
      const cell = worksheet.getCell(3, index + 1);
      cell.value = header;
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '335C81' } };
    });

    if (data.length === 0) {
      worksheet.getCell("A4").value = "No hay datos disponibles";
      worksheet.getCell("A4").style = {
        font: { bold: true },
        alignment: { horizontal: "center", vertical: "middle" },
      };
    }

    // Agregar datos
    data.forEach((row) => {
      worksheet.addRow(row);
    });

    const fileName = `report_dispositivos_red_${Date.now()}.xlsx`;

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

// ? reporte inventario general
export async function getReportGeneralInventory(req: Request, res: Response, next: NextFunction) {
  try {

    const { dateStart, dateEnd } = req.body;

    const data = await getReportGeneralInventoryRows({ dateStart, dateEnd });

    const workbook = new ExcelJS.Workbook();
    const workSheet = workbook.addWorksheet("Inventario General");

    workSheet.columns = [
      { header: "", key: "createdAt", width: 20 },
      { header: "", key: "name", width: 30 },
      { header: "", key: "classification", width: 30 },
      { header: "", key: "asset", width: 30 },
      { header: "", key: "material", width: 30 },
      { header: "", key: "status", width: 20 },
      { header: "", key: "responsible", width: 30 },
      { header: "", key: "areaType", width: 30 },
      { header: "", key: "dependencyArea", width: 30 },
      { header: "", key: "assetType", width: 30 },
      { header: "", key: "headquarters", width: 30 },
      { header: "", key: "brand", width: 20 },
      { header: "", key: "model", width: 20 },
      { header: "", key: "serial", width: 30 },
      { header: "", key: "location", width: 30 },
      { header: "", key: "inventoryNumber", width: 30 },
      { header: "", key: "quantity", width: 30 },
      { header: "", key: "otherData", width: 50 },
      { header: "", key: "acquisitionDate", width: 50 },
      { header: "", key: "purchaseValue", width: 50 },
      { header: "", key: "warranty", width: 50 },
      { header: "", key: "warrantyPeriod", width: 50 },
      { header: "", key: "dateUpdate", width: 20 },
    ];

    const headers = [
      "Fecha de creación",
      "Clasificación",
      "Activo",
      "Material",
      "Estado",
      "Responsable",
      "Tipo de área",
      "Área de dependencia",
      "Tipo de activo",
      "Sede",
      "Nombre",
      "Marca",
      "Modelo",
      "Número de serie",
      "Ubicación",
      "Número de inventario",
      "Cantidad",
      "Otros datos",
      "Fecha de adquisición",
      "Valor de compra",
      "Garantía",
      "Período de garantía",
      "Fecha de actualización",
    ];

    headers.forEach((header, index) => {
      const cell = workSheet.getCell(`${String.fromCharCode(65 + index)}1`);
      cell.value = header;
      cell.font = { bold: true };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '335C81' } };
    });

    if (!data || data.length === 0) {
      workSheet.getCell("A2").value = "No hay datos disponibles";
      workSheet.getCell("A2").style = {
        font: { bold: true },
        alignment: { horizontal: "center", vertical: "middle" },
      };
    }
    data.forEach((row) => {
      workSheet.addRow(row);
    });

    const fileName = `report_inventario_general_${Date.now()}.xlsx`;

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

// ? reporte tv excel
export async function getReportTV(req: Request, res: Response, next: NextFunction) {
  try {

    const { dateStart, dateEnd } = req.body;

    const data = await getReportTVRows({ dateStart, dateEnd });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Televisores");

    worksheet.columns = [
      { header: "", key: "createdAt", width: 20 },
      { header: "", key: "name", width: 20 },
      { header: "", key: "location", width: 20 },
      { header: "", key: "headquarters", width: 30 },
      { header: "", key: "responsible", width: 30 },
      { header: "", key: "brand", width: 20 },
      { header: "", key: "model", width: 20 },
      { header: "", key: "serial", width: 30 },
      { header: "", key: "screenSize", width: 20 },
      { header: "", key: "screenType", width: 20 },
      { header: "", key: "resolution", width: 20 },
      { header: "", key: "smartTv", width: 15 },
      { header: "", key: "operativeSystem", width: 15 },
      { header: "", key: "addressIp", width: 15 },
      { header: "", key: "mac", width: 15 },
      { header: "", key: "numHdmi", width: 15 },
      { header: "", key: "numUSB", width: 15 },
      { header: "", key: "connectivity", width: 15 },
      { header: "", key: "purchaseDate", width: 15 },
      { header: "", key: "warrantyTime", width: 15 },
      { header: "", key: "warranty", width: 15 },
      { header: "", key: "deliveryDate", width: 15 },
      { header: "", key: "otherData", width: 30 },
      { header: "", key: "status", width: 15 },
      { header: "", key: "inventoryNumber", width: 20 },
      { header: "", key: "acquisitionValue", width: 20 },
      { header: "", key: "controlRemote", width: 20 },
      { header: "", key: "utility", width: 20 },
      { header: "", key: "updatedAt", width: 20 }
    ]

    const headers = [
      "Fecha de creación",
      "Nombre",
      "Ubicación",
      "Sede",
      "Responsable",
      "Marca",
      "Modelo",
      "Número de serie",
      "Tamaño de pantalla",
      "Tipo de pantalla",
      "Resolución",
      "Smart TV",
      "Sistema operativo",
      "Dirección IP",
      "MAC",
      "Número de HDMI",
      "Número de USB",
      "Conectividad",
      "Fecha de compra",
      "Tiempo de garantía",
      "Garantía",
      "Fecha de entrega",
      "Otros datos",
      "Estado",
      "Número de inventario",
      "Valor de adquisición",
      "Control remoto",
      "Utilidad",
      "Fecha de actualización"
    ]

    headers.forEach((header, index) => {
      const cell = worksheet.getCell(1, index + 1);
      cell.value = header;
      cell.font = { bold: true };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '335C81' } };
    });

    if (!data || data.length === 0) {
      worksheet.getCell("A2").value = "No hay datos disponibles";
      worksheet.getCell("A2").style = {
        font: { bold: true },
        alignment: { horizontal: "center", vertical: "middle" },
      };
    }

    data.forEach((row) => {
      worksheet.addRow(row);
    })

    const nameFile = `report_tv_${Date.now()}.xlsx`;

    res.header("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.header("Content-Disposition", `attachment; filename=${nameFile}`);

    await workbook.xlsx.write(res);
    res.end();

  } catch (error) {
    next(error);
  }
}

// ? report excel teléfonos
export async function getReportPhones(req: Request, res: Response, next: NextFunction) {
  try {

    const { dateStart, dateEnd } = req.body;

    const data = await getReportPhonesRows({ dateStart, dateEnd });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Teléfonos");

    worksheet.columns = [
      { header: "", key: "createdAt", width: 20 },
      { header: "", key: "name", width: 20 },
      { header: "", key: "brand", width: 20 },
      { header: "", key: "model", width: 20 },
      { header: "", key: "serial", width: 20 },
      { header: "", key: "imei", width: 20 },
      { header: "", key: "operativeSystem", width: 20 },
      { header: "", key: "version", width: 20 },
      { header: "", key: "storage", width: 20 },
      { header: "", key: "storageRam", width: 20 },
      { header: "", key: "phoneNumber", width: 20 },
      { header: "operator", key: "operator", width: 20 },
      { header: "", key: "typePlan", width: 20 },
      { header: "", key: "dueDataPlan", width: 20 },
      { header: "", key: "macWifi", width: 20 },
      { header: "", key: "addressBluetooth", width: 20 },
      { header: "", key: "purchaseDate", width: 20 },
      { header: "", key: "warrantyTime", width: 20 },
      { header: "", key: "warranty", width: 20 },
      { header: "", key: "deliveryDate", width: 20 },
      { header: "", key: "inventoryNumber", width: 20 },
      { header: "", key: "responsable", width: 20 },
      { header: "", key: "caseProtector", width: 20 },
      { header: "", key: "temperedGlass", width: 20 },
      { header: "", key: "observarion", width: 20 },
      { header: "", key: "status", width: 20 },
      { header: "", key: "headquarters", width: 20 },
      { header: "", key: "acquisitionValue", width: 20 },
      { header: "", key: "updatedAt", width: 20 },
    ];

    const headers = [
      "Fecha de creación",
      "Nombre",
      "Marca",
      "Modelo",
      "Número de serie",
      "Emei",
      "Sistema operativo",
      "Versión",
      "Almacenamiento",
      "RAM",
      "Número de teléfono",
      "Operador",
      "Tipo de plan",
      "Fecha de vencimiento del plan",
      "MAC WiFi",
      "Dirección Bluetooth",
      "Fecha de compra",
      "Tiempo de garantía",
      "Garantía",
      "Fecha de entrega",
      "Número de inventario",
      "Responsable",
      "Protector de carcasa",
      "Vidrio templado",
      "Observaciones",
      "Estado",
      "Sede",
      "Valor de adquisición",
      "Fecha de actualización"
    ];

    headers.forEach((header, index) => {
      const cell = worksheet.getCell(1, index + 1);
      cell.value = header;
      cell.font = { bold: true };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '335C81' } };
    });

    if (!data || data.length === 0) {
      worksheet.getCell("A2").value = "No hay datos disponibles";
      worksheet.getCell("A2").style = {
        font: { bold: true },
        alignment: { horizontal: "center", vertical: "middle" },
      };
    }

    data.forEach((row) => {
      worksheet.addRow(row);
    });

    const fileName = `report_phones_${Date.now()}.xlsx`;

    res.header("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.header("Content-Disposition", `attachment; filename=${fileName}`);

    await workbook.xlsx.write(res);
    res.end();


  } catch (error) {
    next(error)
  }
}

// ? =================  PREVIEW CONTROLLERS ================= //

// ? preview JSON del reporte deCircugías
export async function previewReportSurgerys(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { dateStart, dateEnd } = req.body;
    const data = await getReportSurgerysRows({ dateStart, dateEnd }, 20);
    res.status(200).json({ total: data.length, data });
  } catch (error) {
    next(error);
  }
}

// ? preview JSON del reporte de asistentes
export async function previewReportAssistants(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { dateStart, dateEnd } = req.body;
    const data = await getReportAssistantsRows({ dateStart, dateEnd }, 20);
    res.status(200).json({ total: data.length, data });
  } catch (error) {
    next(error);
  }
}

// ? preview JSON del reporte de pausas activas
export async function previewReportBreakesActive(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { dateStart, dateEnd } = req.body;
    const data = await getReportBreakesActiveRows({ dateStart, dateEnd }, 20);
    res.status(200).json({ total: data.length, data });
  } catch (error) {
    next(error);
  }
}

// ? preview JSON del reporte biométrico
export async function previewReportBiometric(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { dateStart, dateEnd } = req.body;
    const data = await getReportBiometricRows({ dateStart, dateEnd }, 20);
    res.status(200).json({ total: data.length, data });
  } catch (error) {
    next(error);
  }
}

// ? preview JSON del reporte de tickets
export async function previewReportTickets(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { dateStart, dateEnd } = req.body;
    const data = await getReportTicketsRows({ dateStart, dateEnd }, 20);
    res.status(200).json({ total: data.length, data });
  } catch (error) {
    next(error);
  }
}

// ? preview JSON del reporte de demanda inducida
export async function previewReportDemandInduced(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { dateStart, dateEnd, headquarter, convenio } = req.body;
    const rolUser = req.user?.rol;
    const userId = req.user?.id;

    const data = await getReportDemandInducedRows(
      {
        dateStart,
        dateEnd,
        headquarter,
        convenio,
        rolUser,
        userId,
      },
      20
    );
    res.status(200).json({ total: data.length, data });
  } catch (error) {
    next(error);
  }
}

// ? preview JSON del reporte de equipos
export async function previewReportEquipments(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { dateStart, dateEnd } = req.body;
    const data = await getReportEquipmentsRows({ dateStart, dateEnd }, 20);
    res.status(200).json({ total: data.length, data });
  } catch (error) {
    next(error);
  }
}

// ? preview JSON del reporte de dispositivos de red
export async function previewReportRedDevice(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { dateStart, dateEnd } = req.body;
    const data = await getReportRedDeviceRows({ dateStart, dateEnd }, 20);
    res.status(200).json({ total: data.length, data });
  } catch (error) {
    next(error);
  }
}

// ? preview JSON del reporte de inventario general
export async function previewReportGeneralInventory(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { dateStart, dateEnd } = req.body;
    const data = await getReportGeneralInventoryRows({ dateStart, dateEnd }, 20);
    res.status(200).json({ total: data.length, data });
  } catch (error) {
    next(error);
  }
}

// ? preview JSON del reporte de televisores
export async function previewReportTV(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { dateStart, dateEnd } = req.body;
    const data = await getReportTVRows({ dateStart, dateEnd }, 20);
    res.status(200).json({ total: data.length, data });
  } catch (error) {
    next(error);
  }
}

// ? preview JSON del reporte de teléfonos
export async function previewReportPhones(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { dateStart, dateEnd } = req.body;
    const data = await getReportPhonesRows({ dateStart, dateEnd }, 20);
    res.status(200).json({ total: data.length, data });
  } catch (error) {
    next(error);
  }
}