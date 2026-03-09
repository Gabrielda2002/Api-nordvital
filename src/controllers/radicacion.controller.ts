import { NextFunction, Request, Response } from "express";
import { Radicacion } from "../entities/radicacion";
import { validate } from "class-validator";
import { Between, IsNull } from "typeorm";
import { subMonths, startOfMonth, endOfMonth } from "date-fns";
import { UnidadFuncional } from "../entities/unidad-funcional";
import { CupsRadicados } from "../entities/cups-radicados";
import { Pacientes } from "../entities/pacientes";
import { Soportes } from "../entities/soportes";
import path from "path";
import Logger from "../utils/logger-wrapper";

export async function tablaPorAuditar(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const query = await Radicacion.createQueryBuilder("radicacion")
      .leftJoinAndSelect("radicacion.profesionalesRelation", "profesionales")
      .leftJoinAndSelect("radicacion.patientRelation", "pacientes")
      .leftJoinAndSelect("pacientes.convenioRelation", "convenio")
      .leftJoinAndSelect("pacientes.documentRelation", "document")
      .leftJoinAndSelect("pacientes.ipsPrimariaRelation", "ipsPrimaria")
      .leftJoinAndSelect("radicacion.placeRelation", "place")
      .leftJoinAndSelect("radicacion.ipsRemiteRelation", "ipsRemite")
      .leftJoinAndSelect("radicacion.specialtyRelation", "specialty")
      .leftJoinAndSelect("radicacion.servicesRelation", "services")
      .leftJoinAndSelect("radicacion.servicesGroupRelation", "servicesGroup")
      .leftJoinAndSelect("radicacion.usuarioRelation", "radicador")
      .leftJoinAndSelect("place.municipioRelation", "municipio")
      .leftJoinAndSelect("municipio.departmentRelation", "departamento")
      .leftJoinAndSelect("radicacion.cupsRadicadosRelation", "cupsRadicados")
      .leftJoinAndSelect("cupsRadicados.statusRelation", "status")
      .leftJoinAndSelect(
        "cupsRadicados.functionalUnitRelation",
        "unidadFuncional"
      )
      .leftJoinAndSelect(
        "cupsRadicados.servicioRelation",
        "servicios"
      )
      .leftJoinAndSelect("radicacion.soportesRelation", "soportes")
      .where(
        "cupsRadicados.statusId = 6"
      );

    if (req.departmentUserId) {
      query.andWhere("municipio.departmentId = :departmentId", {
        departmentId: req.departmentUserId,
      });
    }
    query.orderBy("radicacion.createdAt", "ASC");
    const radicaciones = await query.getMany();

    const formatedRadicaciones = await radicaciones.map((r) => ({
      id: r.id,
      createdAt: r.createdAt,
      documentType: r.patientRelation?.documentRelation.name || "N/A",
      documentNumber: r.patientRelation?.documentNumber || "N/A",
      namePatient: r.patientRelation?.name || "N/A",
      agreementName: r.patientRelation?.convenioRelation?.name || "N/A",
      ipsPrimary: r.patientRelation.ipsPrimariaRelation.name || "N/A",
      orderDate: r.orderDate || "N/A",
      place: r.placeRelation?.name || "N/A",
      ipsRemitente: r.ipsRemiteRelation?.name || "N/A",
      professional:
        r.professionalId === null
          ? r.professionalName
          : r.profesionalesRelation?.name || "N/A",
      speciality: r.specialtyRelation?.name || "N/A",
      typeService: r.servicesRelation?.name || "N/A",
      assistant: r.usuarioRelation?.name || "N/A",
      cups:
        r.cupsRadicadosRelation?.map((c) => ({
          id: c.servicioRelation?.id || "N/A",
          code: c.servicioRelation?.code || "N/A",
          description: c.servicioRelation?.name || "N/A",
          observation: c.observation,
          status: c.statusRelation.name,
          functionalUnit: c.functionalUnitRelation.name,
          idRadicado: c.radicacionId,
          quantity: c.quantity,
        })) || "N/A",
      supportName: r.soportesRelation?.nameSaved || "N/A",
      supportId: r.soportesRelation?.id || "N/A",
    }));

    return res.status(200).json(formatedRadicaciones);
  } catch (error) {
    next(error);
  }
}

export async function  auditorRadicados(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const query = await Radicacion.createQueryBuilder("radicacion")
      .leftJoinAndSelect("radicacion.placeRelation", "place")
      .leftJoinAndSelect("place.municipioRelation", "municipality")
      .leftJoinAndSelect("radicacion.patientRelation", "pacientes")
      .leftJoinAndSelect("pacientes.convenioRelation", "convenio")
      .leftJoinAndSelect("pacientes.documentRelation", "document")
      .leftJoinAndSelect("radicacion.cupsRadicadosRelation", "cupsRadicados")
      .leftJoinAndSelect("cupsRadicados.statusRelation", "status")
      .leftJoinAndSelect("cupsRadicados.servicioRelation", "services")
      .orderBy("radicacion.id", "DESC")
      .where(
        "cupsRadicados.statusId <> 6 AND cupsRadicados.radicacionId = radicacion.id"
      );

    if (req.departmentUserId) {
      query.andWhere("municipality.departmentId = :departmentId", {
        departmentId: req.departmentUserId,
      });
    }
    query.orderBy("radicacion.id", "ASC");
    const radicaciones = await query.getMany();

    const formatedRadicaciones = radicaciones.map((r) => ({
      id: r.id,
      createdAt: r.createdAt,
      document: r.patientRelation?.documentNumber || "N/A",
      patientName: r.patientRelation?.name || "N/A",
      CUPS: r.cupsRadicadosRelation?.map((c) => ({
        id: c.id,
        cupsId: c.servicioRelation?.id,
        code: c.servicioRelation?.code,
        description: c.servicioRelation?.name,
        status: c.statusRelation.name,
        statusId: c.statusRelation.id,
        observation: c.observation,
        updatedAt: c.updatedAt,
        quantity: c.quantity,
      })),
    }));

    return res.status(200).json(formatedRadicaciones);
  } catch (error) {
    next(error);
  }
}

export async function autorizarRadicado(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const queryRunner = Radicacion.getRepository().manager.connection.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const radicadoId = parseInt(String(req.params.id));
    const { auditora, fechaAuditoria, justificacion, cupsDetails } = req.body;

    const existRadicado = await queryRunner.manager.findOneBy(Radicacion, { id: radicadoId });

    if (!existRadicado) {
      await queryRunner.rollbackTransaction();
      return res.status(404).json({ message: "Radicado no existe" });
    }

    existRadicado.auditNotes = auditora;
    existRadicado.auditDate = fechaAuditoria;
    existRadicado.auditJustification = justificacion;

    const errors = await validate(existRadicado);
    if (errors.length > 0) {
      const messages = errors.map((err) => ({
        property: err.property,
        constraints: err.constraints,
      }));
      await queryRunner.rollbackTransaction();
      return res.status(400).json({ message: "Error updating radicacion", messages });
    }

    for (const detail of cupsDetails) {
      const cups = await queryRunner.manager.findOneBy(CupsRadicados, {
        radicacionId: radicadoId,
        requestedServiceId: parseInt(String(detail.id)),
      });

      if (!cups) {
        await queryRunner.rollbackTransaction();
        return res.status(404).json({ message: `CUPS con requestedServiceId ${detail.id} no encontrado para el radicado ${radicadoId}` });
      }

      cups.statusId = parseInt(detail.status);
      cups.observation = detail.observation;
      cups.functionalUnitId = parseInt(detail.funtionalUnit);
      cups.quantity = Number(detail.quantity);

      const errorsCups = await validate(cups);
      if (errorsCups.length > 0) {
        const messagesCups = errorsCups.map((err) =>
          Object.values(err.constraints || {}).join(", ")
        );
        await queryRunner.rollbackTransaction();
        return res.status(400).json({ message: "Error updating cupsRadicados", messagesCups });
      }

      await queryRunner.manager.save(cups);
    }

    await queryRunner.manager.save(existRadicado);
    await queryRunner.commitTransaction();
    return res.status(200).json({ message: "Radicado autorizado exitosamente" });

  } catch (error) {
    await queryRunner.rollbackTransaction();
    next(error);
  } finally {
    await queryRunner.release();
  }
}

export async function cirugiasTable(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const radicacion = await Radicacion.createQueryBuilder("radicacion")
      .leftJoinAndSelect("radicacion.specialtyRelation", "specialty")
      .leftJoinAndSelect("radicacion.placeRelation", "place")
      .leftJoinAndSelect("radicacion.ipsRemiteRelation", "ipsRemite")
      .leftJoinAndSelect("radicacion.servicesGroupRelation", "servicesGroup")
      .leftJoinAndSelect("radicacion.servicesRelation", "services")
      .leftJoinAndSelect("radicacion.usuarioRelation", "radicador")
      .leftJoinAndSelect("radicacion.patientRelation", "patient")
      .leftJoinAndSelect("patient.convenioRelation", "convenio")
      .leftJoinAndSelect("patient.documentRelation", "document")
      .leftJoinAndSelect("patient.ipsPrimariaRelation", "ipsPrimaria")
      .leftJoinAndSelect("radicacion.cupsRadicadosRelation", "cupsRadicados")
      .leftJoinAndSelect(
        "cupsRadicados.seguimientoAuxiliarRelation",
        "seguimientoCups"
      )
      .leftJoinAndSelect(
        "cupsRadicados.servicioRelation",
        "servicesCups"
      )
      .leftJoinAndSelect(
        "seguimientoCups.usuarioRelation",
        "usuarioSeguimientoCups"
      )
      .leftJoinAndSelect(
        "seguimientoCups.estadoSeguimientoRelation",
        "statusSeguimientoCups"
      )
      .leftJoinAndSelect("cupsRadicados.statusRelation", "status")
      .leftJoinAndSelect(
        "cupsRadicados.functionalUnitRelation",
        "unidadFuncional"
      )
      .leftJoinAndSelect("radicacion.diagnosticoRelation", "diagnostic")
      .leftJoinAndSelect("radicacion.soportesRelation", "soporte")
      .leftJoinAndSelect("radicacion.cirugiasRelation", "cirugias")
      .leftJoinAndSelect("cirugias.ipsRemiteRelation", "ipsRemiteCirugia")
      .leftJoinAndSelect(
        "cirugias.gestionCirugiasRelation",
        "gestionAuxiliarCirugia"
      )
      .leftJoinAndSelect(
        "gestionAuxiliarCirugia.userRelation",
        "usuario-seguimiento"
      )
      .leftJoinAndSelect(
        "gestionAuxiliarCirugia.estadoSeguimientoRelation",
        "statusGestionAuxiliarCirugia"
      )
      .andWhere("convenio.id <> :convenioId", { convenioId: 1 })
      .andWhere("servicesGroup.id IN (:...groupIds)", { groupIds: [6, 9] })
      .andWhere(
        "(gestionAuxiliarCirugia.id IS NULL OR statusGestionAuxiliarCirugia.id NOT IN (:...statusIds))",
        { statusIds: [3, 4] }
      )
      .orderBy("radicacion.id", "DESC")
      .getMany();

    const cirugiasFormat = radicacion.map((r) => ({
      fechaRadicado: r.createdAt,
      id: r.id,
      convenio: r.patientRelation?.convenioRelation?.name || "N/A",
      numeroDocumento: r.patientRelation?.documentNumber || "N/A",
      nombrePaciente: r.patientRelation?.name || "N/A",
      numeroPaciente: r.patientRelation?.phoneNumber || "N/A",
      telefonoFijo: r.patientRelation?.landline || "N/A",
      email: r.patientRelation?.email || "N/A",
      fechaAuditoria: r.auditDate,
      fechaOrden: r.orderDate,
      especialidad: r.specialtyRelation?.name || "N/A",
      nombreSoporte: r.soportesRelation?.nameSaved || "N/A",
      sopportId: r.soportesRelation?.id || "N/A",
      cups: r.cupsRadicadosRelation?.map((c) => ({
        id: c.servicioRelation?.id || "N/A",
        code: c.servicioRelation?.code || "N/A",
        description: c.servicioRelation?.name || "N/A",
        seguimiento: c.seguimientoAuxiliarRelation?.map((s) => ({
          id: s.id,
          estado: s.estadoSeguimientoRelation?.name || "N/A",
          observacion: s.observation,
          fechaCreacion: s.createdAt,
          Nombre: s.usuarioRelation?.name || "N/A",
          Apellido: s.usuarioRelation?.lastName || "N/A",
        })),
      })),
      grupoServicios: r.servicesGroupRelation?.name || "N/A",
      idGrupoServicios: r.servicesGroupRelation?.id || "N/A",
      diagnostico: r.diagnosticoRelation?.description || "N/A",
      programacionCirugia: r.cirugiasRelation?.map((c) => ({
        id: c.id || "N/A",
        fechaCirugia: c.surgeryDate || "N/A",
        ipsRemite: c.ipsRemiteRelation?.name || "N/A",
        observacion: c.observation || "N/A",
        hora: c.scheduledTime || "N/A",
        fechaParaclinoco: c.paraclinicalDate || "N/A",
        fechaAnesteciologia: c.anesthesiologyDate || "N/A",
        especialista: c.specialist || "N/A",
        gestionAuxiliarCirugia: c.gestionCirugiasRelation?.map((g) => ({
          id: g.id,
          estado: g.estadoSeguimientoRelation?.name,
          observacion: g.observation,
          fechaCreacion: g.createdAt,
          Nombre: g.userRelation?.name || "N/A",
          Apellido: g.userRelation?.lastName || "N/A",
        })),
      })),
    }));

    return res.json(cirugiasFormat);
  } catch (error) {
    next(error);
  }
}

// radicacion_controller.ts
export async function registrosUltimosTresMeses(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const now = new Date();
    const threeMonthsAgo = subMonths(now, 3);

    const registros = await Radicacion.createQueryBuilder("radicacion")
      .where("radicacion.createdAt BETWEEN :start AND :end", {
        start: threeMonthsAgo,
        end: now,
      })
      .getMany();

    const registrosPorMes = registros.reduce(
      (acc: { [key: string]: number }, registro) => {
        const mes = registro.createdAt.getMonth();
        const año = registro.createdAt.getFullYear();
        const key = `${año}-${mes + 1}`; // Meses en JavaScript son 0-indexados

        if (!acc[key]) {
          acc[key] = 0;
        }
        acc[key]++;
        return acc;
      },
      {}
    );

    const data = Object.keys(registrosPorMes).map((key) => {
      const [año, mes] = key.split("-");
      return {
        mes: `${año}-${mes}`,
        cantidad: registrosPorMes[key],
      };
    });

    return res.json(data);
  } catch (error) {
    next(error);
  }
}

// buscar radicado por numero documento paciente
export async function buscarRadicadoPorDocumento(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { documento } = req.body;

    if (!documento) {
      return res.status(400).json({ message: "Documento es requerido" });
    }

    const query = await Radicacion.createQueryBuilder("radicacion")
      .leftJoinAndSelect("radicacion.profesionalesRelation", "profesionales")
      .leftJoinAndSelect("radicacion.patientRelation", "patient")
      .leftJoinAndSelect("radicacion.specialtyRelation", "specialty")
      .leftJoinAndSelect("radicacion.placeRelation", "place")
      .leftJoinAndSelect("place.municipioRelation", "municipio")
      .leftJoinAndSelect("radicacion.ipsRemiteRelation", "ipsRemite")
      .leftJoinAndSelect("radicacion.servicesGroupRelation", "servicesGroup")
      .leftJoinAndSelect("radicacion.servicesRelation", "services")
      .leftJoinAndSelect("radicacion.usuarioRelation", "radicador")
      .leftJoinAndSelect("radicacion.statusRelation", "estadoAuditoria")
      .leftJoinAndSelect("patient.convenioRelation", "convenio")
      .leftJoinAndSelect("patient.documentRelation", "document")
      .leftJoinAndSelect("patient.ipsPrimariaRelation", "ipsPrimaria")
      .leftJoinAndSelect("radicacion.cupsRadicadosRelation", "cupsRadicados")
      .leftJoinAndSelect("cupsRadicados.statusRelation", "status")
      .leftJoinAndSelect(
        "cupsRadicados.functionalUnitRelation",
        "unidadFuncional"
      )
      .leftJoinAndSelect("radicacion.diagnosticoRelation", "diagnostic")
      .leftJoinAndSelect("radicacion.soportesRelation", "soporte")
      .leftJoinAndSelect(
        "cupsRadicados.seguimientoAuxiliarRelation",
        "seguimientoAuxiliar"
      )
      .leftJoinAndSelect(
        "cupsRadicados.servicioRelation",
        "servicios"
      )
      .leftJoinAndSelect(
        "seguimientoAuxiliar.estadoSeguimientoRelation",
        "estadoSeguimiento"
      )
      .leftJoinAndSelect(
        "seguimientoAuxiliar.usuarioRelation",
        "usuario-seguimiento"
      )
      .leftJoinAndSelect("radicacion.cirugiasRelation", "cirugias")
      .leftJoinAndSelect(
        "cirugias.gestionCirugiasRelation",
        "gestionAuxiliarCirugia"
      )
      .leftJoinAndSelect("cirugias.ipsRemiteRelation", "ipsRemiteCirugia")
      .leftJoinAndSelect(
        "gestionAuxiliarCirugia.userRelation",
        "usuario-seguimiento-cirugia"
      )
      .leftJoinAndSelect(
        "gestionAuxiliarCirugia.estadoSeguimientoRelation",
        "estadoSeguimientoCirugia"
      )
      .where("patient.documentNumber = :documento", { documento });

    if (req.departmentUserId) {
      query.andWhere("municipio.departmentId = :departmentId", {
        departmentId: req.departmentUserId,
      });
    }
    query.orderBy("radicacion.id", "DESC");
    const radicacion = await query.getMany();

    if (!radicacion) {
      return res.status(404).json({ message: "Radicacion not found" });
    }
    const radicacionFormated = radicacion.map((r) => ({
      id: r.id || "N/A",
      createdAt: r.createdAt || "N/A",
      auditNotes: r.auditNotes || "N/A",
      documentNumber: r.patientRelation?.documentNumber || "N/A",
      convenioName: r.patientRelation?.convenioRelation?.name || "N/A",
      documentType: r.patientRelation?.documentRelation?.name || "N/A",
      namePatient: r.patientRelation?.name || "N/A",
      phoneNumber: r.patientRelation?.phoneNumber || "N/A",
      landline: r.patientRelation?.landline || "N/A",
      email: r.patientRelation?.email || "N/A",
      address: r.patientRelation?.address || "N/A",
      ipsPrimaria: r.patientRelation?.ipsPrimariaRelation?.name || "N/A",
      ipsRemitente: r.ipsRemiteRelation?.name || "N/A",
      auditDate: r.auditDate || "N/A",
      supportName: r.soportesRelation?.nameSaved || "N/A",
      supportId: r.soportesRelation?.id || "N/A",
      radicacionPlace: r.placeRelation?.name || "N/A",
      professionalName:
        r.professionalId === null
          ? r.professionalName
          : r.profesionalesRelation?.name || "N/A",
      specialty: r.specialtyRelation?.name || "N/A",
      orderDate: r.orderDate || "N/A",
      typeServices: r.servicesRelation?.name || "N/A",
      groupServices: r.servicesGroupRelation?.name || "N/A",
      radicador: r.usuarioRelation?.name || "N/A",
      auditJustification: r.auditJustification || "N/A",
      surgery: r.cirugiasRelation?.map((c) => ({
        id: c.id || "N/A",
        surgeryDate: c.surgeryDate || "N/A",
        surgeryTime: c.scheduledTime || "N/A",
        ipsSurgery: c.ipsRemiteRelation?.name || "N/A",
        dateParaclinico: c.paraclinicalDate || "N/A",
        dateAnestesiology: c.anesthesiologyDate || "N/A",
        specialist: c.specialist || "N/A",
        observation: c.observation || "N/A",
        seguimiento: c.gestionCirugiasRelation?.map((s) => ({
          id: s.id || "N/A",
          estado: s.estadoSeguimientoRelation?.name || "N/A",
          observation: s.observation || "N/A",
          fechaCreacion: s.createdAt || "N/A",
          Nombre: s.userRelation?.name || "N/A",
          Apellido: s.userRelation?.lastName || "N/A",
        })),
      })),
      cups: r.cupsRadicadosRelation?.map((c) => ({
        id: c.id || "N/A",
        code: c.servicioRelation?.code || "N/A",
        description: c.servicioRelation?.name || "N/A",
        status: c.statusRelation?.name || "N/A",
        observation: c.observation || "N/A",
        functionalUnit: c.functionalUnitRelation?.name || "N/A",
        seguimiento: c.seguimientoAuxiliarRelation?.map((s) =>  ({
            id: s.id || "N/A",
            estado: s.estadoSeguimientoRelation?.name || "N/A",
            observation: s.observation || "N/A",
            fechaCreacion: s.createdAt || "N/A",
            Nombre: s.usuarioRelation?.name || "N/A",
            Apellido: s.usuarioRelation?.lastName || "N/A",
        })),
      })),
    }));

    return res.json(radicacionFormated);
  } catch (error) {
    next(error);
  }
}

export async function getCupsEstadisticasPorMes(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const now = new Date();
    const firstDayOfMonth = startOfMonth(now);

    const cupsRadicados = await CupsRadicados.createQueryBuilder(
      "cupsRadicados"
    )
      .leftJoinAndSelect("cupsRadicados.statusRelation", "status")
      .select(["status.name as estado", "COUNT(*) as cantidad"])
      .where("cupsRadicados.createdAt BETWEEN :start AND :end", {
        start: firstDayOfMonth,
        end: now,
      })
      .groupBy("status.name")
      .getRawMany();

    // Formatear los resultados en una estructura más simple
    const resultado = cupsRadicados.map((record) => ({
      estado: record.estado,
      cantidad: parseInt(record.cantidad),
    }));

    return res.json(resultado);
  } catch (error) {
    next(error);
  }
}

export async function updateGroupServices(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;

    const { groupServices } = req.body;

    const radicacion = await Radicacion.findOneBy({ id: parseInt(String(id)) });

    if (!radicacion) {
      return res.status(404).json({ message: "Radicacion not found" });
    }

    radicacion.serviceGroupId = Number(groupServices);

    const errors = await validate(radicacion, { skipMissingProperties: true });

    if (errors.length > 0) {
      const message = errors.map((err) => ({
        property: err.property,
        constraints: err.constraints,
      }));
      return res
        .status(400)
        .json({ message: "Error updating radicacion", errors: message });
    }

    await radicacion.save();

    return res.status(200).json({ message: "Grupo actualizado exitosamente!" });
  } catch (error) {
    next(error);
  }
}

interface CupsRequest{
  id: string;
  code: string;
  description: string;
  quantity: number;
}

export const createRequestService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const queryRunner =
    Radicacion.getRepository().manager.connection.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const {
      orderDate,
      placeId,
      ipsRemiteId,
      professional,
      specialty,
      groupService,
      assistantId,
      typeService,
      diagnosisId,
      patientId,
      landline,
      phoneNumber,
      phoneNumber2,
      address,
      email,
      agreement
    } = req.body;

    const file = req.file;

    const cupsRequestService: CupsRequest[] = typeof req.body.cupsData === "string"
      ? JSON.parse(req.body.cupsData)
      : req.body.cupsData;

    // update data patient
    const patientExist = await Pacientes.findOneBy({ id: parseInt(String(patientId)) });

    if (!patientExist) {
      await queryRunner.rollbackTransaction();
      return res.status(404).json({ message: "Patient not found" });
    }

    const contactNumbers = [phoneNumber, phoneNumber2, landline].filter(num => num && num !== '');

    const uniqueNumbers = new Set(contactNumbers);
    
    if (uniqueNumbers.size !== contactNumbers.length) {
      await queryRunner.rollbackTransaction();
      return res.status(400).json({ message: "The phone numbers must be unique." });
    }

    patientExist.landline = landline;
    patientExist.phoneNumber = phoneNumber;
    patientExist.phoneNumber2 = phoneNumber2 == "" ? null : phoneNumber2;
    patientExist.address = address;
    patientExist.email = email;
    patientExist.agreementId = parseInt(String(agreement));

    const errorsPatient = await validate(patientExist);
    if (errorsPatient.length > 0) {
      const messages = errorsPatient.map(err => (
        Object.values(err.constraints || {}).join(', ')
      ));

      await queryRunner.rollbackTransaction();

      return res
        .status(400)
        .json({ message: messages });
    }

    // upload file soport
    if (!file) {
      await queryRunner.rollbackTransaction();
      return res.status(400).json({ message: "Attachment is required" });
    }

  const fileNameWithoutExt = file ? path.basename(file.originalname, path.extname(file.originalname)) : "";

    const newSupportRequest = new Soportes();
    newSupportRequest.name = fileNameWithoutExt?.normalize("NFD");
    newSupportRequest.url = file?.path;
    newSupportRequest.type = file?.mimetype;
    newSupportRequest.size = file?.size;
    newSupportRequest.nameSaved = path.basename(file?.filename);

    const errorsSupport = await validate(newSupportRequest);
    if (errorsSupport.length > 0) {
      const messages = errorsSupport.map(err => (
        Object.values(err.constraints || {}).join(', ')
      ));

      await queryRunner.rollbackTransaction();

      return res
        .status(400)
        .json({ message: messages });
    }

    await queryRunner.manager.save(newSupportRequest);
    
    let supportId = newSupportRequest.id;

    // create request service
    const requestService = new Radicacion();
    requestService.orderDate = orderDate;
    requestService.placeId = parseInt(String(placeId));
    requestService.ipsRemiteId = parseInt(String(ipsRemiteId));
    requestService.professionalId = Number(professional);
    requestService.specialtyId = parseInt(String(specialty));
    requestService.serviceGroupId = parseInt(String(groupService));
    requestService.serviceTypeId = parseInt(String(typeService));
    requestService.filedByUserId = parseInt(String(assistantId));
    requestService.auditNotes = "Pendiente";
    requestService.auditJustification = "Pendiente";
    requestService.auditStatusId = 6;
    requestService.patientId = parseInt(String(patientId));
    requestService.supportId = supportId;
    requestService.diagnosisId = parseInt(String(diagnosisId));

    const errorsRequestService = await validate(requestService);
    if (errorsRequestService.length > 0) {
      const messages = errorsRequestService.map((err) => (
        Object.values(err.constraints || {}).join(', ')
      ));

      await queryRunner.rollbackTransaction();

      return res
        .status(400)
        .json({ message: messages });
    }

    await queryRunner.manager.save(requestService);
    const requestServiceId = requestService.id;
    
    // create cups to request service

    let cupsToInsert = [];

    for (const item of cupsRequestService) {
      const createCups = new CupsRadicados();

      createCups.statusId = 6;
      createCups.observation = "Pendiente";
      createCups.functionalUnitId = 12;
      createCups.radicacionId = Number(requestServiceId);
      createCups.quantity = Number(item.quantity);
      createCups.requestedServiceId = Number(item.id);

      const errorsCups = await validate(createCups);

      if (errorsCups.length > 0) {
        const messages = errorsCups.map(err => (
          Object.values(err.constraints || {}).join(', ')
        ));

        await queryRunner.rollbackTransaction();

        return res
          .status(400)
          .json({ message: messages });
      }

      await queryRunner.manager.save(createCups);

      cupsToInsert.push(createCups);

    }

    await queryRunner.manager.save(patientExist);
    await queryRunner.commitTransaction();

    return res.status(200).json({ requestService, cupsToInsert });

  } catch (error) {
    await queryRunner.rollbackTransaction();
    next(error);
  }finally{
    await queryRunner.release();
  }
};
