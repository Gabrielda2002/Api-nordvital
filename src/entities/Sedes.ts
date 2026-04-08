import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Radicacion } from "./radicacion";
import { IsBoolean, IsNotEmpty, IsString, Length } from "class-validator";
import { dispositivosRed } from "./dispositivos-red";
import { Municipio } from "./municipio";
import { Usuarios } from "../modules/auth/entities/usuarios";
import { NotasTecnicas } from "./notas-tecnicas";
import { ServiciosEjecutados } from "./servicios-ejecutados";
import { RegistroEntrada } from "../modules/hr/entities/registro-entrada";
import { InventarioGeneral } from "./inventario-general";
import { Equipos } from "./equipos";
import { Televisor } from "./televisor";
import { Celular } from "./celular";
import { ProgramaMetaHistorico } from "../modules/programs/entities/programa-meta-historico";

@Entity("headquarters")
export class Sedes extends BaseEntity{

    @PrimaryGeneratedColumn({name: "id", type: "int"})
    id: number

    @Column({name: "name", type: "varchar", length: 100})
    @IsString()
    @IsNotEmpty({message: "El nombre del lugar es requerido"})
    @Length(3, 100, {message: "El nombre del lugar debe tener entre $constraint1 y $constraint2 caracteres"})
    name: string

    @Column({name: "status", type: "tinyint", width: 1, default: 1})
    @IsBoolean()
    @IsNotEmpty({message: "El estado del lugar es requerido"})
    status: boolean

    @Column({name: "headquarter_number", nullable: true, type: "int"})
    numeroSede: number

    @Column({name: "address", type: "varchar", length: 255})
    address: string

    @Column({name: "municipality_id", type: "int"})
    municipalityId: number

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date

    // * relaciones

    @OneToMany(() => Radicacion, (radicacion) => radicacion.placeRelation)
    radicacionRelation: Radicacion[]

    // relacion con dispositivos red
    @OneToMany(() => dispositivosRed, (dispositivo) => dispositivo.placeRelation)
    devicesRelation: dispositivosRed[]

    // relacion con usuarios
    @OneToMany(() => Usuarios, (usuario) => usuario.sedeRelation)
    userRelation: Usuarios[]

    // relacion con municipio
    @ManyToOne(() => Municipio, (municipio) => municipio.placeRelation)
    @JoinColumn({name: "municipality_id"})
    municipioRelation: Municipio;

    // relacion con notas tecnicas
    @OneToMany(() => NotasTecnicas, (notasTecnicas) => notasTecnicas.placeRelation)
    notasTecnicasRelation: NotasTecnicas[];

    //relacion con sercicios ejecutas
    @OneToMany(() => ServiciosEjecutados, servicio => servicio.placeRelation)
    serviciosEjecutadosRelation: ServiciosEjecutados[]

    // * relacion registro entrada
    @OneToMany(() => RegistroEntrada, registro => registro.sedeRelation)
    registerEntriesRelation: RegistroEntrada[]

    // relacion con ivg
    @OneToMany(() => InventarioGeneral, (inventarioGeneral) => inventarioGeneral.headquartersRelation)
    inventoryGeneralRelation: InventarioGeneral[]

    @OneToMany(() => Equipos, (equipos) => equipos.placeRelation)
    EquipmentRelation: Equipos[]
    
    // Relaciones con las nuevas entidades
    @OneToMany(() => Televisor, (televisor) => televisor.sedeRelation)
    televisoresRelation: Televisor[]

    @OneToMany(() => Celular, (celular) => celular.sedeRelation)
    celularesRelation: Celular[]

    // Relación con programa meta historico
    @OneToMany(() => ProgramaMetaHistorico, (programaMeta) => programaMeta.headquartersRelation)
    programaMetaHistoricoRelation: ProgramaMetaHistorico[]
}