import { NextFunction, Request, Response } from "express";
import ExcelJS from "exceljs";
import { randomBytes } from "crypto";
import { NotFoundError } from "@core/utils/custom-errors";
import { getReportSatisfactionRows } from "../services/report-satisfaction.service";

const COLUMNS = [
  { header: "MARCA TEMPORAL", key: "Marca_temporal", width: 22 },
  { header: "SEDE DE ATENCIÓN", key: "Sede_atencion", width: 20 },
  { header: "CONVENIO DEL PACIENTE", key: "Convenio_paciente", width: 22 },
  { header: "NÚMERO DE IDENTIFICACIÓN", key: "Numero_identificacion", width: 22 },
  { header: "NOMBRE COMPLETO", key: "Nombre_completo", width: 35 },
  { header: "POBLACIÓN ESPECIAL", key: "Poblacion_especial", width: 28 },
  { header: "SERVICIO EN EL CUAL RECIBIÓ ATENCIÓN", key: "Servicio_atencion", width: 40 },
  {
    header: "¿SU CITA MÉDICA FUE ASIGNADA DE MANERA OPORTUNA?",
    key: "Cita_oportuna",
    width: 22,
  },
  {
    header: "¿FUE ATENDIDO(A) CON PUNTUALIDAD?",
    key: "Atencion_puntual",
    width: 22,
  },
  {
    header: "¿EL PROFESIONAL MOSTRÓ INTERÉS EN CONOCER SU HISTORIA CLÍNICA Y MOTIVO DE CONSULTA?",
    key: "Interes_profesional",
    width: 26,
  },
  {
    header: "¿LAS RECOMENDACIONES BRINDADAS POR EL PROFESIONAL FUERON CLARAS Y COMPRENSIBLES?",
    key: "Recomendaciones_claras",
    width: 26,
  },
  {
    header: "¿LA SEÑALIZACIÓN DENTRO DE LA SEDE FACILITÓ SU UBICACIÓN?",
    key: "Senalizacion_ayudo",
    width: 22,
  },
  {
    header: "¿CONSIDERA QUE LAS INSTALACIONES SON ADECUADAS Y CÓMODAS?",
    key: "Instalaciones_adecuadas",
    width: 22,
  },
  {
    header: "¿CONSIDERA QUE LAS INSTALACIONES SE ENCUENTRAN LIMPIAS Y EN BUEN ORDEN?",
    key: "Instalaciones_limpias",
    width: 22,
  },
  {
    header: "CALIFICACIÓN ATENCIÓN DEL PROFESIONAL DE SALUD",
    key: "Calificacion_profesional",
    width: 24,
  },
  {
    header: "CALIFICACIÓN ATENCIÓN DEL PERSONAL DE SERVICIO AL CLIENTE",
    key: "Calificacion_servicio_cliente",
    width: 24,
  },
  {
    header: "EXPERIENCIA GLOBAL CON LOS SERVICIOS DE SALUD DE LA IPS",
    key: "Experiencia_global",
    width: 24,
  },
  {
    header: "¿RECOMENDARÍA A SUS FAMILIARES Y AMIGOS A NORDVITAL IPS?",
    key: "Recomendaria_ips",
    width: 24,
  },
];

export async function getReportSatisfaction(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { dateStart, dateEnd } = req.body;

    const rows = await getReportSatisfactionRows({ dateStart, dateEnd });

    if (!rows || rows.length === 0) {
      throw new NotFoundError(
        "No se encontraron encuestas de satisfacción en el rango especificado"
      );
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Reporte Encuestas Satisfaccion");

    worksheet.columns = COLUMNS;

    const headerRow = worksheet.getRow(1);
    headerRow.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: "00000000" }, size: 10 };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "84DCCF" },
        bgColor: { argb: "84DCCF" },
      };
      cell.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });
    headerRow.height = 45;

    rows.forEach((row) => worksheet.addRow(row));

    const fileName = `Reporte_Encuestas_Satisfaccion_${randomBytes(4).toString("hex")}.xlsx`;

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

export async function previewReportSatisfaction(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { dateStart, dateEnd } = req.body;

    const data = await getReportSatisfactionRows({ dateStart, dateEnd }, 20);

    if (!data || data.length === 0) {
      throw new NotFoundError("No se encontraron encuestas de satisfacción");
    }

    res.status(200).json({ total: data.length, data });
  } catch (error) {
    next(error);
  }
}
