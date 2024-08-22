import { NextFunction, Request, Response } from "express";
import { Radicacion } from "../entities/radicacion";

export async function downloadReportExcel(req: Request, res: Response, next: NextFunction){
    try {
        
        const dataRadicacion = await Radicacion.createQueryBuilder("radicacion")
        .select([
            "radicacion.createdAt",
            "radicacion.id",
            "tipo_documento.name",
            "pacientes.name",
            "pacientes.phoneNumber",
            "pacientes.phoneNumber",
            "pacientes.landline",
            "pacientes.email",
            "pacientes.address",
            "convenio.name",
            "ips_primaria.name",
            "radicacion.orderDate",
            "lugar_radicacion.name",
            "ips_remitente.name",
            "radicacion.profetional",
            "especialidad.name",
            "radicacion.diagnosticCode",
            "radicacion.descriptionDiagnostic",
            "grupo_servicios.name",
            "servicios.name",
            "radicador.name",
            "radicacion.auditora",
            "radicacion.auditDate",
            // * codigo cups
            // * descripcion cups
            // * estado
            // * unidad funcional cup
            // * ultima modificacion cup
            // * observacion seguimiento auxiliar
            // * fecha seguimiento auxiliar
        ])
        .leftJoinAndSelect('radicacion.patientRelation', 'pacientes')
        .leftJoinAndSelect('pacientes.documentRelation', 'tipo_documento')
        .leftJoinAndSelect('pacientes.convenioRelation', 'convenio')
        .leftJoinAndSelect('pacientes.ipsPrimariaRelation', 'ips_primaria')
        .leftJoinAndSelect('radicacion.placeRelation', 'lugar_radicacion')
        .leftJoinAndSelect('radicacion.ipsRemitenteRelation', 'ips_remitente')
        .leftJoinAndSelect('radicacion.servicesGroupRelation', 'grupo_servicios')
        .leftJoinAndSelect('radicacion.servicesRelation', 'servicios')
        .leftJoinAndSelect('radicacion.radicadorRelation', 'radicador')
        .leftJoinAndSelect('radicacion.specialtyRelation', 'especialidad')
        .leftJoinAndSelect('radicacion.cupsRelation', 'cups')
        .leftJoinAndSelect('radicacion.seguimientoAuxiliarRelation', 'seguimiento_auxiliar')
        .getRawMany();

        res.json(dataRadicacion);
    } catch (error) {
        next(error);
    }
}