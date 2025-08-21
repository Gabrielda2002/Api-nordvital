import { NextFunction, query, Request, Response } from "express";
import { Radicacion } from "../entities/radicacion";
import { validate } from "class-validator";
import { Between, IsNull } from "typeorm";
import { subMonths, startOfMonth, endOfMonth } from "date-fns";
import { UnidadFuncional } from "../entities/unidad-funcional";
import { CupsRadicados } from "../entities/cups-radicados";
import { Pacientes } from "../entities/pacientes";
import { Soportes } from "../entities/soportes";
import path from "path";

export async function getAllRadicacion(
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
        "seguimientoAuxiliar.estadoSeguimientoRelation",
        "estadoSeguimiento"
      )
      .leftJoinAndSelect("radicacion.cirugiasRelation", "cirugias")
      .orderBy("radicacion.id", "DESC")
      .getMany();

    return res.json(radicacion);
  } catch (error) {
    next(error);
  }
}

export async function getRadicacionById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;

    const radicacion = await Radicacion.createQueryBuilder("radicacion")
      .where("radicacion.id = :id", { id: parseInt(id) })
      .leftJoinAndSelect("radicacion.specialtyRelation", "specialty")
      .leftJoinAndSelect("radicacion.placeRelation", "place")
      .leftJoinAndSelect("radicacion.ipsRemiteRelation", "ipsRemite")
      .leftJoinAndSelect("radicacion.servicesGroupRelation", "servicesGroup")
      .leftJoinAndSelect("radicacion.servicesRelation", "services")
      .leftJoinAndSelect("radicacion.usuarioRelation", "radicador")
      .leftJoinAndSelect("radicacion.patientRelation", "patient")
      .leftJoinAndSelect("radicacion.cupsRadicadosRelation", "cupsRadicados")
      .leftJoinAndSelect("radicacion.profesionalesRelation", "profesionales")
      .getOne();

    if (!radicacion) {
      return res.status(404).json({ message: "Radicacion not found" });
    }

    const radicacionFormated = {
      id: radicacion.id,
      name: radicacion.patientRelation?.name,
      document: radicacion.patientRelation?.documentNumber,
      convenio: radicacion.patientRelation?.convenioRelation?.name,
      specialty: radicacion.specialtyRelation?.name,
      place: radicacion.placeRelation?.name,
      ipsRemite: radicacion.ipsRemiteRelation?.name,
      servicesGroup: radicacion.servicesGroupRelation?.name,
      services: radicacion.servicesRelation?.name,
      radicador: radicacion.usuarioRelation?.name,
      auditDate: radicacion.auditDate,
      createdAt: radicacion.createdAt,
      orderDate: radicacion.orderDate,
      profetional:
        radicacion.idProfesional === null
          ? radicacion.profetional
          : radicacion.profesionalesRelation?.name,
      groupServices: radicacion.groupServices,
      typeServices: radicacion.typeServices,
      justify: radicacion.justify,
      auditConcept: radicacion.auditConcept,
      cupsRadicados: radicacion.cupsRadicadosRelation?.map((c) => ({
        id: c.id,
        code: c.code,
        DescriptionCode: c.DescriptionCode,
        status: c.status,
        observation: c.observation,
        functionalUnit: c.functionalUnit,
        idRadicacion: c.idRadicacion,
        updatedAt: c.updatedAt,
        createdAt: c.createdAt,
      })),
    };

    return res.json(radicacionFormated);
  } catch (error) {
    next(error);
  }
}

export async function createRadicado(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const {
      orderDate,
      place,
      ipsRemitente,
      profetional,
      specialty,
      groupServices,
      radicador,
      typeServices,
      idPatient,
      idSoporte,
      idDiagnostico,
    } = req.body;

    const radicacado = new Radicacion();

    radicacado.orderDate = orderDate;
    radicacado.place = parseInt(place);
    radicacado.ipsRemitente = parseInt(ipsRemitente);
    radicacado.idProfesional = Number(profetional);
    radicacado.specialty = parseInt(specialty);
    radicacado.groupServices = parseInt(groupServices);
    radicacado.typeServices = parseInt(typeServices);
    radicacado.radicador = parseInt(radicador);
    radicacado.auditora = "Pendiente";
    radicacado.justify = "Pendiente";
    radicacado.auditConcept = 6;
    radicacado.idPatient = parseInt(idPatient);
    radicacado.idSoporte = parseInt(idSoporte);
    radicacado.idDiagnostico = parseInt(idDiagnostico);

    const errors = await validate(radicacado);

    if (errors.length > 0) {
      const messages = errors.map((err) => ({
        property: err.property,
        constraints: err.constraints,
      }));

      return res
        .status(400)
        .json({ message: "Error creating radicacion", messages });
    }

    await radicacado.save();

    return res.json(radicacado);
  } catch (error) {
    next(error);
  }
}

export async function updateRadicado(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;

    const {
      orderDate,
      place,
      ipsRemitente,
      profetional,
      specialty,
      diagnosticCode,
      diagnosticDescription,
      groupServices,
      radicador,
      auditora,
      auditDate,
      typeServices,
      justify,
      idPatient,
      auditConcept,
    } = req.body;

    const radicacado = await Radicacion.findOneBy({ id: parseInt(id) });

    if (!radicacado) {
      return res.status(404).json({ message: "Radicacion not found" });
    }

    radicacado.orderDate = orderDate;
    radicacado.place = place;
    radicacado.ipsRemitente = ipsRemitente;
    radicacado.idProfesional = Number(profetional);
    radicacado.profetional = null;
    radicacado.specialty = specialty;
    radicacado.groupServices = groupServices;
    radicacado.typeServices = typeServices;
    radicacado.radicador = radicador;
    radicacado.auditora = auditora;
    radicacado.auditDate = auditDate;
    radicacado.justify = justify;
    radicacado.idPatient = idPatient;
    radicacado.auditConcept = auditConcept;

    const errors = await validate(radicacado);

    if (errors.length > 0) {
      const messages = errors.map((err) => ({
        property: err.property,
        constraints: err.constraints,
      }));

      return res
        .status(400)
        .json({ message: "Error updating radicacion", messages });
    }

    await radicacado.save();

    return res.json(radicacado);
  } catch (error) {
    next(error);
  }
}

export async function deleteRadicado(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;

    const radicacado = await Radicacion.findOneBy({ id: parseInt(id) });

    if (!radicacado) {
      return res.status(404).json({ message: "Radicacion not found" });
    }

    await radicacado.remove();

    return res.json({ message: "Radicacion deleted" });
  } catch (error) {
    next(error);
  }
}

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
      .leftJoinAndSelect("radicacion.soportesRelation", "soportes")
      .where(
        "cupsRadicados.status = 6 AND servicesGroup.id <> 6 AND servicesGroup.id <> 9"
      );

    if (req.departmentUserId) {
      query.andWhere("place.departamento = :departmentId", {
        departmentId: req.departmentUserId,
      });
    }
    query.orderBy("radicacion.createdAt", "ASC");
    const radicaciones = await query.getMany();

    const formatedRadicaciones = await radicaciones.map((r) => ({
      id: r.id,
      radicadoDate: r.createdAt,
      documentType: r.patientRelation?.documentRelation.name || "N/A",
      documentNumber: r.patientRelation?.documentNumber || "N/A",
      namePatient: r.patientRelation?.name || "N/A",
      convenio: r.patientRelation?.convenioRelation?.name || "N/A",
      ipsPrimary: r.patientRelation.ipsPrimariaRelation.name || "N/A",
      orderDate: r.orderDate || "N/A",
      place: r.placeRelation?.name || "N/A",
      ipsRemitente: r.ipsRemiteRelation?.name || "N/A",
      profetional:
        r.idProfesional === null
          ? r.profetional
          : r.profesionalesRelation?.name || "N/A",
      speciality: r.specialtyRelation?.name || "N/A",
      typeServices: r.servicesRelation?.name || "N/A",
      radicador: r.usuarioRelation?.name || "N/A",
      statusCups:
        r.cupsRadicadosRelation?.map((c) => ({
          id: c.id,
          code: c.code,
          description: c.DescriptionCode,
          observation: c.observation,
          status: c.statusRelation.name,
          unidadFuncional: c.functionalUnitRelation.name,
          idRadicado: c.idRadicacion,
        })) || "N/A",
      soportes: r.soportesRelation?.nameSaved || "N/A",
    }));

    return res.json(formatedRadicaciones);
  } catch (error) {
    next(error);
  }
}

export async function auditorRadicados(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const query = await Radicacion.createQueryBuilder("radicacion")
      .leftJoinAndSelect("radicacion.placeRelation", "place")
      .leftJoinAndSelect("radicacion.patientRelation", "pacientes")
      .leftJoinAndSelect("pacientes.convenioRelation", "convenio")
      .leftJoinAndSelect("pacientes.documentRelation", "document")
      .leftJoinAndSelect("radicacion.cupsRadicadosRelation", "cupsRadicados")
      .leftJoinAndSelect("cupsRadicados.statusRelation", "status")
      .orderBy("radicacion.id", "DESC")
      .where(
        "cupsRadicados.status <> 6 AND cupsRadicados.idRadicacion = radicacion.id"
      );

    if (req.departmentUserId) {
      query.andWhere("place.departamento = :departmentId", {
        departmentId: req.departmentUserId,
      });
    }
    query.orderBy("radicacion.id", "ASC");
    const radicaciones = await query.getMany();

    const formatedRadicaciones = radicaciones.map((r) => ({
      id: r.id,
      radicadoDate: r.createdAt,
      document: r.patientRelation?.documentNumber || "N/A",
      patientName: r.patientRelation?.name || "N/A",
      CUPS: r.cupsRadicadosRelation?.map((c) => ({
        id: c.id,
        code: c.code,
        description: c.DescriptionCode,
        status: c.statusRelation.id,
        observation: c.observation,
        modifyDate: c.updatedAt,
        quantity: c.quantity,
      })),
    }));

    return res.json(formatedRadicaciones);
  } catch (error) {
    next(error);
  }
}

export async function autorizarRadicado(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    console.log(id);

    const { auditora, fechaAuditoria, justificacion } = req.body;

    console.log(req.body);

    const existRadicado = await Radicacion.findOneBy({ id: parseInt(id) });

    if (!existRadicado) {
      return res.status(404).json({ message: "Cups not found" });
    }

    existRadicado.auditora = auditora;
    existRadicado.auditDate = fechaAuditoria;
    existRadicado.justify = justificacion;

    const errors = await validate(existRadicado);
    if (errors.length > 0) {
      const messages = errors.map((err) => ({
        property: err.property,
        constraints: err.constraints,
      }));

      return res
        .status(400)
        .json({ message: "Error updating radicacion", messages });
    }

    await existRadicado.save();

    res.json(existRadicado);
  } catch (error) {
    next(error);
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
      cups: r.cupsRadicadosRelation?.map((c) => ({
        id: c.id,
        code: c.code,
        description: c.DescriptionCode,
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
      query.andWhere("place.departamento = :departmentId", {
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
      auditora: r.auditora || "N/A",
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
      profetional:
        r.idProfesional === null
          ? r.profetional
          : r.profesionalesRelation?.name || "N/A",
      specialty: r.specialtyRelation?.name || "N/A",
      orderDate: r.orderDate || "N/A",
      typeServices: r.servicesRelation?.name || "N/A",
      groupServices: r.servicesGroupRelation?.name || "N/A",
      radicador: r.usuarioRelation?.name || "N/A",
      justify: r.justify || "N/A",
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
        code: c.code || "N/A",
        description: c.DescriptionCode || "N/A",
        status: c.statusRelation?.name || "N/A",
        observation: c.observation || "N/A",
        functionalUnit: c.functionalUnitRelation?.name || "N/A",
        seguimiento: c.seguimientoAuxiliarRelation.map((s) => ({
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

    console.log(req.body);

    const radicacion = await Radicacion.findOneBy({ id: parseInt(id) });

    if (!radicacion) {
      return res.status(404).json({ message: "Radicacion not found" });
    }

    radicacion.groupServices = Number(groupServices);

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

    return res.json({ message: "Radicacion updated" });
  } catch (error) {
    next(error);
  }
}

interface CupsRequest{
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
      // data request service
      orderDate,
      place,
      ipsRemitente,
      profetional,
      specialty,
      groupServices,
      radicador,
      typeServices,
      idSoporte,
      idPatient,
      idDiagnostico,
      // data patient
      landline,
      phoneNumber,
      phoneNumber2,
      address,
      email,
      // data CUPS
    } = req.body;



    const file  = req.file;

    console.log(file)

    const cupsRequestService: CupsRequest[] = JSON.parse(req.body.items);

    // update data patient
    const patientExist = await Pacientes.findOneBy({ id: parseInt(idPatient) });

    if (!patientExist) {
      return res.status(404).json({ message: "Patient not found" });
    }

    patientExist.landline = landline;
    patientExist.phoneNumber = phoneNumber;
    patientExist.phoneNumber2 = phoneNumber2 == "" ? null : phoneNumber2;
    patientExist.address = address;
    patientExist.email = email;

    const errorsPatient = await validate(patientExist);
    if (errorsPatient.length > 0) {
      const messages = errorsPatient.map((err) => ({
        property: err.property,
        constraints: err.constraints,
      }));

      await queryRunner.rollbackTransaction();

      return res
        .status(400)
        .json({ message: "Error updating patient", messages });
    }



    // upload file soport
    if (!file) {
      await queryRunner.rollbackTransaction();
      return res.status(400).json({ message: "File support is required" });
    }

  const fileNameWithoutExt = file ? path.basename(file.originalname, path.extname(file.originalname)) : "";

    const newSupportRequest = new Soportes();
    newSupportRequest.name = fileNameWithoutExt?.normalize("NFD");
    newSupportRequest.url = file?.path;
    newSupportRequest.type = file?.mimetype;
    newSupportRequest.size = file?.size;
    newSupportRequest.nameSaved = path.basename(file?.filename);

    console.log("soporte creado:", newSupportRequest);

    const errorsSupport = await validate(newSupportRequest);
    if (errorsSupport.length > 0) {
      const messages = errorsSupport.map((err) => ({
        property: err.property,
        constraints: err.constraints,
      }));

      await queryRunner.rollbackTransaction();

      return res
        .status(400)
        .json({ message: "Error creating support", messages });
    }

    await queryRunner.manager.save(newSupportRequest);
    
    let supportId = newSupportRequest.id;

    // create request service
    const requestService = new Radicacion();
    requestService.orderDate = orderDate;
    requestService.place = parseInt(place);
    requestService.ipsRemitente = parseInt(ipsRemitente);
    requestService.idProfesional = Number(profetional);
    requestService.specialty = parseInt(specialty);
    requestService.groupServices = parseInt(groupServices);
    requestService.typeServices = parseInt(typeServices);
    requestService.radicador = parseInt(radicador);
    requestService.auditora = "Pendiente";
    requestService.justify = "Pendiente";
    requestService.auditConcept = 6;
    requestService.idPatient = parseInt(idPatient);
    requestService.idSoporte = supportId;
    requestService.idDiagnostico = parseInt(idDiagnostico);

    const errorsRequestService = await validate(requestService);
    if (errorsRequestService.length > 0) {
      const messages = errorsRequestService.map((err) => ({
        property: err.property,
        constraints: err.constraints,
      }));

      await queryRunner.rollbackTransaction();

      return res
        .status(400)
        .json({ message: "Error creating request service", messages });
    }

    await queryRunner.manager.save(requestService);
    const requestServiceId = requestService.id;
    
    // create cups to request service

    let cupsToInsert = [];

    for (const item of cupsRequestService) {
      const createCups = new CupsRadicados();

      createCups.code = Number(item.code);
      createCups.DescriptionCode = item.description;
      createCups.status = 6;
      createCups.observation = "Pendiente";
      createCups.functionalUnit = 12;
      createCups.idRadicacion = Number(requestServiceId);
      createCups.quantity = Number(item.quantity);

      const errorsCups = await validate(createCups);

      if (errorsCups.length > 0) {
        const messages = errorsCups.map((err) => ({
          property: err.property,
          constraints: err.constraints,
        }));

        await queryRunner.rollbackTransaction();

        return res
          .status(400)
          .json({ message: "Error creating cups", messages });
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
