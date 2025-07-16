import { NextFunction, Request, Response } from "express";
import { DemandaInducida } from "../entities/demanda-inducida";
import { Pacientes } from "../entities/pacientes";
import { validate } from "class-validator";

export const getAllDemandInduded = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const demandInduced = await DemandaInducida.createQueryBuilder("demandInduced")
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
      .leftJoinAndSelect("demandInduced.personaSeguimientoRelation", "personaSeguimiento")
      .orderBy("demandInduced.createdAt", "DESC")
      .getMany();

    const demandInducedFormatted = demandInduced.map(d => ({
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
        personProcess: `${d.personaSeguimientoRelation?.name} ${d.personaSeguimientoRelation?.lastName}` || "N/A",
        areaPersonProcess: d.areaPersonaRelation?.name || "N/A",
        programPerson: d.programaRelation?.name || "N/A",
        assignmentDate: d.fechaCita || "N/A",
        profetional: d.profesional || "N/A",
    }))

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
    console.log("Received data:", req.body);

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
    demandInduced.elementoDemandaInducidaId = parseInt(elementDemand) ;
    demandInduced.tipoDemandaInducidaId = typeElementDemand ? parseInt(typeElementDemand) : null;
    demandInduced.objetivoDemandaInducidaId = objetive ? parseInt(objetive) : null;
    demandInduced.relacionUsuarioId = relationshipUser ? parseInt(relationshipUser) : null;
    demandInduced.areaEpsId = areaEps ? parseInt(areaEps) : null;
    demandInduced.resumenSeguimientoActividadId = summaryCall ? parseInt(summaryCall) : null;
    demandInduced.resultadoLlamadaId = resultCall ? parseInt(resultCall) : null;
    demandInduced.motivoVisitaId = reasonVisitNotEffective ? parseInt(reasonVisitNotEffective) : null;
    demandInduced.areaPersonaSeguimientoId = areaPersonProcess ? parseInt(areaPersonProcess) : null;
    demandInduced.clasificacion = classification;
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
