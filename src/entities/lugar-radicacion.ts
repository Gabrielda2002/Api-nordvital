import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Radicacion } from "./radicacion";
import { IsBoolean, IsNotEmpty, IsString, Length } from "class-validator";
import { dispositivosRed } from "./dispositivos-red";
import { Municipio } from "./municipio";
import { Usuarios } from "./usuarios";
import { departamentos } from "./departamentos";
import { NotasTecnicas } from "./notas-tecnicas";
import { ServiciosEjecutados } from "./servicios-ejecutados";

@Entity("sedes")
export class LugarRadicacion extends BaseEntity{

    @PrimaryGeneratedColumn({name: "IdLugar"})
    id: number

    @Column({name: "NombreLugar"})
    @IsString()
    @IsNotEmpty({message: "El nombre del lugar es requerido"})
    @Length(3, 50, {message: "El nombre del lugar debe tener entre $constraint1 y $constraint2 caracteres"})
    name: string

    @Column({name: "Estado"})
    @IsBoolean()
    @IsNotEmpty({message: "El estado del lugar es requerido"})
    status: boolean

    @Column({name: "numero_sede", nullable: true})
    numeroSede: number

    @Column({name: "direccion"})
    address: string

    @Column({name: "departamento"})
    departamento: number

    @Column({name: "ciudad"})
    city: number

    @UpdateDateColumn({ name: "fecha-actualizacion" })
    updatedAt: Date

    @CreateDateColumn({ name: "fecha-creacion" })
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

    // relacion con departamento
    @ManyToOne(() => departamentos, (departamento) => departamento.placeRelation)
    @JoinColumn({name: "departamento"})
    departmentRelation: departamentos;

    // relacion con municipio
    @ManyToOne(() => Municipio, (municipio) => municipio.placeRelation)
    @JoinColumn({name: "ciudad"})
    municipioRelation: Municipio;

    // relacion con notas tecnicas
    @OneToMany(() => NotasTecnicas, (notasTecnicas) => notasTecnicas.placeRelation)
    notasTecnicasRelation: NotasTecnicas[];

    //relacion con sercicios ejecutas
    @OneToMany(() => ServiciosEjecutados, servicio => servicio.placeRelation)
    serviciosEjecutadosRelation: ServiciosEjecutados[]

}