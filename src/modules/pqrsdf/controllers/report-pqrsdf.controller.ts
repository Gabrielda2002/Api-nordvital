import { NextFunction, Request, Response } from "express";
import ExcelJS from "exceljs";
import { randomBytes } from "crypto";
import { NotFoundError } from "@core/utils/custom-errors";
import { getReportPqrsdfRows } from "../services/report-pqrsdf.service";

const COLUMNS = [
  { header: "NOMBRE DE PACIENTE", key: "Nombre_del_paciente", width: 32 },
  { header: "DOCUMENTO", key: "Documento", width: 20 },
  { header: "ASEGURADOR/EPS", key: "Asegurador_EPS", width: 20 },
  { header: "ENTE", key: "Ente", width: 20 },
  { header: "REGIMEN", key: "Regimen", width: 20 },
  { header: "NOVEDAD PRESENTADA POR", key: "Novedad_presentada_por", width: 24 },
  { header: "NOTIFICA DE EPS", key: "Notifica_EPS", width: 20 },
  { header: "PQRS", key: "PQRS", width: 16 },
  { header: "MEDIO", key: "Medio", width: 18 },
  { header: "NUMERO DE RADICADO", key: "Numero_de_radicado", width: 20 },
  { header: "FECHA DE RADICACION", key: "Fecha_de_radicacion", width: 20 },
  { header: "FECHA DE HALLAZGO", key: "Fecha_de_hallazgo", width: 20 },
  { header: "FECHA DE RESPUESTA", key: "Fecha_de_respuesta", width: 20 },
  {
    header: "OPORTUNIDAD DESDE RADICACION",
    key: "Oportunidad_desde_radicacion",
    width: 24,
  },
  {
    header: "OPORTUNIDAD DESDE HALLAZGO",
    key: "Oportunidad_desde_hallazgo",
    width: 24,
  },
  {
    header: "VIA UTILIZADA PARA LA RESPUESTA",
    key: "Via_utilizada_para_la_respuesta",
    width: 28,
  },
  { header: "SERVICIO", key: "Servicio", width: 24 },
  { header: "RESPUESTA", key: "Respuesta", width: 50 },
  {
    header: "AREA CON LA CUAL SE RESOLVIO EL EVENTO",
    key: "Area_con_la_cual_se_resolvio_el_evento",
    width: 30,
  },
  { header: "CLASIFICACION FINAL", key: "Clasificacion_final", width: 20 },
  { header: "ACCION DE MEJORA", key: "Accion_de_mejora", width: 18 },
  {
    header: "PLAN DE MEJORAMIENTO: ACCIONES TOMADAS/CORRECTIVOS",
    key: "Plan_de_mejoramiento",
    width: 50,
  },
  { header: "FECHA DEL SEGUIMIENTO", key: "Fecha_del_seguimiento", width: 22 },
  { header: "SEGUIMIENTO", key: "Seguimiento", width: 30 },
  { header: "ESTADO", key: "Estado", width: 16 },
  { header: "INDICADOR", key: "Indicador", width: 16 },
];

export async function getReportPqrsdf(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const {
      startDate,
      endDate,
      status,
    classification,
      instance,
      patientDocument,
      originAreaId,
    } = req.body;

    const rows = await getReportPqrsdfRows({
      startDate,
      endDate,
      status,
      classification,
      instance,
      patientDocument,
      originAreaId,
    });

    if (!rows || rows.length === 0) {
      throw new NotFoundError(
        "No se encontraron PQRSDF en el rango especificado"
      );
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Reporte PQRSDF");

    worksheet.columns = COLUMNS;

    rows.forEach((row) => worksheet.addRow(row));

    const fileName = `Reporte_PQRSDF_${randomBytes(4).toString("hex")}.xlsx`;

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

export async function previewReportPqrsdf(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const {
      startDate,
      endDate,
      status,
      classification,
      instance,
      patientDocument,
      originAreaId,
    } = req.body;

    const data = await getReportPqrsdfRows(
      {
        startDate,
        endDate,
        status,
        classification,
        instance,
        patientDocument,
        originAreaId,
      },
      20
    );

    if (!data || data.length === 0) {
      return res.status(404).json({ message: "Data PQRSDF Not Found." });
    }

    res.status(200).json({ total: data.length, data });
  } catch (error) {
    next(error);
  }
}