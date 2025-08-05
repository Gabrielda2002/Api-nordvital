import { NextFunction, Request, Response } from "express";
import { PacientesCoosalud } from "../entities/pacientes-coosalud";
import * as ExcelJS from "exceljs";

export async function getAllPatientsCoosalud(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const patients = await PacientesCoosalud.find();

    res.json(patients);
  } catch (error) {
    next(error);
  }
}

export async function getPatientCoosalud(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const patient = await PacientesCoosalud.findOneBy({
      id: parseInt(req.params.id),
    });

    res.json(patient);
  } catch (error) {
    next(error);
  }
}

export async function createPatientCoosalud(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const {
      tpsIdnId,
      hstIdnNumeroIdentificacion,
      aflPrimerApellido,
      aflSegundoApellido,
      aflPrimerNombre,
      aflSegundoNombre,
      aflFechaNacimiento,
      tpsGnrId,
      tpsRgmId,
      entId,
      tpsAflId,
      znsId,
      tpsEstAflId,
      tpsCndBnfId,
      dprId,
      mncId,
      divipola,
      tpsMdlSbsId,
    } = req.body;

    const patientExist = await PacientesCoosalud.createQueryBuilder(
      "pacientes_cosalud"
    )
      .where("hstIdnNumeroIdentificacion = :hstIdnNumeroIdentificacion", {
        hstIdnNumeroIdentificacion,
      })
      .getOne();

    if (patientExist) {
      return res.status(400).json({ message: "Patient already exist" });
    }

    const patient = PacientesCoosalud.create({
      tpsIdnId,
      hstIdnNumeroIdentificacion,
      aflPrimerApellido,
      aflSegundoApellido,
      aflPrimerNombre,
      aflSegundoNombre,
      aflFechaNacimiento,
      tpsGnrId,
      tpsRgmId,
      entId,
      tpsAflId,
      znsId,
      tpsEstAflId,
      tpsCndBnfId,
      dprId,
      mncId,
      divipola,
      tpsMdlSbsId,
    });

    await patient.save();

    res.json(patient);
  } catch (error) {
    next(error);
  }
}

export async function updatePatientCoosalud(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const {
      tpsIdnId,
      hstIdnNumeroIdentificacion,
      aflPrimerApellido,
      aflSegundoApellido,
      aflPrimerNombre,
      aflSegundoNombre,
      aflFechaNacimiento,
      tpsGnrId,
      tpsRgmId,
      entId,
      tpsAflId,
      znsId,
      tpsEstAflId,
      tpsCndBnfId,
      dprId,
      mncId,
      divipola,
      tpsMdlSbsId,
    } = req.body;

    const patient = await PacientesCoosalud.findOneBy({
      id: parseInt(req.params.id),
    });

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    patient.tpsIdnId = tpsIdnId;
    patient.hstIdnNumeroIdentificacion = hstIdnNumeroIdentificacion;
    patient.aflPrimerApellido = aflPrimerApellido;
    patient.aflSegundoApellido = aflSegundoApellido;
    patient.aflPrimerNombre = aflPrimerNombre;
    patient.aflSegundoNombre = aflSegundoNombre;
    patient.aflFechaNacimiento = aflFechaNacimiento;
    patient.tpsGnrId = tpsGnrId;
    patient.tpsRgmId = tpsRgmId;
    patient.entId = entId;
    patient.tpsAflId = tpsAflId;
    patient.znsId = znsId;
    patient.tpsEstAflId = tpsEstAflId;
    patient.tpsCndBnfId = tpsCndBnfId;
    patient.dprId = dprId;
    patient.mncId = mncId;
    patient.divipola = divipola;
    patient.tpsMdlSbsId = tpsMdlSbsId;

    await patient.save();

    res.json(patient);
  } catch (error) {
    next(error);
  }
}

export async function deletePatientCoosalud(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const patient = await PacientesCoosalud.findOneBy({
      id: parseInt(req.params.id),
    });

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    await patient.remove();

    res.json({ message: "Patient deleted" });
  } catch (error) {
    next(error);
  }
}

// buscar paciente por numero identificacion
export async function getPatientByIdentificationCoosalud(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { numeroIdentificacion } = req.body;

    const patient = await PacientesCoosalud.createQueryBuilder(
      "pacientes_cosalud"
    )
      .where(
        "pacientes_cosalud.hstIdnNumeroIdentificacion = :hstIdnNumeroIdentificacion",
        { hstIdnNumeroIdentificacion: numeroIdentificacion }
      )
      .andWhere("pacientes_cosalud.Estado = :Estado", { Estado: "Activo" })
      .getOne();

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.json(patient);
  } catch (error) {
    next(error);
  }
}

export async function updatePatientsStatusFromExcel(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {

    const { inactivar } = req.body;

    if (!inactivar) {
        return res
            .status(400)
            .json({ message: "El campo 'inactivar' es obligatorio" });
    }

    // Verificar que se haya subido un archivo
    if (!req.file) {
      return res
        .status(400)
        .json({ message: "No se ha subido ningún archivo" });
    }

    // Verificar que el archivo tiene contenido
    if (!req.file.buffer || req.file.buffer.length === 0) {
      return res.status(400).json({ message: "El archivo está vacío" });
    }

    try {
      // Leer el archivo Excel con ExcelJS en lugar de XLSX
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(req.file.buffer);

      // Verificar que hay hojas en el libro
      if (workbook.worksheets.length === 0) {
        return res
          .status(400)
          .json({ message: "El archivo Excel no contiene hojas" });
      }

      const worksheet = workbook.worksheets[0];

      // Verificar que la hoja contiene datos
      if (!worksheet) {
        return res
          .status(400)
          .json({ message: "La hoja de cálculo está vacía" });
      }

      // Convertir el contenido de la hoja a JSON
      const data: any[] = [];
      const headers: string[] = [];

      // Obtener los encabezados
      worksheet.getRow(1).eachCell((cell, colNumber) => {
        headers[colNumber - 1] = cell.value ? cell.value.toString() : "";
      });

      // Obtener los datos
      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber > 1) {
          // Saltar la fila de encabezado
          const rowData: any = {};
          row.eachCell((cell, colNumber) => {
            rowData[headers[colNumber - 1]] = cell.value !== null && cell.value !== undefined ?
            cell.value.toString() : null;
          });
          data.push(rowData);
        }
      });

      if (!data || data.length === 0) {
        return res
          .status(400)
          .json({ message: "No se encontraron datos en el archivo" });
      }
      
      const primeraFila = data[0];
      const nombreColumnas = Object.keys(primeraFila);

      console.log("Columnas disponibles:", nombreColumnas);

      if (!nombreColumnas.includes("HST_IDN_NUMERO_IDENTIFICACION")) {
        return res.status(400).json({
          message:
            "El archivo no contiene la columna 'HST_IDN_NUMERO_IDENTIFICACION'",
          columnasDisponibles: nombreColumnas,
        });
      }

      const cedulas = data
        .map((row) => row.HST_IDN_NUMERO_IDENTIFICACION)
        .filter((cedula) => cedula !== undefined && cedula !== null);

      if (cedulas.length === 0) {
        return res
          .status(400)
          .json({ message: "No se encontraron cédulas válidas en el archivo" });
      }

      console.log(`Se encontraron ${cedulas.length} cédulas`);
      console.log("Primeras 5 cédulas:", cedulas.slice(0, 5));

      // Una vez verificado que todo funciona, puedes descomentar esta parte para actualizar la base de datos
      await PacientesCoosalud.createQueryBuilder()
        .update(PacientesCoosalud)
        .set({ estado: `${inactivar === 'true' ? 'Inactivo' : 'Activo'}` })
        .where("hstIdnNumeroIdentificacion IN (:...cedulas)", { cedulas })
        .execute();

      return res.status(200).json({
        message: `Se encontraron ${cedulas.length} cédulas`,
        primeras: cedulas.slice(0, 10),
      });

    } catch (error: any) {
      console.error("Error al procesar el archivo Excel:", error);

      return res.status(400).json({
        message:
          "Error al procesar el archivo Excel. Asegúrate de que es un archivo Excel válido.",
        error: error.message,
      });
    }
  } catch (error) {
    console.error("Error general:", error);
    next(error);
  }
}

export async function updatePatientsRegimenFromExcel(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // Verificar que se haya subido un archivo
    if (!req.file) {
      return res
        .status(400)
        .json({ message: "No se ha subido ningún archivo" });
    }

    // Verificar que el archivo tiene contenido
    if (!req.file.buffer || req.file.buffer.length === 0) {
      return res.status(400).json({ message: "El archivo está vacío" });
    }

    try {
      // Leer el archivo Excel con ExcelJS
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(req.file.buffer);

      // Verificar que hay hojas en el libro
      if (workbook.worksheets.length === 0) {
        return res
          .status(400)
          .json({ message: "El archivo Excel no contiene hojas" });
      }

      const worksheet = workbook.worksheets[0];

      // Verificar que la hoja contiene datos
      if (!worksheet) {
        return res
          .status(400)
          .json({ message: "La hoja de cálculo está vacía" });
      }

      // Convertir el contenido de la hoja a JSON
      const data: any[] = [];
      const headers: string[] = [];

      // Obtener los encabezados
      worksheet.getRow(1).eachCell((cell, colNumber) => {
        headers[colNumber - 1] = cell.value ? cell.value.toString() : "";
      });

      // Obtener los datos
      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber > 1) {
          // Saltar la fila de encabezado
          const rowData: any = {};
          row.eachCell((cell, colNumber) => {
            rowData[headers[colNumber - 1]] = cell.value !== null && cell.value !== undefined ?
            cell.value.toString() : null;
          });
          data.push(rowData);
        }
      });

      if (!data || data.length === 0) {
        return res
          .status(400)
          .json({ message: "No se encontraron datos en el archivo" });
      }
      
      const primeraFila = data[0];
      const nombreColumnas = Object.keys(primeraFila);

      console.log("Columnas disponibles:", nombreColumnas);

      // Verificar que las columnas necesarias existen
      const columnasRequeridas = ["HST_IDN_NUMERO_IDENTIFICACION", "TPS_RGM_ID", "REGIMEN"];
      const columnasFaltantes = columnasRequeridas.filter(col => !nombreColumnas.includes(col));

      if (columnasFaltantes.length > 0) {
        return res.status(400).json({
          message: `El archivo no contiene las siguientes columnas requeridas: ${columnasFaltantes.join(", ")}`,
          columnasDisponibles: nombreColumnas,
          columnasRequeridas: columnasRequeridas
        });
      }

      // Filtrar y preparar los datos para actualización
      const datosActualizacion = data
        .filter((row) => 
          row.HST_IDN_NUMERO_IDENTIFICACION && 
          (row.TPS_RGM_ID || row.REGIMEN)
        )
        .map((row) => ({
          numeroIdentificacion: row.HST_IDN_NUMERO_IDENTIFICACION,
          tpsRgmId: row.TPS_RGM_ID,
          regimen: row.REGIMEN
        }));

      if (datosActualizacion.length === 0) {
        return res
          .status(400)
          .json({ message: "No se encontraron datos válidos para actualizar en el archivo" });
      }

      console.log(`Se encontraron ${datosActualizacion.length} registros para actualizar`);
      console.log("Primeros 5 registros:", datosActualizacion.slice(0, 5));

      // Actualización masiva con CASE WHEN para mejor rendimiento
      try {
        const cedulas = datosActualizacion.map(d => d.numeroIdentificacion);
        
        // Construir casos para TPS_RGM_ID solo para registros que tienen este campo
        const registrosConTpsRgm = datosActualizacion.filter(d => d.tpsRgmId && d.tpsRgmId.trim() !== '');
        const tpsRgmCases = registrosConTpsRgm
          .map(d => `WHEN HST_IDN_NUMERO_IDENTIFICACION = '${d.numeroIdentificacion}' THEN '${d.tpsRgmId.replace(/'/g, "''")}'`)
          .join(' ');
        
        // Construir casos para REGIMEN solo para registros que tienen este campo
        const registrosConRegimen = datosActualizacion.filter(d => d.regimen && d.regimen.trim() !== '');
        const regimenCases = registrosConRegimen
          .map(d => `WHEN HST_IDN_NUMERO_IDENTIFICACION = '${d.numeroIdentificacion}' THEN '${d.regimen.replace(/'/g, "''")}'`)
          .join(' ');

        // Construir la consulta de actualización
        let updateQuery = `UPDATE pacientes_cosalud SET `;
        const updateParts = [];

        if (tpsRgmCases) {
          updateParts.push(`TPS_RGM_ID = CASE ${tpsRgmCases} ELSE TPS_RGM_ID END`);
        }
        
        if (regimenCases) {
          updateParts.push(`REGIMEN = CASE ${regimenCases} ELSE REGIMEN END`);
        }

        if (updateParts.length === 0) {
          return res.status(400).json({
            message: "No hay datos válidos para actualizar"
          });
        }

        updateQuery += updateParts.join(', ');
        updateQuery += ` WHERE HST_IDN_NUMERO_IDENTIFICACION IN (${cedulas.map(c => `'${c.replace(/'/g, "''")}'`).join(',')})`;

        console.log("Ejecutando actualización masiva...");
        console.log(`Actualizando ${registrosConTpsRgm.length} registros con TPS_RGM_ID`);
        console.log(`Actualizando ${registrosConRegimen.length} registros con REGIMEN`);
        
        const inicioTiempo = Date.now();
        const resultado = await PacientesCoosalud.query(updateQuery);
        const tiempoTranscurrido = Date.now() - inicioTiempo;
        
        console.log(`Actualización completada en ${tiempoTranscurrido}ms`);
        
        return res.status(200).json({
          message: `Actualización masiva completada exitosamente`,
          totalRegistros: datosActualizacion.length,
          registrosConTpsRgm: registrosConTpsRgm.length,
          registrosConRegimen: registrosConRegimen.length,
          tiempoEjecucion: `${tiempoTranscurrido}ms`,
          metodo: "Actualización masiva con CASE WHEN",
          muestra: datosActualizacion.slice(0, 5)
        });

      } catch (updateError: any) {
        console.error("Error en actualización masiva:", updateError);
        
        return res.status(500).json({
          message: "Error durante la actualización masiva",
          error: updateError.message,
          totalRegistros: datosActualizacion.length
        });
      }

    } catch (error: any) {
      console.error("Error al procesar el archivo Excel:", error);

      return res.status(400).json({
        message:
          "Error al procesar el archivo Excel. Asegúrate de que es un archivo Excel válido.",
        error: error.message,
      });
    }
  } catch (error) {
    console.error("Error general:", error);
    next(error);
  }
}
