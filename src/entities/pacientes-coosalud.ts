import { Entity, BaseEntity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("pacientes_cosalud")
export class PacientesCoosalud extends BaseEntity {
    @PrimaryGeneratedColumn({ name: "id" })
    id: number;

    @Column({ name: "TPS_IDN_ID", length: 50 })
    tpsIdnId: string;

    @Column({ name: "HST_IDN_NUMERO_IDENTIFICACION" })
    hstIdnNumeroIdentificacion: string;

    @Column({ name: "AFL_PRIMER_APELLIDO" })
    aflPrimerApellido: string;

    @Column({ name: "AFL_SEGUNDO_APELLIDO",  nullable: true })
    aflSegundoApellido?: string;

    @Column({ name: "AFL_PRIMER_NOMBRE" })
    aflPrimerNombre: string;

    @Column({ name: "AFL_SEGUNDO_NOMBRE", nullable: true })
    aflSegundoNombre?: string;

    @Column({ name: "AFL_FECHA_NACIMIENTO", length: 50 })
    aflFechaNacimiento: string;

    @Column({ name: "TPS_GNR_ID" })
    tpsGnrId: string;

    @Column({ name: "TPS_RGM_ID" })
    tpsRgmId: string;

    @Column({ name: "ENT_ID" })
    entId: string;

    @Column({ name: "TPS_AFL_ID" })
    tpsAflId: string;

    @Column({ name: "ZNS_ID" })
    znsId: string;

    @Column({ name: "TPS_EST_AFL_ID" })
    tpsEstAflId: string;

    @Column({ name: "TPS_CND_BNF_ID", nullable: true })
    tpsCndBnfId?: string;

    @Column({ name: "DPR_ID" })
    dprId: number;

    @Column({ name: "MNC_ID" })
    mncId: number;

    @Column({ name: "Divipola" })
    divipola: string;

    @Column({ name: "tps_mdl_sbs_id", nullable: true })
    tpsMdlSbsId?: string;

    @Column({ name: "tps_nvl_ssb_id", nullable: true })
    tpsNvlSsbId?: string;

    @Column({ name: "tps_grp_pbl_id" })
    tpsGrpPblId: string;

    @Column({ name: "IPS_PRIMARIA", length: 150 })
    ipsPrimaria: string;

    @Column({ name: "ENT_REGIMEN" })
    entRegimen: string;

    @Column({ name: "DIRECCION", length: 255, nullable: true })
    direccion?: string;

    @Column({ name: "TELEFONO", length: 50, nullable: true })
    telefono?: string;

    @Column({ name: "ENT_ID_ASIGNADA" })
    entIdAsignada: string;

    @Column({ name: "direccionsisben", nullable: true })
    direccionsisben?: string;

    @Column({ name: "telefonosisben", nullable: true })
    telefonosisben?: string;

    @Column({ name: "CORREO", length: 255, nullable: true })
    correo?: string;

    @Column({ name: "REGIMEN", length: 50 })
    regimen: string;

    @Column({ name: "DIVIPOLA2", nullable: true })
    divipola2?: string;

    @Column({ name: "SUCURSAL", length: 255 })
    sucursal: string;

    @Column({ name: "DEPARTAMENTO", length: 255 })
    departamento: string;

    @Column({ name: "MUNICIPIO", length: 100 })
    municipio: string;

    @Column({ name: "Estado", length: 50, default: "Activo" })
    estado: string;
}