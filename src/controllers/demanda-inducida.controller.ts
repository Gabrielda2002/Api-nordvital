import { NextFunction, Request, Response } from "express";
import { DemandaInducida } from "../entities/demanda-inducida";
import { Pacientes } from "../entities/pacientes";
import { validate } from "class-validator";
import { ProgramaMetaService } from "../services/ProgramaMetaService";
import { Usuarios } from "../entities/usuarios";

export const getAllDemandInduded = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const idCurrentUser = req.user?.id;
    const idRoLCurrentUser = req.user?.rol;

    const headquartersCurrentUser = await Usuarios.createQueryBuilder("usuario")
      .where("usuario.id = :id", { id: idCurrentUser })
      .getOne();

    const demandInduced = await DemandaInducida.createQueryBuilder(
      "demandInduced"
    )
      .leftJoinAndSelect("demandInduced.pacienteRelation", "paciente")
      .leftJoinAndSelect("paciente.documentRelation", "document")
      .leftJoinAndSelect("demandInduced.elementoRelation", "elemento")
      .leftJoinAndSelect("demandInduced.tipoRelation", "tipo")
      .leftJoinAndSelect("demandInduced.objetivoRelation", "objetivo")
      .leftJoinAndSelect("demandInduced.relacionRelation", "relacion")
      .leftJoinAndSelect("demandInduced.areaEpsRelation", "areaEps")
      .leftJoinAndSelect("demandInduced.resumenRelation", "resumen")
      .leftJoinAndSelect("demandInduced.resultadoRelation", "resultado")
      .leftJoinAndSelect("demandInduced.motivoRelation", "motivo")
      .leftJoinAndSelect("demandInduced.areaPersonaRelation", "areaPersona")
      .leftJoinAndSelect("demandInduced.programaRelation", "programa")
      .leftJoinAndSelect(
        "demandInduced.personaSeguimientoRelation",
        "personaSeguimiento"
      )
      .orderBy("demandInduced.createdAt", "DESC");

    if (idRoLCurrentUser == "19") {
      demandInduced.andWhere("demandInduced.personaSeguimientoId = :userId", {
        userId: idCurrentUser,
      });
    } else if (idRoLCurrentUser == "21") {
      demandInduced.andWhere(
        "personaSeguimiento.headquarters = :headquartersId",
        {
          headquartersId: headquartersCurrentUser?.headquarters,
        }
      );
    }

    const demandInducedList = await demandInduced.getMany();

    const demandInducedFormatted = demandInducedList.map((d) => ({
      id: d.id || "N/A",
      typeDocument: d.pacienteRelation?.documentRelation?.name || "N/A",
      document: d.pacienteRelation?.documentNumber || "N/A",
      dateCreated: d.createdAt || "N/A",
      elementDI: d.elementoRelation?.name || "N/A",
      typeElementDI: d.tipoRelation?.name || "N/A",
      objetive: d.objetivoRelation?.name || "N/A",
      numbersContact: d.contactNumbers || "N/A",
      classification: d.clasificacion,
      perconReceive: d.personaRecibe || "N/A",
      relationshipUser: d.relacionRelation?.name || "N/A",
      dateCall: d.fechaLlamada || "N/A",
      hourCall: d.horaLlamada || "N/A",
      textCall: d.textoLlamada || "N/A",
      dificulties: d.dificultadAcceso || "N/A",
      areaDificulties: d.areaDificultad || "N/A",
      areaEps: d.areaEpsRelation?.name || "N/A" || "N/A",
      summaryCall: d.resumenRelation?.name || "N/A",
      conditionUser: d.condicionPaciente || "N/A",
      suport: d.soporteRecuperados || "N/A",
      namePatient: d.pacienteRelation?.name || "N/A",
      phoneNumberPatient: d.pacienteRelation?.phoneNumber || "N/A",
      emailPatient: d.pacienteRelation?.email || "N/A",
      resultCALL: d.resultadoRelation?.name || "N/A" || "N/A",
      dateSend: d.fechaEnvio || "N/A",
      hourSend: d.horaEnvio || "N/A",
      textSend: d.textEnvio || "N/A",
      dateVisit: d.fechaVisita || "N/A",
      sumaryVisit: d.resumenVisita || "N/A",
      reasonVisit: d.motivoRelation?.name || "N/A" || "N/A",
      personProcess:
        `${d.personaSeguimientoRelation?.name} ${d.personaSeguimientoRelation?.lastName}` ||
        "N/A",
      areaPersonProcess: d.areaPersonaRelation?.name || "N/A",
      programPerson: d.programaRelation?.name || "N/A",
      assignmentDate: d.fechaCita || "N/A",
      profetional: d.profesional || "N/A",
    }));

    return res.status(200).json(demandInducedFormatted);
  } catch (error) {
    next(error);
  }
};

export const createDemandInduced = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const queryRunner =
    DemandaInducida.getRepository().manager.connection.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();
  try {
    const {
      email,
      phoneNumber,
      phoneNumber2,
      address,
      elementDemand,
      typeElementDemand,
      objetive,
      contactNumbers,
      classification,
      acceptCall,
      relationshipUser,
      dateCall,
      hourCall,
      textCall,
      dificulties,
      areaDificulties,
      areaEps,
      summaryCall,
      conditionUser,
      suport,
      resultCall,
      dateSend,
      hourSend,
      textSend,
      dateVisit,
      sumaryVisit,
      reasonVisitNotEffective,
      areaPersonProcess,
      programPerson,
      assignmentDate,
      idPatient,
      profetional,
      idUser,
    } = req.body;

    if (idPatient === undefined || idPatient === null) {
      return res.status(400).json({ message: "Patient ID is required" });
    }

    const patient = await Pacientes.findOneBy({ id: parseInt(idPatient) });

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    patient.email = email;
    patient.phoneNumber = phoneNumber;
    patient.phoneNumber2 = phoneNumber2;
    patient.address = address;

    const errorsPatient = await validate(patient);
    if (errorsPatient.length > 0) {
      const message = errorsPatient.map((err) => ({
        property: err.property,
        constraints: err.constraints,
      }));

      await queryRunner.rollbackTransaction();

      return res.status(400).json({
        message: "Validation failed for patient",
        errors: message,
      });
    }

    const demandInduced = new DemandaInducida();
    demandInduced.pacienteId = patient.id;
    demandInduced.elementoDemandaInducidaId = parseInt(elementDemand);
    demandInduced.tipoDemandaInducidaId = typeElementDemand
      ? parseInt(typeElementDemand)
      : null;
    demandInduced.objetivoDemandaInducidaId = objetive
      ? parseInt(objetive)
      : null;
    demandInduced.relacionUsuarioId = relationshipUser
      ? parseInt(relationshipUser)
      : null;
    demandInduced.areaEpsId = areaEps ? parseInt(areaEps) : null;
    demandInduced.resumenSeguimientoActividadId = summaryCall
      ? parseInt(summaryCall)
      : null;
    demandInduced.resultadoLlamadaId = resultCall ? parseInt(resultCall) : null;
    demandInduced.motivoVisitaId = reasonVisitNotEffective
      ? parseInt(reasonVisitNotEffective)
      : null;
    demandInduced.areaPersonaSeguimientoId = areaPersonProcess
      ? parseInt(areaPersonProcess)
      : null;
    demandInduced.clasificacion =
      elementDemand == 1 || elementDemand == 3 ? true : classification;
    demandInduced.contactNumbers = contactNumbers;
    demandInduced.personaRecibe = acceptCall || null;
    demandInduced.profesional = profetional;
    demandInduced.fechaLlamada = dateCall || null;
    demandInduced.horaLlamada = hourCall || null;
    demandInduced.textoLlamada = textCall || null;
    demandInduced.dificultadAcceso = dificulties;
    demandInduced.areaDificultad = areaDificulties || null;
    demandInduced.condicionPaciente = conditionUser;
    demandInduced.soporteRecuperados = suport || null;
    demandInduced.fechaEnvio = dateSend || null;
    demandInduced.horaEnvio = hourSend || null;
    demandInduced.textEnvio = textSend || null;
    demandInduced.fechaVisita = dateVisit || null;
    demandInduced.resumenVisita = sumaryVisit || null;
    demandInduced.programaId = parseInt(programPerson);
    demandInduced.fechaCita = assignmentDate || null;
    demandInduced.personaSeguimientoId = parseInt(idUser);

    const errorsDemandInduced = await validate(demandInduced);

    if (errorsDemandInduced.length > 0) {
      const message = errorsDemandInduced.map((err) => ({
        property: err.property,
        constraints: err.constraints,
      }));

      await queryRunner.rollbackTransaction();

      return res.status(400).json({
        message: "Validation failed for demand induced",
        errors: message,
      });
    }

    await queryRunner.manager.save(patient);
    await queryRunner.manager.save(demandInduced);
    await queryRunner.commitTransaction();

    return res.status(201).json({
      message: "Demand induced created successfully",
      demandInduced,
    });
  } catch (error) {
    await queryRunner.rollbackTransaction();

    next(error);
  } finally {
    await queryRunner.release();
  }
};

export async function getEstadisticasDemandaInducida(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const {
      element: elementoId,
      program: programaId,
      professional: profesional,
      year: año,
      month: mes,
    } = req.body;

    const rolCurrentUser = req.user?.rol;

    const idCurrentUser = req.user?.id;

    const headquartersCurrentUser = await Usuarios.createQueryBuilder("usuario")
      .where("usuario.id = :id", { id: idCurrentUser })
      .getOne();

    const idHeadquartersCurrentUser = headquartersCurrentUser?.headquarters;

    // Obtener meta del programa para el mes
    const metaPrograma = await ProgramaMetaService.getGoalMonth(
      parseInt(programaId),
      parseInt(año),
      parseInt(mes),
      idHeadquartersCurrentUser,
      rolCurrentUser
    );

    const metaValue = metaPrograma?.meta || 0;

    // 1. Estadísticas por programa, elemento y profesional
    // const estadisticasPorPrograma = await getStatisticsByProgram(
    //   elementoId,
    //   programaId,
    //   profesional,
    //   año,
    //   mes,
    //   metaValue
    // );

    // 2. Llamadas telefónicas efectivas vs no efectivas
    const estadisticasLlamadasTelefonicas = await getStatisticsCalls(
      programaId,
      profesional,
      año,
      mes,
      metaValue,
      idCurrentUser,
      idHeadquartersCurrentUser,
      rolCurrentUser
    );

    // 3. Resultados de llamadas no efectivas
    // const estadisticasLlamadasNoEfectivas = await getStatisticsCallNotEffective(
    //   programaId,
    //   profesional,
    //   año,
    //   mes,
    //   metaValue
    // );

    // 4. Cantidad de registros demanda inducida por programa por mes y por año
    const cantidadDemandInduced = await getQuantityDemandInducedByProgram(
      profesional,
      programaId,
      año,
      mes,
      elementoId,
      idCurrentUser,
      idHeadquartersCurrentUser,
      rolCurrentUser
    );

    // 5. Estadísticas resultados de llamadas no efectivas
    const estResultadoLlamadasNoEfectivas =
      await getStatisticsResultCallsNotEffective(
        programaId,
        profesional,
        elementoId,
        año,
        mes,
        idCurrentUser,
        rolCurrentUser,
        idHeadquartersCurrentUser
      );

    return res.status(200).json({
      meta: metaValue,
      // estadisticasPorPrograma,
      estadisticasLlamadasTelefonicas,
      // estadisticasLlamadasNoEfectivas,
      cantidadDemandInduced,
      estResultadoLlamadasNoEfectivas,
    });
  } catch (error) {
    next(error);
  }
}

async function getStatisticsResultCallsNotEffective(
  programaId: string,
  profesional: string,
  elementoId: string,
  año: string,
  mes: string,
  currentUserId: string,
  rolCurrentUser?: number | string,
  currentUserHeadquartersId?: number
) {
  const query = await DemandaInducida.createQueryBuilder("demanda")
    .leftJoinAndSelect("demanda.programaRelation", "programa")
    .leftJoinAndSelect("demanda.resultadoRelation", "resultado")
    .leftJoinAndSelect(
      "demanda.personaSeguimientoRelation",
      "personaSeguimiento"
    )
    .select(["resultado.name as resultadoLlamada", "COUNT(*) as cantidad"])
    .where("demanda.elementoDemandaInducidaId = :elementoId", { elementoId })
    .andWhere("demanda.clasificacion = :clasificacion", {
      clasificacion: false,
    })
    .andWhere("YEAR(demanda.createdAt) = :year", { year: año })
    .andWhere("MONTH(demanda.createdAt) = :month", { month: mes })
    .andWhere("demanda.programaId = :programaId", { programaId })
    .andWhere("demanda.profesional = :profesional", { profesional })
    .groupBy("resultado.name");

  // si el rol es 19 mostrar solo las DI de ese usuario
  if (rolCurrentUser == "19") {
    query.andWhere("demanda.personaSeguimientoId = :userId", {
      userId: currentUserId,
    });
  } else if (rolCurrentUser == "21") {
    query.andWhere("personaSeguimiento.headquarters = :headquartersId", {
      headquartersId: currentUserHeadquartersId,
    });
  }

  const results = await query.getRawMany();

  return results.map((resultado) => ({
    resultadoLlamada: resultado.resultadoLlamada,
    cantidad: parseInt(resultado.cantidad),
  }));
}

// funcion auxiliar para arrojar la cantidad de registros demanda inducida por programa por mes y por ano
async function getQuantityDemandInducedByProgram(
  profesional: string,
  programaId: string,
  año: string,
  mes: string,
  elementoId: string,
  currentUserId: string,
  currentUserHeadquartersId?: number,
  rolCurrentUser?: string | number
) {
  const query = await DemandaInducida.createQueryBuilder("demanda")
    .leftJoinAndSelect("demanda.programaRelation", "programa")
    .leftJoinAndSelect("programa.metaHistoricoRelation", "metaHistorico")
    .leftJoinAndSelect("demanda.personaSeguimientoRelation", "personaSeguimiento")
    .select(["programa.name as programa", "COUNT(*) as cantidad"])
    .where("demanda.elementoDemandaInducidaId = :elementoId", { elementoId })
    .andWhere("metaHistorico.año = :year", { year: año })
    .andWhere("metaHistorico.mes = :month", { month: mes })
    .andWhere("demanda.profesional = :profesional", { profesional })
    .andWhere("demanda.programaId = :programaId", { programaId })
    .groupBy("programa.name");

  // si el rol es 19 mostrar solo las DI de ese usuario
  if (rolCurrentUser == "19") {
    query.andWhere("demanda.personaSeguimientoId = :userId", {
      userId: currentUserId,
    });
  } else if (rolCurrentUser == "21") {
    query.andWhere("personaSeguimiento.headquarters = :headquartersId", {
      headquartersId: currentUserHeadquartersId,
    });
  }

  const queryResults = await query.getRawMany();

  return queryResults.map((resultado) => ({
    programa: resultado.programa,
    cantidad: parseInt(resultado.cantidad),
  }));
}

// Función auxiliar: Estadísticas por programa, elemento y profesional
async function getStatisticsByProgram(
  elementoId: string,
  programaId: string,
  profesional: string,
  año: string,
  mes: string,
  metaValue: number
) {
  const query = await DemandaInducida.createQueryBuilder("demanda")
    .leftJoinAndSelect("demanda.programaRelation", "programa")
    .leftJoinAndSelect("programa.metaHistoricoRelation", "metaHistorico")
    .leftJoinAndSelect("demanda.elementoRelation", "elemento")
    .select([
      "programa.name as programa",
      "elemento.name as elemento",
      "demanda.profesional as profesional",
      "COUNT(*) as cantidad",
    ])
    .where("metaHistorico.año = :year", { year: año })
    .andWhere("metaHistorico.mes = :month", { month: mes })
    .andWhere("demanda.elementoDemandaInducidaId = :elementoId", { elementoId })
    // .andWhere("demanda.programaId = :programaId", { programaId })
    .andWhere("demanda.profesional = :profesional", { profesional })
    .groupBy("programa.name, elemento.name, demanda.profesional")
    .getRawMany();

  return query.map((resultado) => ({
    programa: resultado.programa,
    elemento: resultado.elemento,
    profesional: resultado.profesional,
    cantidad: parseInt(resultado.cantidad),
    porcentaje:
      metaValue > 0
        ? Math.round((parseInt(resultado.cantidad) / metaValue) * 100)
        : 0,
  }));
}

// ? Función auxiliar: Llamadas telefónicas efectivas vs no efectivas
async function getStatisticsCalls(
  programaId: string,
  profesional: string,
  año: string,
  mes: string,
  metaValue: number,
  currentUserId: string,
  currentUserHeadquartersId?: number,
  rolCurrentUser?: string | number
) {
  const query = await DemandaInducida.createQueryBuilder("demanda")
    .leftJoinAndSelect("demanda.programaRelation", "programa")
    .leftJoinAndSelect("programa.metaHistoricoRelation", "metaHistorico")
    .leftJoinAndSelect("demanda.personaSeguimientoRelation", "personaSeguimiento")
    .select([
      "demanda.clasificacion as esEfectiva",
      "demanda.profesional as profesional",
      "COUNT(*) as cantidad",
    ])
    .where("demanda.elementoDemandaInducidaId = :elementoId", { elementoId: 2 }) // ID 2 para llamadas telefónicas
    .andWhere("metaHistorico.año = :year", { year: año })
    .andWhere("metaHistorico.mes = :month", { month: mes })
    .andWhere("demanda.programaId = :programaId", { programaId })
    .andWhere("demanda.profesional = :profesional", { profesional })
    .groupBy("demanda.clasificacion, demanda.profesional");

  // si el rol es 19 mostrar solo las DI de ese usuario
  if (rolCurrentUser == "19") {
    query.andWhere("demanda.personaSeguimientoId = :userId", {
      userId: currentUserId,
    });
  } else if (rolCurrentUser == "21") {
    query.andWhere("personaSeguimiento.headquarters = :headquartersId", {
      headquartersId: currentUserHeadquartersId,
    });
  }

  const queryResults = await query.getRawMany();

  const estadisticas: {
    efectivas: { profesional: any; cantidad: number; porcentaje: number }[];
    noEfectivas: { profesional: any; cantidad: number; porcentaje: number }[];
  } = {
    efectivas: [],
    noEfectivas: [],
  };

  queryResults.forEach((resultado) => {
    const data = {
      profesional: resultado.profesional,
      cantidad: parseInt(resultado.cantidad),
      porcentaje:
        metaValue > 0
          ? Math.round((parseInt(resultado.cantidad) / metaValue) * 100)
          : 0,
    };

    if (resultado.esEfectiva) {
      estadisticas.efectivas.push(data);
    } else {
      estadisticas.noEfectivas.push(data);
    }
  });

  return estadisticas;
}

// Función auxiliar: Resultados de llamadas no efectivas
async function getStatisticsCallNotEffective(
  programaId: string,
  profesional: string,
  año: string,
  mes: string,
  metaValue: number
) {
  const query = await DemandaInducida.createQueryBuilder("demanda")
    .leftJoinAndSelect("demanda.programaRelation", "programa")
    .leftJoinAndSelect("demanda.resultadoRelation", "resultado")
    .select([
      "programa.name as programa",
      "resultado.name as resultadoLlamada",
      "demanda.profesional as profesional",
      "COUNT(*) as cantidad",
    ])
    .where("demanda.elementoDemandaInducidaId = :elementoId", { elementoId: 2 })
    .andWhere("demanda.clasificacion = :clasificacion", {
      clasificacion: false,
    })
    .andWhere("YEAR(demanda.createdAt) = :year", { year: año })
    .andWhere("MONTH(demanda.createdAt) = :month", { month: mes })
    // .andWhere("demanda.programaId = :programaId", { programaId })
    .andWhere("demanda.profesional = :profesional", { profesional })
    .groupBy("programa.name, resultado.name, demanda.profesional")
    .getRawMany();

  return query.map((resultado) => ({
    programa: resultado.programa,
    resultadoLlamada: resultado.resultadoLlamada,
    profesional: resultado.profesional,
    cantidad: parseInt(resultado.cantidad),
    porcentaje:
      metaValue > 0
        ? Math.round((parseInt(resultado.cantidad) / metaValue) * 100)
        : 0,
  }));
}
