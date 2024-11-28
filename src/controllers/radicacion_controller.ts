import { NextFunction, Request, Response } from "express";
import { Radicacion } from "../entities/radicacion";
import { validate } from "class-validator";
import { Between } from "typeorm";
import { subMonths, startOfMonth, endOfMonth } from "date-fns";
import { UnidadFuncional } from "../entities/unidad-funcional";
import { CupsRadicados } from "../entities/cups-radicados";

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
      profetional: radicacion.profetional,
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
    radicacado.profetional = profetional;
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
    radicacado.profetional = profetional;
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
// export async function mostrarTabla(
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) {
//   try {
//     const radicaciones = await Radicacion.createQueryBuilder("radicacion")
//       .leftJoinAndSelect("radicacion.patientRelation", "pacientes")
//       .leftJoinAndSelect("pacientes.convenioRelation", "convenio")
//       .leftJoinAndSelect("pacientes.documentRelation", "document")
//       .leftJoinAndSelect(
//         "radicacion.seguimientoAuxiliarRelation",
//         "seguimientoAuxiliar"
//       )
//       .orderBy("radicacion.id", "DESC")
//       .getMany();

//     const formatedRadicaciones = radicaciones.map((r) => {
//       const latestSeguimiento = r.seguimientoAuxiliarRelation?.sort(
//         (a, b) => b.id - a.id
//       )[0];

//       return {
//         createdAt: r.createdAt,
//         typeDocument: r.patientRelation?.documentRelation?.name || "N/A",
//         id: r.id,
//         convenio: r.patientRelation?.convenioRelation?.name || "N/A",
//         document: r.patientRelation?.documentNumber || "N/A",
//         patientName: r.patientRelation?.name || "N/A",
//         auditDate: r.auditDate,
//         management: latestSeguimiento ? latestSeguimiento.observation : "N/A",
//       };
//     });

//     return res.json(formatedRadicaciones);
//   } catch (error) {
//     next(error);
//   }
// }

export async function tablaPorAuditar(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const radicaciones = await Radicacion.createQueryBuilder("radicacion")
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
      .leftJoinAndSelect("radicacion.cupsRadicadosRelation", "cupsRadicados")
      .leftJoinAndSelect("cupsRadicados.statusRelation", "status")
      .leftJoinAndSelect(
        "cupsRadicados.functionalUnitRelation",
        "unidadFuncional"
      )
      .leftJoinAndSelect("radicacion.soportesRelation", "soportes")
      .where(
        "cupsRadicados.status = 6 AND servicesGroup.id <> 6 AND servicesGroup.id <> 9"
      )
      .orderBy("radicacion.createdAt", "ASC")
      .getMany();

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
      profetional: r.profetional || "N/A",
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
    const radicaciones = await Radicacion.createQueryBuilder("radicacion")
      .leftJoinAndSelect("radicacion.patientRelation", "pacientes")
      .leftJoinAndSelect("pacientes.convenioRelation", "convenio")
      .leftJoinAndSelect("pacientes.documentRelation", "document")
      .leftJoinAndSelect("radicacion.cupsRadicadosRelation", "cupsRadicados")
      .leftJoinAndSelect("cupsRadicados.statusRelation", "status")
      .orderBy("radicacion.id", "DESC")
      .where(
        "cupsRadicados.status <> 6 AND cupsRadicados.idRadicacion = radicacion.id"
      )
      .orderBy("radicacion.id", "ASC")
      .getMany();

    const formatedRadicaciones = radicaciones.map((r) => ({
      id: r.id,
      document: r.patientRelation?.documentNumber || "N/A",
      patientName: r.patientRelation?.name || "N/A",
      CUPS: r.cupsRadicadosRelation?.map((c) => ({
        id: c.id,
        code: c.code,
        description: c.DescriptionCode,
        status: c.statusRelation.name,
        observation: c.observation,
        modifyDate: c.updatedAt,
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
        "gestionAuxiliarCirugia.estadoSeguimientoRelation",
        "statusGestionAuxiliarCirugia"
      )
      .where("servicesGroup.id = 6 || servicesGroup.id = 9")
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

    const radicacion = await Radicacion.createQueryBuilder("radicacion")
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
      .leftJoinAndSelect("radicacion.cirugiasRelation", "cirugias")
      .where("patient.documentNumber = :documento", { documento })
      .orderBy("radicacion.id", "DESC")
      .getMany();

    if (!radicacion) {
      return res.status(404).json({ message: "Radicacion not found" });
    }

    return res.json(radicacion);
  } catch (error) {
    next(error);
  }
}
